function _runUnitTestInAddon (path, url, projectpath, automatic) {
    try{
        if (typeof path !== 'undefined' && typeof url !== 'undefined' && typeof projectpath !== 'undefined') {
            window.currentProjectBasePath = projectpath;
            window._waktest_waf_ready = function() {
                _waktestRun();
            };
            window.waktest_ended = function(data) {
                if (typeof studio !== 'undefined' && typeof studio.sendCommand === 'function') {
                    studio.sendCommand('UnitTest.wakbot_any', {report: data, event: 'waktest_ended', kind: 'addon', automatic: automatic});
                }
                return data;
            };
            var waktestScript = document.createElement('script');
            waktestScript.type = 'application/javascript';
            waktestScript.src = url + '/waktest-waf-lib?path=' + path + '&widgetId=WakandaAddon';
            document.getElementsByTagName('head')[0].appendChild(waktestScript);
        }
    } catch (ignore) {}
}

function runUnitTest () {
    _runUnitTestInAddon.apply(this, arguments);
    return true;
}

if (typeof window._wakRunUnitTestArgs !== 'undefined') {
    // _runUnitTestInAddon.apply(this, window._wakRunUnitTestArgs);
}
