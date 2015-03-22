var assert = chai.assert;
function eventually (done, assertions) {
	try {
		assertions();
		done();
	} catch (e) {
		done(e);
	}
}
