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

let highlightArray = [];

const highlight = (text, from, to) => {
  let replacement = highlightBackground(text.slice(from, to));
  return text.substring(0, from) + replacement + text.substring(to);
};
const highlightBackground = (sample) =>
  `<span class='highlighted'style="background-color:yellow;">${sample}</span>`;

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
  // OutputS3BucketName: "testbucket",
  Text: "Hello", // The 'speakText' function supplies this value
  TextType: "text", // For example, "text"
  VoiceId: "Matthew", // For example, "Matthew",
  //   'SpeechMarkTypes' : ["word"]
};

const speechParams2 = {
  OutputFormat: "json", // For example, 'mp3'
  SampleRate: "16000", // For example, '16000
  Text: "Hello world", // The 'speakText' function supplies this value
  TextType: "text", // For example, "text"
  VoiceId: "Matthew", // For example, "Matthew",
  SpeechMarkTypes: ["word"],
};

const speakText = async () => {
  // Update the Text parameter with the text entered by the user
  // speechParams.Text = document.getElementById("textEntry").value;
  try {
    let url = await getSynthesizeSpeechUrl({
      client,
      params: speechParams,
    });
    console.log(url);
    // Get the speech marks
    fetch(url);
    speakMarks();
    // If you ever want to change it to add to a bucket
    // const run = async () => {
    //   try {
    //     const data = await client.send(
    //       new StartSpeechSynthesisTaskCommand(speechParams)
    //     );
    //     console.log(
    //       data,
    //       "Success, audio file added to " + speechParams.OutputS3BucketName
    //     );
    //     let requestId = data.SynthesisTask.TaskId;
    //     console.log("The request ID is " + requestId);
    //     const retrieveAudioParams = {
    //       TaskId: " " /* required */,
    //     };
    //     retrieveAudioParams.TaskId = requestId.toString();
    //     console.log(
    //       "This is the retrival params " + retrieveAudioParams.TaskId
    //     );
    //     client.getSpeechSynthesisTask(
    //       retrieveAudioParams,
    //       function (err, data) {
    //         if (err)
    //           console.log(err, err.stack, AWS.Response); // an error occurred
    //         else console.log("Successful Response: " + data); // successful response
    //       }
    //     );
    //   } catch (err) {
    //     console.log("Error putting object", err);
    //   }
    // };
    // run();

    // Load the URL of the voice recording into the browser
    document.getElementById("audioSource").src = url;
    document.getElementById("audioPlayback").load();
    document.getElementById("result").innerHTML = "Speech ready to play.";
  } catch (err) {
    console.log("Error", err);
    document.getElementById("result").innerHTML = err;
  }
};

// Send another request to polly for speech marks
const speakMarks = async () => {
  // Send async get request
  try {
    let url = await getSynthesizeSpeechUrl({
      client,
      params: speechParams2,
    });
    console.log(url);
    // Fetch the speech marks
    fetch(url)
      // Then sends a response text back with the speech marks
      .then((response) => response.text())
      .then((data) => {
        // Log the data that will be changed for highlight
        console.log(data, typeof data);
        // Replace backslashes
        let replacedData = data.replace(/\\/g, "");
        // Split each json object into an array and pops the last index
        let content = replacedData.split(/\r?\n/);
        content.pop();
        // This line below will give you an example of the object where the data can be extracted
        // console.log(JSON.parse(content[0]));
        // content.each()
        console.log(content);
        highlightArray = content
        //init highlight timing function
        let prev_time = 0;
        let i = 0;
        const timingfunc = function () {
          console.log("time to highlight");
          console.log(content[0]);
          console.log(highlightArray)
          let word_timing = JSON.parse(content[i]);
          console.log(word_timing);
          let text = $('read-block')[0].
          highlight(text, word_timing[start], word_timing[end]);
          if (i++ < timing_arr.length) {
            setTimeout(timingfunc(i), word_timing[time] - prev_time);
            prev_time = word_timing[i];
            i++;
          }
        };
        timingfunc(i)

      });
  } catch (err) {
    console.log("Error", err);
    document.getElementById("result").innerHTML = err;
  }
};

// Instead of #play, change to play attribute
console.log($(["btn"]));
$("[btn]").on("click", function (event) {
  event.preventDefault();
  let readBlock = $(this)
    .closest("[read-block-container]")
    .find("[read-block]");
  console.log(readBlock);
  readBlock.each(function (index) {
    let readBlockElement = $(this);
    let readBlockText = readBlockElement.text();
    speechParams.Text = readBlockText;
    speechParams2.Text = readBlockText;
    console.log(readBlockText);
  });
  speakText();
  speakMarks();
});

// Expose the function to the browser
window.speakText = speakText;
window.speakMarks = speakMarks;
