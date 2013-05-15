
// The code below uses require.js, a module system for javscript:
// http://requirejs.org/docs/api.html#define

require.config({ 
    baseUrl: 'js/lib',
    paths: {'jquery':
            ['jquery-1.7.1.min',
             'jquery']},

});

// Include the in-app payments API, and if it fails to load handle it
// gracefully.
// https://developer.mozilla.org/en/Apps/In-app_payments
require(['https://marketplace.cdn.mozilla.net/mozmarket.js'],
        function() {},
        function(err) {
            window.mozmarket = window.mozmarket || {};
            window.mozmarket.buy = function() {
                alert('The in-app purchasing is currently unavailable.');
            };
        });

// When you write javascript in separate files, list them as
// dependencies along with jquery
define( 'app', function ( require ) {
	require( [ 'jquery', 'jquery', 'lawnchair/Lawnchair', 'hogan.min', 'noclickdelay',
	'mediawiki', '2.5.3-crypto-md5', 'urlcache', 'jquery.localize',
	'leaflet/leaflet' ], function ( $ ) {
		require( [ 'mobilefrontend', 'propertiesFileReader', 'preferences', 'l10n-setup', 'page',
	'templates', 'savedpages', 'chrome', 'wikiapp', 'app_history', 'search', 'geo',
	'settings', 'langlinks', 'localFile', 'main' ], function ( $ ) {
	                require( [ 'firefox/platform' ], function( $ ) {
        			require( [ 'lawnchair/adapters/webkit-sqlite','lawnchair/adapters/memory', 'menu',
	        			'MobileFrontend/javascripts/toggle','MobileFrontend/javascripts/references' ], function( $ ) {
		        			init();
			        		chrome.initialize();
                                });
			});
		} );
	});

    // Hook up the installation button, feel free to customize how
    // this works
    
    var install = require('install');

    function updateInstallButton() {
        $(function() {
            var btn = $('.install-btn');
            if(install.state == 'uninstalled') {
                btn.show();
            }
            else if(install.state == 'installed' || install.state == 'unsupported') {
                btn.hide();
            }
        });
    }

    $(function() {
        $('.install-btn').click(install);
    });

    install.on('change', updateInstallButton);
    updateInstallButton();

    install.on('error', function(e, err) {
        // Feel free to customize this
        $('.install-error').text(err.toString()).show();
    });

    install.on('showiOSInstall', function() {
        // Feel free to customize this
        var msg = $('.install-ios-msg');
        msg.show();
        
        setTimeout(function() {
            msg.hide();
        }, 8000);
    });

});
