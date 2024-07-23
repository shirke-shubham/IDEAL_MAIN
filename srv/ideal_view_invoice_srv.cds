using { IDEAL_INVOICE_DETAILS } from '../db/IDEAL_VIEW_INVOICE';
using {DEALER_PORTAL} from '../db/MASTER_TABLES';
using { DEALER_PORTAL_RETAILER_REGISTRATION } from '../db/RETAILER_MASTER_TABLES';


service ideal_view_invoice_srv {

    entity Ideal_invoice_details as projection on IDEAL_INVOICE_DETAILS;
    entity CountryMaster as projection on DEALER_PORTAL_RETAILER_REGISTRATION.COUNTRY_MASTER;
    entity CityMaster as projection on DEALER_PORTAL_RETAILER_REGISTRATION.CITY_MASTER;
    entity RegionMaster as projection on DEALER_PORTAL.MASTER_REGION;

}