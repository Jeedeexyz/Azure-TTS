document.getElementById("synthesizeBtn").addEventListener("click", async () => {
  const subscriptionKey = document.getElementById("subscriptionKey");
  const region = document.getElementById("region");
  const text = document.getElementById("textInput");
  const playBtn = document.getElementById("playBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const synthesizeBtn = document.getElementById("synthesizeBtn");

  // Reset UI and disable buttons
  resetUI(playBtn, pauseBtn);
  toggleInputs([subscriptionKey, region, text, synthesizeBtn], true);

  if (!validateInputs(subscriptionKey.value, region.value, text.value)) {
    toggleInputs([subscriptionKey, region, text, synthesizeBtn], false);
    return;
  }

  try {
    const audioData = await synthesizeSpeech(
      subscriptionKey.value,
      region.value,
      text.value
    );
    setupAudio(audioData);
    playBtn.style.display = "inline";
    pauseBtn.style.display = "inline";
    toggleInputs(
      [subscriptionKey, region, text, synthesizeBtn, playBtn, pauseBtn],
      false
    );
    playBtn.focus();
  } catch (error) {
    handleError(error, [subscriptionKey, region, text, synthesizeBtn]);
  }
});

document.getElementById("textInput").addEventListener("input", resetUI);

let isSynthesizing = false;
let audioBufferSource = null;
let audioContext = null;
let monoNode = null;
let audioBuffer = null;
let isPlaying = false;
let startTime = 0;
let pauseTime = 0;

async function synthesizeSpeech(subscriptionKey, region, text) {
  if (isSynthesizing) return; // Prevent multiple invocations
  isSynthesizing = true;

  return new Promise((resolve, reject) => {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      subscriptionKey,
      region
    );
    speechConfig.speechSynthesisOutputFormat =
      SpeechSDK.SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm;
    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, null);

    synthesizer.speakTextAsync(
      text,
      (result) => {
        synthesizer.close();
        isSynthesizing = false;
        result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted
          ? resolve(result.audioData)
          : reject(result.errorDetails);
      },
      (error) => {
        synthesizer.close();
        isSynthesizing = false;
        reject(error);
      }
    );
  });
}

function setupAudio(audioData) {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  audioContext.decodeAudioData(audioData, (buffer) => {
    audioBuffer = buffer;
    createAudioBufferSource();
  });
}

function createAudioBufferSource() {
  if (audioBufferSource) audioBufferSource.disconnect();

  audioBufferSource = audioContext.createBufferSource();
  audioBufferSource.buffer = audioBuffer;
  monoNode = audioContext.createGain();
  monoNode.channelCountMode = "explicit";
  monoNode.channelCount = 1;
  audioBufferSource.connect(monoNode).connect(audioContext.destination);
  startVisualization(audioContext, monoNode);

  audioBufferSource.onended = stopPlayback;
}

document.getElementById("playBtn").addEventListener("click", () => {
  if (!isPlaying && audioContext && audioBuffer) {
    createAudioBufferSource();
    audioBufferSource.start(0, pauseTime);
    startTime = audioContext.currentTime - pauseTime;
    audioContext.resume();
    isPlaying = true;
  }
});

document.getElementById("pauseBtn").addEventListener("click", () => {
  if (isPlaying && audioContext) {
    audioContext.suspend();
    pauseTime = audioContext.currentTime - startTime;
    isPlaying = false;
  }
});

let animationFrameId;

function startVisualization(audioContext, source) {
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  source.connect(analyser);

  const visualizer = document.getElementById("visualizer");
  visualizer.innerHTML = "";
  const bars = Array.from({ length: bufferLength }, () => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    visualizer.appendChild(bar);
    return bar;
  });

  (function draw() {
    analyser.getByteFrequencyData(dataArray);
    bars.forEach(
      (bar, i) => (bar.style.height = `${(dataArray[i] / 255) * 100}%`)
    );
    animationFrameId = requestAnimationFrame(draw);
  })();
}

function stopVisualization() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

function stopPlayback() {
  stopVisualization();
  isPlaying = false;
  startTime = 0;
  pauseTime = 0;
}

function resetUI() {
  audioBuffer = null;
  document.getElementById("playBtn").style.display = "none";
  document.getElementById("pauseBtn").style.display = "none";
}

function validateInputs(subscriptionKey, region, text) {
  if (!subscriptionKey || !region) {
    alert("Please provide a subscription key and region.");
    return false;
  }
  if (!text) {
    alert("Please provide text to synthesize.");
    return false;
  }
  return true;
}

function toggleInputs(elements, isDisabled) {
  elements.forEach((el) => (el.disabled = isDisabled));
}

function handleError(error, elementsToEnable) {
  console.error("Error synthesizing speech:", error);
  alert("Error synthesizing speech.");
  toggleInputs(elementsToEnable, false);
}
