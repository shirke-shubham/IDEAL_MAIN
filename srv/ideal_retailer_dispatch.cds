using { DEALER_PORTAL_RETAILER_REGISTRATION as ScSales } from '../db/RETAILER_TRANSACTION_TABLES';
using { DEALER_PORTAL_RETAILER_REGISTRATION } from '../db/RETAILER_MASTER_TABLES';
using {DEALER_PORTAL as DPPortal} from '../db/TRANSACTION_TABLES';
using {DEALER_PORTAL} from '../db/MASTER_TABLES';

service ideal_retailer_dispatch {
    entity RetailerDetails as projection on ScSales.RETAILER_DETAILS;
    entity RetailerDeliveryHeader as projection on ScSales.RETAILER_DELIVERY_HEADER;
    entity RetailerDeliveryItem as projection on ScSales.RETAILER_DELIVERY_ITEM;
    entity RetailerInvoiceHeader as projection on ScSales.RETAILER_INVOICE_HEADER;
    entity RetailerInvoiceItem as projection on ScSales.RETAILER_INVOICE_ITEM;
    entity RetailerSoHeader as projection on ScSales.RETAILER_SO_HEADER;
    entity RetailerSoItems as projection on ScSales.RETAILER_SO_ITEMS;
    entity divisionMaster as projection on DEALER_PORTAL_RETAILER_REGISTRATION.DIVISION_MASTER;
    entity statusMaster as projection on DEALER_PORTAL_RETAILER_REGISTRATION.STATUS_MASTER;
    entity retailerMaster as projection on DEALER_PORTAL_RETAILER_REGISTRATION.RETAILER_MASTER;
    entity master_credit_debit_tx as projection on DEALER_PORTAL.MASTER_CREDIT_DEBIT_TX;

    entity PaymentEntryStatusMaster as projection on DEALER_PORTAL.PAYMENT_ENTRY_STATUS_MASTER;

    entity Grn_Stock as projection on DPPortal.GRN_STOCK;

    action dispatchCreation(deliveryheader:many RetailerDeliveryHeader ,deliveryItem:many RetailerDeliveryItem ,invoiceHeader:many RetailerInvoiceHeader  ,invoiceItem : many RetailerInvoiceItem)returns String;
}

 