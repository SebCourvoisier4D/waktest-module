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
	try {
        document.getElementById('waktest-waf-log').innerHTML = '';
    } catch (e) {
        var elt = document.createElement('div');
        elt.setAttribute('id', 'waktest-waf-log');
        document.body.appendChild(elt);
    }
	runner.run();
};
