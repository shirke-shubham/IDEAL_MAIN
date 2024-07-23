using { DEALER_PORTAL} from '../db/MASTER_TABLES';

service ideal_fiori_approval_hierarchy {
    
    @odata.draft.enabled
    entity MasterEntityAndType as projection on DEALER_PORTAL.MASTER_ENTITY_AND_TYPE;
    entity MasterApprovalHierarchy as projection on DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY;
    entity MasterEntityCode as projection on DEALER_PORTAL.MASTER_ENTITY_CODE;
    entity MasterIdealSettings as projection on DEALER_PORTAL.MASTER_IDEAL_SETTINGS;
    entity MasterUserRole as projection on DEALER_PORTAL.MASTER_USER_ROLE;
    entity MasterIdealUsers as projection on DEALER_PORTAL.MASTER_IDEAL_USERS;
    entity MasterApprovalTypes as projection on DEALER_PORTAL.MASTER_APPROVAL_TYPES;
    entity MasterUserEntityUsers as projection on DEALER_PORTAL.MASTER_USER_ENTITY_CODES;

    define view Users as
    select from MasterIdealUsers distinct {
        key USER_ID
    }where USER_ID !='';

    // annotate ideal_fiori_approval_hierarchy.MasterEntityAndType@(Common.SideEffects #ReactionItemCreationOrDeletion: {
    //     SourceEntities  : [TO_MASTER_APPROVAL_HIERARCHY],
    //     TargetProperties: ['TO_MASTER_APPROVAL_HIERARCHY/LEVEL']     
    // });

}