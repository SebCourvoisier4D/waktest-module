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
function getQueryParameters(request) {
	var queryParameters = {};
	var queryEntities = request.urlQuery.split("&");
	var queryEntitiesIdx = 0;
	var queryEntitiesLength = queryEntities.length;
	var keyValue = null;
	for (queryEntitiesIdx = 0; queryEntitiesIdx < queryEntitiesLength; queryEntitiesIdx++) {
		keyValue = queryEntities[queryEntitiesIdx].split("=");
		if (keyValue[0] !== "") {
			if (keyValue.length === 1) queryParameters[keyValue[0]] = null;
			else queryParameters[keyValue[0]] = decodeURIComponent(keyValue[1]);
		}
	}
	if (request.method === "POST") {
		queryEntities = request.body.split("&");
		queryEntitiesIdx = 0;
		queryEntitiesLength = queryEntities.length;
		keyValue = null;
		for (queryEntitiesIdx = 0; queryEntitiesIdx < queryEntitiesLength; queryEntitiesIdx++) {
			keyValue = queryEntities[queryEntitiesIdx].split("=");
			if (keyValue[0] !== "") {
				if (keyValue.length === 1) queryParameters[keyValue[0]] = null;
				else queryParameters[keyValue[0]] = decodeURIComponent(keyValue[1]);
			}
		}
	}
	return queryParameters;
}
exports.getQueryParameters = getQueryParameters;

function writeReport(name, content, location) {
	var now = new Date();
	var logsFolder = Folder(application.getFolder("path") + "Logs");
	if (!logsFolder || logsFolder.exists === false) logsFolder.create();
	var logFile = File(application.getFolder("path") + "Logs/" + name + "-results-" + now.getFullYear() + "_" + (now.getMonth() + 1) + "_" + now.getDate() + "-" + now.getHours() + "_" + now.getMinutes() + "_" + now.getSeconds() + ".xml");
	if (logFile && logFile.exists === true) logFile.remove();
	logFile.create();
	var textStream = TextStream(logFile, "Write");
	textStream.write(content);
	textStream.close();
	if (typeof location !== "undefined") {
		var logFile = File(location + "-results-" + now.getFullYear() + "_" + (now.getMonth() + 1) + "_" + now.getDate() + "-" + now.getHours() + "_" + now.getMinutes() + "_" + now.getSeconds() + ".xml");
		if (logFile && logFile.exists === true) logFile.remove();
		try {
			logFile.create();
			var textStream = TextStream(logFile, "Write");
			textStream.write(content);
			textStream.close();
		} catch (e) {

		}
	}
}
exports.writeReport = writeReport;
