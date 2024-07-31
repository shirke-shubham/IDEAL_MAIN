const cds = require("@sap/cds")
const dbClass = require("sap-hdbext-promisfied");
const hdbext = require("@sap/hdbext");
const lib_common = require('../srv/LIB/ideal_library')
const lib_email = require('../srv/LIB/ideal_library_email')
// const lib_CR = require('../srv/LIB/ideal_library_cr')
const lib_email_content = require('../srv/LIB/ideal_library_email_content')
// const lib_rga = require('../srv/LIB/ideal_library_rga')
module.exports = cds.service.impl(function () {

    async function getSRNo(array) {
        var number = 1;
        for (var i = 0; i < array.length; i++) {
            if (array[i].ADDRESS_TYPE === 'BL_ADDR') {
                array[i].SR_NO = 1;
            } else {
                array[i].SR_NO = number + 1;
                number = array[i].SR_NO;
            }


        }
        return array;
    }
    this.on('registerRetailer', async (req) => {
        try {
            var retailerId, distributorId;
            // var {retailerDetails,attachmentdetails} = req.data;

            var client = await dbClass.createConnectionFromEnv();
            var dbconn = new dbClass(client);

            var userRole = req.data.userDetails.USER_ROLE;
            var userId = req.data.userDetails.USER_ID;

            var connection=await cds.connect.to("db");
            var isEmailNotificationEnabled = false;

            if (req.data.Action === 'CREATE') {

                // var isEmailNotificationEnabled = false;
                var array = req.data.retailerAddress;
                var arraySrNo = await getSRNo(array);
                isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");
                var staxid = req.data.retailerDetails[0].REGISTERED_TAX_ID;

                var existid = await SELECT `REGISTERED_TAX_ID`.from `DEALER_PORTAL_RETAILER_REGISTRATION_RETAILER_DETAILS`.where`REGISTERED_TAX_ID=${staxid}`;
                if (existid.length !== 0) {
                    return req.error(301, "Registered Tax Id " + staxid + "  already exist");
                }
                else {
                    var retailerTypeId  = req.data.retailerDetails[0].RETAILER_TYPE;
                    var retailerType = await SELECT`RETAILER_TYPE`.from`DEALER_PORTAL_RETAILER_REGISTRATION_RETAILER_TYPE_MASTER` .where`RETAILER_TYPE_ID=${retailerTypeId}`;
                    var retailerName = req.data.retailerDetails[0].RETAILER_NAME;

                    distributorId = req.data.retailerDetails[0].DISTRIBUTOR_ID;
                    const sp = await dbconn.loadProcedurePromisified(hdbext, null, 'RETAILER_REGISTRATION');

                    const output = await dbconn.callProcedurePromisified(sp, [retailerType[0].RETAILER_TYPE,req.data.Action, distributorId,retailerName, req.data.retailerDetails, req.data.retailerAddress, []]);
                    var Result = output.outputScalar;
                    // if (output.outputScalar.OUT_SUCCESS !== null) {
                    //     sResponse = output.outputScalar.OUT_SUCCESS;
                    //     return sResponse;
                    // }
                    if (output.outputScalar.OUT_SUCCESS !== null) {

                        oEmailData = {
                            "RetailerReqNo": output.outputScalar.OUT_SUCCESS 
                        }  
                        if (isEmailNotificationEnabled) {
                            oEmaiContent = await lib_email_content.getRetailerEmailContent(connection, "CREATE", "RETAILER_REQUEST", oEmailData, null)
                            var sCCEmail = await lib_email.setDynamicCC(null);
                            // var sCCEmail = await lib_email.setDynamicCC("vaishali.c@intellectbizware.com");
        
                            //   await lib_email.sendidealEmail(checkApprover[0].USER_IDS, sCCEmail, 'html', oEmaiContent.subject, oEmaiContent.emailBody)
                             await lib_email.sendidealEmail(userId, sCCEmail, 'html', oEmaiContent.subject, oEmaiContent.emailBody)
                                  
                            }
                            sResponse = output.outputScalar.OUT_SUCCESS;
                            return sResponse;
                            // Result = {
                            //     OUT_SUCCESS: output.outputScalar.OUT_SUCCESS
                            // }    
                            // return Result;
                        
                    }
                }
            }

            else if (req.data.Action === 'CREATECSV') {
                var sResponse;
                var arrayDetails = req.data.retailerDetails;
                var array = req.data.retailerAddress;
                var retailertypearray = [];

                // var duplicatedata="";
                var duplicatedata = [];
                var k = 0;
                for (var i = 0; i < arrayDetails.length; i++) {
                    // validation for duplicate tax id 
                    var staxid = req.data.retailerDetails[i].REGISTERED_TAX_ID;
                    var existid = await SELECT`REGISTERED_TAX_ID`.from`DEALER_PORTAL_RETAILER_REGISTRATION_RETAILER_DETAILS`.where`REGISTERED_TAX_ID=${staxid}`;
                    if (existid.length != 0) {
                        duplicatedata[k] = staxid;
                        k = k + 1;
                        // if(duplicatedata === undefined || duplicatedata === "")
                        // {
                        //     duplicatedata = staxid;
                        // }
                        // else{
                        // duplicatedata = staxid +" "+duplicatedata;
                        // }  
                    }
                }
                if (duplicatedata.length === 0) {
                    var cDate = await SELECT`CURRENT_DATE`.from`DUMMY`;
                    // var arraySrNo = await getSRNo(array);
                    var id;
                    for (var i = 0; i < arrayDetails.length; i++) {
                        id = arrayDetails[i].RETAILER_ID;


                        var retailerTypeId  = req.data.retailerDetails[i].RETAILER_TYPE;
                        var retailerType = await SELECT`RETAILER_TYPE`.from`DEALER_PORTAL_RETAILER_REGISTRATION_RETAILER_TYPE_MASTER` .where`RETAILER_TYPE_ID=${retailerTypeId}`;
                        retailertypearray[i] = retailerType[0].RETAILER_TYPE;
                        // retailertypearray[i].push(retailerType[0].RETAILER_TYPE);

                        const sp1 = await dbconn.loadProcedurePromisified(hdbext, null, 'NEW_RETAILER_ID');
                        const output1 = await dbconn.callProcedurePromisified(sp1, []);
                        const sretailerId = output1.outputScalar.OUT_RETAILER_ID;
                        var sComment = 'A Retailer is created with the no : ' + sretailerId;
                        arrayDetails[i].RETAILER_ID = output1.outputScalar.OUT_RETAILER_ID;
                        if (output1.outputScalar.OUT_RETAILER_ID !== null) {
                            await INSERT.into('DEALER_PORTAL_RETAILER_REGISTRATION_RETAILER_EVENT').entries({ EVENT_ID: 1, DISTRIBUTOR_ID: arrayDetails[i].DISTRIBUTOR_ID, RETAILER_ID: arrayDetails[i].RETAILER_ID, RETAILER_NAME: arrayDetails[i].RETAILER_NAME, CREATION_DATE: cDate[0].CURRENT_DATE, COMMENT: sComment });
                            await INSERT.into('DEALER_PORTAL_RETAILER_REGISTRATION_RETAILER_MASTER').entries({DISTRIBUTOR_ID: arrayDetails[i].DISTRIBUTOR_ID, RETAILER_ID: arrayDetails[i].RETAILER_ID, RETAILER_NAME: arrayDetails[i].RETAILER_NAME});
                        }
                        else { 
                            var sType = error.code ? "Procedure" : "Node Js";  
                            var iErrorCode = error.code ?? 500;

                            req.error({ code: iErrorCode, message: error.message ? error.message : error });
                        }

                        var number = 1;
                        for (var j = 0; j < array.length; j++) {
                            if (array[j].RETAILER_ID === id) {
                                if (array[j].ADDRESS_TYPE === 'BL_ADDR') {
                                    array[j].SR_NO = 1;
                                } else {
                                    array[j].SR_NO = number + 1;
                                    number = array[j].SR_NO;
                                }
                                array[j].RETAILER_ID = output1.outputScalar.OUT_RETAILER_ID;
                            }
                        }
                    }

                    distributorId = req.data.retailerDetails[0].DISTRIBUTOR_ID;
                    const sp = await dbconn.loadProcedurePromisified(hdbext, null, 'RETAILER_REGISTRATION');
                    
                    // retailerType[0].RETAILER_TYPE,
                    const output = await dbconn.callProcedurePromisified(sp, [null ,req.data.Action, distributorId,null, req.data.retailerDetails, req.data.retailerAddress, req.data.retailerAttachments]);
//      
                    isEmailNotificationEnabled = await lib_email.isiDealSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");

                    // if (output.outputScalar.OUT_SUCCESS !== null) {
                        
                        // return sResponse;
                    // }
                    if (output.outputScalar.OUT_SUCCESS !== null) {

                        oEmailData = {
                            "RetailerReqNo": output.outputScalar.OUT_SUCCESS ,
                            "details": arrayDetails,
                            "retailertype" :retailertypearray
                        }  
                        if (isEmailNotificationEnabled) {
                            oEmaiContent = await lib_email_content.getRetailerEmailContent(connection, "CREATECSV", "RETAILER_REQUEST", oEmailData, null)
                            var sCCEmail = await lib_email.setDynamicCC(null);
                            // var sCCEmail = await lib_email.setDynamicCC("vaishali.c@intellectbizware.com");
        
                            //   await lib_email.sendidealEmail(checkApprover[0].USER_IDS, sCCEmail, 'html', oEmaiContent.subject, oEmaiContent.emailBody)
                             await lib_email.sendidealEmail(userId, sCCEmail, 'html', oEmaiContent.subject, oEmaiContent.emailBody)
                                  
                            }
                            sResponse = output.outputScalar.OUT_SUCCESS;
                            // Result = {
                            //     OUT_SUCCESS: output.outputScalar.OUT_SUCCESS
                            // }    
                            // return Result;
                            return sResponse;
                        
                    }
                }
                else {
                    return req.error({ code: 301, message: duplicatedata.toString() });
                }

            }


            else if (req.data.Action === 'EDIT') {
                var array = req.data.retailerAddress;
                var arraySrNo = await getSRNo(array);
                retailerId = req.data.retailerDetails[0].RETAILER_ID;
                distributorId = req.data.retailerDetails[0].DISTRIBUTOR_ID;

                const sp = await dbconn.loadProcedurePromisified(hdbext, null, 'RETAILER_MANAGEMENT');

                const output = await dbconn.callProcedurePromisified(sp, [distributorId, retailerId, req.data.retailerDetails, req.data.retailerAddress, req.data.retailerAttachments]);
                if (output.outputScalar.OUT_SUCCESS !== null) {
                    sResponse = output.outputScalar.OUT_SUCCESS;
                    return sResponse;
                }
            }

            else if (req.data.Action === 'BLOCK') {

                retailerId = req.data.retailerDetails[0].RETAILER_ID;
                distributorId = req.data.retailerDetails[0].DISTRIBUTOR_ID;
                // var previousdata = await SELECT `BLOCKED` .from`DEALER_PORTAL_RETAILER_REGISTRATION_RETAILER_DETAILS` .where `DISTRIBUTOR_ID=${distributorId} AND RETAILER_ID=${retailerId}`;
                // if(previousdata[0].BLOCKED ==='Y'){
                //     return "the retailer is already blocked";
                // }
                // else{
                const sp = await dbconn.loadProcedurePromisified(hdbext, null, 'BLOCK_RETAILER');
                const output = await dbconn.callProcedurePromisified(sp, [req.data.Action, distributorId, retailerId, req.data.retailerDetails[0].BLOCKED]);
                if (output.outputScalar.OUT_SUCCESS !== null) {
                    sResponse = output.outputScalar.OUT_SUCCESS;
                    return sResponse;
                }
                // }

            }
            else if (req.data.Action === 'UNBLOCK') {
                retailerId = req.data.retailerDetails[0].RETAILER_ID;
                distributorId = req.data.retailerDetails[0].DISTRIBUTOR_ID;

                // var previousdata = await SELECT `BLOCKED` .from`DEALER_PORTAL_RETAILER_REGISTRATION_RETAILER_DETAILS` .where `DISTRIBUTOR_ID=${distributorId} AND RETAILER_ID=${retailerId}`;
                // if(previousdata[0].BLOCKED ==='N'){
                //     return "The retailer is already unblocked";
                // }
                // else{

                const sp = await dbconn.loadProcedurePromisified(hdbext, null, 'BLOCK_RETAILER');

                const output = await dbconn.callProcedurePromisified(sp, [req.data.Action, distributorId, retailerId, req.data.retailerDetails[0].BLOCKED]);
                if (output.outputScalar.OUT_SUCCESS !== null) {
                    sResponse = output.outputScalar.OUT_SUCCESS;
                    return sResponse;
                }
                // }
            }


        }
        catch (error) {
            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;

            let Result ={
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE: error.message ? error.message : error

            }
            // lib_common.postErrorLog(Result,)
            await lib_common.postErrorLog(Result,distributorId,userId,userRole,"Retailer Registration",sType,dbconn,hdbext);

            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }
    });
    this.on('pdcCreation', async (req) => {
        try {
            var client = await dbClass.createConnectionFromEnv();
            var dbconn = new dbClass(client);
            var userRole = req.data.userDetails.USER_ROLE;
            var userId = req.data.userDetails.USER_ID;

            var SACTION = "";
            retailerId = req.data.retailerPDC[0].RETAILER_ID;
            distributorId = req.data.retailerPDC[0].DISTRIBUTOR_ID;

            var data = await SELECT`DISTRIBUTOR_ID,RETAILER_ID`.from`DEALER_PORTAL_RETAILER_REGISTRATION_RETAILER_PDC`.where`DISTRIBUTOR_ID=${distributorId} AND RETAILER_ID=${retailerId}`;

            if (data.length != 0) {

                SACTION = "EXIST";
                const sp = await dbconn.loadProcedurePromisified(hdbext, null, 'PDC_CREATION');
                const output = await dbconn.callProcedurePromisified(sp, [SACTION, distributorId, retailerId, req.data.retailerPDC]);
                if (output.outputScalar.OUT_SUCCESS !== null) {
                    sResponse = output.outputScalar.OUT_SUCCESS;
                    return sResponse;
                }
            }
            else {
                // var pdc_id = 1;
                const sp = await dbconn.loadProcedurePromisified(hdbext, null, 'PDC_CREATION');
                SACTION = "NOTEXIST";
                const output = await dbconn.callProcedurePromisified(sp, [SACTION, distributorId, retailerId, req.data.retailerPDC]);
                if (output.outputScalar.OUT_SUCCESS !== null) {
                    sResponse = output.outputScalar.OUT_SUCCESS;
                    return sResponse;
                }
            }
        }
         catch (error) {
            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;

            let Result ={
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE: error.message ? error.message : error

            }
            // lib_common.postErrorLog(Result,)
            await lib_common.postErrorLog(Result,retailerId,userId,userRole,"PDC Creation",sType,dbconn,hdbext);

            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }

    });

    this.on('templateCreation', async (req) => {
        try {
            // var client = await dbClass.createConnectionFromEnv();
            var dbconn = new dbClass(client);
            var userRole = req.data.userDetails.USER_ROLE;
            var userId = req.data.userDetails.USER_ID;
            var query= await SELECT .from `DEALER_PORTAL_RETAILER_REGISTRATION_RETAILER_TEMPLATE_ATTACHMENTS`;
            if(query.length >0){
                await DELETE .from `DEALER_PORTAL_RETAILER_REGISTRATION_RETAILER_TEMPLATE_ATTACHMENTS`;
            }

            var details = req.data.templateDetails;
            await INSERT.into('DEALER_PORTAL_RETAILER_REGISTRATION_RETAILER_TEMPLATE_ATTACHMENTS').entries({
                TEMPLATE_ID: details[0].TEMPLATE_ID, TEMPLATE_NAME: details[0].TEMPLATE_NAME,
                TEMPLATE_CONTENT: details[0].TEMPLATE_CONTENT, TEMPLATE_MIMETYPE: details[0].TEMPLATE_MIMETYPE,
                TEMPLATE_TYPE: details[0].TEMPLATE_TYPE
            });

            sresponse = "Attachments inserted Successfully";
            return sresponse;
        
        }
        catch (error) {
            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;
            var soNumber = null;
            
            let Result ={
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE: error.message ? error.message : error

            }
            // lib_common.postErrorLog(Result,)
            await lib_common.postErrorLog(Result,soNumber,userId,userRole,"Template Creation",sType,dbconn,hdbext);

            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }
    });
    this.on('orderCreation', async (req) => {
        try {
            // let connection = await cds.connect.to('db');
            var client = await dbClass.createConnectionFromEnv();
            var dbconn = new dbClass(client);
            var userRole = req.data.userDetails.USER_ROLE;
            var userId = req.data.userDetails.USER_ID;  
            var array=req.data.soItems;
            
            for(var i=0; i<array.length;i++){
                array[i].ITEM_NO = i+1;
            }
            var materialCode, materialGroupCode, stockQty, matCode, updatedStock;
            for (let i=0; i<array.length; i++){
                
                materialGroupCode = array[i].MATERIAL_GROUP;
                materialCode = array[i].MATERIAL_CODE;
                stockQty = array[i].QUANTITY;
                // matCode = await SELECT `MATERIAL_STOCK`.from `DEALER_PORTAL_GRN_STOCK` .where `MATERIAL_GROUP=${materialGroupCode} AND MATERIAL_CODE=${materialCode}`;
                // updatedStock = matCode[0].MATERIAL_STOCK - stockQty;

                // await UPDATE`DEALER_PORTAL_GRN_STOCK`.set`MATERIAL_STOCK=${updatedStock}`.where`MATERIAL_GROUP=${materialGroupCode} AND MATERIAL_CODE=${materialCode}`;

            }
            var distributorId = req.data.soHeaders[0].DISTRIBUTOR_ID;
            var retailerId = req.data.soHeaders[0].RETAILER_ID;
            const sp = await dbconn.loadProcedurePromisified(hdbext, null, 'RETAILER_ORDER_CREATION');
            const output = await dbconn.callProcedurePromisified(sp, [distributorId,retailerId,req.data.soHeaders, req.data.soItems]);
            var soNumber = output.outputScalar.OUT_SO_NUMBER;
            if (output.outputScalar.OUT_SUCCESS !== null) {
                sResponse = output.outputScalar.OUT_SUCCESS;    
                return sResponse;
            }
            
        } catch (error) {
            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;

            let Result ={
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE: error.message ? error.message : error

            }
            // lib_common.postErrorLog(Result,)
            await lib_common.postErrorLog(Result,soNumber,userId,userRole,"Order Creation",sType,dbconn,hdbext);


            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }

    });
})

