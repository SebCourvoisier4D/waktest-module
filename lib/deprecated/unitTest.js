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
var tools = require("unitTest/lib/deprecated/utility");
var unitTest = require("unitTest/lib/deprecated");
function unitTestHandler(request, response) {
	response.contentType = 'text/javascript';
	var jsContent = "";
	var query = tools.getQueryParameters(request);
	if (query && typeof query.path !== 'undefined') {
		var customFile = File(query.path);
		if (customFile && customFile.exists === true) {
			var textStream = TextStream(customFile, "Read");
			jsContent += textStream.read() + "\n";
			textStream.close();
		}
	} else {
		var comboFile = File(unitTest.getModulePath() + "/yui-combo.js");
		if (comboFile && comboFile.exists === true) {
			var textStream = TextStream(comboFile, "Read");
			jsContent += textStream.read() + "\n";
			textStream.close();
		}
		var watestFile = File(unitTest.getModulePath() + "/yui-watest.js");
		if (watestFile && watestFile.exists === true) {
			var textStream = TextStream(watestFile, "Read");
			jsContent += textStream.read() + "\n";
			textStream.close();
		}
		var unitTestFile = File(unitTest.getModulePath() + "index.js");
		var unitTestFileContent = "";
		if (unitTestFile && unitTestFile.exists === true) {
			var textStream = TextStream(unitTestFile, "Read");
			unitTestFileContent = textStream.read() + "\n";
			textStream.close();
		}
		var wrapperFile = File(unitTest.getModulePath() + "/unitTestWrapper.js");
		if (wrapperFile && wrapperFile.exists === true) {
			var textStream = TextStream(wrapperFile, "Read");
			jsContent += textStream.read().replace(/\/\/@unitTest/, unitTestFileContent) + "\n";
			textStream.close();
		}
	}
	return jsContent;
}
