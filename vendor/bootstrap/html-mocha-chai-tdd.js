var runner = mocha;
runner.setup('tdd');
runner.reporter('wakanda-html');
var assert = chai.assert;
function eventually (done, assertions) {
	try {
		assertions();
		done();
	} catch (e) {
		done(e);
	}
}
var _waktestRun = function _waktestRun() {
	$('#waktest-waf-log').html('');
	runner.run();
};
