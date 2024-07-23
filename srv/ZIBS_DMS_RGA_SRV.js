const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const ZIBS_DMS_RGA_SRV = await cds.connect.to("ZIBS_DMS_RGA_SRV"); 
      srv.on('READ', 'INVOICEF4Set', req => ZIBS_DMS_RGA_SRV.run(req.query)); 
      srv.on('READ', 'INVOICEITEMSet', req => ZIBS_DMS_RGA_SRV.run(req.query)); 
      srv.on('READ', 'RGAHEADERSet', req => ZIBS_DMS_RGA_SRV.run(req.query)); 
      srv.on('READ', 'RGAITEMSet', req => ZIBS_DMS_RGA_SRV.run(req.query)); 
}