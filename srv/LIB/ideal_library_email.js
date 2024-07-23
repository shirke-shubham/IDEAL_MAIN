const { throwErrorWhenReturnTypeIsUnionType } = require("@sap-cloud-sdk/core");
const cds = require("@sap/cds");
const dbClass = require("sap-hdbext-promisfied")
const hdbext = require("@sap/hdbext")
var nodemailer = require('nodemailer');
const { SYSTEM } = require("@sap/xssec/lib/constants");
module.exports = {

    // Main function for email trigger call 
    sendEmail: async function (connection, sEmailBody, sEmailSubject, aEmailTo, aEmailCC, sEmailSender) {

        // CC added for developers to receive emails while testing 
        var aSampleCC = ["siddhesh.d@intellectbizware.com", "priya.g@intellectbizware.com", "aniket.s@intellectbizware.com"];
        if (aEmailCC === null || aEmailCC.length < 0) aEmailCC = aSampleCC
        else if (aEmailCC.length > 0) aEmailCC.push(aSampleCC.toString());

        return this.emailTriggerCPI(connection, sEmailBody, sEmailSubject, aEmailTo, aEmailCC, sEmailSender);
    },

    emailTriggerCPI: async function (connection, sEmailBody, sEmailSubject, aEmailTo, aEmailCC, sEmailSender) {
        try {
            // Get email contact id
            if (sEmailSender === null || sEmailSender === "" || sEmailSender === undefined) {
                var aEmailIds = await this.getEmailContactId(connection);
                if (aEmailIds === null) {
                    throw { "message": "Sender email id is missing in master" }
                }
                sEmailSender = aEmailIds.EMAIL_NOTIF_1;
            }

            // CC Check
            if (aEmailCC === null) {
                aEmailCC = [];
            }

            //set connection to Email Destination
            let emailConnection = await cds.connect.to('EMAIL_DEST');

            // const result = await SPA_API.send('POST', '/workflow/rest/v1/workflow-instances',
            //  JSON.stringify(workflowContent), { "Content-Type": "application/json" });

            //Email to
            var params = "send_email?EmailTo= " + aEmailTo.toString();

            //Email Body
            params += "&EmailBody=" + encodeURIComponent(sEmailBody);

            //Email Sender
            params += "&EmailSender=" + sEmailSender;

            //Email CC
            params += "&EmailCc=" + aEmailCC.toString();

            //Email Subject
            params += "&EmailSubject= " + sEmailSubject;

            var path = encodeURI(params);
            const Mailresult = await emailConnection.send('GET', path);

            return Mailresult;
        }
        catch (error) { throw error }
    },

    getEmailContactId: async function (connection) {
        try {
            let aResult = await connection.run(SELECT.from`${connection.entities['DEALER_PORTAL.MASTER_EMAIL_CONTACT_ID']}`);
            var aEmailIds = null;

            // var conn = $.hdb.getConnection();
            // var sQuery = 'SELECT * FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::MASTER_EMAIL_CONTACT_ID" ';
            // var aResult = conn.executeQuery(sQuery);

            if (aResult.length > 0) {
                aEmailIds = aResult.length > 0 ? aResult[0] : null;
            }

            // conn.close();
            return aEmailIds;
        }
        catch (error) {
            throw error;
        }
    },

    getSubaccountDetais: async function (connection) {
        // var conn = $.hdb.getConnection();
        var oResult = {};
        // var sQuery =
        // 'SELECT "SUBACCOUNT" AS SUBACCOUNT, "PORTAL_LINK" AS PORTAL_LINK FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::MASTER_SUBACCOUNT"';
        // var aResult = conn.executeQuery(sQuery);

        let aResult = await connection.run(SELECT.from`${connection.entities['DEALER_PORTAL.MASTER_SUBACCOUNT']}`);

        if (aResult.length > 0) {
            oResult.SUBACCOUNT = aResult[0].SUBACCOUNT;
            oResult.PORTAL_LINK = aResult[0].PORTAL_LINK;
        } else {
            oResult = null;
        }
        // conn.close();

        return oResult;
    },
    isiDealSettingEnabled: async function (connection, sSettingCode) {
        try {
            var isEnabled = false;
            let aResult = await connection.run(
                SELECT`SETTING`
                    .from`${connection.entities['DEALER_PORTAL.MASTER_IDEAL_SETTINGS']}`
                    .where({ CODE: sSettingCode, SETTING: 'X' })
            );
            // var sQuery = 'SELECT * FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::MASTER_IVEN_SETTINGS" ';
            //     sQuery += 'WHERE "CODE" = ?';

            if (aResult.length > 0)
                isEnabled = true;

            return isEnabled;
        }
        catch (error) { throw error; }
    },
    sendTestEmail: async function (sEmailBody, sEmailSubject, aEmailTo, aEmailCC, sEmailSender) {

        this.sendEmail('This is test email', "Test java Email from CAPM", aEmailTo, aEmailCC, sEmailSender)
    },
    getSAPClient: async function (conn) {
        try {

            var iClient = null;
            var conn = $.hdb.getConnection();

            // var sQuery = 'SELECT TOP 1 "CLIENT" AS CLIENT FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::MASTER_SAP_CLIENT" ';
            // var aResult = conn.executeQuery(sQuery);
            let aResult = await conn.run(
                SELECT`CLIENT`
                    .from`${conn.entities['DEALER_PORTAL.MASTER_SAP_CLIENT']}`
                    
            );
            if (aResult.length > 0) {
                iClient = aResult[0].CLIENT !== undefined ? aResult[0].CLIENT : null;
            }

            // conn.close();
            return iClient;
        } catch (error) { throw error; }

    },
    getSAPDestination: async function (conn) {
        try {
            var iClient = null;
            // var conn = $.hdb.getConnection();

            // var sQuery = 'SELECT TOP 1 "DESTINTAION" AS DESTINTAION FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::MASTER_SAP_CLIENT" ';
            // var aResult = conn.executeQuery(sQuery);
            let aResult = await conn.run(
                SELECT`DESTINTAION`
                    .from`${conn.entities['DEALER_PORTAL.MASTER_SAP_CLIENT']}`
            );
            if (aResult.length > 0) {
                iClient = aResult[0].DESTINTAION !== undefined ? aResult[0].DESTINTAION : null;
            }
            // conn.close();
            return iClient;
        } catch (error) { throw error; }
    },
    getEmailConfig: async function(){
        
        let connection = await cds.connect.to('db');
        let queryResult = await connection.run(SELECT`*`.from`${connection.entities['DEALER_PORTAL.EMAIL_CONFIG']}`.where`SR_NO = 1`);
      return queryResult[0];
    },
    sendidealEmail: async function (ToEmails, CCEmail, type, subject, body) {
        try {
              // CC added for developers to receive emails while testing 
        // var aSampleCC = ["siddhesh.d@intellectbizware.com", "supritha.m@intellectbizware.com", "farzeen.s@intellectbizware.com", "amit.m@intellectbizware.com", "vishal.s@intellectbizware.com"];
        // if (CCEmail === null || CCEmail.length < 0) CCEmail = aSampleCC
        // else if (CCEmail.length > 0) CCEmail.push(aSampleCC.toString());

            const lvEmailConfig = await this.getEmailConfig();
            const transporter = nodemailer.createTransport({
                host: lvEmailConfig.HOST,
                port: lvEmailConfig.PORT,
                secure: lvEmailConfig.SECURE, // STARTTLS
                auth: {
                    user: lvEmailConfig.USERNAME,
                    pass: lvEmailConfig.PASSWORD,
                },
            });
            var senderEmail = lvEmailConfig.SENDER_EMAIL;
            // var sToEmails = ToEmails.toString();
            // var sCCEmail = CCEmail.toString();
            if (type == 'html') {
                var mailOptions = {
                    from: senderEmail,
                    to: ToEmails,
                    cc: CCEmail,
                    subject: subject,
                    html: body

                };

            } else {
                var mailOptions = {
                    from: senderEmail,
                    to: ToEmails,
                    cc: CCEmail,
                    subject: subject,
                    text: body
                };
            }

            var mailres = await transporter.sendMail(mailOptions);
           
            var output = {
                records: []
            };
            var logdata = {
                "LOG_ID": '0',
                "STATUS": '01',
                "STATUS_DSC": 'SUCCESS',
                "LOG": JSON.stringify(mailres),
                "CREATED_ON": '',
                "CREATED_DATE": '',
                "USER_ID": "userid",
                "TO_EMAIL": '0',
                "CC_EMAIL": '0',
                "SUBJECT": '0',
                "BODY": '0',
                "TYPE": '0'
            };
            output.records.push(logdata);
            var client = await dbClass.createConnectionFromEnv();
            let dbConn = new dbClass(client);
            const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'EMAIL_LOG');
            var sResponse = await dbConn.callProcedurePromisified(loadProc, ['CREATE', output.records]);

        } catch (error) {
            // var userid = this.user.USER_ID;
            var output = {
                records: []
            };
            var logdata = {
                "LOG_ID": '0',
                "STATUS": '02',
                "STATUS_DSC": 'FAILED',
                "LOG": error.message,
                "CREATED_ON": '',
                "CREATED_DATE": '',
                "USER_ID": 'userid',
                "TO_EMAIL": ToEmails,
                "CC_EMAIL": CCEmail,
                "SUBJECT": subject,
                "BODY": body,
                "TYPE": type
            };
            output.records.push(logdata);
            var client = await dbClass.createConnectionFromEnv();
            let dbConn = new dbClass(client);
            const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'EMAIL_LOG');
            var sResponse = await dbConn.callProcedurePromisified(loadProc, ['CREATE', output.records]);

        }

    },
    // setSampleCC:async function(aEmailCC){
    //     var aSampleCC =  [
    //      "priya.g@intellectbizware.com", "aniket.s@intellectbizware.com", "prajwal.g@intellectbizware.com"];
    //     if (aEmailCC === null || aEmailCC.length < 0) aEmailCC = aSampleCC
    //     else if (aEmailCC.length > 0) aEmailCC.push(aSampleCC.toString());   
    //    return aEmailCC.toString();
    // }
    setDynamicCC:async function(aEmailCC){
        var aEmailTable=await SELECT .columns(['EMAIL_CC']) .from('DEALER_PORTAL_MASTER_EMAIL_CONTACT_ID') .where({SR_NO:1});                    
        var aEmailCCInfo=aEmailTable[0].EMAIL_CC.split(',')     
        if(typeof(aEmailCC)=='string') return aEmailCC.toString()
        else if (aEmailCC === null || aEmailCC.length < 0) 
            aEmailCC = aEmailCCInfo;                      
        else if (aEmailCC.length > 0) 
            aEmailCC=[...new Set([...aEmailCC,...aEmailCCInfo])]   //set operator to keep only unique emails     
       return aEmailCC.toString();            
    }
}