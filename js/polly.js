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

// Import statements
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
window.CognitoIdentityClient = CognitoIdentityClient;
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
window.fromCognitoIdentityPool = fromCognitoIdentityPool;
import { Polly } from "@aws-sdk/client-polly";
window.Polly = Polly;
import { getSynthesizeSpeechUrl } from "@aws-sdk/polly-request-presigner";
window.getSynthesizeSpeechUrl = getSynthesizeSpeechUrl;


const POLLY_VOICE_ID = "Matthew";
const POLLY_SAMPLE_RATE = "22050";
const MAX_SYNTH_LENGTH = 1000;

window.identifyQuestionBlocks = function(){
  $('.question').each(function(i){
    let ele = $(this);
    if( ele.prop('id') === '' ) {
      ele.prop('id','rb-question-'+i);
    }
  });
}

window.identifyReadBlocks = function(){
  $('[read-block]').each(function(i){
    let ele = $(this);
    if( ele.prop('id') === '' ) {
      ele.prop('id', 'rb-' + i);
    }
  });
}

// Global variables
window.audioData = {};

//below variables used to keep track of audio state and switching between states
const AUDIO_STATE_PAUSED = 'paused';
const AUDIO_STATE_STOPPED = 'stopped';
const AUDIO_STATE_PLAYING = 'playing';
window.ttsAudioState = {
  read_container_id: null,
  read_block_index: null,
  curr_read_index: null,
  audio_data: null,
  audio_state: null
};

const highlight = (text, from, to) => {
  let replacement = highlightBackground(text.slice(from, to));
  return text.substring(0, from) + replacement + text.substring(to);
};
const highlightBackground = (sample) =>
    `<span class='highlighted'style="background-color:yellow;">${sample}</span>`;

/**
 * highlight text in given readBlockElement
 *
 * readBlockElement should be a single read-block element
 *
 * @param i index of word in highlight(speech marks) array
 * @param readBlockElement
 * @param highlightArray
 */
const timingfunc = function (i,readBlockElement,highlightArray) {
  if( !$.isPlainObject(readBlockElement) ){
    readBlockElement = $(readBlockElement); //convert to jQuery object
  }

  //handle pause and stopped states
  if( ttsAudioState.audio_state === AUDIO_STATE_PAUSED ){
    ttsAudioState.audio_data.audio_player.pause(); //pause audio
    ttsAudioState.curr_read_index = i;
    updateTtsControls();
    return; //stop next word highlight;
  }else if( ttsAudioState.audio_state === AUDIO_STATE_STOPPED ){
    ttsAudioState.audio_data.audio_player.pause(); //stop audio
    ttsAudioState.audio_data.audio_player.currentTime = 0; //set position to start of audio
    ttsAudioState.audio_data.read_block.text(ttsAudioState.audio_data.org_text);
    ttsAudioState.curr_read_index = 0;
    updateTtsControls();
    return; //stop next word highlight;
  }

  // Changes the wordtiming array into the speech marks data array
  let word_timing = highlightArray[i];

  //highlight readblock
  let text = readBlockElement.text();
  readBlockElement.html(highlight(text, word_timing.start, word_timing.end));

  //call timing function on next word
  i++; //increment index
  if( i < highlightArray.length ){
    let curr_start_time = word_timing.time; //get current word start time
    let next_time = highlightArray[i].time; //get next word start time
    let word_speak_duration = next_time - curr_start_time;

    //call timingfunc for next word after current word_speak_duration time has elapsed
    setTimeout( function(){timingfunc(i,readBlockElement,highlightArray)}, word_speak_duration);
  }
};

const client = new Polly({
  region: "us-east-1",
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: "us-east-1" }),
    identityPoolId: "us-east-1:4ced5b8f-aca7-4fd0-a335-28c76d5bb1bb", // IDENTITY_POOL_ID
  }),
});

const speakText = async (read_container,read_block,params_audio,params_speech_marks) => {
  try {
    console.log('fetching audio..');

    //get audio url and wait for it to be retrieved
    let resp = await getSynthesizeSpeechUrl({
      client,
      params: params_audio,
    });
    console.log('audio url retrieved' + resp);

    // Get the speech marks and wait for them to be retrieved
    await speakMarks(resp, read_container, read_block, params_speech_marks);

  } catch (err) {
    console.log("Error", err);
    document.getElementById("result").innerHTML = err;
  }
};

// Send another request to polly for speech marks
const speakMarks = async (audio_url, read_container, read_block, params_speech_marks) => {
  try {
    //send request to get speech marks and wait for it to return
    console.log('fetching marks..');
    let url = await getSynthesizeSpeechUrl({
      client,
      params: params_speech_marks,
    });
    console.log('marks url retrieved..');

    //request data from speech marks url and wait it for it to return
    let resp = await fetch(url);
    let data = await resp.text();
    console.log('marks data retrieved..');

    //process speech marks json data into usable array
    // Replace backslashes
    let replacedData = data.replace(/\\/g, "");
    // Split each json object into an array and pops the last index
    let content = replacedData.split(/\r?\n/);
    content.pop();
    // This line below will give you an example of the object where the data can be extracted
    // console.log(JSON.parse(content[0]));
    // content.each()
    //console.log(content);

    //create array of speech marks timing data
    let highlightArray = [];
    for (let i = 0; i < content.length; i++) {
      highlightArray.push(JSON.parse(content[i]));
    }
    //initialize audio data array for container
    let read_container_id = read_container.prop('id');
    if( !audioData.hasOwnProperty(read_container_id) ){
      audioData[read_container_id] = [];
    }
    //save data for later use
    audioData[read_container_id].push({'read_block': read_block, 'org_text': read_block.text(), 'audio_url': audio_url, 'speech_marks_arr': highlightArray});

    console.log('marks data processed..');

  } catch (err) {
    console.log("Error", err);
    document.getElementById("result").innerHTML = err;
  }
};

window.getSynthesizedAudio = async function(readContainer){
  //get visible read blocks
  let readBlock = readContainer.find("[read-block]");

  //loop through each read block and get the synthesized audio data from polly
  //loop is serial, ie. it makes the calls one after the other
  //polly will throw a duplicate middleware signature error if multiple calls are made in parallel
  for( let i=0; i < readBlock.length; i++ ){
    //get read block text
    let readBlockElement = $(readBlock[i]);
    let readBlockText = readBlockElement.text();

    //initialize params for polly
    let pollyParamsAudio = {
      OutputFormat: "mp3",
      SampleRate: POLLY_SAMPLE_RATE,
      Text: readBlockText,
      TextType: "text",
      VoiceId: POLLY_VOICE_ID,
    };
    let pollyParamsSpeechMarks = {
      OutputFormat: "json",
      SampleRate: POLLY_SAMPLE_RATE,
      Text: readBlockText,
      TextType: "text",
      VoiceId: POLLY_VOICE_ID,
      SpeechMarkTypes: ["word"],
    };

    //make call to polly get audio data, loop waits for promise before continuing
    console.log('waiting for speak text..');
    await speakText(readContainer,readBlockElement,pollyParamsAudio,pollyParamsSpeechMarks);
    console.log('WAIT COMPLETED');
  }

  console.log("Speech ready to play for container.");
}

$('#synthesize-btn').on('click', async function(){
  $(this).addClass('hide');
  let audio_processing_btn = $('#audio-processing');
  audio_processing_btn.removeClass('hide');
  let read_containers = $('body').find('.question');
  let read_containers_length = read_containers.length;
  let synth_length = Math.min(MAX_SYNTH_LENGTH,read_containers_length); //set amount of read block that get synthesized
  for( let i=0; i < synth_length; i++ ){
    await getSynthesizedAudio($(read_containers[i]));
  }
  console.log('All Question Audio Synthesized');
  audio_processing_btn.addClass('hide');
  updateTtsControls(); //show audio controls
});

$('#play-btn').on('click',function(){
  let readContainer =  $('body').find('.question:visible');
  let i = 0;
  console.log('playing ' + readContainer.prop('id') + ' ..');
  ttsAudioState.audio_state = AUDIO_STATE_PLAYING; //set to play audio state
  playAudioClip(readContainer.prop('id'),i); //play audio from start of container
});

$('#pause-btn').on('click',function(){
  console.log('pausing..');
  ttsAudioState.audio_state = AUDIO_STATE_PAUSED; //set to pause audio state
});

$('#resume-btn').on('click',function(){
  console.log('resume..');
  ttsAudioState.audio_state = AUDIO_STATE_PLAYING; //set to play audio state
  ttsAudioState.audio_data.audio_player.play(); //play audio
});

$('#stop-btn').on('click',function(){
  console.log('stopping..');
  let prev_state = ttsAudioState.audio_state;
  ttsAudioState.audio_state = AUDIO_STATE_STOPPED; //set to stopped audio state
  if( prev_state ===  AUDIO_STATE_PAUSED ){
    ttsAudioState.audio_data.audio_player.currentTime = 0; //set position to start of audio
    ttsAudioState.audio_data.read_block.text(ttsAudioState.audio_data.org_text);
    ttsAudioState.curr_read_index = 0;
    updateTtsControls();
  }
});


window.playAudioClip = function(read_container_id,i){
  //get voice data for container from audio data array
  let audio_data_container = audioData[read_container_id];
  let audio_data = audio_data_container[i];
  let audio_url = audio_data.audio_url;
  if( !audio_data.hasOwnProperty('audio_player') ) {
    console.log('creating audio player..');
    audio_data['audio_player'] = new Audio(audio_url); //create audio player for given url
  }
  let audio = audio_data.audio_player;
  let read_block = audio_data.read_block;
  let highlight_arr = audio_data.speech_marks_arr;
  let org_read_block_text = read_block.text();

  //initialize audio state
  ttsAudioState.read_container_id = read_container_id;
  ttsAudioState.read_block_index = i;
  ttsAudioState.audio_data = audio_data;
  ttsAudioState.curr_read_index = 0;

  //setup play and end events
  audio.onplay = function(event){
    timingfunc(ttsAudioState.curr_read_index
        ,ttsAudioState.audio_data.read_block
        ,ttsAudioState.audio_data.speech_marks_arr);
    updateTtsControls();
  }
  audio.onended = function(event){
    //reset read block to original (un highlighted) text
    read_block.text(org_read_block_text);

    //play next audio clip if there is more audio data
    i++;
    if( i < audio_data_container.length ){
      //console.log('playing next clip.. ' + i);
      playAudioClip(read_container_id, i);
    }else{
      //set audio state to stopped
      ttsAudioState.audio_state = AUDIO_STATE_STOPPED;
      updateTtsControls();
    }
  }

  //play audio
  if( ttsAudioState.audio_state === AUDIO_STATE_PLAYING ) {
    audio.play();
  }else{
    //update controls if not in play state
    //this can happen when pause/stopped is clicked on last word in a read block
    updateTtsControls();
  }
}

/**
 * Hide and show relevant controls based on audio state
 */
window.updateTtsControls = function(){
  if( ttsAudioState.audio_state === AUDIO_STATE_PLAYING ){
    $('#pause-btn').removeClass('hide');
    $('#stop-btn').removeClass('hide');
    $('#resume-btn').addClass('hide');
    $('#play-btn').addClass('hide');
  }else if( ttsAudioState.audio_state === AUDIO_STATE_PAUSED ){
    $('#resume-btn').removeClass('hide');
    $('#stop-btn').removeClass('hide');
    $('#play-btn').addClass('hide');
    $('#pause-btn').addClass('hide');
  }else if( ttsAudioState.audio_state === AUDIO_STATE_STOPPED ){
    $('#play-btn').removeClass('hide');
    $('#resume-btn').addClass('hide');
    $('#pause-btn').addClass('hide');
    $('#stop-btn').addClass('hide');
  }else {
    //default
    $('#play-btn').removeClass('hide');
    $('#resume-btn').addClass('hide');
    $('#pause-btn').addClass('hide');
    $('#stop-btn').addClass('hide');
  }
}

// Expose the function to the browser
window.speakText = speakText;
window.speakMarks = speakMarks;

//add ids to relevant elements
$(document).ready(function(){
  identifyQuestionBlocks();
  identifyReadBlocks();
});
