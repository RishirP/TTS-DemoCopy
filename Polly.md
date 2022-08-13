## Current Developments 
- Audio is synthesized and placed into an s3 bucket. From here another request is made to retrieve the audio (or could be speech marks json). The point of this is so I dont have to constantly make audio or speech mark requests to have the TTS and highlight. What I'm thinking moving forward is to make the api request for the speech marks and retrieve the audio files and eventually cache them (Save that money). Once the play button is pressed words will be highlighted as they are spoken, in perfect synchronicity. To make this happen you must store the audio files so they are ready to be played once the play button is pressed, also as the button is clicked the highlight functionality starts, so this means the data from the speech request is made then the data is fetched after this you can use the json to start this from the start to end byte and at the time it takes for each word. 

### Obstacles and Difficulties already faced
- Attempting to use a browser script, ends with a 403 error (forbidden) and on the network tab that get request is denied. (figured it out)
- I don't know if it is a cors issue or a problem with my amazon credentials (Have double checked that is not issue, will check again), will find the error again and attempt to debug. Now attempting to reproduce issue. (figured it out)
- If it is cors, maybe will we have to use a fetch request and add in the header for cross-origin-resource-sharing. [Here are some documentation on CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- ![Amazon on CORS](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/images/cors-overview.png)
- Cors could be the 403 error also, the application is requesting polly to return a speech response yet has not been authorized so the request is denied. 
- Possible solutions: Fix this by turning the polly client Object into a fetch get request with preflight header? Seems to difficult and may not work in production.
- **Read amazon's how to add cors headers and follow that**        

### Immediate problems
-When changing parameters for outFile: UnexpectedParameter: Unexpected key 'outFile' found in params (Fixed)
-Thinking that I may have to use a fetch request so I can manually configure how I want the response. [Polly API Reference](https://docs.aws.amazon.com/polly/latest/dg/API_SynthesizeSpeech.html) (Not needed)
https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Polly.html

### Important Guides and Documentation to Follow
- [How to use a Browser Script](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-browser.html#getting-started-browser-write-sample)


-[Amazon Polly JavaScript SDK v3 code examples](https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/polly/README.md)

-Find examples and how to from [here](https://github.com/aws-samples?q=polly&type=&language)
- Try and work on the browser script




### Notes and points to consider before development
- Make sure that your credentials are created and stored securely
- Follow all of the prerequisites ( Mostly importantly setting up production environment) Follow this [guide](https://github.com/awsdocs/aws-doc-sdk-examples/tree/master/javascriptv3/example_code/s3/README.md)  
- Here is a [Polly example](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/polly-examples.html) but this requires to create S3

- Node example [Node example](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials-node.html)

[How to write json file](https://stackoverflow.com/questions/64629734/how-can-i-convert-speech-mark-output-to-array-of-json-objects-in-amazon-polly)
 
 ### The easiest way to play that audio in a browser is to have Amazon Polly make the audio available at a presigned URL you can then set as the src attribute of the <audio> element in the webpage.  - from [amazon docs](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-browser.html#getting-started-browser-write-sample)
- Make sure aws CLI is installed to make verification easier but plan to use environment variables



### Highlighting
Pseudo Code to develop
- Polly can return a text file of the speech and the word boundaries in json format, giving the start, end and start time byte as the word boundaries. Also gives a time when the word is spoken and when the word ends. This would allow you to use a time function to highlight the word. Using the bytes to identify the word on the html.
Thoughts and Concerns 
- We have a time where the word begins in the audio stream but how do we know when it ends?
Right before the other one begins!! This function should be called HighlightRangeTime. You may be able to use OnRange (see if you can use time for this method).  

For example, Amazon Polly generates the following word speech mark object from the text "Mary had a little lamb":
{"time":373,"type":"word","start":5,"end":8,"value":"had"}
The described word ("had") begins 373 milliseconds after the audio stream begins, and starts at byte 5 and ends at byte 8 of the input text.

Steps to complete this TTS Highlight Service
- Send the text to polly and have it read the assessment based off read blocks => closest read block on the page will be sent as a text parameter for polly. 
- Once this happens youll be able to start highlighting. 



    let start = pollyVoiceSentence.start
    var end = pollyVoiceSentence.end
    let voiceRange = NSRange(location: start, length: end - start)
    print("RANGE: \(voiceRange) - Word: \(pollyVoiceSentence.value)")   
[Speech marks](https://docs.aws.amazon.com/polly/latest/dg/speechmarkexamples.html)
'The challenge is that Amazon gives you the byte position, not the character position, of the word' - From [TTS amazon polly](https://github.com/smch/tts/blob/master/amazon-polly/index.html) from user @smch

### Once you have full functionality
*At the moment you have the polly speech request being sent to aws and it responds with a url which gives you the data about highlighting. The issue now is that you cannot have two file outputs for one request, and calling two would be too expensive, one possible solution is calling a request for each question to output as an mp3 and store in a s3 bucket instead. Store the mp3 in a bucket which will be requested
- How to upload audio recording using amazon polly to Amazon S3 [Here](https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/polly/general-examples/src/polly_synthesize_to_s3.js)

#### Questions and concerns
Will a script tap work on the tablet?

This current demo uses aws-sdk V2, but V3 is the most recent version. V3 example needs Amazon S3?

Should we store the audio files?


