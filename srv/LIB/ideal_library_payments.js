const cds = require("@sap/cds");

module.exports = {

getPAYPayload:async function(prHeader,prItems,connection){
try{
	var utrno;
	var utrAmt;
	if(prHeader[0].OFFLINE_FP_UTR || prHeader[0].OFFLINE_FP_UTR && prHeader[0].OFFLINE_FP_AMOUNT || prHeader[0].OFFLINE_FP_AMOUNT)
	{
		utrno = prHeader[0].OFFLINE_FP_UTR.toString();
		utrAmt = prHeader[0].OFFLINE_FP_AMOUNT.toString();
	}
	if(prHeader[0].OFFLINE_PP_UTR || prHeader[0].OFFLINE_PP_UTR && prHeader[0].OFFLINE_PP_UTR_AMT || prHeader[0].OFFLINE_PP_UTR_AMT){
		utrno = prHeader[0].OFFLINE_PP_UTR.toString();
		utrAmt = prHeader[0].OFFLINE_PP_UTR_AMT.toString();
	}
	if(prHeader[0].PAY_NOW_UTR || prHeader[0].PAY_NOW_UTR && prHeader[0].PAY_NOW_AMT || prHeader[0].PAY_NOW_AMT){
		utrno = prHeader[0].PAY_NOW_UTR.toString();
		utrAmt = prHeader[0].PAY_NOW_AMT.toString();
	}
	var Payments = {
        "Kunnr" :prHeader[0].DISTRIBUTOR_ID.toString(),
        "Vbeln" :prHeader[0].PR_SAP_NO.toString(),//sales order no pr header
        "Belnr" :"", //resp
        "Payamt" : utrAmt || "",//amount
        "Utrno" :utrno
	}

	var SORELEASE = {
		"Vbeln" : prHeader[0].PR_SAP_NO.toString()
	}

	return {Payments,SORELEASE};
}
catch(error)
{
	return error.message;
}
},

PostToPAY:async function(PAYMENTS,SORELEASE,conn) {
	try{
	var dataobj = PAYMENTS;
    var dataobj2 = SORELEASE;
	var oResponseObj = null;
	var oResponseObj2 = null;
	var resultData = {
		oResponse: "",
		iStatusCode: 0
	};
		if (dataobj !== undefined || dataobj !== "" || dataobj !== null) {
			var iDealDistConnection = await cds.connect.to('ZIBS_DMS_PAYMENT_SRV');
			var sResponse = await iDealDistConnection.send({
			  method: 'POST',
			  path: "/PaymentSet",
			  data:dataobj,
			  headers: { 'Content-Type': 'application/json',
						  "accept": "application/json",
						  "X-Requested-With": "XMLHttpRequest"}
			})
			oResponseObj = sResponse 
			var iStatus = 200;
			// if (oResponseObj && oResponseObj.value) {
			// 	return oResponseObj;
			// }
		} 
        else {
			resultData.oResponse = "Invalid Posting Object";
			resultData.iStatusCode = 400;
		}

        if (dataobj2 !== undefined || dataobj2 !== "" || dataobj2 !== null) {
			var iDealDistConnection = await cds.connect.to('ZIBS_DMS_PAYMENT_SRV');
			var sResponse = await iDealDistConnection.send({
			  method: 'POST',
			  path: "/SORELEASESet",
			  data:dataobj2,
			  headers: { 'Content-Type': 'application/json',
						  "accept": "application/json",
						  "X-Requested-With": "XMLHttpRequest"}
			})
			oResponseObj2 = sResponse 
			var iStatus = 200;
		} 
        else {
			resultData.oResponse = "Invalid Posting Object";
			resultData.iStatusCode = 400;
		}
	return {oResponseObj,oResponseObj2};
}catch(error){throw error;}
 }
}