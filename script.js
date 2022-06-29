// Read block container should have all Readable content inside
// Button should be inside of the container but outside of read-block
// Read block should not have nested HTML elements
// Blocks should only have text and containers have all of the reading blocks within them
// Play button for each question 
// Play pause cancel on every question 
// drop down of voices and sliding scale for rate globally for Demo 
// Read and highlight individually question and once done reading alert const t0 = performance.now();
console.log("TTS Script connected");
let result = [];
let synth = window.speechSynthesis;
// window.speechSynthesis.onvoiceschanged = () => {
//   voices = window.speechSynthesis.getVoices();
//   console.log(voices)
// };
// For rate and pitch
// var synth = window.speechSynthesis;

// var inputForm = document.querySelector("form");
// var inputTxt = document.querySelector(".txt");
const voiceSelect = document.querySelector("select");

const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector(".pitch-value");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector(".rate-value");

let voices = [];

function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
    const aname = a.name.toUpperCase();
    const bname = b.name.toUpperCase();

    if (aname < bname) {
      return -1;
    } else if (aname == bname) {
      return 0;
    } else {
      return +1;
    }
  });
  const selectedIndex =
    voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  voiceSelect.innerHTML = "";

  for (let i = 0; i < voices.length; i++) {
    const option = document.createElement("option");
    option.textContent = `${voices[i].name} (${voices[i].lang})`;

    if (voices[i].default) {
      option.textContent += " -- DEFAULT";
    }

    option.setAttribute("data-lang", voices[i].lang);
    option.setAttribute("data-name", voices[i].name);
    voiceSelect.appendChild(option);
  }
  voiceSelect.selectedIndex = selectedIndex;
}

populateVoiceList();

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}



// Pause
$("[pause]").on("click", () => {
  window.speechSynthesis.pause();
});
// Resume
$("[resume]").on("click", () => {
  window.speechSynthesis.resume();
});

// Cancel
$("[cancelVoice]").on("click", () => {
  synth.cancel()
});

const t1 = performance.now();

// Start of new code
const btn = document.getElementById("play");
// Highlights text function 
const highlight = (text, from, to) => {
  let replacement = highlightBackground(text.slice(from, to));
  return text.substring(0, from) + replacement + text.substring(to);
};
const highlightBackground = (sample) =>
  `<span class='highlighted'style="background-color:yellow;">${sample}</span>`;

// Instead of #play, change to play attribute
$('[play]').on('click', function (event) {
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
    });
    utterance.addEventListener("end", (event) => {
      readblockElement.html(readBlockText)
    })
    // utterance.voice = 1
    pitch.onchange = function () {
  pitchValue.textContent = pitch.value;
};

rate.onchange = function () {
  rateValue.textContent = rate.value;
};
const selectedOption =
voiceSelect.selectedOptions[0].getAttribute("data-name");

for (let i = 0; i < voices.length; i++) {
if (voices[i].name === selectedOption) {
  utterance.voice = voices[i];
  console.log(voices[i].lang)
  break;
}
}
    utterance.pitch = pitch.value;
    utterance.rate = rate.value;
    synth.speak(utterance);
  })
})