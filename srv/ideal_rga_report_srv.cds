using {DEALER_PORTAL as DPPortal} from '../db/TRANSACTION_TABLES';
using {DEALER_PORTAL.MASTER_RGA_STATUS, DEALER_PORTAL.MASTER_RGA_EVENT_STATUS } from '../db/MASTER_TABLES';


service ideal_rga_report_srv {
  entity Rga_Header as projection on DPPortal.RGA_HEADER{
    *,
    RGA_NO as RGA_NUM: String,  
    TO_DATE(CREATED_ON) as LV_CREATION_DATE : Date,
    };
  entity Rga_Items as projection on DPPortal.RGA_ITEMS;
  entity Rga_Event_Logs as projection on DPPortal.RGA_EVENT_LOGS;
  entity Status_Master as projection on MASTER_RGA_STATUS;
  entity Master_Rga_Event_Status as projection on MASTER_RGA_EVENT_STATUS;

  define view Dist as
    select from Rga_Header distinct {
        key DISTRIBUTOR_NAME
    }where DISTRIBUTOR_NAME !='';
  

}