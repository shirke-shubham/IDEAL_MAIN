var cds = require("@sap/cds");
var hdbext = require("@sap/hdbext");
var dbClass = require("sap-hdbext-promisfied");
const lib_common = require('../srv/LIB/ideal_library')
const lib_email = require('../srv/LIB/ideal_library_email')
const lib_CR = require('../srv/LIB/ideal_library_cr')
const lib_email_content = require('../srv/LIB/ideal_library_email_content')
const lib_rga = require('../srv/LIB/ideal_library_rga')
// var sHANDLER = require("./LIB/Handler");
// var error_log = require("./LIB/Error_Logs");
// var { error } = require("console");

 
module.exports = cds.service.impl(async function (req) {

    var client = await dbClass.createConnectionFromEnv();
    var dbconn = new dbClass(client);
    var connection = await cds.connect.to("db");
    var output;
    // BY SHUBHAM
    this.on('rgaProcess', async (req) => {      
        try {

            var { 
                action,        
                appType,
                rgHeader,
                rgItems,
                rgEvent,
            } = req.data;

            var ErrLogsUserId = rgEvent.USER_ID;
            var ErrLogsUserRole = rgEvent.USER_ROLE;        
            var ErrLogsAppName = null;
            var ErrLogReqNo;  
    
            var isEmailNotificationEnabled = false;
            var sAction = action || null;

            if (sAction === "CREATE") {

                ErrLogsAppName = "RGA CREATION";

                if (rgHeader === null || rgHeader[0].DISTRIBUTOR_ID === null) {
                    throw "Invalid Payload";
                }

                var checkApprover = await lib_common.getApproverForEntity(connection, '1000', null, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY', appType, 1);
                if (checkApprover === null || (checkApprover[0].USER_IDS === null || checkApprover[0].USER_IDS === "")) {
                    throw { "message": "Approver missing in approval hierarchy. Please contact Admin team." };
                }

                isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");
                
                for(var i=0; i<rgItems.length; i++){
                    rgItems[i].RGA_ITEM_NO =i+1;
                }

                //To deduct return qty from particular stock qty. 
                // var invoiceNo,itemCode,returnQty, matCode, updatedStock;
                // for (let i=0; i<rgItems.length; i++){
                    
                //     itemCode = rgItems[i].ITEM_CODE;
                //     returnQty = rgItems[i].RETURN_QUANTITY;
                //     matCode = await SELECT `MATERIAL_STOCK`.from `DEALER_PORTAL_GRN_STOCK` .where `MATERIAL_CODE=${itemCode}`;
                //     updatedStock = matCode[0].MATERIAL_STOCK - returnQty;

                //     await UPDATE`DEALER_PORTAL_GRN_STOCK`.set`MATERIAL_STOCK=${updatedStock}`.where`MATERIAL_CODE=${itemCode}`;

                // }    
                    
                var sp = await dbconn.loadProcedurePromisified(hdbext, null, 'RGA_CREATE');
                var output = await dbconn.callProcedurePromisified(sp, [sAction, appType, checkApprover[0].LEVEL, checkApprover[0].ROLE_CODE, rgHeader, rgItems, rgEvent]);
                var Result = output.outputScalar;

                oEmailData = {
                    "RgaReqNo": output.outputScalar.OUT_SUCCESS   
                }
                const rgaReqNoString = oEmailData.RgaReqNo;
                const rgaReqNo = rgaReqNoString.match(/\d{10}/)[0];

                if (output.outputScalar.OUT_SUCCESS !== null) {
                    oEmailData = {
                        "RgaReqNo": output.outputScalar.OUT_SUCCESS,
                        "RgaRequestNo":rgaReqNo 
                    }
                ErrLogReqNo = rgaReqNo;
    
                    if (isEmailNotificationEnabled) {
                        oEmaiContent = await lib_email_content.getEmailContent(connection, "CREATE", "RGA_REQUEST", oEmailData, null)
                        var sCCEmail = await lib_email.setDynamicCC(null);
                        // var sCCEmail = await lib_email.setDynamicCC("shubham.sh@intellectbizware.com");

                        await lib_email.sendidealEmail(checkApprover[0].USER_IDS, sCCEmail, 'html', oEmaiContent.subject, oEmaiContent.emailBody)
                        //  await lib_email.sendidealEmail("shubham.sh@intellectbizware.com", sCCEmail, 'html', oEmaiContent.subject, oEmaiContent.emailBody)

                    }
                    Result = {
                        OUT_SUCCESS: output.outputScalar.OUT_SUCCESS
                    }
                    return Result;

                }

            } else if (sAction === "APPROVE") {
                
                ErrLogsAppName = "RGA APPROVAL";
                ErrLogReqNo = rgHeader[0].RGA_NO;

                var rgaNo = rgHeader[0].RGA_NO;
                var approverRole = rgHeader[0].APPROVER_ROLE;
                var approvelLevel = rgHeader[0].APPROVER_LEVEL;

                var maxLevel = await lib_common.getMaxLevel('1000', appType);
                // var maxLevel = 2; 
                                         
                var checkApprover = await lib_common.getApproverForEntity(connection, '1000', approverRole, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY', appType, approvelLevel);
                if (checkApprover === null || (checkApprover[0].USER_IDS === null || checkApprover[0].USER_IDS === "")) {
                    throw { "message": "Approver missing in approval hierarchy. Please contact Admin team." };
                }
                isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");

                    if (approvelLevel === maxLevel) {  
                    sAction = 'APPROVE';

                    // S4 HIT TO generate sapNo
                    var vRgaResult = await lib_rga.getRgaPayload(rgHeader, rgItems, rgEvent, connection);
                    var RgaResult = await lib_rga.PostRgaPayload(vRgaResult, connection);
                    var sapNo = RgaResult.d.SalesOrder;
                    if(sapNo === null || sapNo === "" || sapNo === undefined){
                        throw new error("Issue found while approving request. Please contact admin team")
                    }

                    emailUserId = checkApprover[0].USER_IDS;   

                    var sp = await dbconn.loadProcedurePromisified(hdbext, null, 'RGA_APPROVE_REJECT');
                    var output = await dbconn.callProcedurePromisified(sp, [sAction, appType, rgaNo, null, null, rgHeader, rgItems, rgEvent, sapNo]);

                    var Result = output.outputScalar;
                    var approverName = await SELECT.from`DEALER_PORTAL_MASTER_IDEAL_USERS`.where`USER_ID=${checkApprover[0].USER_IDS}`;
                    var approverRoleDesc = await SELECT.from`DEALER_PORTAL_MASTER_USER_ROLE`.where`CODE=${checkApprover[0].ROLE_CODE}`;

                }
                else if (approvelLevel < maxLevel) {

                    sAction = 'APPROVE_PENDING';
                    var addApproverLevel = Number(approvelLevel) + 1;

                    var CcheckApprover = await lib_common.getApproverForEntity(connection, '1000', null, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY', appType, addApproverLevel);
                    if (CcheckApprover === null || (CcheckApprover[0].USER_IDS === null || CcheckApprover[0].USER_IDS === "")) {
                        throw { "message": "Approver missing in approval hierarchy. Please contact Admin team." };
                    }
                    var sapNo = null;
                    emailUserId = CcheckApprover[0].USER_IDS;

                    var sp = await dbconn.loadProcedurePromisified(hdbext, null, 'RGA_APPROVE_REJECT');
                    var output = await dbconn.callProcedurePromisified(sp, [sAction, appType, rgaNo, CcheckApprover[0].LEVEL, CcheckApprover[0].ROLE_CODE, rgHeader, rgItems, rgEvent, sapNo]);

                    var Result = output.outputScalar;
                    var approverName = await SELECT.from`DEALER_PORTAL_MASTER_IDEAL_USERS`.where`USER_ID=${checkApprover[0].USER_IDS}`;
                    var approverRoleDesc = await SELECT.from`DEALER_PORTAL_MASTER_USER_ROLE`.where`CODE=${checkApprover[0].ROLE_CODE}`;
                    
                }

                if (output.outputScalar.OUT_SUCCESS !== null) {     
                    oEmailData = {
                        "RgaReqNo": rgaNo,
                        "Approver": approverName[0].USER_NAME,
                        "Approve_Role": approverRoleDesc[0].DESCRIPTION     
                    }
    
                    if (isEmailNotificationEnabled) {
                        oEmaiContent = await lib_email_content.getEmailContent(connection, sAction, "RGA_REQUEST", oEmailData, null)
                        var sCCEmail = await lib_email.setDynamicCC(null);
                        // var sCCEmail = await lib_email.setDynamicCC("shubham.sh@intellectbizware.com");
                        await lib_email.sendidealEmail(checkApprover[0].USER_IDS, sCCEmail, 'html', oEmaiContent.subject, oEmaiContent.emailBody);
                        // await lib_email.sendidealEmail("shubham.sh@intellectbizware.com", sCCEmail, 'html', oEmaiContent.subject, oEmaiContent.emailBody)
 
                    }
                    Result = {
                        // OUT_SUCCESS:  output.outputSca lar.OUT_SUCCESS || " is been approved"
                        OUT_SUCCESS: output.outputScalar.OUT_SUCCESS

                    }
                    return Result;
                }

            } else if (sAction === "REJECT") {
 
                ErrLogsAppName = "RGA APPROVAL";
                ErrLogReqNo = rgHeader[0].RGA_NO;

                var rgaNo = rgHeader[0].RGA_NO;
                var approverRole = rgHeader[0].APPROVER_ROLE;
                var approvelLevel = rgHeader[0].APPROVER_LEVEL;
                var RejectComment = rgEvent[0].COMMENT;
                

                var getApprover = await lib_common.getApproverForEntity(connection, '1000', approverRole, 'DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY', appType, approvelLevel);
                if (getApprover === null || (getApprover[0].USER_IDS === null || getApprover[0].USER_IDS === ""))
                    throw { "message": "Approver missing in approval hierarchy. Please contact Admin team." };

                isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");
                var sapNo = "";

                //To add rejected qty to particular stock qty.
                var invoiceNo,itemCode,returnQty, matCode, updatedStock;
                for (let i=0; i<rgItems.length; i++){
                    
                    itemCode = rgItems[i].ITEM_CODE; 
                    returnQty = rgItems[i].RETURN_QUANTITY;
                    matCode = await SELECT `MATERIAL_STOCK`.from `DEALER_PORTAL_GRN_STOCK`.where `MATERIAL_CODE=${itemCode}`;
                    updatedStock = matCode[0].MATERIAL_STOCK + returnQty;

                    await UPDATE`DEALER_PORTAL_GRN_STOCK`.set`MATERIAL_STOCK=${updatedStock}`.where`MATERIAL_CODE=${itemCode}`;
                    // if(matCode.length>0){
                    //     updatedStock = matCode[0].MATERIAL_STOCK + returnQty;
                    //     await UPDATE`DEALER_PORTAL_GRN_STOCK`.set`MATERIAL_STOCK=${updatedStock}`.where`MATERIAL_CODE=${itemCode}`;
                    // }    
                }

                var sp = await dbconn.loadProcedurePromisified(hdbext, null, 'RGA_APPROVE_REJECT');
                var output = await dbconn.callProcedurePromisified(sp, [sAction, appType, rgaNo, getApprover[0].LEVEL, getApprover[0].ROLE_CODE, rgHeader, rgItems, rgEvent, sapNo]);
                var Result = output.outputScalar;

                var approverName = await SELECT.from`DEALER_PORTAL_MASTER_IDEAL_USERS`.where`USER_ID=${getApprover[0].USER_IDS}`;
                var approverRoleDesc = await SELECT.from`DEALER_PORTAL_MASTER_USER_ROLE`.where`CODE=${getApprover[0].ROLE_CODE}`;

                if (output.outputScalar.OUT_SUCCESS !== null) {
                    oEmailData = {
                        "RgaReqNo": output.outputScalar.OUT_SUCCESS,
                        "Approver": approverName[0].USER_NAME,
                        "Approve_Role": approverRoleDesc[0].DESCRIPTION,
                        "RejComm": RejectComment
                    }

                    if (isEmailNotificationEnabled) {
                        oEmaiContent = await lib_email_content.getEmailContent(connection, "REJECT", "RGA_REQUEST", oEmailData, null)
                        var sCCEmail = await lib_email.setDynamicCC(null);
                        // var sCCEmail = await lib_email.setDynamicCC("shubham.sh@intellectbizware.com");
                        await lib_email.sendidealEmail(getApprover[0].USER_IDS, sCCEmail, 'html', oEmaiContent.subject, oEmaiContent.emailBody);
                        // await lib_email.sendidealEmail("shubham.sh@intellectbizware.com", sCCEmail, 'html', oEmaiContent.subject, oEmaiContent.emailBody);

                    }
                    Result = {
                        OUT_SUCCESS: output.outputScalar.OUT_SUCCESS || " has been rejected"
                    }
                }
                return Result;
            }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           

        } 
        catch (error) {
            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;

            lib_common.postErrorLog(Result,ErrLogReqNo,ErrLogsUserId,ErrLogsUserRole,ErrLogsAppName,sType,dbConn,hdbext);
            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }
    })
})