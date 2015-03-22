exports.format = function(data) {
	var basePath = module.id.replace(/JUnit$/i, '');
	var util = require(basePath + '../util.js');
	var _report = ['<?xml version="1.0" encoding="utf-8"?>'];
	_report.push('<testsuites success="' + ((data.passes / (data.passes + data.failures)) * 100).toFixed(2) + '%" completion="' + data.completion + '%" passed="' + data.passes + '" failures="' + data.failures + '" tests="' + (data.passes + data.failures) + '" time="' + data.duration + '" path="' + util.encodedStr(data.path) + '">');
	data.suites.forEach(function(suite) {
		_report.push('<testsuite name="' + util.encodedStr(suite.title) + '" passed="' + suite.passes + '" failures="' + suite.failures + '" tests="' + (suite.passes + suite.failures) + '" time="' + suite.duration + '" path="' + util.encodedStr(suite.path) + '">');
		suite.tests.forEach(function(test) {
			if (test.state === 'passed') {
				_report.push('<testcase name="' + util.encodedStr(test.title) + '" passed="true" time="' + test.duration + '" state="' + test.state + '" speed="' + test.speed + '">');
				_report.push('<code><![CDATA[');
				_report.push(test.code);
				_report.push(']]></code>');
				_report.push('</testcase>');
			} else if (test.state === 'failed') {
				_report.push('<testcase name="' + util.encodedStr(test.title) + '" passed="false" time="' + test.duration + '" state="' + test.state + '">');
				if (test.error) {
					_report.push('<failure message="' + util.encodedStr(test.error.message) + '"><![CDATA[');
					if (test.error.stack) {
						_report.push(test.error.stack.join('\n'));
					}
					_report.push(']]></failure>');
				}
				_report.push('<code><![CDATA[');
				_report.push(test.code);
				_report.push(']]></code>');
				_report.push('</testcase>');
			}
		});
		_report.push('</testsuite>');
	});
	_report.push('</testsuites>');
	return _report.join('\n');
};
exports.getContentType = function() {
	return 'application/xml';
}
