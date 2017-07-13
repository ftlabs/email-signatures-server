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
