/***********************
// You can also see this code on GitHub: https://github.com/hugoburiel/JavaScript/blob/master/module-pattern.js
/***********************


/** MODULES *******************************************************************/
// App Launcher
var App = (function( document, window, undefined )
{
    "use strict";

	/* --- Private Properties --- */
    var _display        = $('#display'),
		_messageArea    = $('#message'),
		_counter        = 0,
		_image,
		_datetime,
		_timeAgo,
		_text,


	/* --- Private Methods --- */

	// Load images
    _loadImages = function( hashTag )
	{
		// Get data
		$.getJSON( '/js/ajax/load-saved-images-from-db.php',
		{
			//format: 'json',
			tag: hashTag
		})
		.done(function( results )
		{
			// If there are results...
			if ( results !== 'fail' )
			{
					// Retrieve data and format images
					$.each( results, function( index, image )
					{
						// If image is allowed to display
						if ( image.display === '1' )
						{
							var _id           = ( image.social_network_image_id        !== undefined ) ? image.social_network_image_id : '';
							var _socNet       = ( image.social_network                 !== undefined ) ? ( image.social_network === 'instagram' ) ? 'icon-instagram' : 'icon-social-twitter' : '';
							var _createdOn    = ( image.social_network_created_on_date !== undefined ) ? Format_DateTime.format( image.social_network_created_on_date ) : '';
							var _screenName   = ( image.screen_name                    !== undefined ) ? image.screen_name : 'screen name is missing';
							var _src          = ( image.social_network_image_src       !== undefined ) ? image.social_network_image_src : '/assets/images/social-wall/'; //TODO:placehold.it
							var _url          = ( image.social_network_url             !== undefined ) ? image.social_network_url : '';
							var _text         = ( image.text                           !== null )      ? image.text : 'no caption';
							var _commentCount = ( image.comment_count                  !== null )      ? image.comment_count : 0;
							var _likes        = ( image.likes                          !== null )      ? image.likes : 0;

							// Update message area
							//_message = '';

							// Increment counter
							_counter++;

							// Format image
							_image = '<figure class="image effect-zoe">' +
										'<span class="socNetIcon icon ' + _socNet + '"><a href="' + _url + '" target="_blank"></a></span>' +
										'<a href="' + _url + '" title="' + _text + '" class="image" target="_blank">' +
											'<img' +
												' src="' + _src + '"' +
												' data-imageid="' + _id + '"' +
												' data-socialnetwork="' + _socNet + '"' +
												' data-screenname="' + _screenName + '"' +
												' alt="' + _text + '"' +
												' data-datetime="' + _createdOn.datetime + '"' +
												' data-timeago="' + _createdOn.timeago + '"' +
											' />' +
										'</a>' +
										'<figcaption>' +
											'<h2><span>' + _screenName + '</span></h2>' +
											'<span class="icon icon-heart" title="Favorited ' + _likes + ' times">' + _likes + '</span>' +
											'<span class="icon icon-talk-chat" title="Number of comments (concept only)">' + _commentCount + '</span>' +
											'<p>' + _text + '</p>' +
											'<a href="' + _url + '" target="_blank">View on ' + _socNet + '</a>' +
										'</figcaption>' +
									'</figure>';





							// Append to display container
							_display.append( _image );

						} // Display check

					}); // End each

					// Reset
					_counter = 0;

				// Display message
//				_messageArea.html( _message );

				// Fade-in images sequentially
				$('.image').each(function ( p )
				{
					var _el = $(this);
					_el.delay(( p++ ) * 100).fadeTo( 250, 1 );

				});

				// Fade in social network icon
				$('.socNetIcon').animate({ 'opacity': '1' }, 3000);
			}
			else
			{
				// Message to display
				_messageArea.html( 'No images to display' );

			} // End if

		}) // End done
		.fail(function( jqxhr, textStatus, error )
		{
			var err = textStatus + ", " + error;
			console.log( "Request Failed: " + err );

		}) // End fail
		.always(function() {
			console.log( "complete" );

		}); // End always

    }, // End _loadImages


	// Initializer
	_init = function()
	{
		// Load images from db
		_loadImages( 'vegan' );

	}; // End init


		// API public access
		return {

			// Initialize
			init: _init

		}; // End return

})( window ); // End App


// Format datetime information via moment.js
var Format_DateTime = (function()
{
    "use strict";

	// Private Properties
    var _datetime,
		_now,
		_imageTakeOnDate,
		_timeAgo,


	// --- Private Methods
	// Initiate
    _momentizeIt = function( datetime )
	{
		// Format datetime via moment.js
		_datetime = moment( datetime, 'X' ).format( 'YYYY-MM-DD hh:mm:ss' );


		// Time-Ago
		_now = moment();
		_imageTakeOnDate = moment( _datetime, 'X' );
		_timeAgo = _imageTakeOnDate.from( _now );

		// Create data object
		var _formattedDateTimeData = {
			datetime : _datetime,
			timeago  : _timeAgo
		};

		// Return
		return _formattedDateTimeData;

    }, // End _momentizeIt


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


	// Initializer
	_init = function( data )
	{
		// Load admin
		var obj = _momentizeIt( data );

		// Return
		return obj;

	}; // End init


		// API public access
		return {

			// Initialize
			format: _init

		}; // End return


})(); // End Format_DateTime



/** DOM READY *****************************************************************/
$(document).ready(function()
{
	/** PROPERTIES ************************************************************/
	var xxx = $('#xxx');


	/** METHODS ***************************************************************/
	// Init
	App.init();
});
