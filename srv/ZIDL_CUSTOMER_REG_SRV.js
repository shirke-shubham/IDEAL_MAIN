const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const ZIDL_CUSTOMER_REG_SRV = await cds.connect.to("ZIDL_CUSTOMER_REG_SRV"); 
      srv.on('READ', 'GetTelCodeSet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'GetStateSet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'GetSwiftCodeSet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'GetSortkeySet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'GetSchemaGrpSet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'GetPurOrgSet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'GetPaymentMethodSet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'GetPaymentTermSet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'GetMaterialGrpSet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'GetCurrencyKeySet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'GetCustomersSet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'GetGLReconAccSet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'GetIncotermSet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'GetCountrySet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'GetCountryDetailSet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'GetCompanyCodeSet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'GetCitySet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'CheckUpdateReqSet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'GetAccountGrpSet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'GetBankDetailSet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'CheckNewCustomerCodeSet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'CheckCustomerCodeSet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
      srv.on('READ', 'BPTypeSet', req => ZIDL_CUSTOMER_REG_SRV.run(req.query)); 
}