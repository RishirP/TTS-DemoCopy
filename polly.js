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
// snippet-start:[Polly.JavaScript.BrowserExample.configV3]
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { Polly, StartSpeechSynthesisTaskCommand } from "@aws-sdk/client-polly";
import { getSynthesizeSpeechUrl } from "@aws-sdk/polly-request-presigner";


const btn = document.body.getElementsByClassName("btn default")
console.log(btn)


// btn.addEventListener("click", speakText())

const client = new Polly({
  region: "us-east-1",
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: "us-east-1" }),
    identityPoolId: "us-east-1:44351522-129c-47a3-bf7c-ee1cbaf383dd", // IDENTITY_POOL_ID
  }),
});

// Set the parameters
const speechParams = {
  OutputFormat: "mp3", // For example, 'mp3'
  SampleRate: "16000", // For example, '16000
  OutputS3BucketName: "testbucket",
  Text: "", // The 'speakText' function supplies this value
  TextType: "text", // For example, "text"
  VoiceId: "Matthew", // For example, "Matthew",
//   'SpeechMarkTypes' : ["word"]
};
// snippet-end:[Polly.JavaScript.BrowserExample.configV3]
// snippet-start:[Polly.JavaScript.BrowserExample.synthesizeV3]

const speakText = async () => {
  // Update the Text parameter with the text entered by the user
  speechParams.Text = document.getElementById("textEntry").value;
  try {
    let url = await getSynthesizeSpeechUrl({
      client,
      params: speechParams,
    });
    console.log(url);
    // Get the speech marks
        fetch(url)
    .then((response) => response.text())
    .then((data) => console.log(data));
    speakMarks()
    // fetch(url)
    // .then(response => response.text()).then(data => 
    // console.log(data));
    const questions = document.querySelectorAll('[read-block]')
    console.log(questions)

    const run = async () => {
      try {
        const data = await client.send(
          new StartSpeechSynthesisTaskCommand(speechParams)
        );
        console.log(
          data,
          "Success, audio file added to " + speechParams.OutputS3BucketName
        );
        let requestId = data.SynthesisTask.TaskId;
        console.log("The request ID is " + requestId);
        const retrieveAudioParams = {
          TaskId: " " /* required */,
        };
        retrieveAudioParams.TaskId = requestId.toString();
        console.log(
          "This is the retrival params " + retrieveAudioParams.TaskId
        );
        client.getSpeechSynthesisTask(
          retrieveAudioParams,
          function (err, data) {
            if (err)
              console.log(err, err.stack, AWS.Response); // an error occurred
            else console.log("Successful Response: " + data); // successful response
          }
        );
      } catch (err) {
        console.log("Error putting object", err);
      }
    };
    run();
    // Load the URL of the voice recording into the browser
    document.getElementById("audioSource").src = url;
    document.getElementById("audioPlayback").load();
    document.getElementById("result").innerHTML = "Speech ready to play.";
  } catch (err) {
    console.log("Error", err);
    document.getElementById("result").innerHTML = err;
  }
};
const speechParams2 = {
    OutputFormat: "json", // For example, 'mp3'
    SampleRate: "16000", // For example, '16000
    OutputS3BucketName: "testbucket",
    Text: "", // The 'speakText' function supplies this value
    TextType: "text", // For example, "text"
    VoiceId: "Matthew", // For example, "Matthew",
    'SpeechMarkTypes' : ["word"]
  };
  // snippet-end:[Polly.JavaScript.BrowserExample.configV3]
  // snippet-start:[Polly.JavaScript.BrowserExample.synthesizeV3]
  const speakMarks = async () => {
    // Update the Text parameter with the text entered by the user
    speechParams2.Text = ('Hello world!');
    try {
      let url = await getSynthesizeSpeechUrl({
        client,
        params: speechParams2,
      });
      console.log(url);
      // Get the speech marks
          fetch(url)
      .then((response) => response.text())
      .then((data) => console.log(data));
    } catch (err) {
    console.log("Error", err);
    document.getElementById("result").innerHTML = err;
  }
}

// Instead of #play, change to play attribute
$('.btn default').on('click', function (event) {
    event.preventDefault();
    let $readBlock = $(this).closest('[read-block-container]').find('[read-block]');
    console.log($readBlock)
    $readBlock.each(function (index) {
      // console.log( index + ": " + $( this ).text());
      // Do we need to index the read blocks?
      let readblockElement = $(this);
      let readBlockText = readblockElement.text();
      console.log(readBlockText)
      let originalText = readBlockText;
      let utterance = new SpeechSynthesisUtterance(originalText);
      utterance.addEventListener("boundary", (event) => {
        const { charIndex, charLength } = event;
        //document.body.querySelector('#paragraph1').innerHTML =
        readblockElement.html(highlight(
          originalText,
          charIndex,
          charIndex + charLength
        ));
      })
    })
});

      let readBlock = $('[read-block-container]').find('[read-block]');
      console.log(readBlock)


// Expose the function to the browser
window.speakText = speakText;
window.speakMarks = speakMarks;
// snippet-end:[Polly.JavaScript.BrowserExample.synthesizeV3]
// snippet-end:[Polly.JavaScript.BrowserExample.completeV3]