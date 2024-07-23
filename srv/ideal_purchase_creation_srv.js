const cds = require('@sap/cds')
const dbClass = require("sap-hdbext-promisfied")
const hdbext = require("@sap/hdbext")
const lib_common = require('../srv/LIB/ideal_library')
const lib_email = require('../srv/LIB/ideal_library_email')
const lib_email_content = require('../srv/LIB/ideal_library_email_content')
const lib_PR = require('../srv/LIB/ideal_library_pr')
const { response } = require('express')

module.exports = cds.service.impl(function () {

    this.on('CreatePurchase', async (req) => {
        try{
        var client = await dbClass.createConnectionFromEnv();
        var dbConn = new dbClass(client);
        let connection = await cds.connect.to('db');
        var sResponse = null;
        var Result = null;
       
        var{
            action,
            appType,
            prHeader,
            prCart,
            prItems,
            prEvent,
            userDetails
        } = req.data;

        var sAction = action || null;
        var isEmailNotificationEnabled = false;
        var ErrLogReqNo = null;
        var ErrLogsUserId = userDetails.USER_ID;
        var ErrLogsUserRole = userDetails.USER_ROLE;
        var ErrLogsAppName = null;
        
        if(sAction === 'CREATE')
        {
            if(prHeader === null || prHeader[0].DISTRIBUTOR_ID === null) {
                throw "Invalid Payload";
            }
            ErrLogsAppName = "Purchase Creation";
            var isEmailNotificationEnabled = false;
            var eventObj = await eventObject(prEvent);
            var vDistributorId = prHeader[0].DISTRIBUTOR_ID;

            var checkApprover = await lib_common.getApproverForEntity(connection, '1000', null, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY',appType,1);
            if (checkApprover === null || (checkApprover[0].USER_IDS === null || checkApprover[0].USER_IDS === ""))
            {
                throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};
            }

            isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");
            var prItemsObj = await getIdForItems(prItems);
            const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_CREATION');
            sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,null,vDistributorId,null,[],prHeader,prItemsObj,eventObj,checkApprover[0].LEVEL,checkApprover[0].ROLE_CODE]);
            Result = sResponse.outputScalar;
            ErrLogReqNo = sResponse.outputScalar.OUT_SUCCESS;
            if (sResponse.outputScalar.OUT_SUCCESS !== null) {
                oEmailData = {
                    "PurReqNo": sResponse.outputScalar.OUT_SUCCESS
                    // "SupplierName": aInputData[0].DIST_NAME1
                }

                if (isEmailNotificationEnabled) {
                    oEmaiContent = await lib_email_content.getEmailContent(connection, "CREATE", "PURCHASE_REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC(null);
                    await  lib_email.sendidealEmail(checkApprover[0].USER_IDS,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)      
                }
                Result = {
                    OUT_SUCCESS: "Purchase Request Created : " + sResponse.outputScalar.OUT_SUCCESS || ""
                }
                return Result;
            }
            return Result;
        }
        else if(sAction === 'CART'){

            ErrLogsAppName = "Purchase Creation";
            if(prCart === null || prCart[0].DISTRIBUTOR_ID === null) {
                throw "Invalid Payload";
            }
            if(appType === 'CREATE')
            {

                var PresentData = await getPresentData(prCart[0].MATERIAL_DESC,prCart[0].DISTRIBUTOR_ID)
                var vDistributorId = prCart[0].DISTRIBUTOR_ID;
                if(PresentData === true)
                {
                    const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_CREATION');
                    sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,'UPDATE',vDistributorId,null,prCart,[],[],[],null,null]);
                    Result = sResponse.outputScalar;
                    return Result;
                }
                var prCartObj = await getIdForCart(prCart);
              
                
                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_CREATION');
                sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,appType,vDistributorId,null,prCartObj,[],[],[],null,null]);
                Result = sResponse.outputScalar;
                return Result;
            }
            if(appType === 'DELETE')
            {
                var vCartId = prCart[0].CART_ID;
                var vDistributorId = prCart[0].DISTRIBUTOR_ID;
                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_CREATION');
                sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,appType,vDistributorId,vCartId,[],[],[],[],null,null]);
                Result = sResponse.outputScalar;
                return Result;
            }
            if(appType === 'DELETEALL')
            {
                var vCartId = prCart[0].CART_ID;
                var vDistributorId = prCart[0].DISTRIBUTOR_ID;
                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_CREATION');
                sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,appType,vDistributorId,null,[],[],[],[],null,null]);
                Result = sResponse.outputScalar;
                return Result;
            }
        }
        else if(sAction === 'APPROVE')
        {

            ErrLogsAppName = "Purchase Approval";
            if(prHeader === null || prHeader[0].DISTRIBUTOR_ID === null) {
                throw "Invalid Payload";
            }
            ErrLogReqNo = prHeader[0].PR_NO;
            var vPrNo = prHeader[0].PR_NO;
            var vApprRole = prHeader[0].APPROVER_ROLE;
            var vApprLevel = prHeader[0].APPROVER_LEVEL;
            var vDistributorId = prHeader[0].DISTRIBUTOR_ID;
            var vDistName = prHeader[0].DISTRIBUTOR_NAME;
            var isEmailNotificationEnabled = false;
            var emailUserId;

            if(appType === 'ADD')
            {
                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_REQUEST_APPROVAL')
                sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,appType,vPrNo,'SA',null,sSapSoCode,vDistributorId,prHeader[0].GRAND_TOTAL,[],prItems,prEvent]);
                Result = sResponse.outputScalar;
                return Result;
            }
            else if(appType === 'DELETE')
            {
                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_REQUEST_APPROVAL')
                sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,appType,vPrNo,'SA',null,sSapSoCode,vDistributorId,prHeader[0].GRAND_TOTAL,[],prItems,prEvent]);
                Result = sResponse.outputScalar;
                return Result;
            }
            else if(appType === 'UPDATE')
            {
                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_REQUEST_APPROVAL')
                sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,appType,vPrNo,'SA',null,sSapSoCode,vDistributorId,prHeader[0].GRAND_TOTAL,[],prItems,prEvent]);
                Result = sResponse.outputScalar;
                return Result;
            }
            else{
            var pcheckApprover = await lib_common.getApproverForEntity(connection, '1000', vApprRole, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY',appType,vApprLevel);
            if (pcheckApprover === null || (pcheckApprover[0].USER_IDS === null || pcheckApprover[0].USER_IDS === ""))
            {
                throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};
            }
            emailUserId = pcheckApprover[0].USER_ID;
            isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");
            var maxLevel = await lib_common.getMaxLevel('1000',appType);

            if(vApprLevel === maxLevel)
            {   
                //S4 Hana API hit 
                var vPrResult = await lib_PR.getPRPayload(prHeader,prItems,connection);
                var PrResult = await lib_PR.PostToPR(vPrResult,connection);
                //So Number
                var sSapSoCode = PrResult.d.SoNumber;
                if(sSapSoCode === "" || sSapSoCode === null || sSapSoCode === undefined || sSapSoCode === vPrNo){
                    throw {"message":"There is an issue in approval. Please contact admin team."};
                }
                else{
                var SoItemsObj = await getPrItemsData(prItems,sSapSoCode);

                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_REQUEST_APPROVAL')
                sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,appType,vPrNo,'SA',null,sSapSoCode,vDistributorId,prHeader[0].GRAND_TOTAL,SoItemsObj,[],prEvent]);
                Result = sResponse.outputScalar;
                // return Result;
                }
            }
            if(vApprLevel < maxLevel)
            {
                var addLevel = Number(vApprLevel) + 1;
                sAction = "APPROVE_PENDING";
                var checkApprover = await lib_common.getApproverForEntity(connection, '1000', null, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY',appType,addLevel);
                if (checkApprover === null || (checkApprover[0].USER_IDS === null || checkApprover[0].USER_IDS === ""))
                throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};
                emailUserId = checkApprover[0].USER_IDS;
                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_REQUEST_APPROVAL')
                sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,appType,vPrNo,checkApprover[0].ROLE_CODE,checkApprover[0].LEVEL,null,vDistributorId,prHeader[0].GRAND_TOTAL,[],[],prEvent]);
                Result = sResponse.outputScalar;
                // return Result;
            }

            if (sResponse.outputScalar.OUT_SUCCESS !== null) {
                if (isEmailNotificationEnabled) {
                var approverName = await SELECT .from`DEALER_PORTAL_MASTER_IDEAL_USERS` .where`USER_ID=${pcheckApprover[0].USER_IDS}`; 
                var approverRoleDesc = await SELECT .from`DEALER_PORTAL_MASTER_USER_ROLE` .where`CODE=${pcheckApprover[0].ROLE_CODE}`;
                oEmailData = {
                    "PurReqNo": vPrNo,
                    "Approver" : approverName[0].USER_NAME,
                    "Approve_Role" : approverRoleDesc[0].DESCRIPTION,
                    "DistName" : vDistName
                }
                if(sAction === "APPROVE_PENDING")
                {
                    oEmaiContent = await lib_email_content.getEmailContent(connection, sAction, "PURCHASE_REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC(null);
                    await  lib_email.sendidealEmail(emailUserId,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)
                }
                if(sAction === "APPROVE"){
                    var DistEmailId = await getDistEmailId(vDistributorId,'A');
                    oEmaiContent = await lib_email_content.getEmailContent(connection, sAction, "PURCHASE_REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC([pcheckApprover[0].USER_IDS]);
                    await lib_email.sendidealEmail(DistEmailId[0].REGISTERED_ID,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)
                }
            }
        }
        return Result;
        }

        }
        else if(sAction === 'REJECT')
        {
            ErrLogsAppName = "Purchase Approval";
            if(prHeader === null || prHeader[0].DISTRIBUTOR_ID === null) {
                throw "Invalid Payload";
            }
            ErrLogReqNo = prHeader[0].PR_NO;
            var vPrNo = prHeader[0].PR_NO;
            var vApprRole = prHeader[0].APPROVER_ROLE;
            var vApprLevel = prHeader[0].APPROVER_LEVEL;
            var vDistributorId = prHeader[0].DISTRIBUTOR_ID;
            var vDistName = prHeader[0].DISTRIBUTOR_NAME;
            var RejComment = prEvent[0].COMMENTS;

            var getApprover = await lib_common.getApproverForEntity(connection, '1000', vApprRole, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY','PR',vApprLevel);
            if (getApprover === null || (getApprover[0].USER_IDS === null || getApprover[0].USER_IDS === ""))
            throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};

            isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");

            const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_REQUEST_APPROVAL')
            sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,appType,vPrNo,'SA',1,null,vDistributorId,prHeader[0].GRAND_TOTAL,[],[],prEvent]);
            Result = sResponse.outputScalar;

            var approverName = await SELECT .from`DEALER_PORTAL_MASTER_IDEAL_USERS` .where`USER_ID=${getApprover[0].USER_IDS}`; 
            var approverRoleDesc = await SELECT .from`DEALER_PORTAL_MASTER_USER_ROLE` .where`CODE=${getApprover[0].ROLE_CODE}`;
            if (sResponse.outputScalar.OUT_SUCCESS !== null) {
                oEmailData = {
                    "PurReqNo": vPrNo,
                    "RejComm" : RejComment,
                    "Approver" : approverName[0].USER_NAME,
                    "Approve_Role" : approverRoleDesc[0].DESCRIPTION,
                    "DistName" : vDistName
                }

                if (isEmailNotificationEnabled) {
                    var DistEmailId = await getDistEmailId(vDistributorId,'A');
                    var checkApprover = await lib_common.getApproverForEntity(connection, '1000', null, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY','PR',vApprLevel);
                    oEmaiContent = await lib_email_content.getEmailContent(connection, "REJECT", "PURCHASE_REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC([checkApprover[0].USER_IDS]);
                    await  lib_email.sendidealEmail(DistEmailId[0].REGISTERED_ID,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)      
                }
            }
            return Result;
        }
        else if(sAction === 'CANCEL')
        {
            ErrLogsAppName = "Purchase Order Report";
            if(prHeader === null || prHeader[0].DISTRIBUTOR_ID === null) {
                throw "Invalid Payload";
            }
            ErrLogReqNo = prHeader[0].PR_NO;
            var vPrNo = prHeader[0].PR_NO;
            var vApprRole = prHeader[0].APPROVER_ROLE;
            var vApprLevel = prHeader[0].APPROVER_LEVEL;
            var vDistributorId = prHeader[0].DISTRIBUTOR_ID;
            var vDistName = prHeader[0].DISTRIBUTOR_NAME;
            var RejComment = prEvent[0].COMMENTS;

            var getApprover = await lib_common.getApproverForEntity(connection, '1000', vApprRole, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY','PR',vApprLevel);
            if (getApprover === null || (getApprover[0].USER_IDS === null || getApprover[0].USER_IDS === ""))
            throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};

            isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");

            const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_REQUEST_APPROVAL')
            sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,appType,vPrNo,'SA',1,null,vDistributorId,prHeader[0].GRAND_TOTAL,[],[],prEvent]);
            Result = sResponse.outputScalar;

            // var approverName = await SELECT .from`DEALER_PORTAL_MASTER_IDEAL_USERS` .where`USER_ID=${getApprover[0].USER_IDS}`; 
            // var approverRoleDesc = await SELECT .from`DEALER_PORTAL_MASTER_USER_ROLE` .where`CODE=${getApprover[0].ROLE_CODE}`;
            if (sResponse.outputScalar.OUT_SUCCESS !== null) {
                oEmailData = {
                    "PurReqNo": vPrNo,
                    "RejComm" : RejComment,
                    // "Approver" : approverName[0].USER_NAME,
                    // "Approve_Role" : approverRoleDesc[0].DESCRIPTION,
                    "DistName" : vDistName
                }

                if (isEmailNotificationEnabled) {
                    var DistEmailId = await getDistEmailId(vDistributorId,'A');
                    var checkApprover = await lib_common.getApproverForEntity(connection, '1000', null, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY','PR',vApprLevel);
                    oEmaiContent = await lib_email_content.getEmailContent(connection, "CANCEL", "PURCHASE_REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC(null);
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
    //MDK Action
    this.on('CreatePurchaseMDK', async (req) => {
        try{
        var client = await dbClass.createConnectionFromEnv();
        var dbConn = new dbClass(client);
        let connection = await cds.connect.to('db');
        var sResponse = null;
        var Result = null;

        // var{
        //     action,
        //     appType,
        //     prHeader,
        //     prCart,
        //     prItems,
        //     prEvent,
        //     userDetails
        // } = req.data;
        // var input = JSON.parse(req.data.prcart);
        var action = req.data.action;
        var appType = req.data.appType;
        var prHeader = JSON.parse(req.data.prHeader);
        var prCart = JSON.parse(req.data.prCart);
        var prItems = JSON.parse(req.data.prItems);
        var prEvent = JSON.parse(req.data.prEvent);
        var userDetails = req.data.userDetails;

        var sAction = action || null;
        var isEmailNotificationEnabled = false;
        var ErrLogReqNo = null;
        var ErrLogsUserId = userDetails.USER_ID;
        var ErrLogsUserRole = userDetails.USER_ROLE;
        var ErrLogsAppName = null;
        
        if(sAction === 'CREATE')
        {
            if(prHeader === null || prHeader[0].DISTRIBUTOR_ID === null) {
                throw "Invalid Payload";
            }
            ErrLogsAppName = "Purchase Creation";
            var isEmailNotificationEnabled = false;
            var eventObj = await eventObject(prEvent);
            var vDistributorId = prHeader[0].DISTRIBUTOR_ID;

            var checkApprover = await lib_common.getApproverForEntity(connection, '1000', null, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY',appType,1);
            if (checkApprover === null || (checkApprover[0].USER_IDS === null || checkApprover[0].USER_IDS === ""))
            {
                throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};
            }

            isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");
            var prItemsObj = await getIdForItems(prItems);
            const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_CREATION');
            sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,null,vDistributorId,null,[],prHeader,prItemsObj,eventObj,checkApprover[0].LEVEL,checkApprover[0].ROLE_CODE]);
            Result = sResponse.outputScalar;
            ErrLogReqNo = sResponse.outputScalar.OUT_SUCCESS;
            if (sResponse.outputScalar.OUT_SUCCESS !== null) {
                oEmailData = {
                    "PurReqNo": sResponse.outputScalar.OUT_SUCCESS
                    // "SupplierName": aInputData[0].DIST_NAME1
                }

                if (isEmailNotificationEnabled) {
                    oEmaiContent = await lib_email_content.getEmailContent(connection, "CREATE", "PURCHASE_REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC(null);
                    await  lib_email.sendidealEmail(checkApprover[0].USER_IDS,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)      
                }
                Result = sResponse.outputScalar.OUT_SUCCESS;
                return Result;
            }
            return Result;
        }
        else if(sAction === 'CART'){

            ErrLogsAppName = "Purchase Creation";
            if(prCart === null || prCart[0].DISTRIBUTOR_ID === null) {
                throw "Invalid Payload";
            }
            if(appType === 'CREATE')
            {
                var PresentData = await getPresentData(prCart[0].MATERIAL_DESC,prCart[0].DISTRIBUTOR_ID)
                var vDistributorId = prCart[0].DISTRIBUTOR_ID;
                if(PresentData === true)
                {
                    const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_CREATION');
                    sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,'UPDATE',vDistributorId,null,prCart,[],[],[],null,null]);
                    Result = sResponse.outputScalar.OUT_SUCCESS;
                    return Result;
                }
                var prCartObj = await getIdForCart(prCart);
              
                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_CREATION');
                sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,appType,vDistributorId,null,prCartObj,[],[],[],null,null]);
                Result = sResponse.outputScalar.OUT_SUCCESS;
                return Result;
                // return "Success";
            }
            if(appType === 'DELETE')
            {
                var vCartId = prCart[0].CART_ID;
                var vDistributorId = prCart[0].DISTRIBUTOR_ID;
                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_CREATION');
                sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,appType,vDistributorId,vCartId,[],[],[],[],null,null]);
                Result = sResponse.outputScalar.OUT_SUCCESS;
                return Result;
            }
            if(appType === 'DELETEALL')
            {
                var vCartId = prCart[0].CART_ID;
                var vDistributorId = prCart[0].DISTRIBUTOR_ID;
                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_CREATION');
                sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,appType,vDistributorId,null,[],[],[],[],null,null]);
                Result = sResponse.outputScalar.OUT_SUCCESS;
                return Result;
            }
        }
        else if(sAction === 'APPROVE')
        {

            ErrLogsAppName = "Purchase Approval";
            if(prHeader === null || prHeader[0].DISTRIBUTOR_ID === null) {
                throw "Invalid Payload";
            }
            ErrLogReqNo = prHeader[0].PR_NO;
            var vPrNo = prHeader[0].PR_NO;
            var vApprRole = prHeader[0].APPROVER_ROLE;
            var vApprLevel = prHeader[0].APPROVER_LEVEL;
            var vDistributorId = prHeader[0].DISTRIBUTOR_ID;
            var vDistName = prHeader[0].DISTRIBUTOR_NAME;
            var isEmailNotificationEnabled = false;
            var emailUserId;

            if(appType === 'ADD')
            {
                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_REQUEST_APPROVAL')
                sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,appType,vPrNo,'SA',null,sSapSoCode,vDistributorId,prHeader[0].GRAND_TOTAL,[],prItems,prEvent]);
                Result = sResponse.outputScalar.OUT_SUCCESS;
                return Result;
            }
            else if(appType === 'DELETE')
            {
                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_REQUEST_APPROVAL')
                sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,appType,vPrNo,'SA',null,sSapSoCode,vDistributorId,prHeader[0].GRAND_TOTAL,[],prItems,prEvent]);
                Result = sResponse.outputScalar.OUT_SUCCESS;
                return Result;
            }
            else if(appType === 'UPDATE')
            {
                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_REQUEST_APPROVAL')
                sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,appType,vPrNo,'SA',null,sSapSoCode,vDistributorId,prHeader[0].GRAND_TOTAL,[],prItems,prEvent]);
                Result = sResponse.outputScalar.OUT_SUCCESS;
                return Result;
            }
            else{
            var pcheckApprover = await lib_common.getApproverForEntity(connection, '1000', vApprRole, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY',appType,vApprLevel);
            if (pcheckApprover === null || (pcheckApprover[0].USER_IDS === null || pcheckApprover[0].USER_IDS === ""))
            {
                throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};
            }
            emailUserId = pcheckApprover[0].USER_ID;
            isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");
            var maxLevel = await lib_common.getMaxLevel('1000',appType);

            if(vApprLevel === maxLevel)
            {   
                //S4 Hana API hit 
                var vPrResult = await lib_PR.getPRPayload(prHeader,prItems,connection);
                var PrResult = await lib_PR.PostToPR(vPrResult,connection);
                //So Number
                var sSapSoCode = PrResult.d.SoNumber;
                if(sSapSoCode === "" || sSapSoCode === null || sSapSoCode === undefined || sSapSoCode === vPrNo){
                    throw {"message":"There is an issue in approval. Please contact admin team."};
                }
                else{
                var SoItemsObj = await getPrItemsData(prItems,sSapSoCode);

                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_REQUEST_APPROVAL')
                sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,appType,vPrNo,'SA',null,sSapSoCode,vDistributorId,prHeader[0].GRAND_TOTAL,SoItemsObj,[],prEvent]);
                Result = sResponse.outputScalar.OUT_SUCCESS;
                // return Result;
                }
            }
            if(vApprLevel < maxLevel)
            {
                var addLevel = Number(vApprLevel) + 1;
                sAction = "APPROVE_PENDING";
                var checkApprover = await lib_common.getApproverForEntity(connection, '1000', null, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY',appType,addLevel);
                if (checkApprover === null || (checkApprover[0].USER_IDS === null || checkApprover[0].USER_IDS === ""))
                throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};
                emailUserId = checkApprover[0].USER_IDS;
                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_REQUEST_APPROVAL')
                sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,appType,vPrNo,checkApprover[0].ROLE_CODE,checkApprover[0].LEVEL,null,vDistributorId,prHeader[0].GRAND_TOTAL,[],[],prEvent]);
                Result = sResponse.outputScalar.OUT_SUCCESS;
                // return Result;
            }

            if (sResponse.outputScalar.OUT_SUCCESS !== null) {
                if (isEmailNotificationEnabled) {
                var approverName = await SELECT .from`DEALER_PORTAL_MASTER_IDEAL_USERS` .where`USER_ID=${pcheckApprover[0].USER_IDS}`; 
                var approverRoleDesc = await SELECT .from`DEALER_PORTAL_MASTER_USER_ROLE` .where`CODE=${pcheckApprover[0].ROLE_CODE}`;
                oEmailData = {
                    "PurReqNo": vPrNo,
                    "Approver" : approverName[0].USER_NAME,
                    "Approve_Role" : approverRoleDesc[0].DESCRIPTION,
                    "DistName" : vDistName
                }
                if(sAction === "APPROVE_PENDING")
                {
                    oEmaiContent = await lib_email_content.getEmailContent(connection, sAction, "PURCHASE_REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC(null);
                    await  lib_email.sendidealEmail(emailUserId,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)
                }
                if(sAction === "APPROVE"){
                    var DistEmailId = await getDistEmailId(vDistributorId,'A');
                    oEmaiContent = await lib_email_content.getEmailContent(connection, sAction, "PURCHASE_REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC([pcheckApprover[0].USER_IDS]);
                    await lib_email.sendidealEmail(DistEmailId[0].REGISTERED_ID,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)
                }
            }
        }
        return Result;
        }

        }
        else if(sAction === 'REJECT')
        {
            ErrLogsAppName = "Purchase Approval";
            if(prHeader === null || prHeader[0].DISTRIBUTOR_ID === null) {
                throw "Invalid Payload";
            }
            ErrLogReqNo = prHeader[0].PR_NO;
            var vPrNo = prHeader[0].PR_NO;
            var vApprRole = prHeader[0].APPROVER_ROLE;
            var vApprLevel = prHeader[0].APPROVER_LEVEL;
            var vDistributorId = prHeader[0].DISTRIBUTOR_ID;
            var vDistName = prHeader[0].DISTRIBUTOR_NAME;
            var RejComment = prEvent[0].COMMENTS;

            var getApprover = await lib_common.getApproverForEntity(connection, '1000', vApprRole, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY','PR',vApprLevel);
            if (getApprover === null || (getApprover[0].USER_IDS === null || getApprover[0].USER_IDS === ""))
            throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};

            isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");

            const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_REQUEST_APPROVAL')
            sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,appType,vPrNo,'SA',1,null,vDistributorId,prHeader[0].GRAND_TOTAL,[],[],prEvent]);
            Result = sResponse.outputScalar.OUT_SUCCESS;

            var approverName = await SELECT .from`DEALER_PORTAL_MASTER_IDEAL_USERS` .where`USER_ID=${getApprover[0].USER_IDS}`; 
            var approverRoleDesc = await SELECT .from`DEALER_PORTAL_MASTER_USER_ROLE` .where`CODE=${getApprover[0].ROLE_CODE}`;
            if (sResponse.outputScalar.OUT_SUCCESS !== null) {
                oEmailData = {
                    "PurReqNo": vPrNo,
                    "RejComm" : RejComment,
                    "Approver" : approverName[0].USER_NAME,
                    "Approve_Role" : approverRoleDesc[0].DESCRIPTION,
                    "DistName" : vDistName
                }

                if (isEmailNotificationEnabled) {
                    var DistEmailId = await getDistEmailId(vDistributorId,'A');
                    var checkApprover = await lib_common.getApproverForEntity(connection, '1000', null, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY','PR',vApprLevel);
                    oEmaiContent = await lib_email_content.getEmailContent(connection, "REJECT", "PURCHASE_REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC([checkApprover[0].USER_IDS]);
                    await  lib_email.sendidealEmail(DistEmailId[0].REGISTERED_ID,sCCEmail,'html', oEmaiContent.subject, oEmaiContent.emailBody)      
                }
            }
            return Result;
        }
        else if(sAction === 'CANCEL')
        {
            ErrLogsAppName = "Purchase Order Report";
            if(prHeader === null || prHeader[0].DISTRIBUTOR_ID === null) {
                throw "Invalid Payload";
            }
            ErrLogReqNo = prHeader[0].PR_NO;
            var vPrNo = prHeader[0].PR_NO;
            var vApprRole = prHeader[0].APPROVER_ROLE;
            var vApprLevel = prHeader[0].APPROVER_LEVEL;
            var vDistributorId = prHeader[0].DISTRIBUTOR_ID;
            var vDistName = prHeader[0].DISTRIBUTOR_NAME;
            var RejComment = prEvent[0].COMMENTS;

            var getApprover = await lib_common.getApproverForEntity(connection, '1000', vApprRole, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY','PR',vApprLevel);
            if (getApprover === null || (getApprover[0].USER_IDS === null || getApprover[0].USER_IDS === ""))
            throw {"message":"Approver missing in approval hierarchy. Please contact Admin team."};

            isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");

            const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'PURCHASE_REQUEST_APPROVAL')
            sResponse = await dbConn.callProcedurePromisified(loadProc,[sAction,appType,vPrNo,'SA',1,null,vDistributorId,prHeader[0].GRAND_TOTAL,[],[],prEvent]);
            Result = sResponse.outputScalar.OUT_SUCCESS;

            // var approverName = await SELECT .from`DEALER_PORTAL_MASTER_IDEAL_USERS` .where`USER_ID=${getApprover[0].USER_IDS}`; 
            // var approverRoleDesc = await SELECT .from`DEALER_PORTAL_MASTER_USER_ROLE` .where`CODE=${getApprover[0].ROLE_CODE}`;
            if (sResponse.outputScalar.OUT_SUCCESS !== null) {
                oEmailData = {
                    "PurReqNo": vPrNo,
                    "RejComm" : RejComment,
                    // "Approver" : approverName[0].USER_NAME,
                    // "Approve_Role" : approverRoleDesc[0].DESCRIPTION,
                    "DistName" : vDistName
                }

                if (isEmailNotificationEnabled) {
                    var DistEmailId = await getDistEmailId(vDistributorId,'A');
                    var checkApprover = await lib_common.getApproverForEntity(connection, '1000', null, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY','PR',vApprLevel);
                    oEmaiContent = await lib_email_content.getEmailContent(connection, "CANCEL", "PURCHASE_REQUEST", oEmailData, null)
                    var sCCEmail = await lib_email.setDynamicCC(null);
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

    this.on('templateUpload', async (req) => {
        try {
            var query= await SELECT .from `DEALER_PORTAL_PR_TEMPLATE`;
            if(query.length >0){
                await DELETE .from `DEALER_PORTAL_PR_TEMPLATE`;
            }

            var details = req.data.prTemplate;
            await INSERT.into('DEALER_PORTAL_PR_TEMPLATE').entries({
                TEMPLATE_ID: details[0].TEMPLATE_ID, TEMPLATE_NAME: details[0].TEMPLATE_NAME,
                TEMPLATE_CONTENT: details[0].TEMPLATE_CONTENT, TEMPLATE_MIMETYPE: details[0].TEMPLATE_MIMETYPE,
                TEMPLATE_TYPE: details[0].TEMPLATE_TYPE
            });

            var sresponse = "Template inserted successfully";
            return sresponse;
        
        }
        catch (error) {
            var sType=error.code?"Procedure":"Node Js";    
            var iErrorCode=error.code??500; 
            
            // lib_common.postErrorLog(Result,reqNo,sUserIdentity,sUserRole,"Purchase Creation",sType,dbConn,hdbext);
            req.error({ code:iErrorCode, message:  error.message ? error.message : error }); 
        }
    });

    this.on('templateUploadMDK', async (req) => {
        try {
            var query= await SELECT .from `DEALER_PORTAL_PR_TEMPLATE`;
            if(query.length >0){
                await DELETE .from `DEALER_PORTAL_PR_TEMPLATE`;
            }

            var details = JSON.parse(req.data.prTemplate);
            await INSERT.into('DEALER_PORTAL_PR_TEMPLATE').entries({
                TEMPLATE_ID: details[0].TEMPLATE_ID, TEMPLATE_NAME: details[0].TEMPLATE_NAME,
                TEMPLATE_CONTENT: details[0].TEMPLATE_CONTENT, TEMPLATE_MIMETYPE: details[0].TEMPLATE_MIMETYPE,
                TEMPLATE_TYPE: details[0].TEMPLATE_TYPE
            });

            var sresponse = "Template inserted successfully";
            return sresponse;
        
        }
        catch (error) {
            var sType=error.code?"Procedure":"Node Js";    
            var iErrorCode=error.code??500; 
            
            // lib_common.postErrorLog(Result,reqNo,sUserIdentity,sUserRole,"Purchase Creation",sType,dbConn,hdbext);
            req.error({ code:iErrorCode, message:  error.message ? error.message : error }); 
        }
    });

    async function eventObject(payload){
        var oEventObj = [{
            "PR_NO" : 1,
            "EVENT_NO":1,
            "EVENT_CODE":1,
            "USER_ID":payload[0].USER_ID,
            "USER_ROLE":payload[0].USER_ROLE,
            "USER_NAME":payload[0].USER_NAME,
            "COMMENTS":payload[0].COMMENTS,
            "CREATION_DATE":null
              }
          ];
        return oEventObj;

    }
    async function getIdForCart(data){

        for(var i = 0;i < data.length; i++)
        {
            data[i].CART_ID = i + 1;
        }
        return data;
    }
    async function getIdForItems(data){

        for(var i = 0;i < data.length; i++)
        {
            data[i].PR_ITEM_NO = i + 1;
        }
        return data;
    }      
    async function getPrItemsData(data,sSapSoCode){

        var vSoItems = [];
        for(var i =0;i<data.length;i++)
	    {
        var soItems = {
            "SAP_SO_NO":sSapSoCode,
            // "PR_NO":data[i].PR_NO,
            "SO_ITEM_NO":i+1,
            "MATERIAL_CODE":data[i].MATERIAL_CODE,
            "MATERIAL_DESC":data[i].MATERIAL_DESC,
            "IMAGE_URL":data[i].IMAGE_URL,
            "HSN_CODE":data[i].HSN_CODE,
            "UNIT_OF_MEASURE":data[i].UNIT_OF_MEASURE,
            "QUANTITY":data[i].QUANTITY,
            "FREE_QUANTITY":data[i].FREE_QUANTITY,
            "STD_PRICE":data[i].STD_PRICE,
            "BASE_PRICE":data[i].BASE_PRICE,
			"DISC_AMOUNT":data[i].DISC_AMOUNT,
            "DISC_PERC":data[i].DISC_PERC,
            "NET_AMOUNT":data[i].NET_AMOUNT,
            "TOTAL_AMOUNT":data[i].TOTAL_AMOUNT,
            "CGST_PERC":data[i].CGST_PERC,
            "CGST_AMOUNT":data[i].CGST_AMOUNT,
            "SGST_PERC":data[i].SGST_PERC,
            "SGST_AMOUNT":data[i].SGST_AMOUNT,
            "IGST_PERC":data[i].IGST_PERC,
            "IGST_AMOUNT":data[i].IGST_AMOUNT,
            "TAXES_AMOUNT":data[i].TAXES_AMOUNT
        }
        vSoItems.push(soItems);
    }
    return vSoItems;
    }

    async function getPresentData(mCode,dID){
        try{
            var result = await SELECT .from`DEALER_PORTAL_PR_CART` .where`MATERIAL_DESC=${mCode} AND DISTRIBUTOR_ID=${dID}`;
            if(result.length > 0)
            {
                return true;
            }
            else{
                return false;    
            }

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
})