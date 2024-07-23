const cds = require('@sap/cds')
const dbClass = require("sap-hdbext-promisfied")
const hdbext = require("@sap/hdbext")
const lib_common = require('../srv/LIB/ideal_library')
const lib_email = require('../srv/LIB/ideal_library_email')
const lib_email_content = require('../srv/LIB/ideal_library_email_content')
// const lib_ias = require('./LIB/iven_library_ias') 
const { response } = require('express')
const { escapeDoubleQuotes } = require('@sap/hdbext/lib/sql-injection-utils')

module.exports = cds.service.impl(function () {
    this.on('RequestProcess', async (req) => {
        try {
            //local Variables
            var { action, appType, inputData, eventsData,userDetails } = req.data;
            var sUserIdentity=userDetails.USER_ID;
            var sUserRole=userDetails.USER_ROLE;
            var sAction = action || null;
            var aInputData = inputData || [];
            var aEvents = eventsData || [];
            var isEmailNotificationEnabled = false;

            if(inputData.length === 0) throw {"message" : "inputData is missing"};
            
            var sEntityCode = aInputData[0].ENTITY_CODE || null;
            // var cLevel = aInputData[0].APPROVER_LEVEL || null;

            //intialize connection to database
            let connection = await cds.connect.to('db');

            // getEntity Description against Entity Code from library
            var sEntityDesc = await lib_common.getEntityDesc(connection, sEntityCode);
            // delete aInputData[0].ENTITY_DESC;  //commented by Siddhesh 10th Sep 23

            var sResponse = null;

            //Check if email notification is enabled
            isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");
            // get connection
            var client = await dbClass.createConnectionFromEnv();
            let dbConn = new dbClass(client);

            if (sAction === "CREATE") { 
                try{
                //----------------------------------------------------------------------------------
                //Check If Approver details exist against the entity code
                //PM TO CM
                // var NoApprover = "false";
                // var fHierarchy_id;
                // var fLevel;
                var checkApprover = await lib_common.getApproverForEntity(connection, sEntityCode, null, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY',appType,1);
                if (checkApprover === null || (checkApprover[0].USER_IDS === null || checkApprover[0].USER_IDS === ""))
                {
                    // NoApprover = "true";
                    // fHierarchy_id = null;
                    // fLevel = null;
                    throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};
                }
                var checkApproverReg = await lib_common.getApproverForEntity(connection, sEntityCode, null, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY','REG',1);
                if (checkApproverReg === null || (checkApproverReg[0].USER_IDS === null || checkApproverReg[0].USER_IDS === ""))
                {
                    throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};
                }
                // else{
                //     fHierarchy_id =  checkApprover[0].HIERARCHY_ID;
                //     fLevel = checkApprover[0].LEVEL;

                // }
              
                // try {
                // var inviteReq = aInputData[0].INVITEREQ;
                var type = parseInt(aInputData[0].REQUEST_TYPE);
                var dealer_No = aInputData[0].IDEAL_DIST_CODE;

                if (aInputData[0].SAP_DIST_CODE !== null) {
                    aInputData[0].SAP_DIST_CODE = parseInt(aInputData[0].SAP_DIST_CODE, 10).toString();
                }

                // var events = aInputData[0].INVITEVENTS;
                iREQUEST_NO = aEvents[0].REQUEST_NO || null;
                sUserID = aEvents[0].USER_ID || null;
                if (type === 1 || type === 2 || type === 3 || type === 7 || dealer_No === null) {
                    valid = await checkDealer(connection, aInputData, "CheckEmail");
                } else {
                    valid = 0;
                }
                if (valid === 0) {

                    if (type !== 7) {
                        const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'REQUEST_PROCESS_CREATION')
                        sResponse = await dbConn.callProcedurePromisified(loadProc,
                            [aInputData[0].ENTITY_CODE, dealer_No, aInputData, aEvents, checkApprover[0].ROLE_CODE, checkApprover[0].LEVEL]
                        );
                    } else if (type === 7) {
                        // Quick registration
                        // var sEntityCode = aInputData[0].ENTITY_CODE;
                        var sBuyerEmail = aInputData[0].REQUESTER_ID;
                        var sSupplierName = aInputData[0].DIST_NAME1;
                        var sSupplierEmail = aInputData[0].REGISTERED_ID;
                        var sSupplTypeCode = aInputData[0].SUPPL_TYPE;
                        var sSupplTypeDesc = aInputData[0].SUPPL_TYPE_DESC;
                        var sBP_TypeDesc = aInputData[0].BP_TYPE_CODE;
                        var sBP_lTypeDesc = aInputData[0].BP_TYPE_DESC;

                        var iRequestType = parseInt(aInputData[0].REQUEST_TYPE, 10);
                        var iCreationType = parseInt(aInputData[0].CREATION_TYPE, 10);

                        const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'QUICK_REGISTRATION')
                        sResponse = await dbConn.callProcedurePromisified(loadProc,
                            [sEntityCode, sBuyerEmail, sSupplierName, sSupplierEmail, iRequestType,
                                iCreationType, sSupplTypeCode, sSupplTypeDesc, sBP_TypeDesc, sBP_lTypeDesc,
                                aInputData, aEvents]
                        );

                        // iVen_Content.postErrorLog(conn, Result, iREQUEST_NO, sUserID, "Supplier Request Form", "PROCEDURE",dbConn,hdbext);
                    }

            if (sResponse.outputScalar.OUT_SUCCESS !== null) {
                oEmailData = {
                    "ReqNo": sResponse.outputScalar.OUT_SUCCESS,
                    "ReqType": aInputData[0].REQUEST_TYPE,
                    "SupplierName": aInputData[0].DIST_NAME1,
                    "EntityDesc": sEntityDesc
                }
                aInputData[0].REQUEST_NO = sResponse.outputScalar.OUT_SUCCESS;
                // isEmailNotificationEnabled = "true";

            //Directly Approval            
            // if(NoApprover === "true")
            // {
            //     sAction = "APPROVE";
            //     var reqNo = aInputData[0].REQUEST_NO || null;
            //     var type = aInputData[0].REQUEST_TYPE || null;
            //     var iDealCode = aInputData[0].IDEAL_DIST_CODE || null;
            //     var sapCode = aInputData[0].SAP_DIST_CODE || null;

            //     var oActiveObj = type === 5 ? await getActiveData(connection, aInputData) : null;
            //     if (oActiveObj !== null && type === 5) {

            //         const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'REQUEST_PROCESS_APPROVAL')
            //         sResponse = await dbConn.callProcedurePromisified(loadProc,
            //             [sAction, reqNo, type, aInputData[0].REGISTERED_ID, iDealCode, sapCode,
            //                 oActiveObj.REQUEST_NO_ACTIVE, oActiveObj.REQUEST_TYPE, oActiveObj.CREATION_TYPE, 2, null,null,'CM',aEvents]
            //         );
            //         // iVen_Content.postErrorLog(conn, Result, iREQUEST_NO, sUserID, "Supplier Request Approval", "PROCEDURE",dbConn,hdbext);
            //     }
            //     else {
            //         const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'REQUEST_PROCESS_APPROVAL')
            //         sResponse = await dbConn.callProcedurePromisified(loadProc,
            //             [sAction, reqNo, type, aInputData[0].REGISTERED_ID, iDealCode, sapCode, null,
            //                 null, null, null, null,null,'CM',aEvents]
            //         );
            //         // iVen_Content.postErrorLog(conn, Result, iREQUEST_NO, sUserID, "Supplier Request Approval", "PROCEDURE",dbConn,hdbext);
            //     }

            //     if (sResponse.outputScalar.OUT_SUCCESS !== null) {
            //         if (isEmailNotificationEnabled) {
            //             // setEmailData(inviteReq, "Approve");
            //             oEmailData = {
            //                 "ReqNo": reqNo,
            //                 "ReqType": aInputData[0].REQUEST_TYPE,
            //                 "SupplierName": aInputData[0].DIST_NAME1,
            //                 "EntityDesc": sEntityDesc
            //             }

            //              // await lib_email.sendEmail(connection, oEmaiContent.emailBody, oEmaiContent.subject, [aInputData[0].REQUESTER_ID], null, null)
            //         oEmaiContent = await lib_email_content.getEmailContent(connection, "APPROVE", "REQUEST", oEmailData, null)
            //         var sCCEmail = await lib_email.setDynamicCC(null);
            //         await  lib_email.sendidealEmail(aInputData[0].REQUESTER_ID,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)
                        
            //             // await lib_email.sendEmail(connection, oEmaiContent.emailBody, oEmaiContent.subject, [aInputData[0].REGISTERED_ID], null, null)
            //         oEmaiContent = await lib_email_content.getEmailContent(connection, "INVITE", "REQUEST", oEmailData, null)
            //         var sCCEmail = await lib_email.setDynamicCC(null);
            //         await  lib_email.sendidealEmail(aInputData[0].REGISTERED_ID,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)  
            //             } }
            //     //Directly Approval Response
            //     if(NoApprover === "true")
            //     { Result2 = { OUT_SUCCESS : "Distributor Request Created And Approved" };} return Result2;
            // }

                if (type === 7) {
                    oEmailData = {
                        "ReqNo": sResponse.outputScalar.OUT_SUCCESS,
                        "SupplierName": sSupplierName,
                        "SupplierId": sSupplierEmail,
                        "To_Email": sBuyerEmail // BuyersId
                    };

                if (isEmailNotificationEnabled) {
                    // Quick registration Approval pending at L1 - notification to Buyer

                oEmaiContent = await lib_email_content.getEmailContent(connection, "QUICK_REG", "REGISTER", oEmailData, null)
                var sCCEmail = await lib_email.setDynamicCC(null);
                await  lib_email.sendidealEmail(sBuyerEmail,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)
                    }
                } else {
                        // iVen_Content.postErrorLog(conn, Result, iREQUEST_NO, sUserID, "Supplier Request Creation", "PROCEDURE",dbConn,hdbext);
                        if (isEmailNotificationEnabled) {
                        //fetch Approver details
                        //PM TO CM
                        var email = await lib_common.getApproverForEntity(connection, sEntityCode, null, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY',appType,1);
                        // lib_common.getApproverForEntity(connection, sEntityCode, 'PM', 'MATRIX_REQUEST_APPR');
                        oEmaiContent = await lib_email_content.getEmailContent(connection, "CREATE", "REQUEST", oEmailData, null)
                        var sCCEmail = await lib_email.setDynamicCC(null);
                        await  lib_email.sendidealEmail(email[0].USER_IDS,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)      
                    }
                        }  
                Result2 = {
                    OUT_SUCCESS: "Distributor Request Created : " + sResponse.outputScalar.OUT_SUCCESS || ""
                }
                    return Result2;
                        // iVen_Content.responseInfo(JSON.stringify(Result2), "application/json", 200);
                } else {
                        iREQUEST_NO = 0;
                        throw {"message":"Distributor Request Creation failed. Please contact admin."}
                        // let Result2 = {
                        //     OUT_SUCCESS: "Supplier Request Creation failed. Please contact admin."
   
                        // };
                        // return Result2;
                        // iVen_Content.responseInfo(JSON.stringify(Result2), "application/json", parseInt(Result.OUT_ERROR_CODE, 10));
                    }
                } else {
                    if (valid === 'ErrorEmail') {
                        iREQUEST_NO = 0;
                        // var Result2 = {
                        //     OUT_SUCCESS: "Supplier Email " + aInputData[0].REGISTERED_ID + " already exist."
                        // };
                        throw {"message":"Distributor Email " + aInputData[0].REGISTERED_ID + " already exist."}
                    } else {
                        iREQUEST_NO = 0;
                        // var Result2 = {
                        //     OUT_SUCCESS: "Supplier " + aInputData[0].VENDOR_NAME1 + " already exist. Previous request is in process.",
                        // };
                        throw {"message":"Distributor " + aInputData[0].DIST_NAME1 + " already exist. Previous request is in process."}
                    }
                    // return Result2;
                    // iVen_Content.responseInfo(JSON.stringify(Result2), "application/json", 301);
                }
                } catch (error) {
                    // conn.rollback();
                    var sType=error.code?"Procedure":"Node Js";    
                    var iErrorCode=error.code??500;     
                    // let Result2 = {
                    //   OUT_SUCCESS: error.message || ""
                    // };
                    iREQUEST_NO = 0;   
                    let Result = {
                        OUT_ERROR_CODE: iErrorCode,
                        OUT_ERROR_MESSAGE:  error.message ? error.message : error
                    }   
                    lib_common.postErrorLog(Result,iREQUEST_NO,sUserIdentity,sUserRole,"Distributor Request Managment",sType,dbConn,hdbext);
                    console.error(error)     
                    // return error.messsage     
                    req.error({ code:iErrorCode, message:  error.message ? error.message : error }); 
                } 
            }
            else if (sAction === "APPROVE") {  //--------------------------------------------------------------------------
             try{
                var sQuery;
                var reqNo = aInputData[0].REQUEST_NO || null;
                var type = aInputData[0].REQUEST_TYPE || null;
                var iDealCode = aInputData[0].IDEAL_DIST_CODE || null;
                var sapCode = aInputData[0].SAP_DIST_CODE || null;
                var sLevel = aInputData[0].APPROVER_LEVEL  || null;
                var sAppType = appType || null;
                var sApproverRole = aInputData[0].APPROVER_ROLE || null;
                // var sHierarchyId = aInputData[0].HIERARCHY_ID || null; ---------

                //getRoleCode And Type
                // var hierarchyData = await lib_common.getRoleForId(connection,sEntityCode,'CALC_HIERARCHY_MATRIX',sHierarchyId,sAppType);
                // var gRoleCode = hierarchyData[0].ROLE_CODE; -----------
                // var gType = hierarchyData[0].TYPE; ----------

                //Check if approver is there for approval
                var getApprover = await lib_common.getApproverForEntity(connection, sEntityCode, sApproverRole, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY',sAppType,sLevel);
                if (getApprover === null || (getApprover[0].USER_IDS === null || getApprover[0].USER_IDS === ""))
                throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};

                //find Max Level 
                var maxLevel = await lib_common.getMaxLevel(sEntityCode,sAppType);

                //if approval are there
                if(sLevel < maxLevel)
                {
                    var addLevel = Number(sLevel) + 1;
                    sAction = "Approve_Pending";
                    var checkApprover = await lib_common.getApproverForEntity(connection, sEntityCode, null, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY',sAppType,addLevel);
                    if (checkApprover === null || (checkApprover[0].USER_IDS === null || checkApprover[0].USER_IDS === ""))
                    throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};
                    const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'REQUEST_PROCESS_APPROVAL')
                    sResponse = await dbConn.callProcedurePromisified(loadProc,
                        [sAction, reqNo, type, aInputData[0].REGISTERED_ID, iDealCode, sapCode, null,
                            null, null, null, checkApprover[0].ROLE_CODE,checkApprover[0].LEVEL,checkApprover[0].ROLE_CODE,aEvents]
                    );

                }
                //final Approval
                if(sLevel === maxLevel)
                {
                var oActiveObj = type === 5 ? await getActiveData(connection, aInputData) : null;
                if (oActiveObj !== null && type === 5) {

                    const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'REQUEST_PROCESS_APPROVAL')
                    sResponse = await dbConn.callProcedurePromisified(loadProc,
                        [sAction, reqNo, type, aInputData[0].REGISTERED_ID, iDealCode, sapCode,
                            oActiveObj.REQUEST_NO_ACTIVE, oActiveObj.REQUEST_TYPE, oActiveObj.CREATION_TYPE, 2, null,null,sApproverRole,aEvents]
                    );
                    // iVen_Content.postErrorLog(conn, Result, iREQUEST_NO, sUserID, "Supplier Request Approval", "PROCEDURE",dbConn,hdbext);
                }
                else {
                    const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'REQUEST_PROCESS_APPROVAL')
                    sResponse = await dbConn.callProcedurePromisified(loadProc,
                        [sAction, reqNo, type, aInputData[0].REGISTERED_ID, iDealCode, sapCode, null,
                            null, null, null, null,null,sApproverRole,aEvents]
                    );
                    // iVen_Content.postErrorLog(conn, Result, iREQUEST_NO, sUserID, "Supplier Request Approval", "PROCEDURE",dbConn,hdbext);
                }
            }
                // isEmailNotificationEnabled = "true";
                if (sResponse.outputScalar.OUT_SUCCESS !== null) {
                    if (isEmailNotificationEnabled && sAction !== 'Approve_Pending') {
                        // setEmailData(inviteReq, "Approve");
                        oEmailData = {
                            "ReqNo": reqNo,
                            "ReqType": aInputData[0].REQUEST_TYPE,
                            "SupplierName": aInputData[0].DIST_NAME1,
                            "EntityDesc": sEntityDesc
                        }

                         // await lib_email.sendEmail(connection, oEmaiContent.emailBody, oEmaiContent.subject, [aInputData[0].REQUESTER_ID], null, null)
                    oEmaiContent = await lib_email_content.getEmailContent(connection, "APPROVE", "REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC(null);
                    await  lib_email.sendidealEmail(aInputData[0].REQUESTER_ID,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)
                        
                        // await lib_email.sendEmail(connection, oEmaiContent.emailBody, oEmaiContent.subject, [aInputData[0].REGISTERED_ID], null, null)
                    oEmaiContent = await lib_email_content.getEmailContent(connection, "INVITE", "REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC(null);
                    await  lib_email.sendidealEmail(aInputData[0].REGISTERED_ID,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)  
                    }
                    if (isEmailNotificationEnabled && sAction === 'Approve_Pending') {

                    var approverName = await SELECT .from`DEALER_PORTAL_MASTER_IDEAL_USERS` .where`USER_ID=${getApprover[0].USER_IDS}`; 
                    var approverRoleDesc = await SELECT .from`DEALER_PORTAL_MASTER_USER_ROLE` .where`CODE=${getApprover[0].ROLE_CODE}`;
                    oEmailData = {
                        "ReqNo": reqNo,
                        "ReqType": aInputData[0].REQUEST_TYPE,
                        "SupplierName": aInputData[0].DIST_NAME1,
                        "EntityDesc": sEntityDesc,
                        "Next_Approver": checkApprover[0].USER_IDS,
                        "Approver" : approverName[0].USER_NAME,
                        "Approve_Role" : approverRoleDesc[0].DESCRIPTION
                    }

                    oEmaiContent = await lib_email_content.getEmailContent(connection, sAction, "REQUEST", oEmailData, null);
                    var sCCEmail = await lib_email.setDynamicCC( null);
                    await  lib_email.sendidealEmail(oEmailData.Next_Approver,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)

                    }
                    let Result2 = {};
                    Result2.OUT_SUCCESS = sResponse.outputScalar.OUT_SUCCESS || "";
                    return Result2;
                    // iVen_Content.responseInfo(JSON.stringify(Result2), "application/json", 200);
                } else {
                    throw {"message":sResponse.outputScalar.OUT_ERROR_MESSAGE}
                }
                } catch (error) {
                    // conn.rollback();

                    var sType=error.code?"Procedure":"Node Js";    
                    var iErrorCode=error.code??500;     
                    // let Result2 = {
                    //   OUT_SUCCESS: error.message || ""
                    // };
                    iREQUEST_NO = 0;   
                    let Result = {
                        OUT_ERROR_CODE: iErrorCode,
                        OUT_ERROR_MESSAGE:  error.message ? error.message : error
                    }
                    lib_common.postErrorLog(Result,reqNo,sUserIdentity,sUserRole,"Distributor Request Approval",sType,dbConn,hdbext);
                    console.error(error)     
                    // return error.messsage     
                    req.error({ code:iErrorCode, message:  error.message ? error.message : error }); 
                    // req.error({ code: "500", message: "Vendor Request Approval failed. Please contact admin." });

                }

            }
            else if (sAction === "REJECT" || sAction === "DELETE") { //----------------------------------------------------------------------------
                try{
                var reqNo = aInputData[0].REQUEST_NO;
                var type = aInputData[0].REQUEST_TYPE;
                var iDealCode = aInputData[0].IDEAL_DIST_CODE;

                iREQ_NO = aEvents[0].REQUEST_NO || null;
                sUserID = aEvents[0].USER_ID || null;

                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'REQUEST_PROCESS_APPROVAL');
                sResponse = await dbConn.callProcedurePromisified(loadProc,
                    [sAction, reqNo, type, aInputData[0].REGISTERED_ID, iDealCode, null, null, null,
                        null, null,null, null, 'CM', aEvents]
                );

                // iVen_Content.postErrorLog(conn, Result, iREQ_NO, sUserID, "Supplier Request Approval","PROCEDURE",dbConn,hdbext);
                // isEmailNotificationEnabled = "true";
                if (sResponse.outputScalar.OUT_SUCCESS !== null) {

                    if (isEmailNotificationEnabled) {
                        oEmailData = {
                            "ReqNo": reqNo,
                            "ReqType": aInputData[0].REQUEST_TYPE,
                            "SupplierName": aInputData[0].DIST_NAME1 || "",
                            "EntityDesc": sEntityDesc || "",
                            "RejComm": aEvents[0].COMMENT || ""
                        }
                        
                    oEmaiContent = await lib_email_content.getEmailContent(connection, sAction, "REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC(null);
                    await  lib_email.sendidealEmail(aInputData[0].REQUESTER_ID,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)
                
                    
                    }
                    let Result2 = {};
                    Result2.OUT_SUCCESS = sResponse.outputScalar.OUT_SUCCESS || "";
                    // iVen_Content.responseInfo(JSON.stringify(Result2), "application/json", 200);
                    return Result2;
                } else {
                    throw {"message":"Dealer Request Rejection failed. Please contact admin."}
                }

            }
            catch (error) {
                // conn.rollback();
                var sType=error.code?"Procedure":"Node Js";    
                var iErrorCode=error.code??500;     
                // let Result2 = {
                //   OUT_SUCCESS: error.message || ""
                // };
                let Result = {
                    OUT_ERROR_CODE: iErrorCode,
                    OUT_ERROR_MESSAGE:  error.message ? error.message : error
                }
                lib_common.postErrorLog(Result,reqNo,sUserIdentity,sUserRole,"Distributor Request Approval",sType,dbConn,hdbext);
                console.error(error)     
                // return error.messsage     
                req.error({ code:iErrorCode, message:  error.message ? error.message : error });
            } 
        }
        
            else if (sAction === "RESENDNOTIFICATION") {

                if (isEmailNotificationEnabled) {
                    oEmailData = {
                        "ReqNo": aInputData[0].REQUEST_NO,
                        "ReqType": aInputData[0].REQUEST_TYPE,
                        "SupplierName": aInputData[0].DIST_NAME1,
                        "EntityDesc": sEntityDesc
                    }

                    // oEmaiContent = EMAIL_LIBRARY.getEmailData("RE_INVITE", "REQUEST", oEmailData, null);
                    // EMAIL_LIBRARY._sendEmailV2(oEmaiContent.emailBody, oEmaiContent.subject, [inviteReq[0].REGISTERED_ID], null);
                oEmaiContent = await lib_email_content.getEmailContent(connection, "RE_INVITE", "REQUEST", oEmailData, null)

                    // sResponse = await lib_email.sendEmail(connection, oEmaiContent.emailBody, oEmaiContent.subject, [aInputData[0].REGISTERED_ID], null, null);
                var sCCEmail = await lib_email.setDynamicCC(null);
                await  lib_email.sendidealEmail(aInputData[0].REGISTERED_ID,sCCEmail,'html', oEmaiContent.subject,oEmaiContent.emailBody)
                
                     //Capture events 
                     await createEvents(connection,aInputData[0].REQUEST_NO,aEvents);
                    // if( sResponse === "Email sent") {
                    //    return  "Invite Notification Resent";
                    // } else{
                    //     throw "Failed to send email";
                    // } 
                    return "Invite Notification Resent";
                }
                else {
                    sResponse = "Email Notification disabled";
                    return sResponse;
                }
            }
            else if (sAction === "VALIDATION") { //Handle validation-----------------------------------------------------
                // var inviteReq = aInputData[0].INVITEREQ;
                // handling to remove zeroes before SAP vendor code from S4HANA
                aInputData[0].SAP_DIST_CODE = parseInt(aInputData[0].SAP_DIST_CODE, 10).toString();
                var validate = await checkUpdate(connection, aInputData);

                if (validate === 'IN PROCESS') {
                    sResponse = "Dealer " + aInputData[0].DIST_NAME1 + " is in process. You can not update.";
                    throw  {"message":sResponse};
                } else if (validate === 'NOT FOUND') {
                    sResponse = "Dealer " + aInputData[0].DIST_NAME1 + " not registered on iDeal Portal.";
                    throw  {"message": sResponse};
                } else {
                    sResponse = validate
                    return sResponse;
                }
                
            }
            else if (sAction === "VALIDATE_SAPCODE") { //Handle SAP_VENDOR_CODE validation-----------------------------------------------------
                // try {
                // var reqData = aInputData[0].INVITEREQ;
                var validateCode = await validateSAPCode(connection, aInputData);
                if (validateCode === false) {
                    sResponse = "SAP dealer code : " + aInputData[0].SAP_DIST_CODE + " already exist.";
                    return sResponse
                } else {
                    return validateCode;
                }
            } 
            else {
                throw {message: "The value for action is invalid"};
            }
        } catch (error) {
            
            req.error({ code: "500",  message: error.message ? error.message : error });
        }
    })

    //Action : RequestEditProcess
    this.on('RequestEditProcess', async (req) => {
        try {
            //local Variables
            var oReqData = JSON.parse(req.data.input);
            var sAction = oReqData.ACTION || null;
            var aInputData = oReqData.INPUT_DATA || null;
            var aEvents = oReqData.EVENTS || [];
            var iRequestNo = aInputData[0].REQUEST_NO || null;

            var oUserDetails=oReqData.USER_DETAILS;   
            var sUserIdentity=oUserDetails.USER_ID || null;
            var sUserRole=oUserDetails.USER_ROLE || null; 

            var isEmailNotificationEnabled = false;
            var Result = null;

            //intialize connection to database
            let connection = await cds.connect.to('db');

            
            //Check if email notification is enabled
            isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");

            // get connection
            var client = await dbClass.createConnectionFromEnv();
            let dbConn = new dbClass(client);

            if (sAction === "REQUEST_EDIT") {
                try{
                // execProcedure = conn.loadProcedure('VENDOR_PORTAL', 'VENDOR_PORTAL.Procedure::REQUEST_TYPE_CHANGE');
                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'REQUEST_TYPE_CHANGE')

                // var iRequestNo = aInputData[0].REQUEST_NO;

                var sUserId = aInputData[0].USER_ID || null;
                var sBuyerId = await getRequestCreator(connection, iRequestNo);
                var sComment = aInputData[0].COMMENT;
                // var responseObj;

                var sReqType = aInputData[0].REQUEST_TYPE;
                var iReqTypeChangeTo = aInputData[0].REQUEST_TYPE_TO_CODE;
                var sChangedTo = aInputData[0].REQUEST_TYPE_TO_DESC.toUpperCase() || "";
                var sChangedFrom = aInputData[0].REQUEST_TYPE_FROM_DESC.toUpperCase() || "";

                var sChangeType = aInputData[0].CHANGE_TYPE;
                var sSubType = aInputData[0].SUB_TYPE_TO_CODE;
                var sSubTypeToDesc = aInputData[0].SUB_TYPE_TO_DESC.toUpperCase() || "";
                var sSubTypeFromDesc = aInputData[0].SUB_TYPE_FROM_DESC.toUpperCase() || "";

                var sSupplType = aInputData[0].SUPPL_TYPE_TO_CODE;
                var sSupplTypeToDesc = aInputData[0].SUPPL_TYPE_TO_DESC.toUpperCase() || "";
                var sSupplTypeFromDesc = aInputData[0].SUPPL_TYPE_FROM_DESC.toUpperCase() || "";

                var aEventObj = await getEventObj(aInputData[0]);
                var sUserID = aEventObj[0].USER_ID || null;

                var sSupplierName = await getSupplierFromRequestNo(connection, iRequestNo) || "NA";

                var changedFields = aInputData[0].CHANGED_FIELDS;
                var aEmailContentChange =[];
                // var sEmailContentChange ='';
                if(changedFields.length > 0)
                {
                    changedFields.map(function(field){
                      field =  field.trim();
                        if(field === "Creation Type" || field === "Request Type")
                    //         // aEmailContentChange.push(field +" changed from " + sChangedFrom + " to <b>" + sChangedTo +" </b>")
                            aEmailContentChange.push({"CHANGE_TYPE":field,"OLD_VALUE":sChangedFrom,"NEW_VALUE":sChangedTo})
                            else if(field === "Dealer Type")
                            aEmailContentChange.push({"CHANGE_TYPE":field,"OLD_VALUE":sSupplTypeFromDesc,"NEW_VALUE":sSupplTypeToDesc})
                    //     // aEmailContentChange.push(field +" changed from " + sSupplTypeFromDesc + " to <b>" + sSupplTypeToDesc +" </b>")
                        else if(field === "Dealer Sub Type")
                        aEmailContentChange.push({"CHANGE_TYPE":field,"OLD_VALUE":sSubTypeFromDesc,"NEW_VALUE":sSubTypeToDesc})
                        
                    //     // aEmailContentChange.push(field +" changed from " + sSubTypeFromDesc + " to <b>" + sSubTypeToDesc +" </b>")
                    
                    })
                    // sEmailContentChange=  aEmailContentChange.toString()
                }

                // Result = execProcedure(iRequestNo, iReqTypeChangeTo, sReqType, sChangeType, sSubType, sSubTypeToDesc, sSupplType, sSupplTypeToDesc, aEventObj);
                Result = await dbConn.callProcedurePromisified(loadProc,
                    [iRequestNo, iReqTypeChangeTo, sReqType, sChangeType, sSubType, sSubTypeToDesc, sSupplType, sSupplTypeToDesc, aEventObj]
                );
                responseObj = {
                    "Message": Result.outputScalar.OUT_SUCCESS !== null ? iRequestNo + ": " + sComment : "Edit saving failed!"
                };

                if (Result.outputScalar.OUT_SUCCESS !== null) {
                    // let oChangeDetail = []
                    // if(sChangedTo != sChangedFrom)
                    //     oChangeDetail.push(" " + sChangedFrom + " to " + sChangedTo + " ")
                    // else if(sSubTypeToDesc != sSubTypeFromDesc)
                    //     oChangeDetail.push(" " + sSubTypeFromDesc + " to " + sSubTypeToDesc + " ")
                    // else if(sSubTypeToDesc != sSubTypeFromDesc)
                    //     oChangeDetail.push(" " + sSubTypeFromDesc + " to " + sSubTypeToDesc + " ")
                    
                    var oEmailData = {
                        "ReqNo": iRequestNo,
                        "SupplierName": sSupplierName,
                        "Changed_by": sUserId,
                        "Reason": sComment,
                        "Assigned_From": sChangeType === "RT" ? sChangedFrom : sSubTypeFromDesc,
                        "Assigned_To": sChangeType === "RT" ? sChangedTo : sSubTypeToDesc,
                        "sChangeType": sChangeType,
                        "changeDetails":aEmailContentChange
                    };

                    if (isEmailNotificationEnabled) {
                    oEmaiContent = await lib_email_content.getEmailContent(connection, null, "REQ_TYPE_CHANGE", oEmailData, null)

                        // await lib_email.sendEmail(connection, oEmaiContent.emailBody, oEmaiContent.subject, [sBuyerId], null, null)
                    var sCCEmail = await lib_email.setDynamicCC(null);
                    await  lib_email.sendidealEmail(sBuyerId,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)
                
                        // var oEmaiContent = EMAIL_LIBRARY.getEmailData(null, "REQ_TYPE_CHANGE", oEmailData, null);
                        // EMAIL_LIBRARY._sendEmailV2(oEmaiContent.emailBody, oEmaiContent.subject, [sBuyerId], null);
                    }

                    statusCode = 200;
                } else {
                    statusCode = 400;
                }
                return responseObj
                // responseInfo(JSON.stringify(responseObj), "text/plain", 200);
            }
            catch (error) {
                // conn.rollback();
                var sType=error.code?"Procedure":"Node Js";    
                var iErrorCode=error.code??500;     
                // let Result2 = {
                //   OUT_SUCCESS: error.message || ""
                // };
                let Result = {
                    OUT_ERROR_CODE: iErrorCode,
                    OUT_ERROR_MESSAGE:  error.message ? error.message : error
                }
                lib_common.postErrorLog(Result,iRequestNo,sUserIdentity,sUserRole,"Distrubutor Request Edit",sType,dbConn,hdbext);
                console.error(error)     
                // return error.messsage     
                req.error({ code:iErrorCode, message:  error.message ? error.message : error });
            } 
            }
            else if (sAction === "REG_ID_EDIT") {
                try{
                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'REGISTERED_ID_EDIT')

                // execProcedure = conn.loadProcedure('VENDOR_PORTAL', 'VENDOR_PORTAL.Procedure::REGSITERED_ID_EDIT');
                // var iRequestNo = aInputData[0].REQUEST_NO;
                var iStatus = aInputData[0].STATUS;
                var iCurrentStatus = await getCurrentRequestStatus(connection, iRequestNo);
                var sSupplierName = await getSupplierFromRequestNo(connection, iRequestNo) || "NA";
                var iRequestType = await getRequestType(connection, iRequestNo);
                var sNewRegId = aInputData[0].CHANGE_TO_ID.toLowerCase() || "";
                var sOldRegId = aInputData[0].CHANGE_FROM_ID.toLowerCase() || "";
                var sComment = aInputData[0].COMMENT;
                var aEventObj = await getEventObj(aInputData[0]);
                var sUserID = aEventObj[0].USER_ID || null;
                var sBuyerId = await getRequestCreator(connection, iRequestNo);
                var iSAPCode = aInputData[0].SAP_DIST_CODE; // by yogendra 
                var oEmaiContent = null;

                // 			throw JSON.stringify(aEventObj);

                var oEmailData = {
                    "ReqNo": iRequestNo,
                    "SupplierName": sSupplierName,
                    "Changed_by": sUserId,
                    "Reason": sComment,
                    "Changed_From": sOldRegId,
                    "Changed_To": sNewRegId,
                    "sBuyerId": sBuyerId,
                    "RequestType": iRequestType,
                    "Status":iStatus
                };

                //-----------------Updateof registered email id on iVen & CPI-----------------------------------------------------------------------
                if (iSAPCode !== '' && iSAPCode !== null && iSAPCode !== undefined) {

                    if (iRequestType < 4 && iCurrentStatus < 11) {
                        // Result = execProcedure(iRequestNo, iStatus, sNewRegId, aEventObj);
                        Result = await dbConn.callProcedurePromisified(loadProc,
                            [iRequestNo, iStatus, sNewRegId, aEventObj]);
                        responseObj = {
                            "Message": Result.outputScalar.OUT_SUCCESS !== null ? iRequestNo + ": " + sComment : "Edit saving failed!"
                        };
                        statusCode = 200;

                        if (isEmailNotificationEnabled) {
                            // oEmaiContent = EMAIL_LIBRARY.getEmailData(null, "REG_EMAILID_CHANGE", oEmailData, null);
                            // EMAIL_LIBRARY._sendEmailV2(oEmaiContent.emailBody, oEmaiContent.subject, [oEmailData.Changed_To], [oEmailData.sBuyerId, oEmailData.Changed_From]);
                    // oEmaiContent = await lib_email_content.getEmailContent(connection, null, "REG_EMAILID_CHANGE", oEmailData, null)

                            // await lib_email.sendEmail(connection, oEmaiContent.emailBody, oEmaiContent.subject, [sNewRegId], [sBuyerId, sOldRegId], null)
                    // var sCCEmail = await lib_email.setDynamicCC( [sBuyerId, sOldRegId]);
                    // await  lib_email.sendidealEmail(sNewRegId,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)
                      
                        }
                    } else {
                        // Result = execProcedure(iRequestNo, iStatus, sNewRegId, aEventObj);
                        Result = await dbConn.callProcedurePromisified(loadProc,
                            [iRequestNo, iStatus, sNewRegId, aEventObj]);
                        responseObj = {
                            "Message": Result.outputScalar.OUT_SUCCESS !== null ? iRequestNo + ": " + sComment : "Edit saving failed!"
                        };

                        if (isEmailNotificationEnabled) {
                            // oEmaiContent = EMAIL_LIBRARY.getEmailData(null, "REG_EMAILID_CHANGE", oEmailData, null);
                            // EMAIL_LIBRARY._sendEmailV2(oEmaiContent.emailBody, oEmaiContent.subject, [oEmailData.Changed_To], [oEmailData.sBuyerId, oEmailData.Changed_From]);
                    // oEmaiContent = await lib_email_content.getEmailContent(connection, null, "REG_EMAILID_CHANGE", oEmailData, null)

                            // await lib_email.sendEmail(connection, oEmaiContent.emailBody, oEmaiContent.subject, [sNewRegId], [sBuyerId, sOldRegId], null)
                    // var sCCEmail = await lib_email.setDynamicCC( [sBuyerId, sOldRegId]);
                    // await  lib_email.sendidealEmail(sNewRegId,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)
                      
                        }
                        //CPI Update change
                        var S_iSapCode =  "\"" + iSAPCode + "\"" ;
                        if(iRequestType == 5){
                    //  var sResponseIAS = await lib_ias.UpdateDealerEmailIdIAS(S_iSapCode,sNewRegId);
                    // console.log(sResponseIAS)
                        //   var  statusCode =  sResponseIAS.STATUS_CODE
                        }
                           
                        // var urlIAS = "iasupdate";

                        // var destIAS = $.net.http.readDestination("VENDOR_PORTAL.XSJS", "iVen_CPI");
                        // var clientIAS = new $.net.http.Client();
                        // var reqIAS = new $.net.http.Request($.net.http.GET, urlIAS);
                        // reqIAS.headers.set("userid", "userName eq " + S_iSapCode );
                        // // reqIAS.headers.set("userid", "userName eq 6000000328");
                        // reqIAS.headers.set("newemail", sNewRegId);
                        // clientIAS.request(reqIAS, destIAS);
                        // var responseIAS = clientIAS.getResponse();

                        // statusCode = responseIAS.status;

                        // switch (statusCode) {
                        //     case 200:
                        //         Result = execProcedure(iRequestNo, iStatus, sNewRegId, aEventObj);
                        //         responseObj = {
                        //             "Message": Result.outputScalar.OUT_SUCCESS !== null ? iRequestNo + ": " + sComment : "Edit saving failed!"
                        //         };

                        //         if(isEmailNotificationEnabled) {
                        //             oEmaiContent = EMAIL_LIBRARY.getEmailData(null, "REG_EMAILID_CHANGE", oEmailData, null);
                        //             EMAIL_LIBRARY._sendEmailV2(oEmaiContent.emailBody, oEmaiContent.subject, [oEmailData.Changed_To], [oEmailData.sBuyerId, oEmailData.Changed_From]);
                        //         }
                        //         break;
                        //     case 409:
                        //         responseObj = {
                        //             "Message": "Email is already Exist in other user ID"
                        //         };
                        //         break;
                        //     case 500:
                        //         responseObj = {
                        //             "Message": "IAS user email Edit failed!Please contact support"

                        //         };
                        //         break;
                        //     default:
                        //         responseObj = {
                        //             "Message": "IAS user email Edit failed!Please contact support"
                        //         };
                        //         break;
                        // }
                    }
                } else {
                    Result = await dbConn.callProcedurePromisified(loadProc,
                        [iRequestNo, iStatus, sNewRegId, aEventObj]);
                    statusCode = 200;
                    responseObj = {
                        "Message": Result.outputScalar.OUT_SUCCESS !== null ? iRequestNo + ": " + sComment : "Edit saving failed!"
                    };

                    if (isEmailNotificationEnabled) {
                        // oEmaiContent = EMAIL_LIBRARY.getEmailData(null, "REG_EMAILID_CHANGE", oEmailData, null);
                        // EMAIL_LIBRARY._sendEmailV2(oEmaiContent.emailBody, oEmaiContent.subject, [oEmailData.Changed_To], [oEmailData.sBuyerId, oEmailData.Changed_From]);
                // oEmaiContent = await lib_email_content.getEmailContent(connection, null, "REG_EMAILID_CHANGE", oEmailData, null);

                        // await lib_email.sendEmail(connection, oEmaiContent.emailBody, oEmaiContent.subject, [sNewRegId], [sBuyerId, sOldRegId], null)
                // var sCCEmail = await lib_email.setDynamicCC( [sBuyerId, sOldRegId]);
                // await  lib_email.sendidealEmail(sNewRegId,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)
                  
                    }
                }
                
                //-------------------------------------------------------------------------------------------------------------
                // responseInfo(JSON.stringify(responseObj), "text/plain", statusCode);
                return responseObj;
            }
          catch (error) {
                // conn.rollback();
                var sType=error.code?"Procedure":"Node Js";    
                var iErrorCode=error.code??500;     
                // let Result2 = {
                //   OUT_SUCCESS: error.message || ""
                // };
                let Result = {
                    OUT_ERROR_CODE: iErrorCode,
                    OUT_ERROR_MESSAGE:  error.message ? error.message : error
                }
                lib_common.postErrorLog(Result,iRequestNo,sUserIdentity,sUserRole,"Distributor Registered ID Edit",sType,dbConn,hdbext);
                console.error(error)     
                // return error.messsage     
                req.error({ code:iErrorCode, message:  error.message ? error.message : error });
            } 
        }
            //user delegation & request forwarding
            else if (sAction === "REQUEST_FORWARDING") {
                try{
                // execProcedure = conn.loadProcedure('VENDOR_PORTAL', 'VENDOR_PORTAL.Procedure::USER_DELEGATION');
                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'REQUEST_FORWARD')

                var aRequests = aInputData[0].REQUESTS;

                if (aRequests.length === 0) {
                    throw  {"message": "No Requests to re-assign"};
                }
                var sAssignedFrom = aInputData[0].ASSIGNED_FROM;
                var sAssignedTo = aInputData[0].ASSIGNED_TO;
                var sLoginId = aInputData[0].USER_ID;
                // 			var sLoginName = aInputData[0].USER_NAME;
                // 			var sComment = aInputData[0].COMMENT;

                var aEventObj = await getUserDelEventObj(connection, aInputData[0]);
                var sUserID = aEventObj[0].USER_ID || null;

                // 			throw JSON.stringify(aEventObj);

                // Result = execProcedure(sLoginId, sAssignedFrom, sAssignedTo, aRequests, aEventObj);
                Result = await dbConn.callProcedurePromisified(loadProc,
                    [sLoginId, sAssignedFrom, sAssignedTo, aRequests, aEventObj]);
                if (Result.outputScalar.OUT_SUCCESS !== null) {
                    responseObj = {
                        "Message": Result.outputScalar.OUT_SUCCESS
                    };

                    // var aEmailto = null;
                    // for (var i = 0; i < aRequests.length; i++) {
                    //     var oEmailData = {
                    //         "ReqNo": aRequests[i].REQUEST_NO,
                    //         "ReqType": aRequests[i].REQUEST_TYPE,
                    //         "SupplierName": aRequests[i].DIST_NAME1,
                    //         "Admin_Email": aRequests[i].sLoginId,
                    //         "Approver": aRequests[i].NEXT_APPROVER,
                    //         "Assigned_To": sAssignedTo,
                    //         "Buyer": aRequests[i].REQUESTER_ID
                    //     };

                        // aEmailto = [sAssignedTo];
                        // if (aRequests[i].STATUS === 6 || (aRequests[i].NEXT_APPROVER !== aRequests[i].REQUESTER_ID)) {
                        //     aEmailto.push(aRequests[i].NEXT_APPROVER);
                        // } else if (aRequests[i].REQUESTER_ID !== sAssignedTo) {
                        //     aEmailto.push(aRequests[i].REQUESTER_ID);
                        // }

                        if (isEmailNotificationEnabled) {
                            // var oEmaiContent = EMAIL_LIBRARY.getEmailData(sAction, "USER_DELEGATE", oEmailData, aRequests[i].STATUS);
                            // EMAIL_LIBRARY._sendEmailV2(oEmaiContent.emailBody, oEmaiContent.subject, aEmailto, null);
                    // oEmaiContent = await lib_email_content.getEmailContent(connection, sAction, "USER_DELEGATE", oEmailData, aRequests[i].STATUS);

                            // await lib_email.sendEmail(connection, oEmaiContent.emailBody, oEmaiContent.subject, aEmailto, null, null)
                    // var sCCEmail = await lib_email.setDynamicCC( null);
                    // await  lib_email.sendidealEmail(aEmailto,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)
                      
                        }
                    }

                    statusCode = 200;
                    return responseObj;
                // }
                //  else {
                    // responseObj = {
                    //     "Message": "Request re-assign failed!"
                    // };
                    throw {"message":"Request re-assign failed!"}
                    // statusCode = 400;
                // }
                // responseInfo(JSON.stringify(responseObj), "text/plain", statusCode);
                // return responseObj;
            }
            catch (error) {
                var sType=error.code?"Procedure":"Node Js";    
                var iErrorCode=error.code??500;     

                let Result = {
                    OUT_ERROR_CODE: iErrorCode,
                    OUT_ERROR_MESSAGE:  error.message ? error.message : error
                }
                lib_common.postErrorLog(Result,aRequests[0].REQUEST_NO,sUserIdentity,sUserRole,"Distributor Request Forwarding",sType,dbConn,hdbext);
                console.error(error)     
                // return error.messsage     
                req.error({ code:iErrorCode, message:  error.message ? error.message : error });

            } 
            } else {
                throw {"message":"Invalid Action"}
            }

        } catch (error) {
            req.error({ code: "500",  message: error.message ? error.message : error });
        }
    })

    async function checkDealer(connection, data, val) {
        try {
            let aQuery1Result = await connection.run(
                SELECT 
                    .from`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`
                    .where`STATUS NOT IN (3,8) AND DIST_NAME1 = ${data[0].DIST_NAME1}`
            );
            let aQuery2Result = await connection.run(
                SELECT
                    .from`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`
                    .where`STATUS NOT IN (3,8) AND REGISTERED_ID = ${data[0].REGISTERED_ID}`
            );

            var iNameCount = aQuery1Result.length;
            var iEmailCount = aQuery2Result.length;

            if (iEmailCount !== 0) {
                return 'ErrorEmail';
            } else if (iEmailCount === 0 && iNameCount === 0) {
                return 0;
            } else {
                return 'ErrorName';
            }
        }
        catch (error) { throw error; }
    }

    //Get Active record-------------------------------------------------------------------------------------------------
    async function getActiveData(connection, data) {
        try {
            var oActiveObj = null;
            let aResult = await connection.run(
                SELECT
                    .from`${connection.entities['VIEW_REQUEST_ACTIVE_STATUS']}`
                    .where({ SAP_DIST_CODE: data[0].SAP_DIST_CODE,ACTIVE: "A", STATUS: 11 })
                   );

            if (aResult.length > 0) {
                oActiveObj = {
                    "REQUEST_NO_ACTIVE": aResult[0].REQUEST_NO,
                    "REQUEST_TYPE": aResult[0].REQUEST_TYPE,
                    "CREATION_TYPE": aResult[0].CREATION_TYPE,
                    "STATUS": aResult[0].STATUS
                };
            }
            return oActiveObj;
        }
        catch (error) { throw error; }

    }
    async function getRequestCreator(connection, iRequestNo) {
        try {
            var sCreatedById = "";
            if (iRequestNo !== "" || iRequestNo !== null) {
                let aResult = await connection.run(
                    SELECT`REQUESTER_ID`
                        .from`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`
                        .where`REQUEST_NO=${iRequestNo}`);

                if (aResult.length > 0) {
                    sCreatedById = aResult[0].REQUESTER_ID;
                }
            }
            return sCreatedById;
        }
        catch (error) { throw error; }
    }
    function getEventObj(oPayloadValue) {

        var eventArr = [];

        if (oPayloadValue !== null) {
            eventArr = [{
                "REQUEST_NO": 0,
                "EVENT_NO": 0,
                "EVENT_CODE": 0,
                "USER_ID": oPayloadValue.USER_ID,
                "USER_NAME": oPayloadValue.USER_NAME,
                "REMARK": "",
                "COMMENT": oPayloadValue.COMMENT,
                "CREATED_ON": null,
                "EVENT_TYPE": "REQ"
            }];

        } else {
            throw "Incorrect Data format for posting";
        }

        return eventArr;
    }
    async function getSupplierFromRequestNo(connection, iRequestNo) {
        try {
            var sSupplierName = "";

            if (iRequestNo !== "" || iRequestNo !== null) {
                let aResult = await connection.run(
                    SELECT`DIST_NAME1`
                        .from`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`
                        .where`REQUEST_NO=${iRequestNo}`);
                if (aResult.length > 0) {
                    sSupplierName = aResult[0].DIST_NAME1;
                }
            }

            return sSupplierName;
        }
        catch (error) { throw error; }
    }
    async function getCurrentRequestStatus(connection, iRequestNo) {
        try {
            var iCount = 0;
            let aResult = await connection.run(
                SELECT`STATUS`
                    .from`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`
                    .where`REQUEST_NO=${iRequestNo}`);
            if (aResult.length > 0) {
                iCount = aResult[0].STATUS;
            }
            return iCount;
        }
        catch (error) { throw error; }
    }
    async function getRequestCreator(connection, iRequestNo) {
        try {
            var sCreatedById = "";

            if (iRequestNo !== "" || iRequestNo !== null) {
                let aResult = await connection.run(
                    SELECT`REQUESTER_ID`
                        .from`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`
                        .where`REQUEST_NO=${iRequestNo}`);
                if (aResult.length > 0) {
                    sCreatedById = aResult[0].REQUESTER_ID;
                }
            }
            return sCreatedById;
        }
        catch (error) { throw error; }
    }

    async function getSupplierFromRequestNo(connection, iRequestNo) {
        try {
            var sSupplierName = "";

            if (iRequestNo !== "" || iRequestNo !== null) {
                let aResult = await connection.run(
                    SELECT`DIST_NAME1`
                        .from`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`
                        .where`REQUEST_NO=${iRequestNo}`);
                if (aResult.length > 0) {
                    sSupplierName = aResult[0].DIST_NAME1;
                }
            }
            return sSupplierName;
        }
        catch (error) { throw error; }
    }
    async function getRequestType(connection, iRequestNo) {
        try {
            var iType = 0;
            let aResult = await connection.run(
                SELECT`REQUEST_TYPE`
                    .from`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`
                    .where`REQUEST_NO=${iRequestNo}`);

            if (aResult.length > 0) {
                iType = aResult[0].REQUEST_TYPE;
            }
            return iType;
        }
        catch (error) { throw error; }
    }
    async function getUserDelEventObj(connection, oPayloadValue) {
        try {
            var eventArr = [];
            var oEventObj = null;

            var aRequests = oPayloadValue.REQUESTS;
            var sReqType = "";

            if (aRequests !== null && aRequests.length > 0) {

                for (var i = 0; i < aRequests.length; i++) {
                    sReqType = aRequests[i].STATUS === 1 ? "Req " : "Reg ";

                    oEventObj = {
                        "REQUEST_NO": aRequests[i].REQUEST_NO,
                        "EVENT_NO": await getNextEventCount(connection, aRequests[i].REQUEST_NO),
                        "EVENT_CODE": 17,
                        "USER_ID": oPayloadValue.USER_ID,
                        "USER_NAME": oPayloadValue.USER_NAME,
                        "REMARK": sReqType + "approval re-assigned: " + oPayloadValue.ASSIGNED_FROM + " to " + oPayloadValue.ASSIGNED_TO,
                        "COMMENT": oPayloadValue.COMMENT,
                        "CREATED_ON": null,
                        "EVENT_TYPE": "DELG"
                    };

                    eventArr.push(oEventObj);
                }

            } else {
                throw "Incorrect Data format for posting";
            }
            return eventArr;
        }
        catch (error) { throw error; }
    }
    async function getNextEventCount(connection, iReq_No) {
        try {
            let aResult = await connection.run(
                SELECT`COUNT(*) AS COUNT`
                    .from`${connection.entities['DEALER_PORTAL.REQUEST_EVENTS_LOG']}`
                    .where`REQUEST_NO=${iReq_No}`);
            var iCount = aResult.length > 0 ? parseInt(aResult[0].COUNT, 10) : 0;

            return (iCount + 1);
        }
        catch (error) { throw error; }
    }
    //Validation while updation----------------------------------------------------------------------------------------
    async function checkUpdate(connection, data) {
        try {

            let aResult = await connection.run(
                SELECT
                .from `${connection.entities['VIEW_REQUEST_ACTIVE_STATUS']} `
                .where`SAP_DIST_CODE=${data[0].SAP_DIST_CODE} AND ACTIVE IS null AND STATUS NOT IN (3,8,11)`
       
                );
            var iNonActivecount = aResult.length;

            let aResult1 = await connection.run(
                    SELECT
                    .from`${connection.entities['VIEW_REQUEST_ACTIVE_STATUS']}`
                    .where`SAP_DIST_CODE=${data[0].SAP_DIST_CODE} AND ACTIVE = 'A' AND STATUS = 11`
          
                    );

            var iActivecount = aResult1.length;

            if (iNonActivecount !== 0) {
                return 'IN PROCESS';
            } else if (iActivecount !== 0) {
                return aResult1;
            } else {
                return 'NOT FOUND';
            }
        }
        catch (error) { throw error; }
    }

    async function isiDealSettingEnabled(connection, sSettingCode) {
        try {
            var isEnabled = false;
            let aResult = await connection.run(
                SELECT`SETTING`
                    .from`${connection.entities['DEALER_PORTAL.MASTER_IDEAL_SETTINGS']}`
                    .where({ CODE: sSettingCode, SETTING: 'X' })
            );

            if (aResult.length > 0)
                isEnabled = true;

            return isEnabled;
        }
        catch (error) { throw error; }
    }
    //Validation while creation--------------------------------------------------------------------------------
    async function checkDealer(connection, data, val) {
        try {
            let aQuery1Result = await connection.run(
                SELECT
                    .from`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`
                    .where`STATUS NOT IN (3,8) AND DIST_NAME1 = ${data[0].DIST_NAME1}`
            );

            let aQuery2Result = await connection.run(
                SELECT
                    .from`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`
                    .where`STATUS NOT IN (3,8) AND REGISTERED_ID = ${data[0].REGISTERED_ID}`
            );

            var iNameCount = aQuery1Result.length;
            var iEmailCount = aQuery2Result.length;

            if (iEmailCount !== 0) {
                return 'ErrorEmail';
            } else if (iEmailCount === 0 && iNameCount === 0) {
                return 0;
            } else {
                return 'ErrorName';
            }
        }
        catch (error) { throw error; }
    }
    async function validateSAPCode(connection, data) {
        try {
            var flag = true;
            let aResult = await connection.run(
                SELECT
                    .from`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`
                    .where`STATUS NOT IN (3,8) AND SAP_DIST_CODE =${data[0].SAP_DIST_CODE} `);
            if (aResult.length !== 0) {
                flag = false;
            }
            return flag;
        }
        catch (error) { throw error; }
    }
    async function getRequestCreator(connection, iRequestNo) {
        try {
            var sCreatedById = "";
            if (iRequestNo !== "" || iRequestNo !== null) {
                let aResult = await connection.run(
                    SELECT`REQUESTER_ID`
                        .from`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`
                        .where`REQUEST_NO=${iRequestNo}`);

                if (aResult.length > 0) {
                    sCreatedById = aResult[0].REQUESTER_ID;
                }
            }
            return sCreatedById;
        }
        catch (error) { throw error; }
    }
    function getEventObj(oPayloadValue) {

        var eventArr = [];

        if (oPayloadValue !== null) {
            eventArr = [{
                "REQUEST_NO": 0,
                "EVENT_NO": 0,
                "EVENT_CODE": 0,
                "USER_ID": oPayloadValue.USER_ID,
                "USER_NAME": oPayloadValue.USER_NAME,
                "REMARK": "",
                "COMMENT": oPayloadValue.COMMENT,
                "CREATED_ON": null,
                "EVENT_TYPE": "REQ"
            }];

        } else {
            throw "Incorrect Data format for posting";
        }
        return eventArr;
    }
    async function getSupplierFromRequestNo(connection, iRequestNo) {
        try {
            var sSupplierName = "";

            if (iRequestNo !== "" || iRequestNo !== null) {
                let aResult = await connection.run(
                    SELECT`DIST_NAME1`
                        .from`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`
                        .where`REQUEST_NO=${iRequestNo}`);
                if (aResult.length > 0) {
                    sSupplierName = aResult[0].DIST_NAME1;
                }
            }

            return sSupplierName;
        }
        catch (error) { throw error; }
    }
    async function getCurrentRequestStatus(connection, iRequestNo) {
        try {
            var iCount = 0;
            let aResult = await connection.run(
                SELECT`STATUS`
                    .from`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`
                    .where`REQUEST_NO=${iRequestNo}`);
            if (aResult.length > 0) {
                iCount = aResult[0].STATUS;
            }
            return iCount;
        }
        catch (error) { throw error; }
    }
    async function getRequestCreator(connection, iRequestNo) {
        try {
            var sCreatedById = "";

            if (iRequestNo !== "" || iRequestNo !== null) {
                let aResult = await connection.run(
                    SELECT`REQUESTER_ID`
                        .from`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`
                        .where`REQUEST_NO=${iRequestNo}`);
                if (aResult.length > 0) {
                    sCreatedById = aResult[0].REQUESTER_ID;
                }
            }

            return sCreatedById;
        }
        catch (error) { throw error; }
    }

    async function getSupplierFromRequestNo(connection, iRequestNo) {
        try {
            var sSupplierName = "";

            if (iRequestNo !== "" || iRequestNo !== null) {
                let aResult = await connection.run(
                    SELECT`DIST_NAME1`
                        .from`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`
                        .where`REQUEST_NO=${iRequestNo}`);
                if (aResult.length > 0) {
                    sSupplierName = aResult[0].DIST_NAME1;
                }
            }

            return sSupplierName;
        }
        catch (error) { throw error; }
    }
    async function getRequestType(connection, iRequestNo) {
        try {
            var iType = 0;
            let aResult = await connection.run(
                SELECT`REQUEST_TYPE`
                    .from`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`
                    .where`REQUEST_NO=${iRequestNo}`);

            if (aResult.length > 0) {
                iType = aResult[0].REQUEST_TYPE;
            }
            return iType;
        }
        catch (error) { throw error; }
    }
    async function getUserDelEventObj(connection, oPayloadValue) {
        try {
            var eventArr = [];
            var oEventObj = null;

            var aRequests = oPayloadValue.REQUESTS;
            var sReqType = "";

            if (aRequests !== null && aRequests.length > 0) {

                for (var i = 0; i < aRequests.length; i++) {
                    sReqType = aRequests[i].STATUS === 1 ? "Req " : "Reg ";

                    oEventObj = {
                        "REQUEST_NO": aRequests[i].REQUEST_NO,
                        "EVENT_NO": await getNextEventCount(connection, aRequests[i].REQUEST_NO),
                        "EVENT_CODE": 17,
                        "USER_ID": oPayloadValue.USER_ID,
                        "USER_NAME": oPayloadValue.USER_NAME,
                        "REMARK": sReqType + "approval re-assigned: " + oPayloadValue.ASSIGNED_FROM + " to " + oPayloadValue.ASSIGNED_TO,
                        "COMMENT": oPayloadValue.COMMENT,
                        "CREATED_ON": null,
                        "EVENT_TYPE": "DELG"
                    };
                    eventArr.push(oEventObj);
                }
            } else {
                throw "Incorrect Data format for posting";
            }
            return eventArr;
        }
        catch (error) { throw error; }
    }
    async function getNextEventCount(connection, iReq_No) {
        try {
            let aResult = await connection.run(
                SELECT`COUNT(*) AS COUNT`
                    .from`${connection.entities['DEALER_PORTAL.REQUEST_EVENTS_LOG']}`
                    .where`REQUEST_NO=${iReq_No}`);
            var iCount = aResult.length > 0 ? parseInt(aResult[0].COUNT, 10) : 0;

            return (iCount + 1);
        }
        catch (error) { throw error; }
    }
    async function createEvents(connection,iReq_No, aEvents) {
        try {
            //Calculate event no
            let aResultCount = await connection.run(
                SELECT`COUNT(*) AS COUNT`
                    .from`${connection.entities['DEALER_PORTAL.REQUEST_EVENTS_LOG']}`
                    .where`REQUEST_NO=${iReq_No}`);
            var iCount = aResultCount.length > 0 ? parseInt(aResultCount[0].COUNT, 10) : 0;

           iCount += 1;
           aEvents[0].EVENT_NO = iCount;
            let aResult = await connection.run(
                INSERT (aEvents) .into (connection.entities['DEALER_PORTAL.REQUEST_EVENTS_LOG']));
          
        }
        catch (error) { throw error; }
    }

    async function validateSAPCode(connection, data) {
        try {
            var flag = true;
            let aResult = await connection.run(
                SELECT
                    .from`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`
                    .where`STATUS NOT IN (3,8) AND SAP_DIST_CODE =${data[0].SAP_DIST_CODE} `);
            if (aResult.length !== 0) {
                flag = false;
            }
            return flag;
        }
        catch (error) { throw error; }
    }
})

