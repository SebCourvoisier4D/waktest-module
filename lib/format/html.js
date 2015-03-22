exports.format = function(data) {
	var basePath = module.id.replace(/html$/i, '');
	var util = require(basePath + '../util.js');
	var _report = ['<html>'];
	_report.push('<body>');
	_report.push('<head>');
	_report.push('<style type="text/css">');
	_report.push(File(basePath + 'html.css').toString());
	_report.push('</style>');
	_report.push('<script type="application/javascript">');
	_report.push('function toggle (id) { var elt = document.getElementById(id); elt.style.display = elt.style.display === "none" ? "" : "none"; }');
	_report.push('</script>');
	_report.push('</head>');
	_report.push('<div id="waktest-report">');
	_report.push('<ul class="stats">');
	_report.push('<li class="progress">' + data.completion + '%</li>');
	_report.push('<li class="passes">passes: <em>' + data.passes + '</em></li>');
	_report.push('<li class="failures">failures: <em>' + data.failures + '</em></li>');
	_report.push('<li class="duration">duration: <em>' + data.duration + '</em>s</li>');
	_report.push('</ul>');
	_report.push('<ul class="report">');
	var eltBaseId = 1;
	data.suites.forEach(function(suite) {
		_report.push('<li class="suite"><h1>' + util.encodedStr(suite.title) + '</h1></li>');
		suite.tests.forEach(function(test) {
			if (test.state === 'passed') {
				_report.push('<li class="test pass ' + test.speed + '"><h2 onclick="toggle(\'code-' + eltBaseId + '\')">' + util.encodedStr(test.title) + '<span class="duration">' + test.duration + 'ms</span></h2>');
				_report.push('<pre id="code-' + eltBaseId + '" class="code" style="display: none;"><code>' + test.code + '</code></pre>');
				_report.push('</li>');
			} else if (test.state === 'failed') {
				_report.push('<li class="test fail"><h2 onclick="toggle(\'code-' + eltBaseId + '\')">' + util.encodedStr(test.title) + '</h2>');
				if (test.error) {
					_report.push('<pre class="error" id="error-' + eltBaseId + '" onclick="toggle(\'stack-' + eltBaseId + '\')">' + test.error.message + '</pre>');
					if (test.error.stack) {
						_report.push('<pre class="stack" id="stack-' + eltBaseId + '" style="display: none;">' + test.error.stack.join('\n') + '</pre>');
					}
				}
				_report.push('<pre id="code-' + eltBaseId + '" class="code" style="display: none;"><code>' + test.code + '</code></pre>');
				_report.push('</li>');
			}
			eltBaseId++;
		});
	});
	_report.push('</ul>');
	_report.push('</div>');
	_report.push('</body>');
	_report.push('</html>');
	return _report.join('\n');
};
exports.getContentType = function() {
	return 'text/html';
}
