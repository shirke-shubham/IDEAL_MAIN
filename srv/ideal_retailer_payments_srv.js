var cds = require("@sap/cds");
var hdbext = require("@sap/hdbext");
var dbClass = require("sap-hdbext-promisfied");

module.exports = cds.service.impl(async function (req) {

    var client = await dbClass.createConnectionFromEnv();
    var dbconn = new dbClass(client);
    var connection = await cds.connect.to("db");
    var output;
    // BY SHUBHAM

    this.on('retailerPayments', async (req) => {

        try {

            var {
                appType,
                retailerPayment,
                paymentEvent
            } = req.data;

            var action = null;

            if (retailerPayment === null || retailerPayment[0].DISTRIBUTOR_ID === null || retailerPayment[0].RETAILER_ID == null || retailerPayment[0].DELIVERY_NO == null || retailerPayment[0].INVOICE_NO == null) {
                throw "Invalid Payload";
            }

            var sp = await dbconn.loadProcedurePromisified(hdbext, null, 'PAYMENT_ENTRY');
            var output = await dbconn.callProcedurePromisified(sp, [action, retailerPayment, paymentEvent]);

            const invoiceNo = await SELECT`INVOICE_NO`.from`DEALER_PORTAL_RETAILER_PAYMENTS`;
            const uniqueInvoiceMap = new Map();

            invoiceNo.forEach(invoice => {
                uniqueInvoiceMap.set(invoice.INVOICE_NO, invoice);
            });
            const uniqueInvoiceNoArray = Array.from(uniqueInvoiceMap.values());
            var TotalInvBalAmt;
            //Adding sum of paid amount of particular invoice in "TOTAL_INV_BALANCE_AMOUNT"column for each transaction entry of same invoice.
            for (var i = 0; i < uniqueInvoiceNoArray.length; i++) {
                TotalInvBalAmt = await SELECT`SUM(YOUR_AMOUNT)`.from`DEALER_PORTAL_RETAILER_PAYMENTS`.where`INVOICE_NO=${uniqueInvoiceNoArray[i].INVOICE_NO}`;

                await UPDATE`DEALER_PORTAL_RETAILER_PAYMENTS`.set`TOTAL_INV_BALANCE_AMOUNT=${TotalInvBalAmt[0]["SUM(YOUR_AMOUNT)"]}`.where`INVOICE_NO=${uniqueInvoiceNoArray[i].INVOICE_NO}`;
            }

            var statusDetail = await SELECT`INVOICE_NO`.from`DEALER_PORTAL_RETAILER_PAYMENTS`.where`PAYMENT_STATUS=${2}`;
            const invBalZero = "0.00";
            if (statusDetail.length > 0) {

                const uniqueInvoiceNos = new Set(statusDetail.map(item => item.INVOICE_NO));

                // Converting the Set to an array to use a normal for loop
                const uniqueInvoiceArray = Array.from(uniqueInvoiceNos);
            // setting "INVOICE_BAL_AMOUNT" zero whose "PAYMENT_STATUS"=2(full paid)
                for (let i = 0; i < uniqueInvoiceArray.length; i++) {
                    await UPDATE`DEALER_PORTAL_RETAILER_PAYMENTS`
                        .set`INVOICE_BAL_AMOUNT=${invBalZero}`
                        .set`PAYMENT_STATUS=${2}`
                        .where`INVOICE_NO=${uniqueInvoiceArray[i]}`;
                    await UPDATE`DEALER_PORTAL_RETAILER_REGISTRATION_RETAILER_INVOICE_HEADER`
                        .set`PAYMENT_STATUS=${2}`.where`INVOICE_NO=${uniqueInvoiceArray[i]}`;
                }
            }
            return "Retailer payment entry updated successfully";

        }
        catch (error) {

            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;

            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }

    });

})