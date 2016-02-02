
# Email Signatures Server

## Api:

`/sig`

GET Params:

`url=rssFeed` *Required* The url of the rss feed from which to generate the signature from. 

`debug=1` Display the raw data from the feed rather than using a theme.

`max=3` Defaults to 3, number of items to display.

`theme=none|pink|simple|debug` the template which to use to generate the signature, defaults to 'pink'

`omit=title[,date[,...]],` what elements to omit from the template, comma seperated.


## Adding additional themes

Make a new layout in `views/` with the prefix 'signature-' view an RSS feed with the debug theme of 'debug=1' to view all the possible pieces of information which can be included.

# AWS Lambda endpoint.

This project is also served through AWS lambda and AWS api gateway

## Setting up Lambda

* Node Version 0.10 - No es6 'Promise'
* index.js contains the lambda handler
* test by running `npm run setup` to create a sample `event.json` file, change the contents to be your test data.
* in the case of this project the contents of the event.json match up to the query params of the api request
* environment varaibles can be put in .env
* use `npm run run` with node 0.10 to test in a similar environment to Amazon lambda.

## Setting up AWS

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

