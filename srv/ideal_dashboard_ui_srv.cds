using {ideal_dashboard_srv} from './ideal_dashboard_srv';

annotate ideal_dashboard_srv.RequestInfo with @(
    Capabilities.SearchRestrictions : {
        Searchable : false,
    }            
);

//Measure - Dimension Annotation(X-Y Axis)
annotate ideal_dashboard_srv.ViewRequestRejectedStatus with {
  @Analytics.Dimension      : true
  DESCRIPTION @(title  : 'Status');
  @Analytics.Dimension      : true
  STATUS @(title  : 'Status');
  @Analytics.Measure        : true   
  @Core.Computed
  REJ_STATUS_COUNT @(title : 'Total Rejected Request');        
}

annotate ideal_dashboard_srv.ViewrequestActionStatus with {
  @Analytics.Dimension      : true
  DESCRIPTION @(title  : 'Status');
  @Analytics.Dimension      : true
  STATUS @(title  : 'Status');
  @Analytics.Measure        : true   
  @Core.Computed
  ACT_STATUS_COUNT @(title                   : 'Total Request');        
}

annotate ideal_dashboard_srv.ViewEntityCodeCount with {
  @Analytics.Dimension      : true
  BUTXT @(title  : 'Entity');
  @Analytics.Dimension      : true       
  ENTITY_CODE @(title  : 'Entity Code');        
  @Analytics.Measure        : true   
  @Core.Computed
  ENTITY_COUNT @(title                   : 'Total Request');        
}

annotate ideal_dashboard_srv.ViewRequestTypeCount with {
  @Analytics.Dimension      : true
  DESCRIPTION @(title  : 'Request Type');
   @Analytics.Dimension      : true
  REQUEST_TYPE @(title  : 'Request Type');
  @Analytics.Measure        : true   
  @Core.Computed
  REQ_TYPE_COUNT @(title                   : 'Total Request');        
}

annotate ideal_dashboard_srv.RequestTat with {       
        @Analytics.Dimension      : true
        STAGE @(title: 'Stage');       
        @Analytics.Dimension      : true
        PROGRESS @(title: 'Progress');                
        @Analytics.Measure        : true  
        AVG_TAT_SEC   @(title: 'Average Turn Around Time (Seconds)');         
        @Analytics.Measure        : true  
        AVG_TAT_MIN   @(title: 'Average Turn Around Time (Minutes)');             
        @Analytics.Measure        : true  
        AVG_TAT_HRS   @(title: 'Average Turn Around Time (Hours)');     
         @Analytics.Measure        : true  
        AVG_TAT_DAYS   @(title: 'Average Turn Around Time (Days)');          
}

annotate ideal_dashboard_srv.ApprovalPending with {      
        @Analytics.Dimension      : true
        APPR_PENDING @(title: 'Approval Pending');                
        @Analytics.Measure        : true  
        REQUEST_NO   @(title: 'No. of Pending Requests');                        
}