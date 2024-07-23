const cds = require("@sap/cds");
const dbClass = require("sap-hdbext-promisfied");
const hdbext = require("@sap/hdbext");
// const LV_Handler = require('../srv/LIB/ErrorHandler');
const lib_common = require('../srv/LIB/ideal_library');

module.exports = cds.service.impl(async function(){

    var client = await dbClass.createConnectionFromEnv();  
    var dbconn = new dbClass(client);

    this.on('PostUserMaster',async (req) => {
        try {
            // local variables
            var oReqData = req.data.input;
            var oUserDetails=oReqData.USER_DETAILS;
            var sUserId=oUserDetails.USER_ID || null;
            var sUserRole=oUserDetails.USER_ROLE || null;
            var sAction = oReqData.ACTION;
            var aUserData = oReqData.VALUE[0].USERMASTER;
            var aEntityData = oReqData.VALUE[0].ENTITYDATA;
            var bIsDuplicateUser = null;

            var LV_USER_ROLE = "";
            var LV_SR_NO = aUserData[0].SR_NO; 
            var LV_USER_ID = aUserData[0].USER_ID;
            var LV_EMAIL = aUserData[0].EMAIL;

            // if(oReqData.VALUE[0].USERMASTER.length > 0)
            // {
              for(var i = 0; i < oReqData.VALUE[0].USERMASTER.length; i++)
              {
                    var lRole = oReqData.VALUE[0].USERMASTER[i].USER_ROLE;
                    var qRole = await SELECT .from`DEALER_PORTAL_MASTER_USER_ROLE` .where`CODE=${lRole}`;
                    if(i === 0)
                    {
                    LV_USER_ROLE = qRole[0].DESCRIPTION;
                    }
                    else if(i<oReqData.VALUE[0].USERMASTER.length - 1){
                      LV_USER_ROLE += ", "+  qRole[0].DESCRIPTION
                    }
                    else{
                      LV_USER_ROLE += " and "+  qRole[0].DESCRIPTION
                    }
              }

            if (sAction === "CREATE") {
                // Check Duplicate User
                bIsDuplicateUser = await _checkDuplicateUser(aUserData);
              }
            if (!bIsDuplicateUser || (sAction === "UPDATE" || sAction === "DELETE")) {
                // load procedure
                const loadProc = await dbconn.loadProcedurePromisified(hdbext, null, 'MASTER_IDEAL_USERS')
                console.log(oReqData);
                
                const result = await dbconn.callProcedurePromisified(loadProc,[sAction, LV_SR_NO, LV_USER_ID, LV_EMAIL, LV_USER_ROLE, aUserData, aEntityData]);
                return result;
              }   
              else {
                return "This user already exist.";        
              }   
            } catch (error) {
              var sType=error.code?"Procedure":"Node Js";    
              var iErrorCode=error.code??500;    
              let Result = {
                  OUT_ERROR_CODE: iErrorCode,
                  OUT_ERROR_MESSAGE:  error.message ? error.message : error
              }
              lib_common.postErrorLog(Result,null,sUserId,sUserRole,"User Master",sType,dbconn,hdbext);
              console.error(error)         
              req.error({ code:iErrorCode, message:  error.message ? error.message : error });      
            }   
          });
  async function _checkDuplicateUser(data) {
      try {
        //Connection to database
        let connection = await cds.connect.to('db');
        queryResult = await connection.run(SELECT.from`${connection.entities['DEALER_PORTAL.MASTER_IDEAL_USERS']}`
          .where`EMAIL = ${data[0].EMAIL} AND ACTIVE = 'X'`);
        if (queryResult.length === 0) {
          return false;
        } else {return true;}
      }
      catch (error) {throw error;}
    }

    this.on('PostApprovalMatrix',async (req) => {
        try{
    // local variables
    var oReqData = req.data.input;
    var oUserDetails=oReqData.USER_DETAILS;
    var sUserId=oUserDetails.USER_ID || null;
    var sUserRole=oUserDetails.USER_ROLE || null;
    var sAction = oReqData.ACTION;
    var aMatrixData = req.data.input.VALUE;
    var sTableName,bCheckDuplicateMatrix,sEntityDescription;   

    let connection = await cds.connect.to('db');

    // getEntity Description against Entity Code from library
    sEntityDescription = await lib_common.getEntityDesc(connection, aMatrixData[0].ENTITY_CODE);

    //Check for App Type
    if(oReqData.APP_TYPE == 'REQUEST'){
      sTableName = 'DEALER_PORTAL_MATRIX_REQUEST_APPR';
      bCheckDuplicateMatrix = await _checkDuplicateOnReqMatrix(aMatrixData);

    }else if(oReqData.APP_TYPE == 'REGISTRATION'){
      sTableName = 'DEALER_PORTAL_MATRIX_REGISTRATION_APPR';
      bCheckDuplicateMatrix =await  _checkDuplicateOnRegMatrix(aMatrixData);
    }
    if((bCheckDuplicateMatrix === 0 || bCheckDuplicateMatrix === 1 ) || (sAction === "UPDATE" || sAction === "DELETE") )    
    {
    // load procedure
    const loadProc = await dbconn.loadProcedurePromisified(hdbext, null, 'MATRIX_APPROVAL_USERS')
    console.log(oReqData)

    // excute procedure
    const result = await dbconn.callProcedurePromisified(loadProc,[oReqData.APP_TYPE, oReqData.ACTION, aMatrixData,sTableName]);
    return result
    }
    else {
      if (bCheckDuplicateMatrix === "APPR_EXISTS_DIFF_EC") {
        throw {message : "This approver already exist for another entity."};
      } else if (bCheckDuplicateMatrix === "APPR_EXISTS_FOR_EC") {
        throw {message:"This matrix for entity " + sEntityDescription + " already exist."};
      }
    }
    // return "success";

  } catch (error) {
    var sType=error.code?"Procedure":"Node Js";    
    var iErrorCode=error.code??500;
    // let Result = {
    //     OUT_ERROR_CODE: iErrorCode,
    //     OUT_ERROR_MESSAGE:  error.message ? error.message : error
    // }
    lib_common.postErrorLog(Result,null,sUserId,sUserRole,"Approval Matrix",sType,dbconn,hdbext);
    console.error(error);        
    req.error({ code:iErrorCode, message:  error.message ? error.message : error });
  }
  }); 
  async function _checkDuplicateOnReqMatrix(data) {
    try{     

    var aResultEntityCode = await SELECT .from `DEALER_PORTAL.MATRIX_REQUEST_APPR`  .where `ENTITY_CODE=${data[0].ENTITY_CODE}`;
    var aResultEmail = await SELECT .from `DEALER_PORTAL.MATRIX_REQUEST_APPR`  .where `USER_ID=${data[0].USER_ID} AND ENTITY_CODE=${data[0].ENTITY_CODE}`;

    var aSameEntityCodes = [];
    var aDiffEntityCodes = [];
    for (var i = 0; i < aResultEmail.length; i++) {
      if (aResultEmail[i].ENTITY_CODE !== data[0].ENTITY_CODE) {
        aDiffEntityCodes.push(aResultEmail[i].ENTITY_CODE);
      } else {
          aSameEntityCodes.push(aResultEmail[i].ENTITY_CODE);
      }
    }
    if (aResultEntityCode.length < 2 && aDiffEntityCodes.length === 0) {
      // Only Max 2 records :  1 PM & 1 BYR
      return 1;
    } else if (aResultEntityCode.length === 2 ) {
        // Already 2 Approvers present for the specified Entity code
      return 'APPR_EXISTS_FOR_EC';
    } else if (aResultEmail.length > 0 && aDiffEntityCodes.length > 0) {
         // Already Approver exists with email id for different entity codes
      return 'APPR_EXISTS_DIFF_EC';
    } else if (aResultEmail.length === 0 && aResultEntityCode.length === 0) {
        // No combination exists in matrix
      return 0;
     }
    }
    catch(error  ){  throw error; }
  }
  // Checks duplicate for Reqistration Matrix
  async function _checkDuplicateOnRegMatrix(data) {
    try{
    var sResult = await SELECT .from `DEALER_PORTAL.MATRIX_REGISTRATION_APPR`  .where `ENTITY_CODE=${data[0].ENTITY_CODE} AND APPROVER_LEVEL=${data[0].APPROVER_LEVEL}`;
    var aResult = await SELECT .from `DEALER_PORTAL.MATRIX_REGISTRATION_APPR`  .where `USER_ID=${data[0].USER_ID}`;

    if (sResult.length !== 0 && sResult.length < 3) {
      return "APPR_EXISTS_FOR_EC";
    } else if (aResult.length !== 0) {
      return "APPR_EXISTS_DIFF_EC";
          // return 0;
    } else if (aResult.length === 0 && sResult.length === 0) {
      return 0;
      }
    }
    catch(error  ){  throw error; }
  }
  // this.on('PostDynamicApprovalHierarchy',async (req) =>{
  //   try{

  //       var sAction = req.data.action;
  //       var aHierarchyMatrixData = req.data.input;
  //       var vType = aHierarchyMatrixData[0].TYPE;
  //       var vRole = aHierarchyMatrixData[0].ROLE_CODE;
  //       var userIds = req.data.userIds || null;

  //       if(sAction === 'CREATE' || sAction === 'UPDATE' || sAction === 'DELETE' || sAction === 'EDITIDS')
  //       {
  //           // load procedure
  //           const loadProc = await dbconn.loadProcedurePromisified(hdbext, null, 'DYNAMIC_MATRIX_APPROVAL')
  //           // execute procedure
  //           const result = await dbconn.callProcedurePromisified(loadProc,[vType, sAction, aHierarchyMatrixData,aHierarchyMatrixData[0].HIERARCHY_ID,userIds,vRole]);
  //           return result
  //       }
  //     }
  //     catch (error) {
  //       req.error({message:  error.message ? error.message : error });      
  //     } 
  //     })
      // var Fiorihierarchyid;
      // var FioriType;
      // this.before('CREATE',MASTER_APPROVAL_HIERARCHY_FIORI,async req =>{
      //     Fiorihierarchyid = req.data.HIERARCHY_ID;
      //     FioriType = req.data.TYPE;
      // })
      // this.before('CREATE',MASTER_APPROVAL_MATRIX_FIROI,async req =>{
      //       req.data.HIERARCHY_ID = Fiorihierarchyid;
      //       req.data.TYPE = FioriType;
      // })
    //   this.before('CREATE', MATERIAL_DETAILS, async req => {
    //     req.data.STATUS = 1;
    //     var date = await SELECT `CURRENT_TIMESTAMP` .from `DUMMY`;
    //     console.log(date);
    //     await INSERT .into`MATERIAL_MASTER_CREATION_EVENT_TABLE` .entries({EVENT_NO:1,MATERIAL_ID:req.data.MATERIAL_ID,CREATED_BY:date[0].CURRENT_TIMESTAMP,EVENT_CODE:1});
    //     // await UPDATE `MATERIAL_MASTER_CREATION_MATERIALS_DETAILS` .set `STATUS = 1` .where `ID = ${Q_ID}`;
    // });
      // this.on('EditHierarchyUsers',async (req) =>{
      // try{

      //   var oReqData = req.data.input;
      //   var sAction = oReqData.ACTION;
      //   var vUserDetails = oReqData.USER_DETAILS;
      //   var vUserIds = oReqData.VALUE[0].USER_IDS;
      //   var vHierarchyId = oReqData.VALUE[0].HIERARCHY_ID;
      //   var vType = oReqData.VALUE[0].TYPE;
  

      //   if(sAction === 'CREATE' || sAction === 'UPDATE' || sAction === 'DELETE')
      //   {
      //       // load procedure
      //       const loadProc = await dbconn.loadProcedurePromisified(hdbext, null, 'HIERARCHY_MATRIX')
      //       // execute procedure
      //       const result = await dbconn.callProcedurePromisified(loadProc,[vType, sAction, vUserIds,vHierarchyId]);
      //       return result
      //   }
      // }
      // catch (error) {
      //   req.error({message:  error.message ? error.message : error });      
      // } 
      // })
}) 
