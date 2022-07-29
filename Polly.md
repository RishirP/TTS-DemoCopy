# Important Guides and Documentation to Follow
- [How to use a Browser Script](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-browser.html#getting-started-browser-write-sample)
-[Amazon Polly JavaScript SDK v3 code examples](https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/polly/README.md)


### Notes and points to consider before development
- Make sure that your credentials are created and stored securely
- Follow all of the prerequisites ( Mostly importantly setting up production environment) Follow this [guide](https://github.com/awsdocs/aws-doc-sdk-examples/tree/master/javascriptv3/example_code/s3/README.md)  
- Here is a [Polly example](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/polly-examples.html) 
-[Node example](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials-node.html)
 
 ### The easiest way to play that audio in a browser is to have Amazon Polly make the audio available at a presigned URL you can then set as the src attribute of the <audio> element in the webpage.  - from [amazon docs](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-browser.html#getting-started-browser-write-sample)
- Make sure aws CLI is installed to make verification easier but plan to use environment variables

### Highlighting
    let start = pollyVoiceSentence.start
    var end = pollyVoiceSentence.end
    let voiceRange = NSRange(location: start, length: end - start)
    print("RANGE: \(voiceRange) - Word: \(pollyVoiceSentence.value)")   

### Once you have full functionality
- How to upload audio recording using amazon polly to Amazon S3 [Here](https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/polly/general-examples/src/polly_synthesize_to_s3.js)

