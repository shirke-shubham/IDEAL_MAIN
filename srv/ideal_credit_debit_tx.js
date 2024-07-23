var cds = require("@sap/cds");
var hdbext = require("@sap/hdbext");
var dbClass = require("sap-hdbext-promisfied");

module.exports = cds.service.impl(async function (req) {

    var client = await dbClass.createConnectionFromEnv();
    var dbconn = new dbClass(client);
    var connection = await cds.connect.to("db");
    var output;
    // BY SHUBHAM

    this.on('creditDebitTransaction', async (req) => {
        try {
                var {
                    appType,
                    creditDebitTx
                } = req.data;
            
            var Result;
            var TransactionType = req.data.creditDebitTx[0].TRANSACTION_TYPE;
            var RefInvoice = req.data.creditDebitTx[0].REFERENCE_INVOICE;
            
            var sp = await dbconn.loadProcedurePromisified(hdbext, null, 'CREDIT_DEBIT_TX');
            var output = await dbconn.callProcedurePromisified(sp, [creditDebitTx, TransactionType, RefInvoice ]);
            Result = output.outputScalar.OUT_SUCCESS
            
            return Result;
            }

        catch (error) {
            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;

            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }
    });
           
})