## Unit Test Module for [Wakanda Server](http://wakanda.org)

This Module is part of a set of Unit Testing tools for [Wakanda Server](http://wakanda.org):

* [Unit Test Widget](https://github.com/SebCourvoisier4D/waktest-widget.git) for Wakanda WAF
* [Unit Test Add-On](https://github.com/SebCourvoisier4D/waktest-addon.git) for Wakanda Studio

This Module **is required** in order to run your Server-Side, Client-Side and Studio-Side unit tests.

### Version

0.0.1

### Supported test libraries

This Module integrates the following test libraries:

* [Mocha](http://mochajs.org)
* [Chai](http://chaijs.com)

### Installation

1. Import the Module using the Add-ons tool of Wakanda Studio, via its URL: https://github.com/SebCourvoisier4D/waktest-module.git
2. Right-click on the **"waktest-module/index.js"** file, then select the **Set as RPC** and **Set as Service** options
3. Edit the settings of your Project (*Source* mode) in order to enable the **waktest-module service**:
```xml
<service name="waktest-module" modulePath="waktest-module" enabled="true" autoStart="true"/>
```
4. Also make sure that the **reuseContexts** option is **disabled**:
```xml
<javaScript reuseContexts="false"/>
```
5. Reload your Solution

### Usage (Server-Side tests)

#### Basic

```javascript
var unitTest = require('waktest-module');
unitTest.init();

describe("My implementation", function () {
  
  it("is expected to do something", function () {
    var foo = "bar";
    expect(foo).to.be.a("string");
    expect(foo).to.equal("bar");
    expect(foo).to.have.length(3);
  });

  it("should do something", function () {
    var foo = "bar";
    foo.should.be.a("string");
    foo.should.equal("bar");
    foo.should.have.length(3);
  });
  
});

var result = unitTest.run();
```

#### External file

```javascript
var unitTest = require('waktest-module');
unitTest.init();
var result = unitTest.run('/path/to/my/test.js');
```

```javascript
var unitTest = require('waktest-module');
unitTest.init();
var result = unitTest.run(new File('/path/to/my/test.js'));
```
#### External folder (will run all the .js files in it)

```javascript
var unitTest = require('waktest-module');
unitTest.init();
var result = unitTest.run('/path/to/my/folderOfTests/');
```

```javascript
var unitTest = require('waktest-module');
unitTest.init();
var result = unitTest.run(new Folder('/path/to/my/folderOfTests/'));
```
#### Run remotely (from a browser)

Once the Server is running, open the following URL (assuming your Project runs on 127.0.0.1:8081):

```
http://127.0.0.1:8081/waktest-ssjs?path=/path/to/your/testFileOrFolder
```

You can specify an output format (JSON by default - see below):

```
http://127.0.0.1:8081/waktest-ssjs?path=/path/to/your/testFileOrFolder&format=JUnit
```

#### Result

The *run()* method returns an Object by default (or a HTML content when run from the browser):

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
              " at callFn (file:///path/to/my/Modules/waktest-module/vendor/mocha.js:4658:21)",
              " at Test.Runnable.run (file:///path/to/my/Modules/waktest-module/vendor/mocha.js:4651:7)",
              " at Runner.runTest (file:///path/to/my/Modules/waktest-module/vendor/mocha.js:5067:10)",
              " at file:///path/to/my/Modules/waktest-module/vendor/mocha.js:5150:12",
              " at next (file:///path/to/my/Modules/waktest-module/vendor/mocha.js:4992:14)",
              " at file:///path/to/my/Modules/waktest-module/vendor/mocha.js:5002:7",
              " at next (file:///path/to/my/Modules/waktest-module/vendor/mocha.js:4937:23)",
              " at file:///path/to/my/Modules/waktest-module/vendor/mocha.js:4969:5",
              " at timeslice (file:///path/to/my/Modules/waktest-module/vendor/mocha.js:6513:27)"
            ]
          },
          "code": "var tutu = 'foo';\n \texpect(tutu).to.equal(null);"
        }
      ]
    }
  ]
}
```

You can specifiy a format for the returned result (only **JUnit** and **html** are supported right now):

```javascript
var unitTest = require('waktest-module');
unitTest.init();
var result = unitTest.run('/path/to/my/test.js', 'JUnit');
```

### Development

### Todo's
