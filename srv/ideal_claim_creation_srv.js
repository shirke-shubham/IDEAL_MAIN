const cds = require('@sap/cds')
const dbClass = require("sap-hdbext-promisfied")
const hdbext = require("@sap/hdbext")
const lib_common = require('../srv/LIB/ideal_library')
const lib_email = require('../srv/LIB/ideal_library_email')
const lib_CR = require('../srv/LIB/ideal_library_cr')
const lib_email_content = require('../srv/LIB/ideal_library_email_content')
const { response } = require('express')

module.exports = cds.service.impl(function () {

    this.on('CreateClaimReq', async (req) => {
        try{
        var client = await dbClass.createConnectionFromEnv();
        var dbConn = new dbClass(client);
        let connection = await cds.connect.to('db');
        var sResponse = null;
        var isEmailNotificationEnabled = false;
        var Result = null;

        var{
            action,
            appType,
            crHeader,
            crAttachments,
            crItems,
            crEvent,
            userDetails
        } = req.data;

        var ErrLogReqNo = null;
        var ErrLogsUserId = userDetails.USER_ID;
        var ErrLogsUserRole = userDetails.USER_ROLE;
        var ErrLogsAppName = null;
        var sAction = action || null;

        if(sAction === 'CREATE')
        {
            if (crHeader === null || crHeader.DISTRIBUTOR_ID === null) {
                throw "Invalid Payload";
            }

            ErrLogsAppName = "Claim Creation";
            var eventObj = await eventObject(crEvent);
            var vDistributorId = crHeader[0].DISTRIBUTOR_ID;

            var checkApprover = await lib_common.getApproverForEntity(connection, '1000', null, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY',appType,1);
            if (checkApprover === null || (checkApprover[0].USER_IDS === null || checkApprover[0].USER_IDS === ""))
            {
                throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};
            }

            var crItemsObj = await getIdForItems(crItems);
            var crAttachmentsObj = await getFileIdForAttchments(crAttachments);

            isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");
            const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'CLAIM_CREATION');
            sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,vDistributorId,crHeader,crItemsObj,crAttachmentsObj,eventObj,checkApprover[0].LEVEL,checkApprover[0].ROLE_CODE]);
            Result = sResponse.outputScalar.OUT_SUCCESS;
            ErrLogReqNo = sResponse.outputScalar.OUT_SUCCESS;
            if (sResponse.outputScalar.OUT_SUCCESS !== null) {
                oEmailData = {
                    "ClaimReqNo": sResponse.outputScalar.OUT_SUCCESS
                }

                if (isEmailNotificationEnabled) {
                    oEmaiContent = await lib_email_content.getEmailContent(connection, "CREATE", "CLAIM_REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC(null);
                    await  lib_email.sendidealEmail(checkApprover[0].USER_IDS,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)      
                }
                Result = {
                    OUT_SUCCESS: "Claim Request Created : " + sResponse.outputScalar.OUT_SUCCESS || ""
                }
                return Result;
            }

            return Result;
        }
        else if(sAction === 'APPROVE')
        {
            ErrLogReqNo = crHeader[0].CR_NO;
            ErrLogsAppName = "Claim Approval";
            var vCrNo = crHeader[0].CR_NO;
            var vApprRole = crHeader[0].APPROVER_ROLE;
            var vApprLevel = crHeader[0].APPROVER_LEVEL;
            var vDistributorId = crHeader[0].DISTRIBUTOR_ID;
            var vDistName = crHeader[0].DISTRIBUTOR_NAME;
            var isEmailNotificationEnabled = false;
            var emailUserId;

            var checkApprover = await lib_common.getApproverForEntity(connection, '1000', vApprRole, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY',appType, vApprLevel);
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
                var vCrResult = await lib_CR.getCRPayload(crHeader,crItems,crAttachments,connection);
                var CrResult = await lib_CR.PostToCR(vCrResult,connection);

                //SAP Number
                var sSapCode = CrResult.d.SapCreditNote || "";
                if(sSapCode === "" || sSapCode === null || sSapCode === undefined || sSapCode === vCrNo){
                    throw {"message":"There is an issue in approval. Please contact admin team."};
                }
                else{

                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'CLAIM_REQUEST_APPROVAL')
                sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,vCrNo,'SA',null,sSapCode,vDistributorId,crEvent]);
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

                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'CLAIM_REQUEST_APPROVAL')
                sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,vCrNo,pcheckApprover[0].ROLE_CODE,pcheckApprover[0].LEVEL,null,vDistributorId,crEvent]);
                Result = sResponse.outputScalar;
                // return Result;
            }

            if (sResponse.outputScalar.OUT_SUCCESS !== null) {
                if (isEmailNotificationEnabled) {
                var approverName = await SELECT .from`DEALER_PORTAL_MASTER_IDEAL_USERS` .where`USER_ID=${checkApprover[0].USER_IDS}`; 
                var approverRoleDesc = await SELECT .from`DEALER_PORTAL_MASTER_USER_ROLE` .where`CODE=${checkApprover[0].ROLE_CODE}`;
                oEmailData = {
                    "ClaimReqNo": vCrNo,
                    "Approver" : approverName[0].USER_NAME, 
                    "Approve_Role" : approverRoleDesc[0].DESCRIPTION,
                    "DistName" : vDistName
                }
                if(sAction === "APPROVE_PENDING")
                {
                    oEmaiContent = await lib_email_content.getEmailContent(connection, sAction, "CLAIM_REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC(null);
                    await  lib_email.sendidealEmail(emailUserId,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)
                }
                if(sAction === "APPROVE"){ 
                    var DistEmailId = await getDistEmailId(vDistributorId,'A');
                    oEmaiContent = await lib_email_content.getEmailContent(connection, sAction, "CLAIM_REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC(null);
                    await  lib_email.sendidealEmail(DistEmailId[0].REGISTERED_ID,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)
                }
            }
        }
        return Result;
        }
        else if(sAction === 'REJECT')
        {
            ErrLogReqNo = crHeader[0].CR_NO;
            ErrLogsAppName = "Claim Approval";
            var vCrNo = crHeader[0].CR_NO;
            var vApprRole = crHeader[0].APPROVER_ROLE;
            var vApprLevel = crHeader[0].APPROVER_LEVEL;
            var vDistributorId = crHeader[0].DISTRIBUTOR_ID;
            var vDistName = crHeader[0].DISTRIBUTOR_NAME;
            var RejComment = crEvent[0].COMMENT;

            var getApprover = await lib_common.getApproverForEntity(connection, '1000', vApprRole, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY',appType,vApprLevel);
            if (getApprover === null || (getApprover[0].USER_IDS === null || getApprover[0].USER_IDS === ""))
            throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};

            isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");

            const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'CLAIM_REQUEST_APPROVAL')
            sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,vCrNo,vApprRole,vApprLevel,null,vDistributorId,crEvent]);
            Result = sResponse.outputScalar;

            var approverName = await SELECT .from`DEALER_PORTAL_MASTER_IDEAL_USERS` .where`USER_ID=${getApprover[0].USER_IDS}`; 
            var approverRoleDesc = await SELECT .from`DEALER_PORTAL_MASTER_USER_ROLE` .where`CODE=${getApprover[0].ROLE_CODE}`;
            if (sResponse.outputScalar.OUT_SUCCESS !== null) {
                oEmailData = {
                    "ClaimReqNo": vCrNo,
                    "RejComm" : RejComment,
                    "Approver" : approverName[0].USER_NAME,
                    "Approve_Role" : approverRoleDesc[0].DESCRIPTION,
                    "DistName" : vDistName
                }

                if (isEmailNotificationEnabled) {
                    var DistEmailId = await getDistEmailId(vDistributorId,'A');
                    oEmaiContent = await lib_email_content.getEmailContent(connection, "REJECT", "CLAIM_REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC([getApprover[0].USER_IDS]);
                    await  lib_email.sendidealEmail(DistEmailId[0].REGISTERED_ID,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)      
                }
            }
            return Result;
        }
        else if(sAction === 'SENDBACK')
        {
            ErrLogReqNo = crHeader[0].CR_NO;
            ErrLogsAppName = "Claim Approval";
            var vCrNo = crHeader[0].CR_NO;
            var vApprRole = crHeader[0].APPROVER_ROLE;
            var vApprLevel = crHeader[0].APPROVER_LEVEL;
            var vDistributorId = crHeader[0].DISTRIBUTOR_ID;
            var vDistName = crHeader[0].DISTRIBUTOR_NAME;
            var SendbackComment = crEvent[0].COMMENT;

            var getApprover = await lib_common.getApproverForEntity(connection, '1000', vApprRole, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY',appType,vApprLevel);
            if (getApprover === null || (getApprover[0].USER_IDS === null || getApprover[0].USER_IDS === ""))
            throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};

            isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");

            const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'CLAIM_REQUEST_APPROVAL')
            sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,vCrNo,vApprRole,vApprLevel,null,vDistributorId,crEvent]);
            Result = sResponse.outputScalar;

            var approverName = await SELECT .from`DEALER_PORTAL_MASTER_IDEAL_USERS` .where`USER_ID=${getApprover[0].USER_IDS}`; 
            var approverRoleDesc = await SELECT .from`DEALER_PORTAL_MASTER_USER_ROLE` .where`CODE=${getApprover[0].ROLE_CODE}`;
            if (sResponse.outputScalar.OUT_SUCCESS !== null) {
                oEmailData = {
                    "ClaimReqNo": vCrNo,
                    "SendbackComm" : SendbackComment,
                    "Approver" : approverName[0].USER_NAME,
                    "Approve_Role" : approverRoleDesc[0].DESCRIPTION,
                    "DistName" : vDistName
                }
                if (isEmailNotificationEnabled) {
                    var DistEmailId = await getDistEmailId(vDistributorId,'A');
                    oEmaiContent = await lib_email_content.getEmailContent(connection, "SENDBACK", "CLAIM_REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC([getApprover[0].USER_IDS]);
                    await  lib_email.sendidealEmail(DistEmailId[0].REGISTERED_ID,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)      
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

    async function eventObject(payload){
        var oEventObj = [{
            "CR_NO" : 1,
            "EVENT_NO":1,
            "EVENT_CODE":1,
            "USER_ID":payload[0].USER_ID,
            "USER_ROLE":payload[0].USER_ROLE,
            "USER_NAME":payload[0].USER_NAME,
            "REMARK":payload[0].REMARK,
            "COMMENT": payload[0].COMMENT,
            "CREATION_DATE":null
              }
          ];
        return oEventObj;

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

    async function getIdForItems(data){

        for(var i = 0;i < data.length; i++)
        {
            data[i].ITEM_NO = i + 1;
        }
        return data;
    }
    
    async function getFileIdForAttchments(data){

        for(var i = 0;i < data.length; i++)
        {
            data[i].FILE_ID = i + 1;
        }
        return data;
    }  
})