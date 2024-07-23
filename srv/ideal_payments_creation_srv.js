const cds = require('@sap/cds')
const dbClass = require("sap-hdbext-promisfied")
const hdbext = require("@sap/hdbext")
const lib_common = require('../srv/LIB/ideal_library')
const lib_email = require('../srv/LIB/ideal_library_email')
const lib_email_content = require('../srv/LIB/ideal_library_email_content')
const lib_PAY = require('../srv/LIB/ideal_library_payments')
const { response } = require('express')

module.exports = cds.service.impl(function () {

    async function getFileId(data){
        try{
        for(var i = 0;i < data.length; i++)
        {
            data[i].FILE_ID = i + 1;
        }
        return data;
        }
        catch(error){
            return error;
        }
    }

    async function getDistEmailId(SapDistCode,Active){
        try{
            var result = await SELECT `VIEW_REQUEST_ACTIVE_STATUS` .where`SAP_DIST_CODE=${SapDistCode} AND ACTIVE=${Active}`;
            if(result.length === 0 || result.length === null || result.length === undefined)
            {
                return "No Distributor Record Found";
            }
            else{
            return result;
            } 
        }
        catch(error){
            return error;
        }
    } 

    this.on('createPayment', async (req) => {
        try{

        var client = await dbClass.createConnectionFromEnv();
        var dbConn = new dbClass(client);
        let connection = await cds.connect.to('db');
        var sResponse = null;
        var Result = null;
            
        var{
            action,
            appType,
            paymentsHeader,
            paymentsAttachments,
            paymentsEventLog,
            userDetails
        } = req.data;

        var ErrLogReqNo = null;
        var ErrLogsUserId = userDetails.USER_ID;
        var ErrLogsUserRole = userDetails.USER_ROLE;
        var ErrLogsAppName = null;

        
        var sAction = action || null;
        var isEmailNotificationEnabled = false;

        if (paymentsHeader === null || paymentsHeader.DISTRIBUTOR_ID === null) {
            throw "Invalid Payload";
        }

        isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");

        if(sAction === 'CREATE')
        {
            ErrLogsAppName = "Payment Creation";
            // var isEmailNotificationEnabled = false;
            var vDistributorId = paymentsHeader[0].DISTRIBUTOR_ID;

            var checkApprover = await lib_common.getApproverForEntity(connection, '1000', null, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY',appType,1);
            if (checkApprover === null || (checkApprover[0].USER_IDS === null || checkApprover[0].USER_IDS === ""))
            {
                throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};
            }

            var paymentsAttachmentsObj = await getFileId(paymentsAttachments);
            // isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");
            
            const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PAYMENT_CREATION');
            sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,null,vDistributorId,paymentsHeader,paymentsAttachmentsObj,paymentsEventLog,checkApprover[0].LEVEL,checkApprover[0].ROLE_CODE]);
            Result = sResponse.outputScalar.OUT_SUCCESS;

            ErrLogReqNo = sResponse.outputScalar.OUT_SUCCESS;
            if (sResponse.outputScalar.OUT_SUCCESS !== null) {     
                oEmailData = {
                    "PayReqNo": sResponse.outputScalar.OUT_SUCCESS
                    // "SupplierName": aInputData[0].DIST_NAME1
                }

                if (isEmailNotificationEnabled) {
                    oEmaiContent = await lib_email_content.getEmailContent(connection, "CREATE", "PAYMENT_REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC(null);
                    await  lib_email.sendidealEmail(checkApprover[0].USER_IDS,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)      
                }
                Result = {
                    OUT_SUCCESS: "Payment Request Created : " + sResponse.outputScalar.OUT_SUCCESS || ""
                }
                return Result;
            }
            return Result;
        }
        else if(sAction === 'UPDATE')
        {
            ErrLogsAppName = "Payment Creation";
            // var isEmailNotificationEnabled = false;
            var vDistributorId = paymentsHeader[0].DISTRIBUTOR_ID;
            var vApprLevel = paymentsHeader[0].APPROVER_LEVEL;

            var checkApprover = await lib_common.getApproverForEntity(connection, '1000', null, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY',appType,vApprLevel);
            if (checkApprover === null || (checkApprover[0].USER_IDS === null || checkApprover[0].USER_IDS === ""))
            {
                throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};
            }

            const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PAYMENT_CREATION');
            sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,null,vDistributorId,paymentsHeader,paymentsAttachments,paymentsEventLog,checkApprover[0].LEVEL,checkApprover[0].ROLE_CODE]);
            Result = sResponse.outputScalar.OUT_SUCCESS;

            ErrLogReqNo = sResponse.outputScalar.OUT_SUCCESS;
            if (sResponse.outputScalar.OUT_SUCCESS !== null) {
                oEmailData = {
                    "PayReqNo": sResponse.outputScalar.OUT_SUCCESS
                }

                if (isEmailNotificationEnabled) {
                    oEmaiContent = await lib_email_content.getEmailContent(connection, "UPDATE", "PAYMENT_REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC(null);
                    await  lib_email.sendidealEmail(checkApprover[0].USER_IDS,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)      
                }
                Result = {
                    OUT_SUCCESS: "Payment Request Updated : " + sResponse.outputScalar.OUT_SUCCESS || ""
                }
                return Result;
            }
            return Result;

        }
        else if(sAction === 'APPROVE')
        {   
            ErrLogsAppName = "Payment Approval";
            ErrLogReqNo = paymentsHeader[0].POP_NO;
            var vPayNo = paymentsHeader[0].POP_NO;
            var vSalesNo = paymentsHeader[0].PR_SAP_NO;
            var vApprRole = paymentsHeader[0].APPROVER_ROLE;
            var vApprLevel = paymentsHeader[0].APPROVER_LEVEL;
            var vDistributorId = paymentsHeader[0].DISTRIBUTOR_ID;
            var vDistName = paymentsHeader[0].DISTRIBUTOR_NAME;
            var isEmailNotificationEnabled = false;
            var emailUserId;

            var checkApprover = await lib_common.getApproverForEntity(connection, '1000', vApprRole, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY',appType,vApprLevel);
            if (checkApprover === null || (checkApprover[0].USER_IDS === null || checkApprover[0].USER_IDS === ""))
            {
                throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};
            }
            emailUserId = checkApprover[0].USER_ID;
            isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");
            var maxLevel = await lib_common.getMaxLevel('1000',appType);

            if(vApprLevel === maxLevel)
            {   
                //S4 Hana API hit 
                var vPayResult = await lib_PAY.getPAYPayload(paymentsHeader,connection);
                var PayResult = await lib_PAY.PostToPAY(vPayResult.Payments,vPayResult.SORELEASE,connection);

                //SAP Number
                var sSapCode = PayResult.oResponseObj.d.Belnr;
                if(sSapCode === "" || sSapCode === null || sSapCode === undefined || sSapCode === vSalesNo){
                    throw {"message":"There is an issue in approval. Please contact admin team."};
                }
                else{
                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PAYMENT_REQUEST_APPROVAL')
                sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,vPayNo,'SA',null,sSapCode,vDistributorId,paymentsEventLog]);
                Result = sResponse.outputScalar;
                // return Result;
                }
            }
            if(vApprLevel < maxLevel)
            {
                var addLevel = Number(vApprLevel) + 1;
                sAction = "APPROVE_PENDING";
                var pcheckApprover = await lib_common.getApproverForEntity(connection, '1000', null, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY',appType,addLevel);
                if (pcheckApprover === null || (pcheckApprover[0].USER_IDS === null || pcheckApprover[0].USER_IDS === ""))
                throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};
                emailUserId = pcheckApprover[0].USER_IDS;

                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PAYMENT_REQUEST_APPROVAL')
                sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,vPayNo,pcheckApprover[0].ROLE_CODE,pcheckApprover[0].LEVEL,null,vDistributorId,paymentsEventLog]);
                Result = sResponse.outputScalar;
                // return Result;
            }

            if (sResponse.outputScalar.OUT_SUCCESS !== null) {
                if (isEmailNotificationEnabled) {
                var approverName = await SELECT .from`DEALER_PORTAL_MASTER_IDEAL_USERS` .where`USER_ID=${checkApprover[0].USER_IDS}`; 
                var approverRoleDesc = await SELECT .from`DEALER_PORTAL_MASTER_USER_ROLE` .where`CODE=${checkApprover[0].ROLE_CODE}`;
                oEmailData = {
                    "PayReqNo": vPayNo,
                    "Approver" : approverName[0].USER_NAME,
                    "Approve_Role" : approverRoleDesc[0].DESCRIPTION,
                    "DistName" : vDistName
                }
                if(sAction === "APPROVE_PENDING")
                {
                    oEmaiContent = await lib_email_content.getEmailContent(connection, sAction, "PAYMENT_REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC(null);
                    await  lib_email.sendidealEmail(emailUserId,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)
                }
                if(sAction === "APPROVE"){
                    var DistEmailId = await getDistEmailId(vDistributorId,'A');
                    oEmaiContent = await lib_email_content.getEmailContent(connection, sAction, "PAYMENT_REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC(null);
                    await  lib_email.sendidealEmail(DistEmailId[0].REGISTERED_ID,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)
                }
            }
        }
            return Result;
        }
        else if(sAction === 'SENDBACK'){

            ErrLogReqNo = paymentsHeader[0].POP_NO;
            ErrLogsAppName = "Payment Approval";
            var vPayNo = paymentsHeader[0].POP_NO;
            var vApprRole = paymentsHeader[0].APPROVER_ROLE;
            var vApprLevel = paymentsHeader[0].APPROVER_LEVEL;
            var vDistributorId = paymentsHeader[0].DISTRIBUTOR_ID;
            var vDistName = paymentsHeader[0].DISTRIBUTOR_NAME;
            var SendbackComment = paymentsEventLog[0].COMMENTS;
            var isEmailNotificationEnabled = false;
            var emailUserId;

            var checkApprover = await lib_common.getApproverForEntity(connection, '1000', vApprRole, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY',appType,vApprLevel);
            if (checkApprover === null || (checkApprover[0].USER_IDS === null || checkApprover[0].USER_IDS === ""))
            {
                throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};
            }
            emailUserId = checkApprover[0].USER_ID;
            isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");

            const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PAYMENT_REQUEST_APPROVAL')
            sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,vPayNo,vApprRole,vApprLevel,null,vDistributorId,paymentsEventLog]);
            Result = sResponse.outputScalar;

            var approverName = await SELECT .from`DEALER_PORTAL_MASTER_IDEAL_USERS` .where`USER_ID=${checkApprover[0].USER_IDS}`; 
            var approverRoleDesc = await SELECT .from`DEALER_PORTAL_MASTER_USER_ROLE` .where`CODE=${checkApprover[0].ROLE_CODE}`;
            if (sResponse.outputScalar.OUT_SUCCESS !== null) {
                oEmailData = {
                    "PayReqNo": vPayNo,
                    "SendbackComm" : SendbackComment,
                    "Approver" : approverName[0].USER_NAME,
                    "Approve_Role" : approverRoleDesc[0].DESCRIPTION,
                    "DistName" : vDistName
                }

                if (isEmailNotificationEnabled) {
                    var DistEmailId = await getDistEmailId(vDistributorId,'A');
                    oEmaiContent = await lib_email_content.getEmailContent(connection, "SENDBACK", "PAYMENT_REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC([checkApprover[0].USER_IDS]);
                    await lib_email.sendidealEmail(DistEmailId[0].REGISTERED_ID,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)      
                }
            }
            return Result;
        }
        else if(sAction === 'HOLD'){
            ErrLogReqNo = paymentsHeader[0].POP_NO;
            ErrLogsAppName = "Payment Approval";
            var vPayNo = paymentsHeader[0].POP_NO;
            var vApprRole = paymentsHeader[0].APPROVER_ROLE;
            var vApprLevel = paymentsHeader[0].APPROVER_LEVEL;
            var vDistributorId = paymentsHeader[0].DISTRIBUTOR_ID;
            var vDistName = paymentsHeader[0].DISTRIBUTOR_NAME;
            var HoldComment = paymentsEventLog[0].COMMENTS;
            var isEmailNotificationEnabled = false;
            var emailUserId;

            var checkApprover = await lib_common.getApproverForEntity(connection, '1000', vApprRole, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY',appType,vApprLevel);
            if (checkApprover === null || (checkApprover[0].USER_IDS === null || checkApprover[0].USER_IDS === ""))
            {
                throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};
            }
            emailUserId = checkApprover[0].USER_ID;
            isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");

            const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PAYMENT_REQUEST_APPROVAL')
            sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,vPayNo,checkApprover[0].ROLE_CODE,checkApprover[0].LEVEL,null,vDistributorId,paymentsEventLog]);
            Result = sResponse.outputScalar;

            var approverName = await SELECT .from`DEALER_PORTAL_MASTER_IDEAL_USERS` .where`USER_ID=${checkApprover[0].USER_IDS}`; 
            var approverRoleDesc = await SELECT .from`DEALER_PORTAL_MASTER_USER_ROLE` .where`CODE=${checkApprover[0].ROLE_CODE}`;
            if (sResponse.outputScalar.OUT_SUCCESS !== null) {
                oEmailData = {
                    "PayReqNo": vPayNo,
                    "HoldComm" : HoldComment,
                    "Approver" : approverName[0].USER_NAME,
                    "Approve_Role" : approverRoleDesc[0].DESCRIPTION,
                    "DistName" : vDistName
                }

                if (isEmailNotificationEnabled) {
                    var DistEmailId = await getDistEmailId(vDistributorId,'A');
                    oEmaiContent = await lib_email_content.getEmailContent(connection, "HOLD", "PAYMENT_REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC([checkApprover[0].USER_IDS]);
                    await lib_email.sendidealEmail(DistEmailId[0].REGISTERED_ID,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)      
                }
            }
            return Result;
        }
        }
        catch(error){
            var sType=error.code?"Procedure":"Node Js";    
            var iErrorCode=error.code??500; 

            lib_common.postErrorLog(Result,ErrLogReqNo,ErrLogsUserId,ErrLogsUserRole,ErrLogsAppName,sType,dbConn,hdbext);
            req.error({ code:iErrorCode, message:  error.message ? error.message : error }); 
        }
    })

})
