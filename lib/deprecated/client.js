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

function clientHandler(request, response) {
	response.contentType = 'text/html';
	var testData = tools.getQueryParameters(request);
	var testContent = "";
	var testContentFile = null;
	if (typeof testData.page !== "undefined") {
		testContentFile = File(application.getFolder("path") + "WebFolder" + testData.page);
		if (!testContentFile || testContentFile.exists !== true) testContentFile = File(testData.page);
	} else testContentFile = File(unitTest.getModulePath() + "/unitTestTemplate.html");
	if (testContentFile && testContentFile.exists === true) {
		var textStream = TextStream(testContentFile, "Read");
		var testContent = textStream.read();
		textStream.close();
	}
	if (typeof testData.path !== "undefined") {
		var re = /^walib/i;
		if (re.test(testData.path)) var testFile = File(application.getWalibFolder("path") + testData.path.replace(/walib\//i, ''));
		else var testFile = File(application.getFolder("path") + testData.path);
		if (!testFile || testFile.exists !== true) testFile = File(testData.path);
		if (testFile && testFile.exists === true) {
			var textStream = TextStream(testFile, "Read");
			var testScript = textStream.read().replace(/\$\$/ig, "$$$$$$$$");
			textStream.close();
			testContent = testContent.replace(/{test}/ig, testScript);
		}
		testContent = testContent.replace(/{title}/ig, testData.path);
	}
	if (typeof testData.jobLocation !== "undefined") testContent = testContent.replace(/{jobLocation}/ig, testData.jobLocation);
	else testContent = testContent.replace(/{jobLocation}/ig, "");
	if (typeof testData.jobId !== "undefined") testContent = testContent.replace(/{jobId}/ig, testData.jobId);
	else testContent = testContent.replace(/{jobId}/ig, "");
	return testContent;
}
