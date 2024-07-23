// get libraries/modules
const cds = require('@sap/cds')
const dbClass = require("sap-hdbext-promisfied")
const hdbext = require("@sap/hdbext")
const lib_ias = require('../srv/LIB/ideal_library_ias')
const lib_common = require('../srv/LIB/ideal_library')
// const lib_dms = require('./DMS_LIB/BTP_DMS_LIB')
module.exports = cds.service.impl(function () {
    this.on('FetchIASUser', async (req) => {
        
        try {
              var client = await dbClass.createConnectionFromEnv();
              var dbConn = new dbClass(client);
              await lib_ias.getIASUser();
              console.log('done');
        } catch (error) {
            
            var sType=error.code?"Procedure":"Node Js";    
            var iErrorCode=error.code??500;
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE:  error.message ? error.message : error
            }
            lib_common.postErrorLog(Result,null,null,null,"FetchIASUser Job",sType,dbConn,hdbext);
            console.error(error)     
            // return error.messsage            
            req.error({ code:iErrorCode, message:  error.message ? error.message : error });
        }
    })
    this.on('AutoDeleteErrorLog', async (req) => {
        try {
            var sResponse = null;
            var connection = await cds.connect.to('db');
              var client = await dbClass.createConnectionFromEnv();
              var dbConn = new dbClass(client);
              const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'AUTO_DELETE_ERROR_LOG')
              sResponse = await dbConn.callProcedurePromisified(loadProc,[]);
             console.log(sResponse)
        } catch (error) {
            
            var sType=error.code?"Procedure":"Node Js";    
            var iErrorCode=error.code??500;
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE:  error.message ? error.message : error
            }
            lib_common.postErrorLog(Result,null,null,null,"AutoDeleteErrorLog Job",sType,dbConn,hdbext);          
            req.error({ code:iErrorCode, message:  error.message ? error.message : error });
        }
    })
    
}
)