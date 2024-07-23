
using { DEALER_PORTAL_RETAILER_REGISTRATION } from '../db/RETAILER_MASTER_TABLES';
using { DEALER_PORTAL_RETAILER_REGISTRATION as ScSales } from '../db/RETAILER_TRANSACTION_TABLES';
using {DEALER_PORTAL} from '../db/MASTER_TABLES';


service ideal_retailer_registration {

    entity RetailerDetails as projection on ScSales.RETAILER_DETAILS;
    entity RetailerAttachments as projection on ScSales.RETAILER_ATTACHMENTS;
    // entity Attachments as projection on ScSales.ATTACHMENTS;
    entity RetailerAddressDetail as projection on ScSales.RETAILER_ADDRESS_DETAIL;
    entity RetailerPDC as projection on ScSales.RETAILER_PDC;
    entity RetailerEvent as projection on ScSales.RETAILER_EVENT;
    entity TemplateAttachments as projection on ScSales.RETAILER_TEMPLATE_ATTACHMENTS;
    entity RetailerSoHeader as projection on ScSales.RETAILER_SO_HEADER;
    entity RetailerSoItems as projection on ScSales.RETAILER_SO_ITEMS;
    entity RetailerDummy as projection on ScSales.RETAILER_DUMMY;

    entity CountryMaster as projection on DEALER_PORTAL_RETAILER_REGISTRATION.COUNTRY_MASTER;
    entity CityMaster as projection on DEALER_PORTAL_RETAILER_REGISTRATION.CITY_MASTER;
    entity RegionMaster as projection on DEALER_PORTAL.MASTER_REGION;
    entity RetailerTypeMaster as projection on DEALER_PORTAL_RETAILER_REGISTRATION.RETAILER_TYPE_MASTER;
    entity AddressTypeMaster as projection on DEALER_PORTAL_RETAILER_REGISTRATION.ADDRESS_TYPE_MASTER;
    entity StatusMaster as projection on DEALER_PORTAL_RETAILER_REGISTRATION.STATUS_MASTER;
    entity DivisionMaster as projection on DEALER_PORTAL_RETAILER_REGISTRATION.DIVISION_MASTER;

    type User_Details:{
    USER_ROLE: String(50);
    USER_ID: String(50);
  }

    action registerRetailer(Action:String , retailerDetails: many RetailerDetails,retailerAddress:many RetailerAddressDetail, retailerAttachments: many RetailerAttachments , userDetails:User_Details) returns String;
    action pdcCreation(retailerPDC : many RetailerPDC, userDetails:User_Details) returns String;
    action templateCreation(templateDetails:many TemplateAttachments, userDetails:User_Details)returns String;
    action orderCreation(soHeaders:many RetailerSoHeader,soItems: many RetailerSoItems, userDetails:User_Details)returns many String;
}