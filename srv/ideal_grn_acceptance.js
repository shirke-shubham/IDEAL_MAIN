var cds = require("@sap/cds");
var hdbext = require("@sap/hdbext");
var dbClass = require("sap-hdbext-promisfied");
const lib_common = require('../srv/LIB/ideal_library')

module.exports = cds.service.impl(async function (req) {

    var client = await dbClass.createConnectionFromEnv();
    var dbconn = new dbClass(client);
    var connection = await cds.connect.to("db");
    var output;
    // BY SHUBHAM
    this.on('grnAccept', async (req) => {
        try {
            var {
                action,
                appType,
                grnHeader,
                grnItems,
                grnEvent
            } = req.data;
        //  For ErrorLogEntity
            var ErrInvoiceNo = grnHeader[0].INVOICE_NO;
            var ErrLogsUserId = grnEvent[0].USER_ID;
            var ErrLogsUserRole = grnEvent[0].USER_ROLE;
            var ErrLogsAppName = "GRN ACCEPT";

            var existInvoice = await SELECT`INVOICE_NO`.from`DEALER_PORTAL_GRN_HEADER`.where`INVOICE_NO=${ErrInvoiceNo}`;

            if (action === "ACCEPT") {

                if (grnHeader === null || grnHeader[0].DISTRIBUTOR_ID === null) {
                    throw "Invalid Payload";
                }else if(existInvoice.length>0)
                {    
                    // throw new Error("Invoice " + ErrInvoiceNo + " is already accepted");
                    throw "Invoice " + ErrInvoiceNo + " is already accepted"
                }

                for (var i = 0; i < grnItems.length; i++) {
                    grnItems[i].ITEM_NO = i + 1;  

                }
 
                var price = 0;

                for (var i = 0; i < grnItems.length; i++) {     
                    const MatDetails = await SELECT`MATERIAL_GROUP, MATERIAL_CODE, MATERIAL_STOCK, UNIT_PRICE`.from`DEALER_PORTAL_GRN_STOCK`.where`MATERIAL_GROUP=${grnItems[i].MATERIAL_GROUP} AND MATERIAL_CODE=${grnItems[i].MATERIAL_CODE} AND DISTRIBUTOR_ID=${grnHeader[0].DISTRIBUTOR_ID}`;
                    if (MatDetails.length > 0) {
                        var existStock = MatDetails[0].MATERIAL_STOCK;
                        var invoiceStock = grnItems[i].ACCEPTED_QUANTITY;
                        var updatedStock = existStock + invoiceStock;
                        var unit_Price = grnItems[i].UNIT_PRICE;

                        if (MatDetails[0].UNIT_PRICE < unit_Price) {
                            price = grnItems[i].UNIT_PRICE;
                        }
                        else {
                            price = MatDetails[0].UNIT_PRICE;
                        }
                        await UPDATE`DEALER_PORTAL_GRN_STOCK`.set`MATERIAL_STOCK=${updatedStock}`.set`UNIT_PRICE=${price}`.where`MATERIAL_GROUP=${grnItems[i].MATERIAL_GROUP} AND MATERIAL_CODE=${grnItems[i].MATERIAL_CODE} AND DISTRIBUTOR_ID=${grnHeader[0].DISTRIBUTOR_ID}`;
                    }
                    else {
                        // await INSERT.into('DEALER_PORTAL_MATERIAL_GROUP_MASTER').entries({
                        //     MATERIAL_GROUP: grnItems[i].MATERIAL_GROUP,
                        //     MATERIAL_GROUP_DESC: grnItems[i].MATERIAL_GROUP_DESC
                        // })

                        await INSERT.into('DEALER_PORTAL_MATERIAL_CODE_MASTER').entries({
                            MATERIAL_GROUP: grnItems[i].MATERIAL_GROUP,
                            MATERIAL_CODE: grnItems[i].MATERIAL_CODE,
                            MATERIAL_DESC: grnItems[i].MATERIAL_DESC
                        })

                        await INSERT.into('DEALER_PORTAL_GRN_STOCK').entries({
                            DISTRIBUTOR_ID: grnHeader[0].DISTRIBUTOR_ID,
                            MATERIAL_GROUP: grnItems[i].MATERIAL_GROUP,
                            MATERIAL_GROUP_DESC: grnItems[i].MATERIAL_GROUP_DESC, MATERIAL_CODE: grnItems[i].MATERIAL_CODE,
                            MATERIAL_DESC: grnItems[i].MATERIAL_DESC, UNIT_PRICE: grnItems[i].UNIT_PRICE, UPDATED_PRICE: null,
                            MATERIAL_STOCK: grnItems[i].ACCEPTED_QUANTITY, HSN_CODE: grnItems[i].HSN_CODE,
                            UNIT_OF_MEASURE:grnItems[i].UNIT_OF_MEASURE,
                            CGST_PERC:grnItems[i].CGST_PERC, SGST_PERC:grnItems[i].SGST_PERC, IGST_PERC:grnItems[i].IGST_PERC,
                            UPDATED_DATE: null, STATUS: 3
                        })
                    }
                }

                var sp = await dbconn.loadProcedurePromisified(hdbext, null, 'GRN_ACCEPTANCE');
                var output = await dbconn.callProcedurePromisified(sp, [action, appType, grnItems[0].INVOICE_NO, grnHeader, grnItems, grnEvent]);
                var Result = output.outputScalar;

                Result = {
                    OUT_SUCCESS: output.outputScalar.OUT_SUCCESS
                }
                return Result;
            }
        }
        catch (error) {
            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;

            let Result ={
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE: error.message ? error.message : error

            }

            lib_common.postErrorLog(Result, ErrInvoiceNo, ErrLogsUserId, ErrLogsUserRole, ErrLogsAppName, sType, dbconn, hdbext);
            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }
    });

    this.on('updateGrnPrice', async (req) => {
        try {
            var {
                action,
                appType,
                updPriceDetails
            } = req.data;

            var ErrMaterialCode = updPriceDetails[0].MATERIAL_CODE;
            var ErrLogsUserId = Event.USER_ID;
            var ErrLogsUserRole = Event.USER_ROLE;
            var ErrLogsAppName = "UPDATE STOCK_PRICE";

            var curTime = await SELECT`CURRENT_TIMESTAMP`.from`DUMMY`;
            var currentTime = curTime[0].CURRENT_TIMESTAMP;

            for(var i=0; i<updPriceDetails.length; i++){

                await UPDATE`DEALER_PORTAL_GRN_STOCK`.set`UPDATED_PRICE=${updPriceDetails[i].UPDATED_PRICE}`.set`UPDATED_DATE=${currentTime}`.set`STATUS=${4}`.where`MATERIAL_GROUP=${updPriceDetails[i].MATERIAL_GROUP} AND MATERIAL_CODE=${updPriceDetails[i].MATERIAL_CODE} AND DISTRIBUTOR_ID=${updPriceDetails[i].DISTRIBUTOR_ID}`;
            }
            return "Material price updated successfully";   
        }      
        catch (error) {
            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;

            let Result ={
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE: error.message ? error.message : error
            }
            lib_common.postErrorLog(Result, ErrMaterialCode, ErrLogsUserId, ErrLogsUserRole, ErrLogsAppName, sType, dbconn, hdbext);
            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }
    });
}) 