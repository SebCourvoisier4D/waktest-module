exports.getQueryParameters = function getQueryParameters(request) {
	var queryParameters = {};
	var queryEntities = request.urlQuery.split("&");
	for (var queryEntitiesIdx = 0, queryEntitiesLength = queryEntities.length; queryEntitiesIdx < queryEntitiesLength; queryEntitiesIdx++) {
		var keyValue = queryEntities[queryEntitiesIdx].split("=");
		if (keyValue[0] !== "" && typeof queryParameters[keyValue[0]] === 'undefined') queryParameters[keyValue[0]] = decodeURIComponent(keyValue[1]);
	}
	if (request.method === "POST" && request.body) {
		try {
			queryEntities = request.body.toString().split("&");
			for (var queryEntitiesIdx = 0, queryEntitiesLength = queryEntities.length; queryEntitiesIdx < queryEntitiesLength; queryEntitiesIdx++) {
				var keyValue = queryEntities[queryEntitiesIdx].split("=");
				if (keyValue[0] !== "" && typeof queryParameters[keyValue[0]] === 'undefined') queryParameters[keyValue[0]] = decodeURIComponent(keyValue[1]);
			}
		} catch (e) {

		}
	}
	return queryParameters;
};
exports.encodedStr = function encodedStr(str) {
	var encoded = '';
	if (str) {
		encoded = str.toString().replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
			return '&#' + i.charCodeAt(0) + ';';
		});
		encoded = encoded.replace(/"/g, '&quot;');
	}
	return encoded;
};
