const cds = require("@sap/cds");
const lib_email = require("./ideal_library_email");
const { Connection } = require("@sap/hana-client");

// App paths from portal
const sLink_Request_Report = "site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_request_fiori_report-display?sap-ui-app-id-hint=saas_approuter_com.ibspl.ideal.idealrequestfiorireport&/RequestInfo";
const sLink_Registraion_Approval = "site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_registration_approval-display?&/Detail/";
const sLink_Request_Approval = "site/iven#iven_request_approval-display&/RouteMaster/";

module.exports = {

	getLongDate: function (dateValue) {
		// var sLongDate = "";
		var daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		var day = daysInWeek[dateValue.getDay()].substring(0, 3);
		var month = months[dateValue.getMonth()].substring(0, 3);
		var date = dateValue.getDate();
		var year = dateValue.getFullYear();

		return month + " " + date + ", " + year; //September 17, 2016
	},
	
	//by vaishali 
	getRetailerEmailContent: async function(connection,sAction, sAppType, oEmailData, iStatus){
		var mailid, Emailbody, Emailbody1, subject, msg;

		var oEmailContent = {
			"subject": null,
			"emailBody": null
		};

		var sDetails = await lib_email.getSubaccountDetais(connection);
		if (sDetails === null) {
			throw "Subaccount & Portal details missing for email"
		}

		var aEmailIds =await lib_email.getEmailContactId(connection); 
		if (aEmailIds === null) {
			throw "Contact email id is missing in master"
		}
		var sClientContactEmail = aEmailIds.CONTACT_ID_1;

		var sClientName = aEmailIds.CLIENT_FULL_NAME;
		var sClientShortName = aEmailIds.CLIENT_SHORT_NAME;

		var sLink_Portal_GuestAccess = sDetails.PORTAL_LINK ;
		var sLink_Portal_LoginAccess = sDetails.PORTAL_LINK ;

		var sLink_Registation_Form =  sLink_Portal_GuestAccess + "site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_registration_form-display?sap-ui-app-id-hint=saas_approuter_com.ibspl.ideal.idealregistrationform&/Login";
		
		var greetingsTo;
		var linkcontent;
		var sRows = "";
		
		if(sAppType === "RETAILER_REQUEST"){

			if (sAction === "CREATE") {

				Emailbody = "Dear Distributor," + "<br><br>";
				var link =sLink_Portal_LoginAccess;

				oEmailContent.emailBody = oEmailData.RetailerReqNo + "<br>" + "<br>" +
				"Please click " + "<a href=" +  link + ">" + "here" + "</a>" + " to login to " + sClientShortName + " Portal and verify." +
				"<br>" + "<br>" +
				"If you have any questions, please feel free to contact us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +
				"</a>" + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";
				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody + oEmailContent.emailBody + "</p>";
				oEmailContent.subject = "Retailer notification";
			}
			else if(sAction === "CREATECSV"){
				Emailbody = "Dear Distributor," + "<br><br>";
				var link =sLink_Portal_LoginAccess;

				oEmailContent.emailBody = oEmailData.RetailerReqNo + ",Please find below the newly registered retailer"
				"<br>" + "<br>" ;

				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody + oEmailContent.emailBody + "</p>";
				oEmailContent.subject = "Retailer registration notification";

				oEmailContent.emailBody += "<br><TABLE width='650px' style='text-align: center;border-collapse: collapse;border:2px solid black;'>";
			sRows += "<thead>" +
				"<TR style='border:1px solid black;'>" +
				"<TH style='border:1px solid black;'>Retailer ID</TH>" +
				"<TH style='border:1px solid black;'>Retailer Name</TH>" +
				"<TH style='border:1px solid black;'>Retailer Type</TH>" +
				// "<TH style='border:1px solid black;'>New Value</TH>" +
				"</TR>";

			sRows += "</thead><tbody>";

			for (var i = 0; i < oEmailData.details.length; i++) {
				var srno=i+1;
				sRows += "<TR style='border:1px solid black;'>";
				// sRows += "<TD style='border:1px solid black;'>" + srno + "</TD>";
				sRows += "<TD style='border:1px solid black;'>" + oEmailData.details[i].RETAILER_ID + "</TD>";
				sRows += "<TD style='border:1px solid black;'>" + oEmailData.details[i].RETAILER_NAME + "</TD>";
				sRows += "<TD style='border:1px solid black;'>" + oEmailData.retailertype[i] + "</TD>";
				sRows += "</TR>";
			}
			sRows += "</tbody>";

			oEmailContent.emailBody += sRows;
 
			oEmailContent.emailBody += "</TABLE class='table100-head'><br><br> " +
			"Please click " + "<a href=" +  link + ">" + "here" + "</a>" + " to login to " + sClientShortName + " Portal and verify." +
			"<br>" + "<br>" +
			"If you have any questions, please feel free to contact us via email at <a href=" + sClientContactEmail + ">" +
			sClientContactEmail +
			"</a>" + "<br>" +
			"<br>" +
			"Regards," + "<br>" +
			"Distributor Management Team" +
			"<br><br>";
			}

		}
		return oEmailContent;
	},



	getEmailContent: async function (connection,sAction, sAppType, oEmailData, iStatus) {

		var mailid, Emailbody, Emailbody1, subject, msg;

		var oEmailContent = {
			"subject": null,
			"emailBody": null
		};

		var sDetails = await lib_email.getSubaccountDetais(connection);
		if (sDetails === null) {
			throw "Subaccount & Portal details missing for email"
		}

		var aEmailIds =await lib_email.getEmailContactId(connection); 
		if (aEmailIds === null) {
			throw "Contact email id is missing in master"
		}
		var sClientContactEmail = aEmailIds.CONTACT_ID_1;

		var sClientName = aEmailIds.CLIENT_FULL_NAME;
		var sClientShortName = aEmailIds.CLIENT_SHORT_NAME;

		var sLink_Portal_GuestAccess = sDetails.PORTAL_LINK ;
		var sLink_Portal_LoginAccess = sDetails.PORTAL_LINK ;

		var sLink_Registation_Form =  sLink_Portal_GuestAccess + "site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_registration_form-display?sap-ui-app-id-hint=saas_approuter_com.ibspl.ideal.idealregistrationform&/Login";
		
		var greetingsTo;
		var linkcontent;
		var sRows = "";
		if(sAppType === "PRODUCT_COMPLAINT_REQUEST")
		{
			if (sAction === "CREATE") { 

				Emailbody = "Dear Approver," + "<br><br>";
				var link =sLink_Portal_LoginAccess+"site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#product_complaint_approval-display?sap-ui-app-id-hint=saas_approuter_com.ibspl.ideal.productcomplaintapproval&/DetailPage/"+ parseInt(oEmailData.PprNo, 10);
				oEmailContent.emailBody = "Product complaint request no. " + oEmailData.PprNo +
				" has been created and currently pending for your approval." + "<br>" + "<br>" +
				"Please click " + "<a href=" +  link + ">" + "here" + "</a>" + " to login to " + sClientShortName + " Portal and approve." +
				"<br>" + "<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +
				"</a>" + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";

				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody + oEmailContent.emailBody + "</p>";
				oEmailContent.subject = "Product Complaint Request Created";
			}
			else if(sAction === "APPROVE_PENDING")
			{
				var link =sLink_Portal_LoginAccess+"site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#product_complaint_approval-display?sap-ui-app-id-hint=saas_approuter_com.ibspl.ideal.productcomplaintapproval&/DetailPage/"+ parseInt(oEmailData.PprNo, 10);
				oEmailContent.subject = "Product Complaint Request Approved";
				oEmailContent.emailBody = "Product Complaint Request No " + oEmailData.PprReqNo +
				" has been approved by " +oEmailData.Approve_Role+" "+oEmailData.Approver +" and is currently pending for your approval." + "<br>" + "<br>" +
				"Please click " + "<a href=" +  link + ">" + "here" + "</a>" + " to login to " + sClientShortName + " Portal and approve." +
				"<br>" + "<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +
				"</a>" + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";

				Emailbody = "Dear Approver," + "<br><br>";
				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
				oEmailContent.emailBody + "</p>";
			}
			else if(sAction === "APPROVE")
			{
				oEmailContent.subject = "Product Complaint Request Approved";
				oEmailContent.emailBody = "Product Complaint Request No " + oEmailData.PprReqNo + 
				" has been approved by " +oEmailData.Approve_Role+" "+oEmailData.Approver  + "<br>" + "<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +
				"</a>" + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";

				Emailbody = "Dear "+oEmailData.DistName+"," + "<br><br>";
				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
				oEmailContent.emailBody + "</p>";
			}
			else if(sAction === "REJECT")
			{
				Emailbody = "Dear "+oEmailData.DistName+"," + "<br><br>";
				oEmailContent.emailBody = "Product Complaint Request No. " + oEmailData.PprReqNo +
				" has been " + sAction.toLowerCase() + "ed by " +oEmailData.Approve_Role+" "+oEmailData.Approver + "<br>" + "<br>" +
				"Reason for " + sAction.toLowerCase() + "ion. :" + "<br>" +
				oEmailData.RejComm +
				"<br>" +
				"<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +
				"</a>" + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";

				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
				oEmailContent.emailBody + "</p>";
				oEmailContent.subject = "Product Complaint Request " + sAction.toLowerCase() + "ed ";
			}
		}
		// By Shubham
		if(sAppType === "RGA_REQUEST"){

			if (sAction === "CREATE") { 

				Emailbody = "Dear Approver," + "<br><br>";
				var link =sLink_Portal_LoginAccess+"site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_rga_approval-display?sap-ui-app-id-hint=saas_approuter_com.ibspl.ideal.idealrgaapproval&/DetailPage/"+ parseInt(oEmailData.RgaRequestNo, 10);
			
				oEmailContent.emailBody = oEmailData.RgaReqNo +   
				" and currently pending for your approval." + "<br>" + "<br>" +
				"Please click " + "<a href=" +  link + ">" + "here" + "</a>" + " to login to " + sClientShortName + " Portal and approve." +
				"<br>" + "<br>" +
				"If you have any questions, please feel free to contact us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +
				"</a>" + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";
				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody + oEmailContent.emailBody + "</p>";
				oEmailContent.subject = "RGA notification";
			}
			if (sAction === "APPROVE_PENDING") {

				// var link =sLink_Portal_LoginAccess;  
				var link =sLink_Portal_LoginAccess+"site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_rga_approval-display?sap-ui-app-id-hint=saas_approuter_com.ibspl.ideal.idealrgaapproval&/DetailPage/"+ parseInt(oEmailData.RgaReqNo, 10)
   
				oEmailContent.subject = "RGA notification";
				oEmailContent.emailBody = "RGA request no "+ oEmailData.RgaReqNo +
				// " has been approved by " +oEmailData.Approve_Role+" "+oEmailData.Approver +" and is currently pending for your approval." + "<br>" + "<br>" +
				" has been approved by Sales Associate "+oEmailData.Approver +" and is currently pending for your approval." + "<br>" + "<br>" +

				"Please click " + "<a href=" +  link + ">" + "here" + "</a>" + " to login to " + sClientShortName + " Portal and approve." +
				"<br>" + "<br>" +
				"If you have any questions, please feel free to contact us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +
				"</a>" + "<br>" + 
				"<br>" + 
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";

				Emailbody = "Dear Approver," + "<br><br>";
				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
				oEmailContent.emailBody + "</p>";
			}
			else if(sAction === "APPROVE")
			{
				var link =sLink_Portal_LoginAccess;

				oEmailContent.subject = "RGA notification";
				oEmailContent.emailBody = "RGA request no "+ oEmailData.RgaReqNo + 
				" has been approved by " +oEmailData.Approve_Role+" "+oEmailData.Approver + "<br>" + "<br>" +
				"If you have any questions, please feel free to contact us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +
				"</a>" + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";

				Emailbody = "Dear Approver," + "<br><br>";
				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
				oEmailContent.emailBody + "</p>";
			}
			else if(sAction === "REJECT")
			{
				var link =sLink_Portal_LoginAccess;
 
				Emailbody = "Dear Approver," + "<br><br>";  
				oEmailContent.emailBody =	 oEmailData.RgaReqNo +
				" by " +oEmailData.Approve_Role+" "+oEmailData.Approver+ "<br>" + "<br>" +
				"Reason for rejection :" + "<br>" +
				oEmailData.RejComm +
				"<br>" + 
				"<br>" +
				"If you have any questions, please feel free to contact us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +
				"</a>" + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";

				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
				oEmailContent.emailBody + "</p>";
				oEmailContent.subject = "RGA notification";
			}

		}
		if(sAppType === "PAYMENT_REQUEST")
		{
			if (sAction === "CREATE") {

				Emailbody = "Dear Approver," + "<br><br>";
				var link =sLink_Portal_LoginAccess+"site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_payment_approval-display?sap-ui-app-id-hint=saas_approuter_com.ibspl.ideal.idealpaymentapproval&/DetailPage/"+ parseInt(oEmailData.PayReqNo, 10);
				// + "site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_claim_approval-display?sap-ui-app-id-hint=saas_approuter_com.ibspl.ideal.idealclaimapproval&/DetailPage/"+ parseInt(oEmailData.ClaimReqNo, 10);
				oEmailContent.emailBody = "Payment request no. " + oEmailData.PayReqNo +
				" has been created and currently pending for your approval." + "<br>" + "<br>" +
				"Please click " + "<a href=" +  link + ">" + "here" + "</a>" + " to login to " + sClientShortName + " Portal and approve." +
				"<br>" + "<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +
				"</a>" + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";

				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody + oEmailContent.emailBody + "</p>";
				oEmailContent.subject = "Payment Request Created";
			}	
			else if(sAction === "UPDATE"){

				Emailbody = "Dear Approver," + "<br><br>";
				var link =sLink_Portal_LoginAccess+"site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_payment_approval-display?sap-ui-app-id-hint=saas_approuter_com.ibspl.ideal.idealpaymentapproval&/DetailPage/"+ parseInt(oEmailData.PayReqNo, 10);
				// + "site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_claim_approval-display?sap-ui-app-id-hint=saas_approuter_com.ibspl.ideal.idealclaimapproval&/DetailPage/"+ parseInt(oEmailData.ClaimReqNo, 10);
				oEmailContent.emailBody = "Payment request no. " + oEmailData.PayReqNo +
				" has been updated and currently pending for your approval." + "<br>" + "<br>" +
				"Please click " + "<a href=" +  link + ">" + "here" + "</a>" + " to login to " + sClientShortName + " Portal and approve." +
				"<br>" + "<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +
				"</a>" + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";

				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody + oEmailContent.emailBody + "</p>";
				oEmailContent.subject = "Payment Request Updated";

			}
			else if(sAction === "APPROVE_PENDING")
			{
				
				var link =sLink_Portal_LoginAccess+"site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_payment_approval-display?sap-ui-app-id-hint=saas_approuter_com.ibspl.ideal.idealpaymentapproval&/DetailPage/"+ parseInt(oEmailData.PayReqNo, 10);
				// + "site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_claim_approval-display?sap-ui-app-id-hint=saas_approuter_com.ibspl.ideal.idealclaimapproval&/DetailPage/"+ parseInt(oEmailData.ClaimReqNo, 10);

				oEmailContent.subject = "Payment Request Approved";
				oEmailContent.emailBody = "Payment Request No " + oEmailData.PayReqNo +
				" has been approved by " +oEmailData.Approve_Role+" "+oEmailData.Approver +" and is currently pending for your approval." + "<br>" + "<br>" +
				"Please click " + "<a href=" +  link + ">" + "here" + "</a>" + " to login to " + sClientShortName + " Portal and approve." +
				"<br>" + "<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +
				"</a>" + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";

				Emailbody = "Dear Approver," + "<br><br>";
				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
				oEmailContent.emailBody + "</p>";
			}
			else if(sAction === "APPROVE")
			{
				oEmailContent.subject = "Payment Request Approved";
				oEmailContent.emailBody = "Payment Request No " + oEmailData.PayReqNo + 
				" has been approved by " +oEmailData.Approve_Role+" "+oEmailData.Approver  + "<br>" + "<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +
				"</a>" + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";

				Emailbody = "Dear "+oEmailData.DistName+"," + "<br><br>";
				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
				oEmailContent.emailBody + "</p>";
			}
			else if(sAction === "SENDBACK"){

				oEmailContent.subject = "Payment Request SendBack";

				oEmailContent.emailBody = "Dear "+oEmailData.DistName+"," + "<br><br>" +

				"Payment request no. " + oEmailData.PayReqNo + " has been sent back during approval by " + oEmailData.Approve_Role+" "+oEmailData.Approver + ".<br><br>" +

				"Reason:" + "<br>" +
				oEmailData.SendbackComm + "<br>" + 

				"<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at " +
				"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team";

			}
			else if(sAction === "HOLD"){

				oEmailContent.subject = "Payment Request Hold";
				
				oEmailContent.emailBody = "Dear "+oEmailData.DistName+","+ "<br><br>" +

				"Payment request no. " + oEmailData.PayReqNo + " has been kept on hold during approval by " + oEmailData.Approve_Role+" "+oEmailData.Approver + ".<br><br>" +

				"Reason:" + "<br>" +
				oEmailData.HoldComm + "<br>" +

				"<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at " +
				"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team";

			}
		}
		if(sAppType === "CLAIM_REQUEST")
		{
			if (sAction === "CREATE") {

				Emailbody = "Dear Approver," + "<br><br>";
				var link =sLink_Portal_LoginAccess + "site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_claim_approval-display?sap-ui-app-id-hint=saas_approuter_com.ibspl.ideal.idealclaimapproval&/DetailPage/"+ parseInt(oEmailData.ClaimReqNo, 10);
				oEmailContent.emailBody = "Claim Request No. " + oEmailData.ClaimReqNo +
				" has been created and currently pending for your approval." + "<br>" + "<br>" +
				"Please click " + "<a href=" +  link + ">" + "here" + "</a>" + " to login to " + sClientShortName + " Portal and approve." +
				"<br>" + "<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +
				"</a>" + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";

				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody + oEmailContent.emailBody + "</p>";
				oEmailContent.subject = "Claim Request Created";
			}	
			else if(sAction === "APPROVE_PENDING")
			{
				
				var link =sLink_Portal_LoginAccess + "site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_claim_approval-display?sap-ui-app-id-hint=saas_approuter_com.ibspl.ideal.idealclaimapproval&/DetailPage/"+ parseInt(oEmailData.ClaimReqNo, 10);

				oEmailContent.subject = "Claim Request Approved";
				oEmailContent.emailBody = "Claim Request No " + oEmailData.ClaimReqNo +
				" has been approved by " +oEmailData.Approve_Role+" "+oEmailData.Approver +" and is currently pending for your approval." + "<br>" + "<br>" +
				"Please click " + "<a href=" +  link + ">" + "here" + "</a>" + " to login to " + sClientShortName + " Portal and approve." +
				"<br>" + "<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +
				"</a>" + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";

				Emailbody = "Dear Approver," + "<br><br>";
				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
				oEmailContent.emailBody + "</p>";
			}
			else if(sAction === "APPROVE")
			{
				oEmailContent.subject = "Claim Request Approved";
				oEmailContent.emailBody = "Claim Request No " + oEmailData.ClaimReqNo + 
				" has been approved by " +oEmailData.Approve_Role+" "+oEmailData.Approver  + "<br>" + "<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +
				"</a>" + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";

				Emailbody = "Dear "+oEmailData.DistName+"," + "<br><br>";
				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
				oEmailContent.emailBody + "</p>";
			}
			else if(sAction === "REJECT")
			{
				Emailbody = "Dear "+oEmailData.DistName+"," + "<br><br>";
				oEmailContent.emailBody = "Claim Request No. " + oEmailData.ClaimReqNo +
				" has been " + sAction.toLowerCase() + "ed by " +oEmailData.Approve_Role+" "+oEmailData.Approver + "<br>" + "<br>" +
				"Reason for " + sAction.toLowerCase() + "ion. :" + "<br>" +
				oEmailData.RejComm +
				"<br>" +
				"<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +
				"</a>" + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";

				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
				oEmailContent.emailBody + "</p>";
				oEmailContent.subject = "Claim Request " + sAction.toLowerCase() + "ed ";
			}
			else if(sAction === "SENDBACK")
			{
				oEmailContent.subject = "Claim Request SendBack";

				oEmailContent.emailBody = "Dear "+oEmailData.DistName+"," + "<br><br>" +

				"Claim request no. " + oEmailData.ClaimReqNo + " has been sent back during approval by " + oEmailData.Approve_Role+" "+oEmailData.Approver + ".<br><br>" +

				"Reason:" + "<br>" +
				oEmailData.SendbackComm + "<br>" + 

				"<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at " +
				"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team";
			}
		}
		if(sAppType === "PURCHASE_REQUEST")
		{
			if (sAction === "CREATE") {

				Emailbody = "Dear Approver," + "<br><br>";
				var link =sLink_Portal_LoginAccess + "site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_sales_order_approval-display?sap-ui-app-id-hint=saas_approuter_com.ibspl.ideal.idealsalesorderapproval&/DetailPage/"+ parseInt(oEmailData.PurReqNo, 10)+"/1";
				// + "site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_request_approval-display?&/MasterPage/"+ parseInt(oEmailData.ReqNo, 10);
				oEmailContent.emailBody = "Purchase Request No. " + oEmailData.PurReqNo +
				" has been created and is currently pending your approval." + "<br>" + "<br>" +
				"Please click " + "<a href=" +  link + ">" + "here" + "</a>" + " to login to " + sClientShortName + " Portal and approve." +
				"<br>" + "<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +
				"</a>" + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";

				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody + oEmailContent.emailBody + "</p>";
				// 		subject = req + "Request created for supplier " + data[0].SupplierName;
				oEmailContent.subject = "Purchase Request Created";

			}	
			else if(sAction === "APPROVE_PENDING")
			{
				
				var link =sLink_Portal_LoginAccess + "site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_sales_order_approval-display?sap-ui-app-id-hint=saas_approuter_com.ibspl.ideal.idealsalesorderapproval&/DetailPage/"+ parseInt(oEmailData.PurReqNo, 10)+"/1";
				// + "site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_request_approval-display?&/MasterPage/"+ parseInt(oEmailData.ReqNo, 10);
				
				oEmailContent.subject = "Purchase Request Approved";
				oEmailContent.emailBody = "Purchase Request No " + oEmailData.PurReqNo +
				" has been approved by " +oEmailData.Approve_Role+" "+oEmailData.Approver +" and is currently pending for your approval." + "<br>" + "<br>" +
				"Please click " + "<a href=" +  link + ">" + "here" + "</a>" + " to login to " + sClientShortName + " Portal and approve." +
				"<br>" + "<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +
				"</a>" + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";

				Emailbody = "Dear Approver," + "<br><br>";
				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
				oEmailContent.emailBody + "</p>";
			}
			else if(sAction === "APPROVE")
			{
				oEmailContent.subject = "Purchase Request Approved";
				oEmailContent.emailBody = "Purchase Request No " + oEmailData.PurReqNo + 
				" has been approved by " +oEmailData.Approve_Role+" "+oEmailData.Approver  + "<br>" + "<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +
				"</a>" + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";

				Emailbody = "Dear "+oEmailData.DistName+"," + "<br><br>";
				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
				oEmailContent.emailBody + "</p>";
			}
			else if(sAction === "REJECT")
			{
				Emailbody = "Dear "+oEmailData.DistName+"," + "<br><br>";
				oEmailContent.emailBody = "Purchase Request No. " + oEmailData.PurReqNo +
				" has been " + sAction.toLowerCase() + "ed by " +oEmailData.Approve_Role+" "+oEmailData.Approver + "<br>" + "<br>" +
				"Reason for " + sAction.toLowerCase() + "ion. :" + "<br>" +
				oEmailData.RejComm +
				"<br>" +
				"<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +
				"</a>" + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";

				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
				oEmailContent.emailBody + "</p>";
				oEmailContent.subject = "Purchase Request " + sAction.toLowerCase() + "ed ";
			}
			else if(sAction === "CANCEL")
			{
				Emailbody = "Dear "+oEmailData.DistName+"," + "<br><br>";
				oEmailContent.emailBody = "Purchase Request No. " + oEmailData.PurReqNo +
				" has been " + sAction.toLowerCase() + "led" + "<br>" + "<br>" +
				"Reason for " + sAction.toLowerCase() + "lation. :" + "<br>" +
				oEmailData.RejComm +
				"<br>" +
				"<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +
				"</a>" + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";

				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
				oEmailContent.emailBody + "</p>";
				oEmailContent.subject = "Purchase Request " + sAction.toLowerCase() + "led ";
			}

		}
		if (sAppType === "REQUEST") {
			var supEmailContent = {};
			if (sAction === "CREATE") {

				var req_Type = oEmailData.ReqType.toString();
				if (req_Type === "1" || req_Type === "2" || req_Type === "3" || req_Type === "6") {
					var req = "";
				} else {
					var req = " Update ";
				}

				Emailbody = "Dear Approver," + "<br><br>";
				var link =sLink_Portal_LoginAccess + "site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_request_approval-display?&/MasterPage/"+ parseInt(oEmailData.ReqNo, 10);
				oEmailContent.emailBody = req + "Request No. " + oEmailData.ReqNo + " for Distributor " + oEmailData.SupplierName +
					" has been created and is currently pending your approval." + "<br>" + "<br>" +
					"Please click " + "<a href=" +  link + ">" + "here" + "</a>" + " to login to " + sClientShortName + " Portal and approve." +
					"<br>" + "<br>" +
					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
					sClientContactEmail +
					"</a>" + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Distributor Management Team" +
					"<br><br>";

				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody + oEmailContent.emailBody + "</p>";
				// 		subject = req + "Request created for supplier " + data[0].SupplierName;
				oEmailContent.subject = "Distributor request created";

			} else if (sAction === "APPROVE") {

				var req_Type = oEmailData.ReqType.toString();

				if (req_Type === "1" || req_Type === "2" || req_Type === "3" || req_Type === "6") {
					oEmailContent.subject = "Distributor Registration request approved";

					oEmailContent.emailBody = "Request No. " + oEmailData.ReqNo + " for Distributor " + oEmailData.SupplierName +
						" has been approved." + "<br>" + "<br>" +
						"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
						sClientContactEmail +
						"</a>" + "<br>" +
						"<br>" +
						"Regards," + "<br>" +
						"Distributor Management Team" +
						"<br><br>";

				} else {
					oEmailContent.subject = "Distributor update request approved";
					// 			subject = msg + "Invitation to update registration on the " + data[0].ENTITY_DESC + " supplier database";
					oEmailContent.emailBody = "Request No. " + oEmailData.ReqNo + " for Distributor " + oEmailData.SupplierName +
						" has been approved." + "<br>" + "<br>" +
						"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
						sClientContactEmail +
						"</a>" + "<br>" +
						"<br>" +
						"Regards," + "<br>" +
						"Distributor Management Team" +
						"<br><br>";
				}

				Emailbody = "Dear Approver," + "<br><br>";
				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
					oEmailContent.emailBody + "</p>";

			}else if (sAction === "Approve_Pending") {

				var req_Type = oEmailData.ReqType.toString();
				var link =sLink_Portal_LoginAccess + "site?siteId=63f3b36c-14be-4338-b1a1-dbb68f492677#ideal_request_approval-display?&/MasterPage/"+ parseInt(oEmailData.ReqNo, 10);
				if (req_Type === "1" || req_Type === "2" || req_Type === "3" || req_Type === "6") {
					oEmailContent.subject = "Distributor Request Approved";

					oEmailContent.emailBody = "Request No. " + oEmailData.ReqNo + " for Distributor " + oEmailData.SupplierName +
						" has been approved by " +oEmailData.Approve_Role+" "+oEmailData.Approver +" and is currently pending for your approval." + "<br>" + "<br>" +
						"Please click " + "<a href=" +  link + ">" + "here" + "</a>" + " to login to " + sClientShortName + " Portal and approve." +
						"<br>" + "<br>" +
						"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
						sClientContactEmail +
						"</a>" + "<br>" +
						"<br>" +
						"Regards," + "<br>" +
						"Distributor Management Team" +
						"<br><br>";

				} else {
					oEmailContent.subject = "Distributor Request Approved";
					// 			subject = msg + "Invitation to update registration on the " + data[0].ENTITY_DESC + " supplier database";
					oEmailContent.emailBody = "Request No. " + oEmailData.ReqNo + " for Distributor " + oEmailData.SupplierName +
						" has been approved and is currently pending for your approval." + "<br>" + "<br>" +
						"Please click " + "<a href=" +  link + ">" + "here" + "</a>" + " to login to " + sClientShortName + " Portal and approve." +
						"<br>" + "<br>" +
						"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
						sClientContactEmail +
						"</a>" + "<br>" +
						"<br>" +
						"Regards," + "<br>" +
						"Distributor Management Team" +
						"<br><br>";
				}

				Emailbody = "Dear Approver," + "<br><br>";
				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
					oEmailContent.emailBody + "</p>";

			} else if (sAction === "REJECT" || sAction === "DELETE") {
				if(sAction === "DELETE") sAction = "DELET"
				var emailStartForUpdate, req;
				var req_Type = oEmailData.ReqType;
				if (req_Type === 1 || req_Type === 2 || req_Type === 3 || req_Type === 6) {
					req = "";
					emailStartForUpdate = "";
				} else {
					req = "update ";
					emailStartForUpdate = 'Your company details ';
				}
				

				Emailbody = "Dear Approver," + "<br><br>";
				oEmailContent.emailBody = emailStartForUpdate + req + "Request No. " + oEmailData.ReqNo + " for Distributor " + oEmailData.SupplierName +
					" has been " + sAction.toLowerCase() + "ed." + "<br>" + "<br>" +
					"Reason for " + sAction.toLowerCase() + "ion. :" + "<br>" +
					oEmailData.RejComm +
					"<br>" +
					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
					sClientContactEmail +
					"</a>" + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Distributor Management Team" +
					"<br><br>";

				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
					oEmailContent.emailBody + "</p>";
				// 		subject = req + "Request rejected for supplier " + data[0].SupplierName;
				oEmailContent.subject = "Distributor " + req + "request " + sAction.toLowerCase() + "ed ";
			} 

			else if(sAction ==="UPDATE"){
				var req_Type = oEmailData.ReqType.toString();
				if (req_Type === "1" || req_Type === "2" || req_Type === "3" || req_Type === "6") {
					var req = "";
				} else {
					var req = " Update ";
				}   
				Emailbody = "Dear Distributor," + "<br><br>";
				// var link = "Vendor_Request_Approval-Approve&/VendorInviteList/" + parseInt(oEmailData.ReqNo, 10);
				var link =sLink_Portal_LoginAccess + "site?siteId=dfe9a08b-9dd0-4282-b092-59cf8a8da401#iven_request_approval-display?&/RouteMaster/"+ parseInt(oEmailData.ReqNo, 10);
				oEmailContent.emailBody = req + "Request No. " + oEmailData.ReqNo + " for Distributor " + oEmailData.SupplierName +
				" has been created." + "<br>" + "<br>" +
				"<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail +    
				"</a>" + "<br>" +    
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team" +
				"<br><br>";          

				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody + oEmailContent.emailBody + "</p>";
				// 		subject = req + "Request created for supplier " + data[0].SupplierName;
				oEmailContent.subject = "Distributor Request Created";   
			} 

			
			else if (sAction === "INVITE" || sAction === "RE_INVITE") {

				if (sAction === "RE_INVITE") {
					msg = "Re-";
				} else {
					msg = "";
				}

				var req_Type = oEmailData.ReqType.toString();

				if (req_Type === "1" || req_Type === "2" || req_Type === "3" || req_Type === "6") {
					// let link = sLink_Portal_GuestAccess + "d6c42621-0dc7-4a69-a65c-3ee082ca5470.comibsplivenivenregistrationform.comibsplivenivenregistrationform-0.0.1/index.html#/Routehome";
					oEmailContent.subject = msg + "Invitation to register on Dealer Portal";

					var emailBody = "Upon successful approval, you may receive future invitations to participate in procurement processes conducted by " +
					oEmailData.EntityDesc + "." + "<br>" + "<br>" +
					"Please note that your approved registration does not guarantee automatic invitation to all procurement processes. " + oEmailData.EntityDesc +
					" retains the right to select participants at its own discretion.";

					oEmailContent.emailBody = "We kindly " + msg + " invite your company " + oEmailData.SupplierName + ", to register as a Distributor with " +
						oEmailData.EntityDesc +
						"." +
						"<br>" + "<br>" +
						"To engage in any business activities with " + oEmailData.EntityDesc +
						", it is mandatory for you to complete the registration form provided in " +
						"<a href=" + sLink_Registation_Form + ">" + "the link" + "</a>" + "<br>" +
						// ">https://edgevendorregistrationform-ww4hph2jbz.dispatcher.ae1.hana.ondemand.com/index.html</a>" + "<br>" +
						"<br>" +
						"Once you submit your registration, our dedicated teams will thoroughly review and approve your request. Additional information may be requested during this process." +
						"<br>" + "<br>" +
						// "Once approved, you may be invited to future procurement processes by " + data[0].ENTITY_DESC +
						// ". Your approved registration does not entitle you to be invited to any/all procurement processes. " + data[0].ENTITY_DESC +
						// " reserve the right to select the participants based on their discretion." 
						emailBody + "<br>" + "<br>" +
						"If you have any inquiries, please feel free to contact us via email at <a href=" + sClientContactEmail + ">" + sClientContactEmail +
						"</a>" + "<br>" + "<br>" +
						"Best Regards," + "<br>" +
						"Distributor Management Team" +
						"<br><br>";

				} else {

					oEmailContent.subject = msg + "Invitation to update your company details on  " + oEmailData.EntityDesc + " Dealer Portal";

					var emailBody = "Once approved, you may be invited to future procurement processes by " + oEmailData.EntityDesc +
						". Your approved registration does not entitle you to be invited to any/all procurement processes. " + oEmailData.EntityDesc +
						" reserve the right to select the participants based on their discretion.";

					oEmailContent.emailBody = "Your company, " + oEmailData.SupplierName + " is " + msg + "invited to update registration with " + oEmailData.EntityDesc +
						" as a Distributor." + "<br>" + "<br>" +
						"In order to perform any business with us, you need to complete this registration in full " +
						"using the link " +
						"<a href=" + sLink_Registation_Form + ">" + "here" + "</a>" + "<br>" +
						"<br>" +
						"Upon submission, your registration request will be reviewed by the relevant teams. We may seek additional information as part of this process." +
						"<br>" + "<br>" +
						// "Once approved, you may be invited to future procurement processes by " + data[0].ENTITY_DESC +
						// ". Your approved registration does not entitle you to be invited to any/all procurement processes. " + data[0].ENTITY_DESC +
						// " reserve the right to select the participants based on their discretion." 
						"<u>" + emailBody + "</u><br>" + "<br>" +
						"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
						sClientContactEmail +
						"</a>" + "<br>" + "<br>" +
						"Regards," + "<br>" +
						"Distributor Management Team" +
						"<br><br>";
				}

				Emailbody = "Dear Distributor," + "<br><br>";
				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
					oEmailContent.emailBody + "</p>";
			}
		} else if (sAppType === "REGISTER") {
			if (sAction === "CREATE" || sAction === "APPROVE" || sAction === "RESEND" || sAction === "INTERNALREQ" || sAction === "QUICK_REG") {
				greetingsTo = 'Dear Approver,'
				linkcontent = "Please click " + "<a href=" + sLink_Portal_LoginAccess + sLink_Registraion_Approval + parseInt(oEmailData.ReqNo, 10) +
					">here</a>" + " to login to " + sClientShortName + " Portal and approve."
				var sActionTypeText = "";
				var RoleName = "";
				var sProcessTypeText = "registration form ";
				if (sAction === "CREATE") {
					sActionTypeText = "submitted";
					RoleName = "";

				} else if (sAction === "APPROVE") {
					sActionTypeText = "approved ";
					RoleName = " by " +oEmailData.Approve_Role+" "+oEmailData.Approver;
					// greetingsTo = 'Dear User,'
					// linkcontent ='You can check the details for the request on the TII portal using this '+"<a href=" + sLink_Portal_LoginAccess+ ">link</a>"
					// sActionTypeText = "approved at L" + oEmailData.Approver_Level;
				} else if (sAction === "RESEND") {
					greetingsTo = 'Dear Approver,'
					linkcontent = "Please click " + "<a href=" + sLink_Portal_LoginAccess + sLink_Registraion_Approval + parseInt(oEmailData.ReqNo, 10) +
						">here</a>" + " to login to " + sClientShortName + " Portal and approve."
					sActionTypeText = "re-submitted";
				} else if (sAction === "INTERNALREQ") {
					sActionTypeText = "submitted as Internal Request";
				} else if (sAction === "QUICK_REG") {
					sActionTypeText = "initiated";
					sProcessTypeText = "registration ";
				}

				var sRequestTypeText = "";
				if (oEmailData.ReqType === 5) {
					sRequestTypeText = "profile update ";
					sProcessTypeText = '';
					sActionTypeText = 'created';
					greetingsTo = 'Dear Approver,'
					linkcontent = "Please click " + "<a href=" + sLink_Portal_LoginAccess + sLink_Registraion_Approval + parseInt(oEmailData.ReqNo, 10) +
						">here</a>"
				} else if (sAction === "QUICK_REG") {
					sRequestTypeText = "Quick ";
				}
				// oEmailContent.subject = "Supplier " + oEmailData.SupplierName + sRequestTypeText + sProcessTypeText + sActionTypeText + "."; 
					oEmailContent.subject = "Distributor " + sRequestTypeText + sProcessTypeText + sActionTypeText;

					oEmailContent.emailBody = greetingsTo + "<br><br>" +
					"Request No. " + oEmailData.ReqNo + " for " + sRequestTypeText + "Distributor Registration of <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName + "</span>";

					oEmailContent.emailBody += " has been " + sActionTypeText + RoleName +" and is currently pending your approval.<br>" + "<br>" +
					linkcontent +
					"<br>" + "<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at " +
					"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Distributor Management Team";

			}
			if (sAction === "SELFREG") {

				var sActionTypeText = "";
				if (iStatus === 5) {
					sActionTypeText = "submitted";
				} else if (iStatus === 9) {
					sActionTypeText = "re-submitted";
				}

				var sRequestTypeText = "";
				if (oEmailData.ReqType === 5) {
					sRequestTypeText = "updated ";
				}

				oEmailContent.subject = "Distributor " + sRequestTypeText + "self registration form " + sActionTypeText + " for " + oEmailData.SupplierName;

				oEmailContent.emailBody = "Dear Distributor," + "<br><br>" +
					"Request No. " + oEmailData.ReqNo + " for " + sRequestTypeText +
					"Distributor self Registration as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName + "</span>";

				oEmailContent.emailBody += " has been " + sActionTypeText + " and is currently pending for approval.<br>" + "<br>" +
					// 			oEmailContent.emailBody += " has been " + sActionTypeText + " and is currently pending for buyer assignment.<br>" + "<br>" +

					"Please login to the following " + sClientShortName + " portal link to approve, using the link " +
					"<a href=" + sLink_Portal_LoginAccess + sLink_Registraion_Approval + parseInt(oEmailData.ReqNo, 10) + ">here</a>" + "<br>" +

					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at " +
					"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Distributor Management Team";

			} else if (sAction === "REJECT") {
				var sRequestTypeText = "";
				var req = '';
				var sSupplierName = " for Distributor " + sRequestTypeText + " Registration as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName +
					"</span> has been rejected.<br>" + "<br>"
				if (oEmailData.ReqType === 5) {
					sRequestTypeText = "updated ";
					req = 'Update';
					sSupplierName = " for <span style=\"text-transform:uppercase\">" +
						oEmailData.SupplierName +
						"</span> has been rejected.<br>" + "<br>"
				}

				oEmailContent.subject = "Distributor " + sRequestTypeText + "Registration form rejected";

				oEmailContent.emailBody = "Dear Distributor," + "<br><br>" +

				req + "Request No. " + oEmailData.ReqNo + sSupplierName +

				"Reason for rejection:" + "<br>" +
				oEmailData.Reason + "<br>" +

				"<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at " +
				"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team";

			} else if (sAction === "SENDBACK") {

				var sRequestTypeText = "";
				var req = '';
				var sPortal_Link = sLink_Registation_Form;
				if (oEmailData.ReqType === 5) {
					sRequestTypeText = "Updated ";
					req = 'Update '
					sPortal_Link = sLink_Registation_Form;
				}

				// 			oEmailContent.subject = "Supplier " + sRequestTypeText + "registration form sent back  for " + oEmailData.SupplierName; 
				oEmailContent.subject = "Distributor " + sRequestTypeText + "registration form returned";

				oEmailContent.emailBody = "Dear Distributor," + "<br><br>" +

					req + "Request No: " + oEmailData.ReqNo + " for Distributor " + sRequestTypeText +
					"Registration as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName +
					"</span> has been sent back.<br><br>" +

					"Reason:" + "<br>" +
					oEmailData.Reason + "<br><br>" +

					"You can check the details for the request on the Dealer portal using this " +
					"<a href=" + sPortal_Link + ">link</a>" + "<br>" +

					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at " +
					"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Distributor Management Team";

			}
		} else if (sAppType === "BUYER_NOTIFICATION") {
			// Buyer notifications only
			var sRequestTypeText;
			var req = '';
			if (sAction === "APPROVE" || sAction === "FINAL_APPROVAL") {
				sRequestTypeText = "Registration form";
				var sActionTypeText = "approved ";
				// 			var sActionTypeText = "approved at L" + oEmailData.Approver_Level;
				if (oEmailData.ReqType === 5) {
					sRequestTypeText = "update form";
					req = 'update ';
				}

				oEmailContent.subject = "Distributor " + sRequestTypeText + " " + sActionTypeText;

				oEmailContent.emailBody = "Dear User," + "<br><br>" +
				"Your " + req + "Request No. " + oEmailData.ReqNo + " for " + sRequestTypeText +
				" Distributor Registration of <span style=\"text-transform:uppercase\">" +
				oEmailData.SupplierName + "</span> has been " + sActionTypeText + " by " +oEmailData.Approve_Role+" "+oEmailData.Approver + ".<br><br>" +

				"You can check the details for the request on the " + sClientShortName + " portal using this " +
				"<a href=" + sLink_Portal_LoginAccess + sLink_Request_Report  +"("+parseInt(oEmailData.ReqNo, 10)+")"+">link</a>" + "<br>" +

				"<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at " +
				"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team";

			} else if (sAction === "REJECT") {
				var sRequestTypeText = "";
				// 			var sRejectionLevel = "L" + oEmailData.Approver_Level + " approval" || "";
				if (oEmailData.ReqType === 5) {
					sRequestTypeText = "updated ";
				}

				oEmailContent.subject = "Distributor " + sRequestTypeText + "registration form rejected";

				oEmailContent.emailBody = "Dear User," + "<br><br>" +

					"Request No. " + oEmailData.ReqNo + " for Distributor " + sRequestTypeText + " Registration as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName +
					"</span> has been rejected " + " by " + oEmailData.Approver_Email + ".<br>" + "<br>" +

					"Reason for rejection:" + "<br>" +
					oEmailData.Reason + "<br><br>" +

					"You can check the details for the request on the " + sClientShortName + " portal report using the link " +
					"<a href=" +  sLink_Portal_LoginAccess + sLink_Request_Report  +"("+parseInt(oEmailData.ReqNo, 10)+")"+ ">here</a>" + "<br>" +

					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at " +
					"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Distributor Management Team";

			} else if (sAction === "SENDBACK") {

				var sRequestTypeText = "";
				var sRejectionLevel = " approval" || "";
				// 			var sRejectionLevel = "L" + oEmailData.Approver_Level + " approval" || ""; 
				if (oEmailData.ReqType === 5) {
					sRequestTypeText = "updated ";
				}

				oEmailContent.subject = "Distributor " + sRequestTypeText + "registration form sent back";

				oEmailContent.emailBody = "Dear User," + "<br><br>" +

					"Request No. " + oEmailData.ReqNo + " for Distributor " + sRequestTypeText + "registration as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName +
					"</span> has been sent back during " + sRejectionLevel + " by " + oEmailData.Approver_Email + ".<br><br>" +

					"Reason for sendback:" + "<br>" +
					oEmailData.Reason + "<br><br>" +

					"You can check the details for the request on the " + sClientShortName + " portal report using the link " +
					"<a href=" + sLink_Portal_LoginAccess + sLink_Request_Report  +"("+parseInt(oEmailData.ReqNo, 10)+")"+ ">here</a>" + "<br>" +

					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at " +
					"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Distributor Management Team";

			} else if (sAction === "SELFREG_BUYER") {

				oEmailContent.subject = "New Distributor self registration request No: " + oEmailData.ReqNo + " has been assigned to you";
				// 			oEmailContent.subject = "Self Registration Request No: " + oEmailData.ReqNo + " created for " + oEmailData.SupplierName;

				oEmailContent.emailBody = "Dear Valued Recipient," + "<br><br>" +

					// 			"Request No: " + oEmailData.ReqNo + " for Supplier <span style=\"text-transform:uppercase\">" + oEmailData.SupplierName +
					// 				"</span> has been created as self registration and you have been assigned to the request as buyer.<br><br>" +

					"Self Registration Request No : " + oEmailData.ReqNo + " has been assigned to you as buyer by SMDM team.<br><br>" +

					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at " +
					"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Distributor Management Team";

			}

		} else if (sAppType === "SUPPLIER_NOTIFICATION") {
			// Supplier notifications only
			var req = '';
			if (sAction === "MASTER_APPROVAL") {
				var sRequestTypeText = "";
				if (oEmailData.ReqType === 5) {
					sRequestTypeText = "updated ";
					req = 'update '
				}
				var portallink = sLink_Portal_LoginAccess+"site/iven#Shell-home";
				oEmailContent.subject = "Final approval of " + sRequestTypeText + "Distributor Registration form is complete";

				oEmailContent.emailBody = "Dear Distributor," + "<br><br>" +
					"Your " + req + "Request No. " + oEmailData.ReqNo + " for " + sRequestTypeText +
					"Distributor Registration with " + sClientName + " as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName + "</span> has been approved and the registration process is complete." +
					"You will receive an email with " + sClientShortName + " portal credentials soon.<br><br>" +

					"Once you receive the credentials, you can login to the " + sClientShortName + " portal using this  " +
					"<a href=" + portallink + ">link</a>" + "<br>" +

					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at " +
					"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Distributor Management Team";

			} else if (sAction === "MASTER_REJECT") {
				var sRequestTypeText = "";
				if (oEmailData.ReqType === 5) {
					sRequestTypeText = "Updated ";
				}

				oEmailContent.subject = sRequestTypeText + "Distributor Registration form rejected";

				oEmailContent.emailBody = "Dear Distributor," + "<br><br>" +

					"Request No. " + oEmailData.ReqNo + " for " + sRequestTypeText + "Distributor Registration as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName +
					"</span> has been rejected.<br>" +

					"<br>" + "Reason for rejection:" + "<br>" +
					oEmailData.Reason + "<br>" +

					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at " +
					"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Distributor Management Team";

			} else if (sAction === "SELFREG_SUPPLIER") {

				oEmailContent.subject = "Request No: " + oEmailData.ReqNo + " created with " + sClientName + " for registration as Distributor";

				oEmailContent.emailBody = "Dear Valued Recipient," + "<br><br>" +

					"Thank you for showing interest in registering with " + sClientName + " as a Distributor.<br><br>" +

					"In order to perform any business with us, you need to complete this registration in full using the link " +
					"<a href=" + sLink_Registation_Form + ">here</a><br><br>" +

					"Upon submission, your registration request will be reviewed by the relevant teams <strong>within 30 working days</strong>. We may seek additional information as part of this process.<br><br>" +

					"<u>Once approved, you may be invited to future procurement processes by " + sClientName + ".</u>" +

					"<u>Your approved registration does not entitle you to be invited to any/all procurement processes. " + sClientName +
					" reserves the right to select the participants based on its own discretion.</u><br><br>" +

					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at " +
					"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Distributor Management Team";

			}

		} else if (sAppType === "COMMUNCATION") {
			if (sAction === "DISTRIBUTOR") {

				oEmailContent.emailBody = "Dear Approver," + "<br><br>" +
					"There is a message from <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName + "</span>" +
					" for your request  <strong>" + oEmailData.ReqNo + "</strong>.<br>" + "<br>" +

					"Distributor's message:" + "<br>" +
					oEmailData.sMessage + "<br>" +

					"<br>" +
					"Thanks!" + "<br>" +
					oEmailData.SupplierName + "<br>" +
					"" + oEmailData.From_Email + "";

				oEmailContent.subject = "Message from Distributor: " + oEmailData.SupplierName;

			} else if (sAction === "SALESASSOCIATE") {

				oEmailContent.emailBody = "Dear Distributor," + "<br><br>" +
					"There is a message from <span style=\"text-transform:uppercase\">Procurement Team</span>" +
					" for your request  <strong>" + oEmailData.ReqNo + "</strong>.<br>" + "<br>" +

					"Procurement team's message:" + "<br>" +
					oEmailData.sMessage + "<br>" +

					"<br>" +
					"Thanks!" + "<br>" +
					"Distributor Registration Team" + "<br>" +
					"" + sClientShortName + "";

				oEmailContent.subject = "Message from Procurement Team";

			} else if (sAction === "APPROVER") {
				oEmailContent.emailBody = "Dear Distributor," + "<br><br>" +
					"There is a message from <span style=\"text-transform:uppercase\">Approver</span>" +
					" for request  <strong>" + oEmailData.ReqNo + "</strong>.<br>" + "<br>" +

					"Approver's message:" + "<br>" +
					oEmailData.sMessage + "<br>" +

					"<br>" +
					"Thanks!" + "<br>" +
					"Distributor Registration Team" + "<br>" +
					"" + sClientShortName + "";

				oEmailContent.subject = "Message from Registration Approver";

			}

		} else if (sAppType === "PENDING_NOTIFICATION") {
			if (iStatus === 5 || iStatus === 6) {

				var sActionTypeText = "";
				if (iStatus === 5) {
					sActionTypeText = "submitted";
				} else if (iStatus === 6) {
					sActionTypeText = "approved";
				} else if (iStatus === 9) {
					sActionTypeText = "re-submitted";
				}

				var sRequestTypeText = "";
				if (oEmailData.ReqType === 5) {
					sRequestTypeText = "Updated ";
				}

				oEmailContent.subject = "Distributor " + sRequestTypeText + "Registration form " + sActionTypeText;

				oEmailContent.emailBody = "Dear Approver," + "<br><br>" +

					sRequestTypeText + "Request No. " + oEmailData.ReqNo + " for Distributor Registration as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName + "</span>";

				oEmailContent.emailBody += "  has been " + sActionTypeText + " and is currently pending your approval<strong>" + oEmailData.For_Days +
					"</strong>.<br>" + "<br>" +

					"Please click " + "<a href=" + sLink_Registation_Form + ">here</a>" + "<br>" + " to login to " + sClientShortName +
					"  Portal and approve." +

					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at " +
					"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Distributor Management Team";

			}
		} else if (sAppType === "ATTACHMENTS") {
			var sRows = "";
			var options = {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			};
			var deadline = new Date();
			deadline.setHours(0, 0, 0, 0); // Sets Time values as zeroes

			oEmailContent.emailBody = "Dear Valued Recipient," + "<br><br>";

			if (sAction === "BEFORE") {

				deadline.setDate(deadline.getDate() + 30);

				oEmailContent.subject = "" + sClientShortName + " registration form attachments expiring in 7 days";

				oEmailContent.emailBody +=
					"Some of your attachments (documents/certificates) uploaded in Distributor Registration as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName + "</span>";

				oEmailContent.emailBody += " are set to expire in <strong>7 days</strong>." + "<br><br>";
				oEmailContent.emailBody +=
					"Please update the registration form with the renewed documents for the following attacments soon by <strong>" + getLongDate(deadline) +
					"</strong>:" + "<br>";

			} else if (sAction === "ON") {
				deadline.setDate(deadline.getDate() + 30);

				oEmailContent.subject = "" + sClientShortName + " registration form attachments expiring today";

				oEmailContent.emailBody +=
					"Some of your attachments (documents/certificates) uploaded in Distributor Registration as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName + "</span>";

				oEmailContent.emailBody += " are set to expire <strong>today</strong>." + "<br><br>";
				oEmailContent.emailBody +=
					"Please update the registration form with the renewed documents for the following attachments in 30 days. " +
					"Else your distributor registration may get deactivated on " +
					"<strong>" + getLongDate(deadline) + "</strong>." + "<br>";

			} else if (sAction === "AFTER_7Days") {
				deadline.setDate(deadline.getDate() + 23);

				oEmailContent.subject = "" + sClientShortName + " registration form attachments expiring in 20days";

				oEmailContent.emailBody +=
					"Some of your attachments (documents/certificates) uploaded in Distributor Registration as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName + "</span>";

				oEmailContent.emailBody += " are set to expire <strong>today</strong>." + "<br><br>";
				oEmailContent.emailBody +=
					"Please update the registration form with the renewed documents for the following attachments in 30 days. " +
					"Else your distributor registration may get deactivated on " +
					"<strong>" + getLongDate(deadline) + "</strong>." + "<br>";

			} else if (sAction === "AFTER") {
				oEmailContent.subject = "" + sClientShortName + " registration form attachments expired 30 days back";

				oEmailContent.emailBody +=
					"Some of your attachments (documents/certificates) uploaded in Distributor Registration as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName + "</span>";

				oEmailContent.emailBody += " have <strong>expired 30 days back</strong>." + "<br><br>";
				oEmailContent.emailBody += "Your registration might be <strong>blocked</strong> as the following expired attachments were not updated:" +
					"<br>";

			} else if (sAction === "ATTACH_EXPIRY") {
				//PROC_MNGR_NOTIFICATION
				oEmailContent.subject = "Distributor: " + oEmailData.SupplierName + " has not updated expired documents after being notified";

				oEmailContent.emailBody +=
					"Distributor <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName +
					"</span> missed updating the expired attachments (documents/certificates) uploaded in Distributor Registration </span>";

				oEmailContent.emailBody += "even after sending final notification as reminder for the following attachments:" + "<br><br>";

			}

			oEmailContent.emailBody += "<br><TABLE width='650px' class='table100-head' style='text-align: center;border: 1px solid black;'>";
			sRows += "<thead>" +
				"<TR>" +
				"<TH class='column1'>Attachments</TH>" +
				"<TH class='column2'>Expiry Date</TH>" +
				"</TR>";

			sRows += "</thead><tbody>";

			for (var i = 0; i < oEmailData.Attachments.length; i++) {
				sRows += "<TR>";
				sRows += "<TD>" + oEmailData.Attachments[i].ATTACH_DESC + "</TD>";
				sRows += "<TD>" + getLongDate(oEmailData.Attachments[i].EXPIRY_DATE) + "</TD>";
				sRows += "</TR>";
			}
			sRows += "</tbody>";

			oEmailContent.emailBody += sRows;

			oEmailContent.emailBody += "</TABLE class='table100-head'><br><br>";

			if (sAction === "BEFORE" || sAction === "ON") {
				oEmailContent.emailBody += "You can check your form via the below link and click on the 'Edit' option in the form:" + "<br>" +
					"<a href=" + sLink_Registation_Form + ">here</a><br><br>";
			} else if (sAction === "ATTACH_EXPIRY") {
				oEmailContent.emailBody += "Kindly take the necessary actions.<br><br>";
			}

			oEmailContent.emailBody += "Should you have any questions, please do not hesitate to reach out to us via email at " +
				"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team";

		} else if (sAppType === "USER_DELEGATE") {

			var sRequestTypeText = "";
			var sAppLink = "";
			if (oEmailData.ReqType === 5) {
				sRequestTypeText = "updated ";
			}

			var sRequestLevel = "";
			if (iStatus === 1 || iStatus === 2 || iStatus === 3) {
				sRequestLevel = "Request";
				sAppLink = sLink_Request_Approval;
			} else {
				sRequestLevel = "Registration";
				sAppLink = sLink_Registraion_Approval;
			}

			oEmailContent.subject = "Request No: " + parseInt(oEmailData.ReqNo, 10) + " is re-assigned for approval";

			oEmailContent.emailBody = "Dear Approver," + "<br><br>" +
				"Request No. " + oEmailData.ReqNo + " for " + sRequestTypeText + "Distributor " + sRequestLevel +
				" of <span style=\"text-transform:uppercase\">" +
				oEmailData.SupplierName + "</span>";

			oEmailContent.emailBody += " has been re-assigned to <strong>" + oEmailData.Assigned_To +
				"</strong> and is currently pending approval.<br>" + "<br>" +

				"Please click " + "<a href=" + sLink_Portal_LoginAccess + sAppLink + parseInt(oEmailData.ReqNo, 10) + ">here</a>" + " to login to " +
				sClientShortName + " Portal and approve." + "<br>" +

				"<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at " +
				"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team";

		} else if (sAppType === "SEC_PIN") {

			oEmailContent.subject = "" + sClientShortName + " Registration form login PIN";

			oEmailContent.emailBody = "Dear Distributor," + "<br><br>" +
				"Please use the below 6-digit PIN to login to your Distributor Registration form as <span style=\"text-transform:uppercase\">" +
				oEmailData.DistributorName + "</span> and regsitered email id <span style=\"text-transform:bold\">" + oEmailData.DistributorId +
				"</span><br><br>";

			oEmailContent.emailBody += "Security login PIN: <strong>" + oEmailData.sSecurityPin + "</strong><br>" + "<br><br>" +

				// 		"Please login to the following " + sClientShortName + " portal link to approve, using the link " + 
				// 			"<a href=" + sLink_Portal_LoginAccess + sAppLink +  parseInt(oEmailData.ReqNo, 10) + ">here</a>" + "<br>" +

				"<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at " +
				"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team";

		} else if (sAppType === "REQ_TYPE_CHANGE") {

			var sType = "";
			if (oEmailData.sChangeType === "RT") {
				sType = "Request-Type";
			} else {
				sType = "Sub-Type";
			}

			oEmailContent.subject = "Request No: " + parseInt(oEmailData.ReqNo, 10) + " - Distributor "+sType+" changed";

			oEmailContent.emailBody = "Dear Approver," + "<br><br>" +
			"Request No. " + oEmailData.ReqNo + " for Distributor as   <span style=\"text-transform:uppercase\">" +
			oEmailData.SupplierName + "</span> has below changes done by " + oEmailData.Changed_by +".<br>";
				
			oEmailContent.emailBody += "<br><TABLE width='650px' style='text-align: center;border-collapse: collapse;border:2px solid black;'>";
			sRows += "<thead>" +
				"<TR style='border:1px solid black;'>" +
				"<TH style='border:1px solid black;'>Sr No.</TH>" +
				"<TH style='border:1px solid black;'>Change Type</TH>" +
				"<TH style='border:1px solid black;'>Old Value</TH>" +
				"<TH style='border:1px solid black;'>New Value</TH>" +
				"</TR>";

			sRows += "</thead><tbody>";

			for (var i = 0; i < oEmailData.changeDetails.length; i++) {
				var srno=i+1;
				sRows += "<TR style='border:1px solid black;'>";
				sRows += "<TD style='border:1px solid black;'>" + srno + "</TD>";
				sRows += "<TD style='border:1px solid black;'>" + oEmailData.changeDetails[i].CHANGE_TYPE + "</TD>";
				sRows += "<TD style='border:1px solid black;'>" + oEmailData.changeDetails[i].OLD_VALUE + "</TD>";
				sRows += "<TD style='border:1px solid black;'>" + oEmailData.changeDetails[i].NEW_VALUE + "</TD>";
				sRows += "</TR>";
			}
			sRows += "</tbody>";

			oEmailContent.emailBody += sRows;

			oEmailContent.emailBody += "</TABLE class='table100-head'><br><br> " +
				"Should you have any questions, please do not hesitate to reach out to us via email at " +
				"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team";

		} else if (sAppType === "REG_EMAILID_CHANGE") {

			if (oEmailData.RequestType === 5) {
				sLink = sLink_Registation_Form;
			} else {
				sLink = sLink_Registation_Form;
			}
			var linkStatement = "";
			if(oEmailData.Status !== 1)
				linkStatement = "Please login to the following " + sClientShortName + " portal using the link " +
				"<a href=" + sLink + ">here</a><br><br>";

			oEmailContent.subject = "Registered Email ID changed for - " + oEmailData.SupplierName;

			oEmailContent.emailBody = "Dear Distributor," + "<br><br>" +
				"Distributor Registred Email ID for <span style=\"text-transform:uppercase\">" +
				oEmailData.SupplierName + "</span>";

			oEmailContent.emailBody += " has been changed from " + oEmailData.Changed_From + " to <strong>" +
				oEmailData.Changed_To + "</strong>.<br><br>" +
				linkStatement +
				"Should you have any questions, please do not hesitate to reach out to us via email at " +
				"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team";

		} else if (sAppType === "INVITE_REMINDER") {
			var sLink = null;
			var sReqType = '';
			if (oEmailData.RequestType === 5) {
				sLink = sLink_Registation_Form;
				sReqType = 'update registration';
			} else {
				sLink = sLink_Registation_Form;
				sReqType = 'register';
			}

			oEmailContent.subject = "" + sClientShortName + " Distributor Registration invite: Reminder-" + oEmailData.Count;
			oEmailContent.emailBody = "Dear Distributor," + "<br><br>" +
				/*oEmailContent.emailBody = */
				"Your company, " + oEmailData.SupplierName + " is re-invited to " + sReqType + " with " + oEmailData.EntityDesc +
				" as a Distributor." + "<br>" + "<br>";
			if (oEmailData.Count === '5') {
				oEmailContent.emailBody +=
					"This is a final reminder. Kindly complete the registration by submitting the E-Distributor registration form at the earliest." + "<br>" +
					"<br>";
			}
			var emailBodyCheck = "Once approved, you may be invited to future procurement processes by " + oEmailData.EntityDesc +
				". Your approved registration does not entitle you to be invited to any/all procurement processes. " + oEmailData.EntityDesc +
				" reserve the right to select the participants based on their discretion.";
			oEmailContent.emailBody += "In order to perform any business with us, you need to complete this registration in full using the link " +
				"<a href=" + sLink + ">" + "here" + "</a>" + "<br>" +

				"<br>" +
				"Upon submission, your registration request will be reviewed by relevant teams. We may seek additional information as part of this process." +
				"<br>" + "<br>" +
				// 			"Once approved, you may be invited to future procurement processes by " + oEmailData.EntityDesc +
				// 			". Your approved registration does not entitle you to be invited to any/all procurement processes. " + oEmailData.EntityDesc +
				// 			" reserve the right to select the participants based on their discretion." + "<br>" + "<br>" +
				"<u>" + emailBodyCheck + "</u><br>" + "<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail + "</a>" + "<br>" + "<br>" +
				"Regards," + "<br>" +
				"Distributor Management Team";

		}
		else if(sAppType === "DATA_MIGRATION"){
			// var sLink = null;
			// var sReqType = '';
			// if (oEmailData.RequestType === 5) {
			// 	sLink = sLink_Registation_Form;
			// 	sReqType = 'update registration';
			// } else {
			// 	sLink = sLink_Registation_Form;
			// 	sReqType = 'register';
			// }
			var sLink_Portal_LoginAccess = sLink_Registation_Form;

			oEmailContent.subject = "Invitation to update registration on the " + oEmailData.EntityDesc + " supplier database";
			var EmailBody = "Dear Valued Recipient," + "<br><br>";
			var emailBodyCheck = "Once approved, you may be invited to future procurement processes by " +  oEmailData.EntityDesc +
			". Your approved registration does not entitle you to be invited to any/all procurement processes. " +  oEmailData.EntityDesc +
			" reserve the right to select the participants based on their discretion.";
			var Emailbody1 = "Your company, " + oEmailData.SupplierName + " is invited to update registration with " +  oEmailData.EntityDesc  +
		" as a supplier." + "<br>" + "<br>" +
		"In order to perform any business with us, you need to complete this registration in full " +
		"using the link " +
		"<a href=" + sLink_Portal_LoginAccess +
		">here</a>" + "<br>" +
		"<br>" +
		"Upon submission, your registration request will be reviewed by relevant teams. We may seek additional information as part of this process." +
		"<br>" + "<br>" +
	// 		"Once approved, you may be invited to future procurement processes by " + data[0].ENTITY_DESC + 
	// 		". Your approved registration does not entitle you to be invited to any/all procurement processes. " + data[0].ENTITY_DESC +
	// 		" reserve the right to select the participants based on their discretion." + "<br>" + "<br>" +
	"<u>" + emailBodyCheck + "</u><br>" + "<br>" +
		"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail +
		">" + sClientContactEmail + "</a>" + "<br>" + "<br>" +
		"Regards," + "<br>" +
		"Distributor Management Team";

		oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + EmailBody + Emailbody1 + "</p>";

		}

		oEmailContent.emailBody = oEmailContent.emailBody + "<br><br>" +
			"<p style=" +
			"font-family:Arial, Helvetica, sans-serif;font-size:9px;color:black>Please note that this email has been generated automatically.</p><br>";

		oEmailContent.emailBody = "<p style=font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black;>" + oEmailContent.emailBody +
			"</p>";

		return oEmailContent;
	}

}