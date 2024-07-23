using {VIEW_REQUEST_ACTIVE_STATUS,
VIEW_REQUEST_REJECTED_STATUS,
VIEW_ENTITY_CODE_COUNT,
VIEW_REQUEST_ACTION_STATUS,
VIEW_REQUEST_DISTRIBUTOR_TYPE,
VIEW_REQUEST_COUNTER_STATUS,
VIEW_REQUEST_TYPE_COUNT,
VIEW_REQUEST_ALL_STATUS_COUNT,
VIEW_TURN_AROUND_TIME,
REQ_TURNAROUND,
REQUEST_TAT,
APPROVAL_PENDING
} from '../db/MASTER_TABLES';
using {DEALER_PORTAL} from '../db/TRANSACTION_TABLES';



service ideal_dashboard_srv {

    entity RequestInfo as projection on DEALER_PORTAL.REQUEST_INFO;
    entity ViewRequestActiveStatus as projection on VIEW_REQUEST_ACTIVE_STATUS;
    entity ViewRequestRejectedStatus as projection on VIEW_REQUEST_REJECTED_STATUS;
    entity ViewrequestActionStatus as projection on VIEW_REQUEST_ACTION_STATUS;
    entity ViewEntityCodeCount as projection on VIEW_ENTITY_CODE_COUNT;
    entity ViewRequestDistributorType as projection on VIEW_REQUEST_DISTRIBUTOR_TYPE;
    entity ViewRequestCounterStatus as projection on VIEW_REQUEST_COUNTER_STATUS;
    entity ViewRequestTypeCount as projection on VIEW_REQUEST_TYPE_COUNT;
    entity ViewRequestAllStatusCount as projection on VIEW_REQUEST_ALL_STATUS_COUNT;
    entity ViewTurnAroundTime as projection on VIEW_TURN_AROUND_TIME;
    entity ReqTurnaround as projection on REQ_TURNAROUND;
    entity RequestTat as projection on REQUEST_TAT;
    entity ApprovalPending as projection on APPROVAL_PENDING;

}