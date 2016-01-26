/*
 * This file is part of Wakanda software, licensed by 4D under
 *  (i) the GNU General Public License version 3 (GNU GPL v3), or
 *  (ii) the Affero General Public License version 3 (AGPL v3) or
 *  (iii) a commercial license.
 * This file remains the exclusive property of 4D and/or its licensors
 * and is protected by national and international legislations.
 * In any event, Licensee's compliance with the terms and conditions
 * of the applicable license constitutes a prerequisite to any use of this file.
 * Except as otherwise expressly stated in the applicable license,
 * such license does not include any other license or rights on this file,
 * 4D's and/or its licensors' trademarks and/or other proprietary rights.
 * Consequently, no title, copyright or other proprietary rights
 * other than those specified in the applicable license is granted.
 */
/**
 * @author Sebastien.Courvoisier@4d.com
 */
var dontRequireUnitTest = true;
var tools = require("unitTest/lib/deprecated/utility");
var unitTest = require("unitTest/lib/deprecated");

function serverHandler(request, response) {
    var testData = tools.getQueryParameters(request);
    if (typeof testData.format === "undefined") testData.format = "html";
    var report = "";
    if (typeof testData.path !== "undefined") {
        switch (testData.format) {
            case 'xml':
                report = unitTest.run(testData.path).getXmlReport();
                break;
            case 'json':
                report = JSON.stringify(unitTest.run(testData.path).getReport());
                break;
            default:
                report = unitTest.run(testData.path).getHtmlReport();
        }
    }
    switch (testData.format) {
        case 'xml':
            response.contentType = 'text/xml';
            break;
        case 'json':
            response.contentType = 'application/json';
            break;
        default:
            response.contentType = 'text/html';
    }
    return report;
}
