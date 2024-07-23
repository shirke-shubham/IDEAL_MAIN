using {DEALER_PORTAL as DPPortal} from '../db/TRANSACTION_TABLES';
using {DEALER_PORTAL.GRN_STATUS_MASTER , DEALER_PORTAL.MATERIAL_GROUP_MASTER, DEALER_PORTAL.MATERIAL_CODE_MASTER } from '../db/MASTER_TABLES';


service IDEAL_GRN_ACCEPTANCE {

    entity Grn_Header             as projection on DPPortal.GRN_HEADER;
    entity Grn_Items              as projection on DPPortal.GRN_ITEMS;
    entity Grn_Event_Logs         as projection on DPPortal.GRN_EVENT_LOGS;
    entity Grn_Status_Master      as projection on GRN_STATUS_MASTER;
    entity Grn_Stock              as projection on DPPortal.GRN_STOCK;
    entity Material_Group_Master  as projection on MATERIAL_GROUP_MASTER;
    entity Material_Code_Master   as projection on MATERIAL_CODE_MASTER;

    type userEvent :{       
        USER_ID: String(50);
        USER_ROLE: String(50)
    }
    action grnAccept( action : String, appType : String, grnHeader : many Grn_Header, grnItems :many Grn_Items, grnEvent : many Grn_Event_Logs ) returns String;

    action updateGrnPrice( appType : String, updPriceDetails : many Grn_Stock, Event : userEvent) returns String; 

   
}
 