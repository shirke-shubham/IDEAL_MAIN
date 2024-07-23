const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const ZIBS_DMS_CLAIM_SRV = await cds.connect.to("ZIBS_DMS_CLAIM_SRV"); 
      srv.on('READ', 'INVOICEITEMSet', req => ZIBS_DMS_CLAIM_SRV.run(req.query)); 
      srv.on('READ', 'CLMITEMSet', req => ZIBS_DMS_CLAIM_SRV.run(req.query)); 
      srv.on('READ', 'INVOICEF4Set', req => ZIBS_DMS_CLAIM_SRV.run(req.query)); 
      srv.on('READ', 'CLMHEADERSet', req => ZIBS_DMS_CLAIM_SRV.run(req.query)); 
}