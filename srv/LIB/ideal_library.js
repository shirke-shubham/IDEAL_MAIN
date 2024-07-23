const cds = require("@sap/cds");

    module.exports= {
    getEntityDesc:async function (connection, entityCode) {
    try {
        var response = "";
        // let connection = await cds.connect.to('db');
        let queryResult = await connection.run(SELECT`BUTXT`.from`${connection.entities['DEALER_PORTAL.MASTER_ENTITY_CODE']}`
            .where`BUKRS = ${entityCode}`);
        if (queryResult.length > 0)
            response = queryResult[0].BUTXT
        return response;
    }
    catch (error) { throw error; }
    },
    generateSuccessMessage: function (aData) {
		var successMsg = '';
		if (aData.length > 0) {
			for (var j = 0; j < aData.length; j++) {
				if (j === 0) {
					successMsg = aData[j];
				} else if (j === aData.length - 1) {
					successMsg = successMsg + " and " + aData[j];
				} else {
					successMsg = successMsg + " , " + aData[j];
				}
			}
		}
		if (successMsg === "") {
			successMsg = 'No Changes Has Been Detected';
		} else {
			successMsg = successMsg + " Has Been Updated";
		}
		return successMsg
	},
    getTemplateColumns: async function (conn) {
		try {
			// var aResult = await SELECT .from `DEALER_PORTAL.MASTER_REGFORM_FIELDS_MANDATORY`  .where `CCODE = 'TEMPLATE' AND TYPE = 1`;

			let aResult = await conn.run(
				SELECT
					.from`${conn.entities['DEALER_PORTAL.MASTER_REGFORM_FIELDS_CONFIG']}`
					.where`CCODE = 'TEMPLATE' AND REQ_TYPE = 1`
			);
			return aResult;
		}
		catch (error) {
			throw error;
		}
	}, 
	getApproverForEntity: async function (connection, sEntityCode, sRoleCode, sTableName, sType, sLevel) {
        try {
            if(sRoleCode === null)
            {
                let aResult = await connection.run(
                SELECT
                    .from`${connection.entities[sTableName]}`
                    .where({ ENTITY_CODE: sEntityCode, TYPE: sType, LEVEL: sLevel}));  
            if (aResult.length > 0) return aResult;
            else return null;

            }
            else{
            let aResult = await connection.run(
                SELECT
                    .from`${connection.entities[sTableName]}`
                    .where({ ENTITY_CODE: sEntityCode, ROLE_CODE: sRoleCode , TYPE: sType, LEVEL: sLevel}));
            if (aResult.length > 0) return aResult;
            else return null;
            }
            // sApprover = aResult[0].USER_ID;            
 
        }
        catch (error) { throw error; }
 
    },
    getUpdatedFieldsDataForEdit: async function (iReqNo, aUpdatedFieldsIDs, connection) {
        try {

            var aUpdatedIdData = [];
            var aColumnsTemplate = await this.getTemplateColumns(connection);
            if (aUpdatedFieldsIDs.length > 0) {
            if (aColumnsTemplate.length > 0) {
                if (aColumnsTemplate.length !== 0) {
                    var aColumnsTemplateObj = JSON.parse(JSON.stringify(aColumnsTemplate[0]));
                    var aTemplateKeys = Object.keys(aColumnsTemplate[0]);

                    for (var i = 0; i < aTemplateKeys.length; i++) {
                        if (aTemplateKeys[i] === "CCODE" || aTemplateKeys[i] === "REQ_TYPE" || aTemplateKeys[i] === "TYPE") {
                            delete aColumnsTemplateObj[aTemplateKeys[i]];
                        } else if (aUpdatedFieldsIDs.includes(aTemplateKeys[i])) {
                            aColumnsTemplateObj[aTemplateKeys[i].toString()] = 'X';
                        } else {
                            aColumnsTemplateObj[aTemplateKeys[i].toString()] = null;
                        }
                    }
                    aColumnsTemplateObj.REQ_NO = iReqNo;
                    aUpdatedIdData.push(aColumnsTemplateObj);
                } else {
                    throw "TEMPLATE Data missing Mandatory Fields Table";
                }
                }
            }
            return aUpdatedIdData;
        }
        catch (error) {
            throw error;
        }
    },
    postErrorLog: async function (Result, REQUEST_NO, USER_ID,USER_ROLE,APP_NAME, TYPE, dbConn, hdbext) {

        if (Result.OUT_ERROR_CODE !== null || Result.OUT_ERROR_MESSAGE !== null) {

            const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'ERROR_LOG')
            var errorLogStructure = await this.errorLogPayload(REQUEST_NO, null, Result.OUT_ERROR_CODE, Result.OUT_ERROR_MESSAGE, null, USER_ID,USER_ROLE,APP_NAME, TYPE);
            // execProcedure(errorLogStructure);  
            sResponse = await dbConn.callProcedurePromisified(loadProc, errorLogStructure);
        }
    },
    errorLogPayload: async function (REQUEST_NO, SR_NO, ERROR_CODE, ERROR_DESCRPTION, CREATED_ON, USER_ID,USER_ROLE, APP_NAME, TYPE) {
        var aArray = [];
        var oObject = {
            "LOG_ID": await this.createLogID() || null,
            "REQUEST_NO": REQUEST_NO || null,
            "SR_NO": SR_NO || null,
            "ERROR_CODE": ERROR_CODE || null,
            "ERROR_DESCRPTION": ERROR_DESCRPTION || null,
            "CREATED_ON": CREATED_ON || null,
            "USER_ID": USER_ID || null,
            "USER_ROLE": USER_ROLE || null,  
            "APP_NAME": APP_NAME || null,
            "TYPE": TYPE || null   
        }
        aArray.push(oObject)
        return aArray;
    },
    createLogID: function () {   
        var oDate = new Date();
        var sMonth = '00' + String(oDate.getMonth() + 1);
        var sLogID = 'LOG' + oDate.getFullYear() + (sMonth).slice(-2) + ('00' + oDate.getDate()).slice(-2) + ('00' + oDate.getHours()).slice(-2) +
            ('00' + oDate.getMinutes()).slice(-2) + ('00' + oDate.getSeconds()).slice(-2) + ('000' + oDate.getMilliseconds()).slice(-3);
        return sLogID;
    },
    isiDealSettingEnabled: async function (connection, sSettingCode) {
        try {
            var isEnabled = false;
            let aResult = await connection.run(
                SELECT`SETTING`
                    .from`${connection.entities['DEALER_PORTAL.MASTER_IDEAL_SETTINGS']}`
                    .where({ CODE: sSettingCode, SETTING: 'X' })
            );
            if (aResult.length > 0)
                isEnabled = true;

            return isEnabled;
        }
        catch (error) { throw error; }
    },
    getMaxLevel: async function (sEntityCode, sType) {
        try {
            let aResult = await SELECT `MAX(LEVEL)`.from`DEALER_PORTAL_MASTER_APPROVAL_HIERARCHY` .where`ENTITY_CODE=${sEntityCode}
            AND TYPE=${sType}`;
            var vMaxNo = aResult[0]["MAX(LEVEL)"];
            if (aResult.length > 0) return vMaxNo;
            else return null;           
        }
        catch (error) { throw error; }
 
    },
    getRoleForId:async function(connection,sEntityCode,sTableName,sHierarchyId,sAppType){

        try {
            let aResult = await connection.run(
                SELECT
                    .from`${connection.entities[sTableName]}`
                    .where({ ENTITY_CODE: sEntityCode, TYPE: sAppType , HIERARCHY_ID: sHierarchyId}));
            if (aResult.length > 0) return aResult;
            else return null;
            // sApprover = aResult[0].USER_ID;            
 
        }
        catch (error) { throw error; }

    },
	getRegisteredId:async function(iReqNo,connection){
        try {
            // let connection = await cds.connect.to('db');
            let aResult = await connection.run(
                SELECT `REGISTERED_ID`
                    .from`${connection.entities['DEALER_PORTAL.REQUEST_INFO']}`
                    .where({ REQUEST_NO: iReqNo }));
            if (aResult.length > 0) return aResult[0].REGISTERED_ID;
            else return null;      
 
        }
        catch (error) { throw error; }
    },
}