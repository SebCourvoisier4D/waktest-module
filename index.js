var _global = this;
var _runner, _runnerName, _assertion, _assertionName, _assertionStyle;
var _timeout = null;
var _moduleName = 'waktest-module';
exports.postMessage = function(message) {
	if (message.name === 'httpServerDidStart') {
		addHttpRequestHandler('/waktest-waf-lib?.*', _moduleName, 'getWaktestWafLib');
		addHttpRequestHandler('/waktest-waf-css?.*', _moduleName, 'getWaktestWafStylesheet');
		addHttpRequestHandler('/waktest-ssjs?.*', _moduleName, 'runSSJSTestFromRequest');
		addHttpRequestHandler('/waktest-format?.*', _moduleName, 'formatTestFromRequest');
	} else if (message.name === 'httpServerWillStop') {
		removeHttpRequestHandler('/waktest-waf-lib?.*', _moduleName, 'getWaktestWafLib');
		removeHttpRequestHandler('/waktest-waf-css?.*', _moduleName, 'getWaktestWafStylesheet');
		removeHttpRequestHandler('/waktest-ssjs?.*', _moduleName, 'runSSJSTestFromRequest');
		removeHttpRequestHandler('/waktest-format?.*', _moduleName, 'formatTestFromRequest');
	}
};
exports.getWaktestWafLib = function(request, response) {
	response.contentType = 'application/javascript';
	var libContent = [];
	var runner = 'mocha';
	var assertion = 'chai';
	var assertionStyle = 'bdd';
	var basePath = module.id.replace(/index$/i, '');
	var util = require(basePath + 'lib/util.js');
	var query = util.getQueryParameters(request);
	if (typeof query.runner !== 'undefined' && query.runner) {
		runner = query.runner;
	}
	if (typeof query.assertion !== 'undefined' && query.assertion) {
		assertion = query.assertion;
	}
	if (typeof query.assertionStyle !== 'undefined' && query.assertionStyle) {
		assertionStyle = query.assertionStyle;
	}
	var jQuerysimulateLib = new File(basePath + 'vendor/jquery.simulate.js');
	if (jQuerysimulateLib.exists === true) {
		libContent.push(jQuerysimulateLib.toString());
	}
	var assertionLib = new File(basePath + 'vendor/' + assertion + '.js');
	if (assertionLib.exists === true) {
		libContent.push(assertionLib.toString());
	} else {
		libContent.push('throw \'Assertion library "' + assertionLib.path + '" not found.\';'); // @FIXME: display errors in widget
	}
	var runnerLib = new File(basePath + 'vendor/' + runner + '.js');
	if (runnerLib.exists === true) {
		libContent.push(runnerLib.toString());
	} else {
		libContent.push('throw \'Runner library "' + runnerLib.path + '" not found.\';'); // @FIXME: display errors in widget
	}
	var bootstrap = new File(basePath + 'vendor/bootstrap/html-' + runner + '-' + assertion + '-' + assertionStyle + '.js');
	if (bootstrap.exists === true) {
		libContent.push(bootstrap.toString());
	}
	libContent.push('document.body.focus();');
	libContent.push('runner.name = \'' + runner + '\';');
	libContent.push('runner.assertion = \'' + assertion + '\';');
	libContent.push('runner.style = \'' + assertionStyle + '\';');
	libContent.push('runner.request = JSON.parse(\'' + JSON.stringify(request) + '\');');
	libContent.push('runner.queryParams = JSON.parse(\'' + JSON.stringify(query) + '\');');
	if (typeof query.path !== 'undefined' && query.path) {
		libContent.push('var _waktest_path = \'' + query.path + '\';');
		libContent.push('var _waktest_paths = [];');
		if (/^\//.test(query.path) === true || /^\w:\//.test(query.path) === true) {
			if (File.isFile(query.path) === true) {
				var testScript = new File(query.path);
			} else if (Folder.isFolder(query.path) === true) {
				var testScript = new Folder(query.path);
			} else {
				libContent.push('throw \'Test suite file or folder "' + query.path + '" not found.\';'); // @FIXME: display errors in widget
			}
		} else {
			if (File.isFile(application.getItemsWithRole('webfolder').path + query.path) === true) {
				var testScript = new File(application.getItemsWithRole('webfolder').path + query.path);
			} else if (Folder.isFolder(application.getItemsWithRole('webfolder').path + query.path) === true) {
				var testScript = new Folder(application.getItemsWithRole('webfolder').path + query.path);
			} else {
				libContent.push('throw \'Test suite file or folder "' + query.path + '" not found in WebFolder.\';'); // @FIXME: display errors in widget
			}
		}
		if (testScript instanceof File) {
			if (testScript.exists === true) {
				libContent.push('_waktest_paths.push(\'' + testScript.path + '\');');
				libContent.push(testScript.toString());
			} else {
				libContent.push('throw \'Test suite file "' + testScript.path + '" not found.\';'); // @FIXME: display errors in widget
			}
		} else if (testScript instanceof Folder) {
			if (testScript.exists === true) {
				var files = testScript.files;
				files.sort(function(a, b) {
					if (a.name < b.name) return -1;
					if (a.name > b.name) return 1;
					return 0;
				});
				for (var i = 0; i < files.length; i++) {
					if (/\.js$/.test(files[i].name) === true) {
						libContent.push('_waktest_paths.push(\'' + files[i].path + '\');');
						libContent.push(files[i].toString());
					}
				}
			} else {
				libContent.push('throw \'Test suite folder "' + testScript.path + '" not found.\';'); // @FIXME: display errors in widget
			}
		}
	}
	if (typeof query.widgetId !== 'undefined' && query.widgetId) {
		libContent.push('if (typeof _waktest_waf_ready === \'function\') setTimeout(_waktest_waf_ready, 500);');
	}
	return libContent.join('\n');
};
exports.getWaktestWafStylesheet = function(request, response) {
	response.contentType = 'text/css';
	var cssContent = [];
	var runner = 'mocha';
	var basePath = module.id.replace(/index$/i, '');
	var util = require(basePath + 'lib/util.js');
	var query = util.getQueryParameters(request);
	if (typeof query.runner !== 'undefined' && query.runner) {
		runner = query.runner;
	}
	var runnerCss = new File(basePath + 'vendor/css/' + runner + '.css');
	if (runnerCss.exists === true) {
		cssContent.push(runnerCss.toString());
	}
	return cssContent.join('\n');
};
exports.runSSJSTestFromRequest = function(request, response) {
	var result = null;
	var runnerName = 'mocha';
	var assertionName = 'chai';
	var assertionStyle = 'bdd';
	var format = 'html'; // html by default
	var basePath = module.id.replace(/index$/i, '');
	var util = require(basePath + 'lib/util.js');
	var query = util.getQueryParameters(request);
	if (typeof query.runner !== 'undefined' && query.runner) {
		runnerName = query.runner;
	}
	if (typeof query.assertion !== 'undefined' && query.assertion) {
		assertionName = query.assertion;
	}
	if (typeof query.assertionStyle !== 'undefined' && query.assertionStyle) {
		assertionStyle = query.assertionStyle;
	}
	if (typeof query.format !== 'undefined' && query.format) {
		format = query.format;
	}
	_global.runner = this.init(runnerName, assertionName, {
		setup: assertionStyle,
		reporter: 'wakanda-ssjs'
	});
	_global.runner.name = runnerName;
	_global.runner.assertion = assertionName;
	_global.runner.style = assertionStyle;
	_global.runner.request = request;
	_global.runner.queryParams = query;
	if (format === 'json') {
		response.contentType = 'application/json';
		result = this.run(query.path);
	} else {
		result = this.run(query.path, format); // @TODO: handle errors
		try {
			var formatter = require(basePath + 'lib/format/' + format);
			response.contentType = formatter.getContentType(request);
		} catch (e) {
			// @TODO: handle errors
		}
	}
	if (typeof result === 'object') {
		result = JSON.stringify(result);
	}
	return result.toString();
};
exports.formatTestFromRequest = function(request, response) {
	var result = null;
	var format = null;
	var basePath = module.id.replace(/index$/i, '');
	var util = require(basePath + 'lib/util.js');
	var query = util.getQueryParameters(request);
	if (typeof query.format !== 'undefined' && query.format) {
		format = query.format;
	}
	if (typeof request.body !== 'undefined' && request.body) {
		try {
			result = JSON.parse(request.body);
		} catch (e) {
			// @TODO: handle errors
		}
	}
	response.contentType = 'text/plain';
	if (format !== null) {
		try {
			var formatter = require(basePath + 'lib/format/' + format);
			result = formatter.format(result);
		} catch (e) {
			// @TODO: handle errors
		}
	}
	if (typeof result === 'object') {
		result = JSON.stringify(result);
	}
	return result.toString();
};
exports.setTimeout = function(timeout) {
	_timeout = timeout;
};
exports.init = function(runnerName, assertionName, runnerOptions, assertionOptions) {
	var basePath = module.id.replace(/index$/i, '');
	if (typeof runnerName === 'undefined') {
		runnerName = 'mocha';
	}
	if (typeof assertionName === 'undefined') {
		assertionName = 'chai';
	}
	if (typeof runnerOptions === 'undefined' || runnerOptions === null) {
		if (runnerName === 'mocha') {
			runnerOptions = {
				setup: 'bdd',
				reporter: 'wakanda-ssjs'
			};
		} else {
			runnerOptions = {};
		}
	}
	if (typeof assertionOptions === 'undefined' || assertionOptions === null) {
		assertionOptions = {};
	}
	var runnerLibFile = new File(basePath + 'vendor/' + runnerName + '.js');
	if (runnerLibFile.exists === false) {
		throw 'Runner library "' + runnerName + '" not found.';
	}
	var assertionLibFile = new File(basePath + 'vendor/' + assertionName + '.js');
	if (assertionLibFile.exists === false) {
		throw 'Assertion library "' + assertionName + '" not found.';
	}
	try {
		_global.location = {};
		include(runnerLibFile);
	} catch (e) {
		throw 'Runner library "' + runnerName + '" cannot be included: ' + JSON.stringify(e);
	}
	try {
		include(assertionLibFile);
	} catch (e) {
		throw 'Assertion library "' + assertionName + '" cannot be included: ' + JSON.stringify(e);
	}
	var assertionStyle = 'bdd';
	for (var option in runnerOptions) {
		if (typeof _global[runnerName][option] !== 'function') {
			throw 'The "' + option + '" option is not available in the "' + runnerName + '" runner library';
		} else {
			_global[runnerName][option](runnerOptions[option]);
			if (runnerOptions[option].toLowerCase() === 'bdd') {
				assertionStyle = 'bdd';
			} else if (runnerOptions[option].toLowerCase() === 'tdd') {
				assertionStyle = 'tdd';
			}
		}
	}
	for (var option in assertionOptions) {
		if (typeof _global[assertionName][option] !== 'function') {
			throw 'The "' + option + '" option is not available in the "' + assertionName + '" assertion library';
		} else {
			_global[assertionName][option](assertionOptions[option]);
		}
	}
	var bootstrap = new File(basePath + 'vendor/bootstrap/ssjs-' + runnerName + '-' + assertionName + '-' + assertionStyle + '.js');
	if (bootstrap.exists === true) {
		include(bootstrap);
	}
	_assertionStyle = assertionStyle;
	_assertionName = assertionName;
	_assertion = _global[assertionName]
	_runnerName = runnerName;
	_runner = _global[runnerName];
	return _runner;
};
exports.run = function(suite, format, formatOpt) {
	var basePath = module.id.replace(/index$/i, '');
	var _result = null;
	var path = null,
		paths = [];
	if (typeof suite === 'string') {
		path = suite;
		if (File.isFile(suite) === true) {
			suite = new File(suite);
		} else if (Folder.isFolder(suite) === true) {
			suite = new Folder(suite);
		} else {
			throw 'Test suite file or folder "' + suite + '" not found.';
		}
	}
	if (suite instanceof File) {
		path = suite.path;
		paths.push(suite.path);
		if (suite.exists === true) {
			try {
				include(suite);
			} catch (e) {
				throw 'Test suite file "' + suite.path + '" cannot be included: ' + JSON.stringify(e);
			}
		} else {
			throw 'Test suite file "' + suite.path + '" not found.';
		}
	} else if (suite instanceof Folder) {
		path = suite.path;
		if (suite.exists === true) {
			var files = suite.files;
			files.sort(function(a, b) {
				if (a.name < b.name) return -1;
				if (a.name > b.name) return 1;
				return 0;
			});
			for (var i = 0; i < files.length; i++) {
				if (/\.js$/.test(files[i].name) === true) {
					paths.push(files[i].path);
					try {
						include(files[i]);
					} catch (e) {
						throw 'Test suite file "' + files[i].path + '" cannot be included: ' + JSON.stringify(e);
					}
				}
			}
		} else {
			throw 'Test suite folder "' + suite.path + '" not found.';
		}
	}
	if (typeof _runner.run !== 'function') {
		throw 'The "run" method is not available in the "' + _runnerName + '" runner library';
	} else {
		if (typeof _global.runner === 'undefined') _global.runner = _runner;
		if (typeof _global.runner.name === 'undefined') _global.runner.name = _runnerName;
		if (typeof _global.runner.assertion === 'undefined') _global.runner.assertion = _assertionName;
		if (typeof _global.runner.style === 'undefined') _global.runner.style = _assertionStyle
		if (typeof _global.runner.request === 'undefined') _global.runner.request = {};
		if (typeof _global.runner.queryParams === 'undefined') _global.runner.queryParams = {
			path: path,
			format: format
		};
		_runner._wakanda_report = null;
		_runner.run();
		if (_timeout !== null && _timeout > 0) {
			wait(_timeout);
		} else {
			wait();
		}
		_result = _runner._wakanda_report;
		if (path !== null) {
			_result.path = path;
			for (var i = 0; i < paths.length; i++) {
				if (typeof _result.suites[i] !== 'undefined') {
					_result.suites[i].path = paths[i];
				}
			}
		}
	}
	if (typeof format === 'function') {
		return format(_result, formatOpt);
	}
	if (typeof format === 'string' && format !== 'json') {
		try {
			var formatter = require(basePath + 'lib/format/' + format);
			return formatter.format(_result, formatOpt);
		} catch (e) {
			throw 'Unknown format "' + format + '"';
		}
	}
	return _result;
};
