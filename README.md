This project is served through AWS lambda and AWS api gateway

## Setting up Lambda

* Node Version 0.10 - No es6 'Promise'
* index.js handler

* setting up on aws
* Make new role for Lambda project
* POST to https://nsoiyrc3v6.execute-api.eu-west-1.amazonaws.com/prod/create?description=Email-signature-service&systemCode=emailsignatures
* with x-api-key header, (Ask Alan Turner for an API key, requires lastpass)
* Role can be used once¸ only

* Log into Amazon: https://awslogin.internal.ft.com
* Create lambda project with Role created earlier emailsignatures

* Code needs to be in top level of zip file. Including node modules.
* Use (node version control) nvm 0.10 to make sure it works on the amazon node.
* Sometimes if it fails it'll just say it was unable to load index.handler
* index.handler refers to the 'handler' function on the module.exports of index.

* If I update the code I get the error: 
`Error: An unexpected error occurred. This could be because of a network error or timeout. Please check your Internet connection and try again.`
* To fix this reopen the project upload new code and press save.
* then test seperately.

## Setting up api gateway

Add querystrings under 'Method Request'

e.g. url,debug,theme,omit,max

In Integratation request build a new template:

{
  "url": "$input.params('url')",
  "debug": "$input.params('debug')",
  "theme": "$input.params('theme')",
  "omit": "$input.params('omit')",
  "max": "$input.params('max')"
}

Then press deploy.

The response can be just set to pass through.

If you want CORS there is a button when setting up the request.

The api gateway can only do JSON responses. So you can't just render a page through it. So in this case I just render a JSON string and have do response.json() rather than response.text().

Remember to deploy to publish your changes.

