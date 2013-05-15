// Wikipedia API currently doesn't have CORS headers allowing offsite access.
// For regular web permissions, we have to use jsonp instead of XHR.
window.DATATYPE = 'jsonp';

// Set up Firefox OS-specific activity stuff
if (window.MozActivity !== undefined) {
	/**
	 * Open link in the browser application, instead of a new window in our app
	 */
	window.chrome.openExternalLink = function(url) {
		// hack -- shouldn't have to do this
		url = url.replace( 'proxy.php?url=', '' );
		var activity = new MozActivity({
			name: 'view',
			data: {
				type: 'url',
				url: url
			}
		});
	}
}

// Horrible hack for #searchParam 'right' CSS property not taking effect properly in Gecko
// although we say 'right: 45px' it seems to fix us at a certain width, even though there's
// no width specified. Arrrrrrghllllebarggle
$( window ).resize( function() {
	var $searchParam = $( '#searchParam' ),
		windowWidth = $( window ).width();
	if (windowWidth < 640) {
		$searchParam.css( 'width', (windowWidth - 90) + 'px' );
	} else {
		$searchParam.css( 'width', 'auto' );
	}
});
$( function () {
	$( window ).resize();
} );