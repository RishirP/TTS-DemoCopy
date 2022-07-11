# TTS-Demo2

## Points moving forward
- Main Problem 
  - Current Speech has a long break during one of the question.... can we refactor the code to make it better? But it still does not sound human enough.
  (_Was able to figure out the long pause at the end of every question was due to a line break that I had on my code editor_)
  - Steps toward a solution
    - Use a different browser engine, googleTTS, or use onmark boundaries
    - will you be able to use a chrome extensions and add to it?  
    - Use Android Studio?  

- Issues at hand are it is difficult to find code examples for TTS on chrome, not familiar with Java, and googleTTS is free up untill 4 million characters 

## Important Links 

### Chrome

- [googleTTS](https://stackoverflow.com/questions/15653145/using-google-text-to-speech-in-javascript)
- [Chrome source code only jsons](https://chromium.googlesource.com/chromium/chromium/+/3d79ca55eb86e0f8733585beaece851e961ac769/chrome/common/extensions/api/)
- [Using chrome TTS](https://stackoverflow.com/questions/25641521/using-chrome-text-to-speech-in-a-chrome-extension)
- [Youtube video explaining how to set it up](https://www.youtube.com/watch?v=5KL_ccQwAuo)
- [Chromium's readme about tts](https://chromium.googlesource.com/chromium/src.git/+/refs/heads/lkgr-ios-internal/docs/accessibility/tts.md#text-to-speech-in-chrome-and-chrome-os)

### Android
- [Android's Text To Speech](https://developer.android.com/reference/android/speech/tts/package-summary)
- [Stack Overflow TTS Example with Java](https://stackoverflow.com/questions/3058919/text-to-speechtts-android)
- [ Example Getting Started](https://android-developers.googleblog.com/2009/09/introduction-to-text-to-speech-in.html How to use TTS)

### Google Cloud TTS 
-[Introduction](https://cloud.google.com/text-to-speech)
---

Plan of actions: 
Create a manifest json file to inject the content/background script into assessment and write [permissions: tts] => Use chrome.tts.speak
OR
Use Android's Studio
OR 
Use googleTTS
