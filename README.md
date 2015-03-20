## Unit Test Module for [Wakanda](http://wakanda.org)
The Waktest Module is part of the **Wakanda** set of testing tools.
This Module **is required** in order to run the tests on the server-side *and* on the client-side.
### Version
0.0.1
### Supported test libraries
The Waktest Module integrates the following test libraries:
* [Mocha](http://mochajs.org)
* [Chai](http://chaijs.com)
### Installation
1. Copy the whole **"waktest"** folder into the **"Modules"** folder of your Project
2. Right-click on the **"waktest/index.js"** file, then select the **Set as RPC** and **Set as Service** options
3. Edit the settings of your Project (*Source* mode) in order to enable the **waktest service**:
```xml
<service name="waktest" modulePath="waktest" enabled="true" autoStart="true"/>
```
1. Also make sure that the **reuseContexts** option is **disabled**:
```xml
<javaScript reuseContexts="false"/>
```
1. Reload your Solution
### Usage (SSJS tests)
#### Basic
```javascript
var waktest = require('waktest');
waktest.init();
describe("SSJS Tests", function () {
    it("first", function () {
        var toto = true;
        expect(toto).to.not.be.an('undefined');
        expect(toto).to.equal(true);
    });
    it("second", function () {
        var tutu = 'foo';
        expect(tutu).to.equal(null);
    });
});
var result = waktest.run();
```
#### External file
```javascript
var waktest = require('waktest');
waktest.init();
var result = waktest.run('/path/to/my/test.js');
```
```javascript
var waktest = require('waktest');
waktest.init();
var result = waktest.run(new File('/path/to/my/test.js'));
```
#### External folder (will run all the .js files in it)
```javascript
var waktest = require('waktest');
waktest.init();
var result = waktest.run('/path/to/my/folderOfTests/');
```
```javascript
var waktest = require('waktest');
waktest.init();
var result = waktest.run(new Folder('/path/to/my/folderOfTests/'));
```
#### Run remotely (from a browser)
Once the Server is running, open the following URL (assuming your Project is running on 127.0.0.1:8081):
```
http://127.0.0.1:8081/waktest-ssjs?path=/path/to/your/testFileOrFolder
```
You can specify an output format (JSON by default - see below):
```
http://127.0.0.1:8081/waktest-ssjs?path=/path/to/your/testFileOrFolder&format=JUnit
```
#### Result
The *run()* method returns an Object by default (or a JSON string when run from the browser):
```json
{
  "date": "2015-03-13T14:24:36.303Z",
  "completion": 100,
  "passes": 1,
  "failures": 1,
  "duration": "0.0140",
  "suites": [
    {
      "title": "SSJS Tests",
      "passes": 1,
      "failures": 1,
      "duration": "0.0060",
      "tests": [
        {
          "state": "passed",
          "speed": "fast",
          "title": "first",
          "duration": "0.0020",
          "code": "var toto = true;\n \texpect(toto).to.not.be.an('undefined');\n \texpect(toto).to.equal(true);"
        },
        {
          "state": "failed",
          "title": "second",
          "error": {
            "message": "AssertionError: expected 'foo' to equal null",
            "stack": [
              "AssertionError: expected 'foo' to equal null",
              " at Context.<anonymous> (file:///path/to/my/test.js:17:22)",
              " at callFn (file:///path/to/my/Modules/waktest/vendor/mocha.js:4658:21)",
              " at Test.Runnable.run (file:///path/to/my/Modules/waktest/vendor/mocha.js:4651:7)",
              " at Runner.runTest (file:///path/to/my/Modules/waktest/vendor/mocha.js:5067:10)",
              " at file:///path/to/my/Modules/waktest/vendor/mocha.js:5150:12",
              " at next (file:///path/to/my/Modules/waktest/vendor/mocha.js:4992:14)",
              " at file:///path/to/my/Modules/waktest/vendor/mocha.js:5002:7",
              " at next (file:///path/to/my/Modules/waktest/vendor/mocha.js:4937:23)",
              " at file:///path/to/my/Modules/waktest/vendor/mocha.js:4969:5",
              " at timeslice (file:///path/to/my/Modules/waktest/vendor/mocha.js:6513:27)"
            ]
          },
          "code": "var tutu = 'foo';\n \texpect(tutu).to.equal(null);"
        }
      ]
    }
  ]
}
```
You can specifiy a format for the returned result (only **JUnit** is supported right now):
```javascript
var waktest = require('waktest');
waktest.init();
var result = waktest.run('/path/to/my/test.js', 'JUnit');
```
### Development
### Todo's
