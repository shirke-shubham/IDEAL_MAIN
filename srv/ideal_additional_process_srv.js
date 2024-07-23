const cds = require('@sap/cds')
const dbClass = require("sap-hdbext-promisfied")
const hdbext = require("@sap/hdbext")
 
const lib_common = require('./LIB/ideal_library')
const lib_email = require('./LIB/ideal_library_email')
const lib_email_content = require('./LIB/ideal_library_email_content')
const connect = require('passport/lib/framework/connect')
const lib_mdg = require('./LIB/ideal_library_mdg')  
// const lib_ias = require('./LIB/iven_library_ias')

module.exports = cds.service.impl(function () {

this.on('checkServiceAvailability',async(req)=>{
 
    try{
        var {cloudSrv,onPremiseSrv} = req.data;
   
      var client = await dbClass.createConnectionFromEnv();
      var dbConn = new dbClass(client);
      // var {sapClient,destFileName} = req.data;
      var response = {"onPremiseSrv":null,"cloudSrv":null};
      var sapClient ='';
   
      if(onPremiseSrv){
      //   set connection to ZIDL_CUSTOMER_REG_SRV Destination
      var iDealDistConnection = await cds.connect.to('ZIDL_CUSTOMER_REG_SRV');
      var onPremResponse = await iDealDistConnection.send({
        method: 'GET',
        path:'/BPTypeSet',
        headers: { 'Content-Type': 'application/json' ,
        "sap-client":sapClient
      }
      })
      if( onPremResponse.length >= 0)
        response.onPremiseSrv = "Loaded"
    }
    if(cloudSrv){
      var connection = await cds.connect.to('db');
      var cloudResponse =  await connection.run(SELECT
        .from`${connection.entities['DEALER_PORTAL.MASTER_SUBACCOUNT']}`);
   
        if( cloudResponse.length >= 0)
        response.cloudSrv = "Loaded"
      }
   req.reply(response);  
  }
  catch(error)
  {
    req.error({ code: "500", message:  error.message ? error.message : error });  
    // throw error;
  }    
  })

  this.on('DistInternalRequest', async (req) => {
    // get connection
    var client = await dbClass.createConnectionFromEnv();
       var dbConn = new dbClass(client); 
    try {
      // local variables
      var {
        action,
        stepNo,
        comment,
        srNo,
        attachCode,
        ndaStatus,
        reqHeader,
        addressData,
        contactsData,
        bankData,
        bankingDetails,
        promotersData,
        customerData,
        businessHistoryData,
        attachmentFieldsData,
        attachmentData,
        updatedFields,
        eventsData,
        supplierLogData,
        userDetails
    } = req.data;
      //intialize connection to database
      var sUserId=userDetails.USER_ID || null;
      var sUserRole=userDetails.USER_ROLE || null;   

      let connection = await cds.connect.to('db');
      var isEmailNotificationEnabled = false;
       //Check if email notification is enabled
       isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");

    if (action === "INTERNAL_REQUEST") {
			  var iReqNo = reqHeader[0].REQUEST_NO;

			// --Section 2--
			// var aMainObj = oPayload.VALUE.MAIN;
			if (reqHeader.length > 0) {
				reqHeader[0].REQUEST_NO = 0;
			} else {
				throw "Invalid Payload";
			}

			// var sUserId = reqHeader[0].REGISTERED_ID || null; 
			var sDistName = reqHeader[0].DIST_NAME1;
			var sEntityCode = reqHeader[0].ENTITY_CODE;
			var sIsResend = reqHeader[0].REQUEST_RESENT;
			var iStatus = 4;
			var sDistNo = reqHeader[0].IDEAL_DIST_CODE;
			var sSAPDistCode = reqHeader[0].SAP_DIST_CODE;

			// Get Invite Data
			var inviteData =await getInviteUpdateReqData(connection, iReqNo);

			var aEventObj =await getEventObjects(supplierLogData);
			var oActiveData =await getActiveData(connection, sDistNo) || null;

			var aAddressObj =await getidForArr(addressData, "SR_NO") || [];
			var aContactObj =await getidForArr(contactsData, "SR_NO") || [];

			// 			// --Section 2--
			var aPaymentObj =await getidForArr(bankData, "SR_NO") || [];
      var aBankingdetailsObj = await getidForArr(bankingDetails, "SR_NO") || [];
			
      var aPromotersObj = await getidForArr(promotersData, "SR_NO") || [];
      var aCustomerObj = await getidForArr(customerData, "SR_NO") || [];
      var aBusniessHistoryObj = await getidForArr(businessHistoryData, "SR_NO") || [];
			
			var aAttachFieldsObj =attachmentFieldsData || [];
			if (aAttachFieldsObj.length > 0) {
				aAttachFieldsObj[0].REQUEST_NO = 0;
			}
			var aAttachmentsObj =await getidForArr(attachmentData, "SR_NO") || [];

			var aUpdatedFieldsIDs = updatedFields;
			var aUpdatedFieldsObj = [];

			if (aUpdatedFieldsIDs.length > 0) {
				aUpdatedFieldsObj =await lib_common.getUpdatedFieldsDataForEdit(iReqNo, aUpdatedFieldsIDs, connection) || [];
			}

      var aLogsTable =await getLogsCount(connection, supplierLogData);
      var onbEvents =await getEventObj(supplierLogData, comment);

      var aEventObj0 =  [aEventObj[0]];
      var  aEventObj1 =  [aEventObj[1]]
      const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'DIST_INTERNAL_REQUEST')
      sResponse = await dbConn.callProcedurePromisified(loadProc,
       [iReqNo, stepNo, ndaStatus, sEntityCode, sDistNo, sSAPDistCode, sUserId, sIsResend, iStatus, oActiveData.REQ_NO_ACTIVE,
        	oActiveData.REQUEST_TYPE, oActiveData.CREATION_TYPE,'IR',
        	inviteData, aEventObj0, aEventObj1,
        	reqHeader, aAddressObj, aBusniessHistoryObj,aPromotersObj,
          aContactObj,aPaymentObj,aBankingdetailsObj,aCustomerObj,
        	aAttachFieldsObj, aAttachmentsObj,
        	aUpdatedFieldsObj, onbEvents, aLogsTable, srNo, attachCode]
        );
			responseObj = {
				"Edit_Success": sResponse.outputScalar.OUT_SUCCESS !== null ? 'X' : '',
				"REQUEST_NO": sResponse.outputScalar.OUT_SUCCESS !== null ? sResponse.outputScalar.OUT_SUCCESS : 0,
				"Message": sResponse.outputScalar.OUT_SUCCESS !== null ? "Internal Distributor request created successfully" : "Internal Distributor request creation failed"
			};
			if (sResponse.outputScalar.OUT_SUCCESS !== null) {
				var oEmailData = {     
					"ReqNo": responseObj.REQUEST_NO,
					"ReqType": 5,
					"SupplierName": sDistName,
					"SupplierEmail": sUserId,
					"Approver_Email": null,
					"Approver_Level": 1,
					"Next_Approver": sResponse.outputScalar.OUT_SUCCESS2, // Proc Manager
					"Buyer": null
				};
				if(isEmailNotificationEnabled) {
            oEmaiContent = await lib_email_content.getEmailContent(connection, "INTERNALREQ", "REGISTER", oEmailData, null)
            var sCCEmail = await lib_email.setDynamicCC( null);
            await  lib_email.sendidealEmail(oEmailData.Next_Approver,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)
        }
			}
			// responseInfo(JSON.stringify(responseObj), "text/plain", 200);
      req.reply(responseObj)
		} else {
      throw {"message":"Invalid Action"}
			// responseInfo(JSON.stringify(responseObj), "text/plain", 400);
		}

    } catch (error) {
      var sType=error.code?"Procedure":"Node Js";    
      var iErrorCode=error.code??500;     
      // let Result2 = {
      //   OUT_SUCCESS: error.message || ""
      // };
      let Result = {
          OUT_ERROR_CODE: iErrorCode,
          OUT_ERROR_MESSAGE:  error.message ? error.message : error
      }
      lib_common.postErrorLog(Result,iReqNo,sUserId,sUserRole,"Distributor Profile",sType,dbConn,hdbext);
      console.error(error)     
      // return error.messsage     
      req.error({ code:iErrorCode, message:  error.message ? error.message : error }); 
    }
  })

  async function getInviteUpdateReqData(connection, iRequestNo) {
    var sDistName = "";
  
    if (iRequestNo !== "" || iRequestNo !== null) {
      var aResult = await connection.run(
        SELECT
            .from`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`
            .where`REQUEST_NO=${iRequestNo}`);
    }
    return aResult;
  }
  function getEventObj(oPayloadValue, comment) {

    var eventArr = [];
  
    if (oPayloadValue !== null) {
      eventArr = [{
        "REQUEST_NO": 0,
        "EVENT_NO": 4,
        "EVENT_CODE": 4,
        "USER_ID": oPayloadValue[0].USER_ID,
        "USER_NAME": oPayloadValue[0].USER_NAME,
        "REMARK": "Form submitted - Internal request",
        "COMMENT": comment,
        "CREATED_ON": null,
        "EVENT_TYPE": "ONB"
      }];
  
    } else {
      throw "Incorrect Data format for posting";
    }
  
    return eventArr;
  }

  async function getLogsCount(connection, oPayloadValue) {
    var iCount = 0;
    var aResult = await connection.run(
      SELECT` MAX(EVENT_NO) AS COUNT`
      .from`${connection.entities['DEALER_PORTAL.SUPPLIER_PROFILE_LOG']}`
      .where`SAP_DIST_CODE =${oPayloadValue[0].SAP_DIST_CODE}`);

    if (aResult.length > 0) {
      iCount = aResult[0].COUNT + 1;
    } else {
      iCount = iCount + 1;
    }
    for (var i = 0; i < oPayloadValue.length; i++) {
      var no = iCount + i;
      oPayloadValue[i].EVENT_NO = no;
    }
    return oPayloadValue;
  }
  
  async function getEventObjects(oPayloadValue) {
    var oEventObj = [{
        "REQUEST_NO": 1,
        "EVENT_NO": 1,
        "EVENT_CODE": 1,
        "EVENT_TYPE": "REG",
        "USER_ID": oPayloadValue[0].USER_ID,
        "USER_NAME": oPayloadValue[0].USER_NAME,
        "REMARK": "Update Request Created",
        "COMMENT": "Update Request is auto-generated for Distributor Internal request",
        "CREATED_ON": null
          },
      {
        "REQUEST_NO": 2,
        "EVENT_NO": 2,
        "EVENT_CODE": 2,
        "EVENT_TYPE": "REG",
        "USER_ID": oPayloadValue[0].USER_ID,
        "USER_NAME": oPayloadValue[0].USER_NAME,
        "REMARK": "Update Request Approved",
        "COMMENT": "Update Request is auto-approved for Distributor Internal request",
        "CREATED_ON": null
          }
  
      ];
    return oEventObj;
  }

  async function getActiveData(connection, iIDealDistNo) {
    var oActiveObj = null;
    var aResult = await connection.run(
      SELECT
      .from`${connection.entities['VIEW_REQUEST_ACTIVE_STATUS']}`
      .where`IDEAL_DIST_CODE=${iIDealDistNo} and ACTIVE = 'A' and status = 11`);
  
    if (aResult.length > 0) {
      oActiveObj = {
        "REQ_NO_ACTIVE": aResult[0].REQUEST_NO,
        "REQUEST_TYPE": aResult[0].REQUEST_TYPE,
        "CREATION_TYPE": aResult[0].CREATION_TYPE,
        "STATUS": aResult[0].STATUS
      };
    }
    return oActiveObj;
  }

  async function getidForArr(array, propertyName) {
    if (array.length > 0) {
      if (propertyName !== "" && propertyName !== null && propertyName !== undefined) {
        for (var i = 0; i < array.length; i++) {
          array[i].REQUEST_NO = 0;
          array[i][propertyName] = i + 1;
        }
      } else {
        throw "Property Name missing for id's"
      }
    }
    return array;
  }
})