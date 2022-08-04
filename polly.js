/* Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. SPDX-License-Identifier: Apache-2.0
ABOUT THIS NODE.JS EXAMPLE: This example works with the AWS SDK for JavaScript version 3 (v3),
which is available at https://github.com/aws/aws-sdk-js-v3. This example is in the 'AWS SDK for JavaScript v3 Developer Guide' at
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-browser.html.
Purpose:
polly.ts demonstrates how to convert text to speech using Amazon Polly.
Inputs (replace in code):
- OUTPUT_FORMAT
- SAMPLE_RATE
- TEXT_TYPE
- POLLY_VOICE
- REGION
- IDENTITY_POOL_ID
Running the code:
Follow the steps in https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-browser.html.
*/
// snippet-start:[Polly.JavaScript.BrowserExample.completeV3]
// snippet-start:[Polly.JavaScript.BrowserExample.configV3]'
console.log('polly.js is connected')
// const { PollyClient, DeleteLexiconCommand } = require("@aws-sdk/client-polly");
// import {
//     fromCognitoIdentityPool,
// } from "@aws-sdk/credential-provider-cognito-identity";
// import { Polly } from "@aws-sdk/client-polly";
// import { getSynthesizeSpeechUrl } from "@aws-sdk/polly-request-presigner";
import { PollyClient, DeleteLexiconCommand } from "@aws-sdk/client-polly";

// Create the Polly service client, assigning your credentials
const client = new PollyClient({
    region: "us-east-1",
    credentials: fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region: "us-east-1" }),
        identityPoolId: 'us-east-1:44351522-129c-47a3-bf7c-ee1cbaf383dd' // IDENTITY_POOL_ID
    }),
});

// Keep
// Set the parameters
const speechParams = {
    OutputFormat: "mp3", // For example, 'mp3'
    SampleRate: "1600", // For example, '16000
    Text: "", // The 'speakText' function supplies this value
    TextType: "text", // For example, "text"
    VoiceId: "Matthew", // For example, "Matthew"
    SpeechMarkTypes:['viseme', 'boundary']
};
// Keep
// snippet-end:[Polly.JavaScript.BrowserExample.configV3]
// snippet-start:[Polly.JavaScript.BrowserExample.synthesizeV3]
const speakText = async (data) => {
    // Update the Text parameter with the text entered by the user
    speechParams.Text = document.getElementById("textEntry").value;
    try{
        let url = await getSynthesizeSpeechUrl({
            client, params: speechParams
        });
        console.log(url);
        // Load the URL of the voice recording into the browser
        document.getElementById('audioSource').src = url;
        document.getElementById('audioPlayback').load();
        document.getElementById('result').innerHTML = "Speech ready to play.";
    } catch (err) {
        console.log("Error", err);
        document.getElementById('result').innerHTML = err;
    }
    // console.log(data.ContentType); 
};
console.log(client)
// Expose the function to the browser
// window.speakText = speakText;
// snippet-end:[Polly.JavaScript.BrowserExample.synthesizeV3]
// snippet-end:[Polly.JavaScript.BrowserExample.completeV3]