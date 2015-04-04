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
exports.getJsFilePathsForFolder = function getJsFilePathsForFolder(folder) {
    var jsFilePaths;

    jsFilePaths = [];
    folder.forEachFile(function(file) {
        if (file.extension === 'js') {
            jsFilePaths.push(file.path);
        }
    });

    jsFilePaths.sort(function(a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });
    return jsFilePaths;
};
exports.getJsFilePathsForFolderRecursive = function getJsFilePathsForFolderRecursive(mainFolder) {
    var jsFilePaths,
        basePath,
        sorter;

    //get js files at the root of the main folder
    jsFilePaths = exports.getJsFilePathsForFolder(mainFolder);

    //get js files in all subfolders recursively
    mainFolder.forEachFolder(function(folder) {
        var jsFilePathsForFolder;
        jsFilePathsForFolder = getJsFilePathsForFolderRecursive(folder);
        jsFilePaths = jsFilePaths.concat(jsFilePathsForFolder);
    });

    //sort the paths
    basePath = module.id.replace(/util$/i, '');
    basePath = basePath.replace('/lib/', '/');
    sorter = require(basePath + 'vendor/path-sort/index').standalone('/');
    jsFilePaths.sort(sorter);

    return jsFilePaths;
};