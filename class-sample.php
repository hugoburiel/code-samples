<?php
/**
 * @author Hugo David Buriel-Vasquez
 * @copyright Hugo David Buriel 2016
 * @version 1.0.0
*/

class PAGE
{
    //=============== Properties ===============//
    private static $_pageCheck = NULL;
    private static $_allowedPagesList = NULL;
    private static $_allowedPagesListTrimmed = NULL;
    private static $_requestedPageCheck = FALSE;


    public static $_atlas = NULL;
    public static $_allowedPagesArray = NULL;
    public static $_requestedPath = NULL;
    public static $_requestedController = NULL;
    public static  $_pageInCache = NULL;


    //=============== Methods ===============//
    private function __clone(){} // Prevent object cloning
    public function __destruct(){} // Prevent direct object destruction


    /**
     * Initialize
     */
    public static function init()
    {
        try
        {
            if ( !self::$_atlas )
            {
                // // List of allowed pages
                $_allowedPagesArray = PAGE::listOfAllowedPages();

                // Process path into components
                $_requestedPath = URL_PARSER::pathComponents();

                // Requested page
                $_requestedController = trim($_requestedPath['controller']);


                // If page allowed
                if( IN_ARRAY::check( $_requestedController, $_allowedPagesArray ) )
                {
                    // Check for cached page
                    $_pageInCache = PAGE::getFromCache( $_requestedController );

                    // If page in cache
                    if( $_pageInCache  )
                    {
                        // Load from cache
                        require_once( WEB_ROOT . '/app/cache/' . $_requestedController . '.php' );
                    }
                    else
                    {
                        // Compile requested page
                        PAGE::load( $_requestedPath );
                    }
                }
                else
                {
                    echo 'Oops! Error loading <b>' . $_requestedController . '</b>, looks like it may not exist.';
                }
            }

            // Return
            return( self::$_atlas );
        }
        catch ( Exception $_errorMessage )
        {
            // PHP error handler
            Exception_Handler::phpError( memory_get_usage(), $_errorMessage->getMessage(), $_errorMessage->getFile(), $_errorMessage->getLine(), $_errorMessage );
        }

    } // End init


    /**
     * Retrieve list of allowed pages
     */
    public static function listOfAllowedPages()
    {
        try
        {
            if ( !self::$_pageCheck )
            {
                // Check database
                $_allowedPagesList = DB::getInstance()->getAllowedPages();

                // Get list from local text file, if needed
                //$_allowedPagesList = explode( "\n", file_get_contents( '../private/app/pages/allowed-pages.txt', FILE_IGNORE_NEW_LINES ) );

                // Trim any whitespace; use this if checking local text file
                //$_allowedPagesList = array_map( 'trim', $_allowedPagesArray[0] );

                //TODO: pass through sanitization class here?

                // Return
                return array( $_allowedPagesList );
            }

            // Return
            return( self::$_pageCheck );

        }
        catch ( Exception $_errorMessage )
        {
            // PHP error handler
            Exception_Handler::phpError( memory_get_usage(), $_errorMessage->getMessage(), $_errorMessage->getFile(), $_errorMessage->getLine(), $_errorMessage );
        }

    } // End listOfAllowedPages


    /**
     * Get list of pages that exist and are allowed
     */
    public static function getFromCache( $_requestedPage )
    {
        try
        {
            if ( !self::$_pageCheck )
            {
                // If page is cached
                if( file_exists( WEB_ROOT . '/app/cache/' . $_requestedPage . '.php' ) )
                {
                    // Set to true
                    self::$_requestedPageCheck = TRUE;
                }

                // Return
                return self::$_requestedPageCheck;
            }

            // Return
            return( self::$_pageCheck );

        }
        catch ( Exception $_errorMessage )
        {
            // PHP error handler
            Exception_Handler::phpError( memory_get_usage(), $_errorMessage->getMessage(), $_errorMessage->getFile(), $_errorMessage->getLine(), $_errorMessage );
        }

    } // End getFromCache


    /**
     * Load Page
     */
    public static function load( array $_pageInfo )
    {
        try
        {
            if ( !self::$_pageCheck )
            {
                // Check if admin page
                if( $_pageInfo['controller'] === 'admin' ) {

                    // Uppercase class name
                    $className = strtoupper( $_pageInfo['controller'] ) . '.class.php';

                    // Dynamically call page class
//                  call_user_func_array( array( PRIVATE_ADMIN_CLASSES . '/' . $className, 'init' ), $_pageInfo['params'] );

                    if( file_exists( PRIVATE_ADMIN_CLASSES . '/' . $className ) )
                    {
                        require_once( PRIVATE_ADMIN_CLASSES . '/' . $className );
                    }

                }

                // Get page data
                $_pageData = DB::getInstance()->getPageData( $_pageInfo['controller'] );
            }

            // Return
            return( self::$_pageCheck );

        }
        catch ( Exception $_errorMessage )
        {
            // PHP error handler
            Exception_Handler::phpError( memory_get_usage(), $_errorMessage->getMessage(), $_errorMessage->getFile(), $_errorMessage->getLine(), $_errorMessage );
        }

    } // End load

} // End PAGE