const cds = require("@sap/cds")
// const lv_handler = require("./LIB/HANDLER");
// const lib = require('./LIB/CONTRACT_LIB')
const dbClass = require("sap-hdbext-promisfied");
const hdbext = require("@sap/hdbext");
module.exports = cds.service.impl(function(){

    this.on('dispatchCreation', async (req) => {
        try {
            var client = await dbClass.createConnectionFromEnv();
            var dbconn = new dbClass(client);

            var {
                deliveryheader,
                deliveryItem,
                invoiceHeader,
                invoiceItem
            } = req.data
            var distributorId = deliveryheader[0].DISTRIBUTOR_ID;
            var retailerId = deliveryheader[0].RETAILER_ID;
            var soNo = deliveryheader[0].SO_NO;

            var deliveryItemarray = deliveryItem;
            var InvoiceItemarray = invoiceItem;

            
            for(var i=0; i<deliveryItemarray.length;i++){
                deliveryItemarray[i].DELIVERY_ITEM_NO = i+1;
                InvoiceItemarray[i].INVOICE_ITEM_NO = i+1;

                var existDispatchedQuantity = await SELECT `DISPATCH_QUANTITY` .from`DEALER_PORTAL_RETAILER_REGISTRATION_RETAILER_SO_ITEMS` .where
                `MATERIAL_GROUP=${deliveryItemarray[i].MATERIAL_GROUP} AND MATERIAL_CODE=${deliveryItemarray[i].MATERIAL_CODE} AND SO_NO =${soNo}`

                var dispatchedquantity = existDispatchedQuantity[0].DISPATCH_QUANTITY + deliveryItemarray[i].DELIVERY_QUANTITY ;

                

                await UPDATE `DEALER_PORTAL_RETAILER_REGISTRATION_RETAILER_SO_ITEMS` .set`DISPATCH_QUANTITY = ${dispatchedquantity}` .where
                `MATERIAL_GROUP=${deliveryItemarray[i].MATERIAL_GROUP} AND MATERIAL_CODE=${deliveryItemarray[i].MATERIAL_CODE} AND SO_NO =${soNo}` 

            }
            var count =0;
            var soItems = await SELECT .from `DEALER_PORTAL_RETAILER_REGISTRATION_RETAILER_SO_ITEMS` .where `SO_NO =${soNo}`;
            for(var i=0; i<soItems.length;i++){
                if(soItems[i].QUANTITY === soItems[i].DISPATCH_QUANTITY)
                {
                    count++;

                }
            }
            if(soItems.length === count)
            {
                await UPDATE `DEALER_PORTAL_RETAILER_REGISTRATION_RETAILER_SO_HEADER` .set `STATUS=2` .where `SO_NO =${soNo}`;
            }
            else {
                await UPDATE `DEALER_PORTAL_RETAILER_REGISTRATION_RETAILER_SO_HEADER` .set `STATUS=3` .where `SO_NO =${soNo}`;
            }

            
            
            const sp = await dbconn.loadProcedurePromisified(hdbext, null, 'DISPATCH_ORDER');
            const output = await dbconn.callProcedurePromisified(sp, [distributorId,retailerId,soNo, deliveryheader,deliveryItem,invoiceHeader,invoiceItem]);
            if (output.outputScalar.OUT_SUCCESS !== null) {
                sResponse = output.outputScalar.OUT_SUCCESS;
                return sResponse;
            }
            
        } catch (error) {
            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;

            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }
    });
    
    
})
