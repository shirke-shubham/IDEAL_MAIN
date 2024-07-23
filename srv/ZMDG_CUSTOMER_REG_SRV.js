const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const ZMDG_CUSTOMER_REG_SRV = await cds.connect.to("ZMDG_CUSTOMER_REG_SRV"); 
      srv.on('READ', 'BankDetailsSet', req => ZMDG_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'CompanyDataSet', req => ZMDG_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'ContactPersonSet', req => ZMDG_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'GeneralDataSet', req => ZMDG_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'IdentificationSet', req => ZMDG_CUSTOMER_REG_SRV.run(req.query)); 
}