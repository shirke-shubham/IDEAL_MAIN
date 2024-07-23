const cds = require("@sap/cds");

module.exports = {

    getRgaPayload: async function (rgHeader, rgItems, rgEvent, connection) {
        try {

            var payload = {
                "RgaNo": rgHeader[0].RGA_NO,
                "DistributorId": rgHeader[0].DISTRIBUTOR_ID,
                
                "Reason": rgHeader[0].DISTRIBUTOR_REASON,
                "SalesOrder": "",
                "RGAHEADTOITEM": []
            } 

            for (var i = 0; i < rgItems.length; i++) {    
                var RgItems = {
                    "RgaNo": rgItems[i].RGA_NO, 
                    "RgaItemNo": rgItems[i].ITEM_NO,   
                    "Matnr": rgItems[i].ITEM_CODE,  
                    "Batch": rgItems[i].BATCH,     
                    "Quantity":rgItems[0].ACCEPTED_QUANTITY+".00",  
                    "Price": rgItems[i].PRICE+"0",
                    "RetQuantity": rgItems[i].RETURN_QUANTITY+".00",  
                    "Vbeln": "",
                    "Division": "",
                    "Subdivision": ""                  
                }  
                payload.RGAHEADTOITEM.push(RgItems); 
            }
            return payload;
        }
        catch (error) {
            return error.message;
        }
    },

        PostRgaPayload: async function (oSapPayload, conn) {
        try {
            var dataobj = oSapPayload;
            var oResponseObj = null;
            var resultData = {
                oResponse: "",
                iStatusCode: 0    
            };
            if (dataobj !== undefined || dataobj !== "" || dataobj !== null) {
                var iDealDistConnection = await cds.connect.to('ZIBS_DMS_RGA_SRV');
                var sResponse = await iDealDistConnection.send({
                    method: 'POST',
                    path: "/RGAHEADERSet",
                    data: dataobj, 
                    headers: {
                        'Content-Type': 'application/json',  
                        "accept": "application/json",
                        "X-Requested-With": "XMLHttpRequest"
                    }    
                })
                oResponseObj = sResponse
                var iStatus = 200;
                if (oResponseObj && oResponseObj.value) {
                    return oResponseObj;
                }
            }
            else {
                resultData.oResponse = "Invalid Posting Object";
                resultData.iStatusCode = 400;
            }
            return oResponseObj; ``
        } catch (error) {
            throw error;
        }
    }
}


