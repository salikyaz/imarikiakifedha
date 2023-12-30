module.exports = {
  /*
    |--------------------------------------------------------------------------
    | HTTP host
    |--------------------------------------------------------------------------
    |
    | The hostname for your HTTP server.
    |
    */
  host: process.env.HOST || 'localhost',

  /*
    |--------------------------------------------------------------------------
    | HTTP port
    |--------------------------------------------------------------------------
    |
    | The port to start the HTTP server on.
    |
    */
  port: process.env.PORT || 3333,

  /*
    |--------------------------------------------------------------------------
    | Environment
    |--------------------------------------------------------------------------
    |
    | The environment to run the HTTP server on. The current environment
    | names are development, testing, and production.
    |
    */
  environment: process.env.NODE_ENV || 'development',

  /*
    |--------------------------------------------------------------------------
    | Force Content Negotiation
    |--------------------------------------------------------------------------
    |
    | The HTTP server will always response with the most preferred format by
    | default. You can still use `request.negotiate` to manually make a
    | negotiation.
    |
    */
  forceContentNegotiationTo: null,
}
