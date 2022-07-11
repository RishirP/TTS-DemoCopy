# TTS-Demo2

## Points moving forward
- Main Problem 
  - Current Speech has a long break during one of the question.... can we refactor the code to make it better? But it still does not sound human enough.
  - Steps toward a solution
    - Use a different browser engine, googleTTS, or use onmark boundaries
    - will you be able to use a chrome extensions and add to it?    
- Issues at hand are it is difficult to find native code for Text to speech on chrome

## Important Links 

### Chrome

- [googleTTS](https://stackoverflow.com/questions/15653145/using-google-text-to-speech-in-javascript)
- [Chrome source code only jsons](https://chromium.googlesource.com/chromium/chromium/+/3d79ca55eb86e0f8733585beaece851e961ac769/chrome/common/extensions/api/)
- [Using chrome TTS](https://stackoverflow.com/questions/25641521/using-chrome-text-to-speech-in-a-chrome-extension)
- [Youtube video explaining how to set it up](https://www.youtube.com/watch?v=5KL_ccQwAuo)
- [Chromium's readme about tts] (https://chromium.googlesource.com/chromium/src.git/+/refs/heads/lkgr-ios-internal/docs/accessibility/tts.md#text-to-speech-in-chrome-and-chrome-os)

### Android
- [Android's Text To Speech] (https://developer.android.com/reference/android/speech/tts/package-summary)
- [Stack Overflow TTS Example with Java] (https://stackoverflow.com/questions/3058919/text-to-speechtts-android)
- [ Example Getting Started] (https://android-developers.googleblog.com/2009/09/introduction-to-text-to-speech-in.html How to use TTS)
---

Plan of actions: 
Create a manifest json file to add the script into and write [permissions: tts]
Use chrome.tts.speak
