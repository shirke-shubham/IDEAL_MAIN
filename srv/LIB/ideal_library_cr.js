const cds = require("@sap/cds");

module.exports = {

getCRPayload:async function(crHeader,crItems,crAttachments,connection){
try{
	var payload = {
            "CrNo": crHeader[0].CR_NO.toString(),
            "DistributorId": crHeader[0].DISTRIBUTOR_ID,
            "SapCreditNote": crHeader[0].SAP_CREDIT_NOTE,
            "CLMHEADERTOITEM": []
            // "ATTACHMENTS": crAttachments
    }
	 
	for(var i =0;i<crItems.length;i++) 
	{
	var CrItems = {
	"CrNo" : crItems[i].CR_NO,
    "ItemNo" : crItems[i].ITEM_NO.toString(),
    "ItemCode" : crItems[i].ITEM_CODE,
    "InvoiceNo" : crItems[i].INVOICE_NO,
    // "InvoiceDate" : "",
    "ReqRate" : crItems[i].REQUESTED_RATE.toString(),
    "ReqQuantity" : crItems[i].REQUESTED_QUANTITY+.00.toString(),
    "ReqAmount" : crItems[i].REQUESTED_AMOUNT.toString()
	}
	payload.CLMHEADERTOITEM.push(CrItems);
}
	return payload;
}
catch(error)
{
	return error.message;
}
},

PostToCR:async function(oSapPayload,conn) {
	try{
	var dataobj = oSapPayload;
	var oResponseObj = null;
	var resultData = {
		oResponse: "",
		iStatusCode: 0
	};
		if (dataobj !== undefined || dataobj !== "" || dataobj !== null) {
			var iDealDistConnection = await cds.connect.to('ZIBS_DMS_CLAIM_SRV');
			var sResponse = await iDealDistConnection.send({
			  method: 'POST',
			  path: "/CLMHEADERSet",
			  data:dataobj,
			  headers: { 'Content-Type': 'application/json',
						  "accept": "application/json",
						  "X-Requested-With": "XMLHttpRequest"}
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
	return oResponseObj;``
}catch(error){throw error;}
 }

}