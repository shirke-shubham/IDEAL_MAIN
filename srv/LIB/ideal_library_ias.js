const cds = require("@sap/cds");
const dbClass = require("sap-hdbext-promisfied")
const hdbext = require("@sap/hdbext")

module.exports = {
    getIASUser: async function () {
        try {
            var IASConnection = await cds.connect.to('IAS_DEST');
            var IASresult = await IASConnection.send('GET', '/Users', '', { "Accept": "*/*", "Content-Type": "application/scim+json", "DataServiceVersion": "2.0" });

            var lv_total_record = IASresult.totalResults;
            //var lv_total_record = '200'; 
            var request_count = lv_total_record / 100;
            request_count = Math.floor(request_count);
            request_count = request_count + 2;
            var output = {
                records: []
            };

            for (var k = 1; k < request_count; k++) {
                if (k === 1) {
                    var lv_start_Index = 0;
                } else {
                    lv_start_Index = k - 1;
                    lv_start_Index = lv_start_Index * 100;
                    lv_start_Index = lv_start_Index + 1;
                }

                var sequence = "startIndex=" + lv_start_Index;
                var IAS_RES_INIT = await IASConnection.send('GET', '/Users?' + sequence, '', { "Accept": "*/*", "Content-Type": "application/scim+json", "DataServiceVersion": "2.0" });
                IAS_RES_INIT = JSON.stringify(IAS_RES_INIT);
                IAS_RES_INIT = IAS_RES_INIT.replace("urn:ietf:params:scim:schemas:core:2.0:User", "extensionsapUser");
                IAS_RES_INIT = JSON.parse(IAS_RES_INIT);
                var Resources = IAS_RES_INIT.Resources;

                for (var i = 0; i < Resources.length; i++) {
                    var emails = Resources[i].emails;
                    for (var j = 0; j < emails.length; j++) {
                        if (emails[j].primary === true) {
                            var mail = emails[j].value;
                        }
                    }
                    if (Resources[i].active === true) {
                        var userStatus = 'active';
                    } else {
                        userStatus = 'inactive';
                    }
                    var lastname = Resources[i].name.givenName;
                    if (lastname === null || lastname === undefined) {
                        lastname = ".";
                    }

                    var str = Resources[i];
                    str = JSON.stringify(str);
                    str = str.replace("urn:ietf:params:scim:schemas:extension:sap:2.0:User", "extensionsapUser");
                    str = str.replace("urn:ietf:params:scim:schemas:extension:sap:2.0:User", "extensionsapUser");
                    str = str.replace("urn:ietf:params:scim:schemas:extension:enterprise:2.0:User", "extensionorgUser");
                    str = str.replace("urn:ietf:params:scim:schemas:extension:enterprise:2.0:User", "extensionorgUser");
                    var JsonData = JSON.parse(str);
                    var mobileNo = "";

                    if (JsonData.hasOwnProperty('phoneNumbers')) {
                        mobileNo = JsonData.phoneNumbers[0].value;
                    }

                    if (JsonData.extensionorgUser === undefined) {
                        var company = 'null';
                        var employeeNumber = 'null';
                    } else {
                        if (JsonData.extensionorgUser.organization === '' || JsonData.extensionorgUser.organization === undefined
                            || JsonData.extensionorgUser.organization === null) {
                            JsonData.extensionorgUser.organization = 'null';
                        } else {
                            company = JsonData.extensionorgUser.organization;
                        }
                        if (JsonData.extensionorgUser.employeeNumber === '' || JsonData.extensionorgUser.employeeNumber === undefined
                            || JsonData.extensionorgUser.employeeNumber === null) {
                            employeeNumber = 'null';
                        } else {
                            employeeNumber = JsonData.extensionorgUser.employeeNumber;
                        }
                    }
                    if (company === undefined) {
                        company = 'null';
                    }
                    var myJson = {
                        "USER_ID": JsonData.extensionsapUser.userId,
                        "STATUS": userStatus,
                        "LOGIN": Resources[i].userName,
                        "EMAIL": mail,
                        "FIRST_NAME": Resources[i].name.familyName,
                        "LAST_NAME": lastname,
                        "COMPANY_CODE": company,
                        "EMP_NO": employeeNumber,
                        "MOBILE_NO": mobileNo
                    };
                    output.records.push(myJson);
                    mail = null;
                    myJson = null;
                    userStatus = null;
                }


            }

            var client = await dbClass.createConnectionFromEnv();
            let dbConn = new dbClass(client);
            const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'IAS_USER_UPDATE');
            var sResponse = await dbConn.callProcedurePromisified(loadProc, output.records);

        } catch (error) {
            throw error;
        }

        return IASresult;
    },
    _sendToIAS: async function (oIASBodyPayload) {
        try {
            var IASConnection = await cds.connect.to('IAS_DEST');
            var IASPostResult = await IASConnection.send('POST', '/Users', oIASBodyPayload,
                { "Accept": "*/*", "Content-Type": "application/scim+json", "DataServiceVersion": "2.0" });
            var displayname = IASPostResult.displayName;
            var id = IASPostResult.id;
            //var userId = IASPostResult.'urn:ietf:params:scim:schemas:extension:sap:2.0:User'.userId;
            var group_body = "{  \"schemas\": [  \"urn:ietf:params:scim:api:messages:2.0:PatchOp\"  ],  \"Operations\": [ { " +
                "\"op\": \"add\", \"path\": \"members\",  \"value\": [ {  \"display\": \"" + displayname + "\"," + " \"value\": \"" + id + "\"      }      ]    }  ]}";
            await IASConnection.send('PATCH', '/Groups/5755eacc-3dfc-4618-a4f9-a7b2dba875ab',
                group_body, { "Accept": "*/*", "Content-Type": "application/scim+json", "DataServiceVersion": "2.0" });

            var oIASResponse = {
                status: '201',
                body: IASPostResult ? IASPostResult : null,
                headers: IASPostResult ? IASPostResult : null
            };

            var iStatus = 201;
            var sRemark = "Success";
            var sStatus = "X";
            var sUSER_ID = oIASResponse.body["urn:ietf:params:scim:schemas:extension:sap:2.0:User"].userId;
            var oResponseObj = {
                "USER_ID": sUSER_ID,
                "DISPLAYNAME": oIASBodyPayload.displayName,
                "ID": oIASResponse.body.id,
                "DISTCODE": oIASBodyPayload.userName,
                "REMARK": sRemark,
                "PAYLOAD": oIASBodyPayload,
                "STATUS": sStatus,
                "STATUS_CODE": iStatus
            };
            return oResponseObj;
        } catch (error) {
            var oResponseObj = {
                "USER_ID": "",
                "DISPLAYNAME": await oIASBodyPayload.displayName,
                "ID": "",
                "DISTCODE": await oIASBodyPayload.userName,
                "PAYLOAD": await oIASBodyPayload,
                "REMARK": "Failed-" + await error.reason.response.body.detail,
                "STATUS": "",
                "STATUS_CODE": await error.reason.response.body.status
            };
            return oResponseObj
        }
    },
    CreateDealerIdIAS: async function (sSAPDistCode, sName1, sName2, sEmaiID) {

        var givenName = sName1.substring(0, 40);

        if (sName1.length > 40) { givenName = sName1.substring(40, sName1.length); }
        var oIASPayload = {
            "schemas": [
                "urn:ietf:params:scim:schemas:core:2.0:User",
                "urn:ietf:params:scim:schemas:extension:sap:2.0:User"],
            "userName": sSAPDistCode,
            "name": {
                "familyName": sName1.substring(0, 40) || "",
                "givenName": givenName,
                "honorificPrefix": "Mr."
            },
            "displayName": sName1,
            "userType": "Partner",
            "active": true,
            "emails": [
                { "value": sEmaiID }
            ],
            "urn:ietf:params:scim:schemas:extension:sap:2.0:User": {
                "sendMail": true
            }
        };
        var oRespIAS = await this._sendToIAS(oIASPayload);
        return oRespIAS;
    },
    // UpdateDealerEmailIdIAS: async function (sapVendoCode, newEmaiID) {

    //     try {
    //         var IASConnection = await cds.connect.to('IAS_DEST');

    //         var IASVendorResult = await IASConnection.send('GET', '/Users?filter=userName%20eq%20%22' + sapVendoCode + '%22', '',
    //             { "Accept": "*/*", "Content-Type": "application/scim+json", "DataServiceVersion": "2.0" });

    //         if (IASVendorResult.totalResults == 1) {
    //             var username, uuid, displayName, familyName, givenName, userType, honorificPrefix, newemail;
    //             newemail = newEmaiID;
    //             uuid = IASVendorResult.Resources[0].id;
    //             username = IASVendorResult.Resources[0].userName;
    //             displayName = IASVendorResult.Resources[0].displayName;
    //             familyName = IASVendorResult.Resources[0].name.familyName;
    //             givenName = IASVendorResult.Resources[0].name.givenName;
    //             honorificPrefix = IASVendorResult.Resources[0].name.honorificPrefix;
    //             userType = IASVendorResult.Resources[0].userType;

    //             if (givenName == 'null' || givenName == '' || givenName == undefined || givenName == '[null]') {
    //                 givenName = familyName;
    //             }
    //             if (honorificPrefix == 'null' || honorificPrefix == '' || honorificPrefix == undefined || honorificPrefix == '[null]') {
    //                 honorificPrefix = "Mr.";
    //             }
    //             var update_body = {
    //                 "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"
    //                     , "urn:ietf:params:scim:schemas:extension:sap:2.0:User"],
    //                 "userName": username,
    //                 "displayName": displayName,
    //                 "name": {
    //                     "familyName": familyName,
    //                     "givenName": givenName,
    //                     "honorificPrefix": honorificPrefix
    //                 },
    //                 "userType": userType,
    //                 "active": true,
    //                 "emails": [{ "value": newemail, "primary": true }]
    //             };

    //             var IASVendorUpdateResult = await IASConnection.send('PUT', '/Users/' + IASVendorResult.Resources[0].id, update_body,
    //                 { "Accept": "*/*", "Content-Type": "application/scim+json", "DataServiceVersion": "2.0" });

    //             return IASVendorUpdateResult;
    //         } else {
    //             var errores = {
    //                 "status": 404,
    //                 "message": "User Not Found"
    //             };
    //             return errores
    //         }

    //     } catch (error) {
    //         var errores = {
    //             "status":await error.reason.response.body.status,
    //             "message":await error.reason.response.body.detail
    //         };

    //     }
    // }
}