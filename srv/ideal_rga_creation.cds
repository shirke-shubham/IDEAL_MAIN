using {DEALER_PORTAL as DPPortal} from '../db/TRANSACTION_TABLES';
// using {DEALER_PORTAL_MASTER as DPMaster} from '../db/MASTER_TABLES';
using {DEALER_PORTAL.MASTER_RGA_STATUS, DEALER_PORTAL.MASTER_RGA_EVENT_STATUS } from '../db/MASTER_TABLES';


service IDEAL_RGA_PROCESS {

  entity Rga_Header as projection on DPPortal.RGA_HEADER;

  entity Rga_Items as projection on DPPortal.RGA_ITEMS;

  entity Rga_Event_Logs as projection on DPPortal.RGA_EVENT_LOGS;

//master
  entity Status_Master as projection on MASTER_RGA_STATUS;

  entity Master_Rga_Event_Status as projection on MASTER_RGA_EVENT_STATUS;
        
  action rgaProcess( action : String, appType : String, rgHeader : many Rga_Header, rgItems :many Rga_Items, rgEvent : many Rga_Event_Logs  ) returns String;






}