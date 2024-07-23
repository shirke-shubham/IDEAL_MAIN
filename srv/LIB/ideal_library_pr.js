const cds = require("@sap/cds");

module.exports = {

getPRPayload:async function(prHeader,prItems,connection){
try{
	var Prheader = {
			"SoNumber" : prHeader[0].PR_NO,
			"CustomerCode" : prHeader[0].DISTRIBUTOR_ID,
			"CustomerName" : "",
			"Status" : prHeader[0].PR_STATUS,
			"SoCreation" : null,
			"ShipTo" : prHeader[0].DISTRIBUTOR_ID,
			"BuCode" : "",
			"OrderType" : prHeader[0].ORDER_TYPE,
			"PaymentMethod" : prHeader[0].PAYMENT_METHOD,
			"RegionCode" : prHeader[0].REGION_CODE,
			"LastUpdate" : null,
			"BillTo" : prHeader[0].BILL_TO,
			"OrderNo" : "1",
			"NavHeaderToItem": []
	}

	var vPrItems = [];
	for(var i =0;i<prItems.length;i++)
	{
	var PrItems = {
		"SoNumber" : prItems[i].PR_NO,
		"SoItem" : prItems[i].PR_ITEM_NO.toString(),
		"OrderNo" : "0",
		"HsnCode" : prItems[i].HSN_CODE,
		"MatCode" : prItems[i].MATERIAL_CODE,
		"ShippingMode" : "",
		"Quantity" :  prItems[i].QUANTITY+".00",
		"ApprovedQty" : prItems[i].QUANTITY+".00",
		"FocQty" : prItems[i].FREE_QUANTITY,
		"Rate" : prItems[i].BASE_PRICE,
		"TaxPercent" : "0.00",
		"Cgst" : prItems[i].CGST_PERC,
		"Sgst" : prItems[i].SGST_PERC,
		"Igst" : prItems[i].IGST_PERC,
		"InitDiscount" : prItems[i].DISC_PERC,
		"TaxAmount" : prItems[i].TAXES_AMOUNT,
		"TotalAmount" : prItems[i].TOTAL_AMOUNT,
		"ProductHierarchy" : "",
		"Uom" : "",
		"Subdivision" : "",
		"MaterialGroup" : ""
	}
	Prheader.NavHeaderToItem.push(PrItems);
}
	var SOHeader = {};
	SOHeader = Prheader;
	// payload.SOItem = vPrItems;

	return SOHeader;
}
catch(error)
{
	return error.message;
}
},

PostToPR:async function(oSapPayload,conn) {
	try{
	var dataobj = oSapPayload;
	var oResponseObj = null;
	var resultData = {
		oResponse: "",
		iStatusCode: 0
	};
		if (dataobj !== undefined || dataobj !== "" || dataobj !== null) {
			var iDealDistConnection = await cds.connect.to('ZIBS_SALES_ORDER_CREATION_SRV');
			var sResponse = await iDealDistConnection.send({
			  method: 'POST',
			  path: "/SOHeaderSet",
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
	return oResponseObj;
}catch(error){throw error;}
 }
}