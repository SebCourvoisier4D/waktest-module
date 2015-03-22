var runner = mocha;
runner.setup('bdd');
runner.reporter('wakanda-html');
var expect = chai.expect;
chai.should();
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
