const cds = require('@sap/cds')
const dbClass = require("sap-hdbext-promisfied")
const hdbext = require("@sap/hdbext")

module.exports = cds.service.impl(function () {

    //New Approval hierarchy code without hierarchy id

    const {MASTER_ENTITY_AND_TYPE,MASTER_APPROVAL_HIERARCHY} = this.entities;

    this.before('NEW',MASTER_APPROVAL_HIERARCHY,async req =>{
        try{
        var vType;
        var vEntity;
        if(req.data.TO_ENTITY_HIERARCHY_ID){
        var TypeFetch = await SELECT .from`IDEAL_FIORI_APPROVAL_HIERARCHY_MASTERENTITYANDTYPE_DRAFTS` .where`ID=${req.data.TO_ENTITY_HIERARCHY_ID}`;
        if(TypeFetch[0].TYPE === '' || TypeFetch[0].ENTITY_CODE === '' || TypeFetch[0].TYPE === null || TypeFetch[0].ENTITY_CODE === null)
        {
            req.error(400, 'Please Add Entity Type First')
        }
        else
        {
        if(TypeFetch[0].TYPE === 'PR' && TypeFetch[0].ENTITY_CODE !== '1000')
        {
            req.error(400, 'Please Select 1000(ABC Company Limited) Entity For Purchase Request')
        }
        if(TypeFetch[0].TYPE === 'CR' && TypeFetch[0].ENTITY_CODE !== '1000')
        {
            req.error(400,'Please Select 1000(ABC Company Limited) Entity For Claim Request')
        }
        if(TypeFetch[0].TYPE === 'RG' && TypeFetch[0].ENTITY_CODE !== '1000')
        {
            req.error(400, 'Please Select 1000(ABC Company Limited) Entity For Purchase Request')
        }
        if(TypeFetch[0].TYPE === 'PAY' && TypeFetch[0].ENTITY_CODE !== '1000')
        {
            req.error(400,'Please Select 1000(ABC Company Limited) Entity For Claim Request')
        }
        if(TypeFetch[0].TYPE === 'PPR' && TypeFetch[0].ENTITY_CODE !== '1000')
        {
            req.error(400, 'Please Select 1000(ABC Company Limited) Entity For Purchase Request')
        }
        var TypeData = await SELECT `TYPE` .from`DEALER_PORTAL_MASTER_ENTITY_AND_TYPE` .where`TYPE=${TypeFetch[0].TYPE} AND ENTITY_CODE=${TypeFetch[0].ENTITY_CODE}`;
        var HierarchyData = await SELECT `TYPE` .from`IDEAL_FIORI_APPROVAL_HIERARCHY_MASTERAPPROVALHIERARCHY_DRAFTS` .where`TYPE=${TypeFetch[0].TYPE} AND ENTITY_CODE=${TypeFetch[0].ENTITY_CODE}`;
        if(TypeData.length === 1 && HierarchyData.length === 0)
        {
            req.error(400, "This Entity Exists");
        }
        else{
        var CountDraft = await SELECT `COUNT(ENTITY_CODE)` .from`IDEAL_FIORI_APPROVAL_HIERARCHY_MASTERENTITYANDTYPE_DRAFTS` .where`ID=${req.data.TO_ENTITY_HIERARCHY_ID}`;
        var dEntityTypeData = await SELECT .from`IDEAL_FIORI_APPROVAL_HIERARCHY_MASTERENTITYANDTYPE_DRAFTS` .where`ID=${req.data.TO_ENTITY_HIERARCHY_ID}`;
        var LevelCount = await SELECT `SETTING` .from`DEALER_PORTAL_MASTER_IDEAL_SETTINGS` .where`CODE='MAX_APPR_LIMIT'`;
        var dMaxLevel = await SELECT `MAX(LEVEL)` .from`IDEAL_FIORI_APPROVAL_HIERARCHY_MASTERAPPROVALHIERARCHY_DRAFTS` .where`TO_ENTITY_HIERARCHY_ID=${req.data.TO_ENTITY_HIERARCHY_ID}`;
        if(dEntityTypeData[0].TYPE === '' || dEntityTypeData[0].ENTITY_CODE === '')
        {
            req.error(400, 'Please fill data into Entity Table');
        }
        else{
        if(CountDraft[0]["COUNT(ENTITY_CODE)"] > 0)
        {
                if(LevelCount[0].SETTING <= dMaxLevel[0]["MAX(LEVEL)"]){
                    req.error(400, "Only " +LevelCount[0].SETTING+" Level Are Allowed")
                }
                else{
                if(dMaxLevel[0]["MAX(LEVEL)"] <= 0){
                    req.data.LEVEL = 1;
                }
                else{
                    req.data.LEVEL = dMaxLevel[0]["MAX(LEVEL)"] + 1;
                }
                }
            req.data.TYPE = dEntityTypeData[0].TYPE;
            if(dEntityTypeData[0].TYPE === 'PR')
            {
                req.data.ENTITY_CODE = '1000';
            }
            else if(dEntityTypeData[0].TYPE === 'CR')
            {
                req.data.ENTITY_CODE = '1000';
            }
            else if(dEntityTypeData[0].TYPE === 'RG')
            {
                req.data.ENTITY_CODE = '1000';
            }
            else if(dEntityTypeData[0].TYPE === 'PAY')
            {
                req.data.ENTITY_CODE = '1000';
            }
            else if(dEntityTypeData[0].TYPE === 'PPR')
            {
                req.data.ENTITY_CODE = '1000';
            }
            else{
            req.data.ENTITY_CODE = dEntityTypeData[0].ENTITY_CODE;
            }
            }
            else{
                req.error(400,'Insert data into Entity Table')
            }
        }
        }}}
    }
    catch(error)
    {
        req.error(error);
    }
    })

    this.before('CREATE',MASTER_ENTITY_AND_TYPE,async req =>{
        try{
        if(req.data.TO_MASTER_APPROVAL_HIERARCHY)
        {
        if(req.data.TO_MASTER_APPROVAL_HIERARCHY.length === 0)
        {
            req.error(400,'Please Enter Hierarchy');
        }
    }
}
    catch(error)
    {
        req.error(error);
    }
    })

    this.before('SAVE',MASTER_ENTITY_AND_TYPE,async req =>{
    try{
        if(req.event !== 'CREATE')
        {
        if(req.data.length !== undefined || req.data.TO_MASTER_APPROVAL_HIERARCHY)
        {
        var uDataType = await SELECT .from`IDEAL_FIORI_APPROVAL_HIERARCHY_MASTERAPPROVALHIERARCHY_DRAFTS` .where`TO_ENTITY_HIERARCHY_ID=${req.data.ID}`;
        var uData = await SELECT .from`DEALER_PORTAL_MASTER_APPROVAL_HIERARCHY` .where`TO_ENTITY_HIERARCHY_ID=${uDataType[0].TO_ENTITY_HIERARCHY_ID} AND TYPE=${uDataType[0].TYPE}`;
        if(uDataType.length !== uData.length)
        {
            for(var i = 0; i<uDataType.length;i++)
            {
                req.data.TO_MASTER_APPROVAL_HIERARCHY[i].LEVEL = i + 1;
            }
        }
        }}
    }
        catch(error)
        {
            req.error(error);
        }
    })


//Old approval hierarchy fiori code 
    // const {ENTITY_AND_TYPE,MASTER_APPROVAL_HIERARCHY,MASTER_APPROVAL_MATRIX} = this.entities;
        
    //     var mHierarchy_id;
    //     var mType;
    //     this.before('NEW',MASTER_APPROVAL_HIERARCHY,async req => {
    //     if(req.data.TO_ENTITY_HIERARCHY_ID)
    //     {
    //     var DraftCountH = await SELECT `COUNT(HIERARCHY_ID)` .from`IDEAL_FIORI_APPROVAL_HIERARCHY_MASTERAPPROVALHIERARCHY_DRAFTS` .where`TO_ENTITY_HIERARCHY_ID=${req.data.TO_ENTITY_HIERARCHY_ID}`;
    //     var DraftCountM = await SELECT `COUNT(HIERARCHY_ID)` .from`IDEAL_FIORI_APPROVAL_HIERARCHY_MASTERAPPROVALMATRIX_DRAFTS` .where`TO_ENTITY_MATRIX_ID=${req.data.TO_ENTITY_HIERARCHY_ID}`;
    //     if(DraftCountH[0]["COUNT(HIERARCHY_ID)"] === DraftCountM[0]["COUNT(HIERARCHY_ID)"]){
        
    //     var DraftData = await SELECT `MAX(LEVEL)` .from`IDEAL_FIORI_APPROVAL_HIERARCHY_MASTERAPPROVALHIERARCHY_DRAFTS` .where`TO_ENTITY_HIERARCHY_ID=${req.data.TO_ENTITY_HIERARCHY_ID}`;
    //     var data = await SELECT .from`DEALER_PORTAL_ENTITY_AND_TYPE` .where`ID=${req.data.TO_ENTITY_HIERARCHY_ID}`;
        
    //     if(DraftData[0]["MAX(LEVEL)"] > 0)
    //     {
    //         var LevelCount = await SELECT `SETTING` .from`DEALER_PORTAL_MASTER_IDEAL_SETTINGS` .where`CODE='MAX_APPR_LIMIT'`;
    //         var LevelData = await SELECT `MAX(LEVEL)` .from`DEALER_PORTAL_MASTER_APPROVAL_HIERARCHY` .where`TO_ENTITY_HIERARCHY_ID=${req.data.TO_ENTITY_HIERARCHY_ID}`;
    //         var DraftLevel = await SELECT `MAX(LEVEL)` .from`IDEAL_FIORI_APPROVAL_HIERARCHY_MASTERAPPROVALHIERARCHY_DRAFTS` .where`TO_ENTITY_HIERARCHY_ID=${req.data.TO_ENTITY_HIERARCHY_ID}`;
    //         if(LevelCount[0].SETTING <= LevelData[0]["MAX(LEVEL)"] || LevelCount[0].SETTING <= DraftLevel[0]["MAX(LEVEL)"])
    //         {
    //         req.error("Only " +LevelCount[0].SETTING+" Level Are Allowed")
    //         }
    //         else{
    //             req.data.LEVEL = DraftData[0]["MAX(LEVEL)"] + 1;
    //         }
            
    //     }
    //     else{
    //     var LevelCount = await SELECT `SETTING` .from`DEALER_PORTAL_MASTER_IDEAL_SETTINGS` .where`CODE='MAX_APPR_LIMIT'`;
    //     var data = await SELECT .from`DEALER_PORTAL_ENTITY_AND_TYPE` .where`ID=${req.data.TO_ENTITY_HIERARCHY_ID}`;
    //     var LevelData = await SELECT `MAX(LEVEL)` .from`DEALER_PORTAL_MASTER_APPROVAL_HIERARCHY` .where`TO_ENTITY_HIERARCHY_ID=${req.data.TO_ENTITY_HIERARCHY_ID}`;
    //     if(LevelCount[0].SETTING <= LevelData[0]["MAX(LEVEL)"])
    //     {
    //         req.error("Only " +LevelCount[0].SETTING+" Level Are Allowed")
    //     }
    //     else{
    //     if(LevelData[0]["MAX(LEVEL)"] <= 0)
    //     {
    //         req.data.LEVEL = 1;
    //     }
    //     else{
    //         req.data.LEVEL = LevelData[0]["MAX(LEVEL)"] + 1;
    //     }
    //     }
    //     req.data.HIERARCHY_ID = data[0].ENTITY_CODE +"_0"+ req.data.LEVEL;
    //     mHierarchy_id = req.data.HIERARCHY_ID;
    //     req.data.ENTITY_CODE = data[0].ENTITY_CODE;
    //     req.data.TYPE = data[0].TYPE;
    //     mType = data[0].TYPE;
    //     }
    //     req.data.HIERARCHY_ID = data[0].ENTITY_CODE +"_0"+ req.data.LEVEL;
    //     mHierarchy_id = req.data.HIERARCHY_ID;
    //     req.data.ENTITY_CODE = data[0].ENTITY_CODE;
    //     req.data.TYPE = data[0].TYPE;
    //     mType = data[0].TYPE;

    //     }
    //     else{
    //         req.error('Please Enter Record In Matrix Table')
    //     }
        
    //     }
    // })

});