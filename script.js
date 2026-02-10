const pads = [
  { key: 'Q', name: 'Bruh', line: 'bruh moment', mode: 'voice', pitch: 0.6, rate: 0.8 },
  { key: 'W', name: 'Vine Boom', line: 'boom', mode: 'boom' },
  { key: 'E', name: 'Bonk', line: 'go to horny jail', mode: 'voice', pitch: 0.8, rate: 1.0 },
  { key: 'R', name: 'Sheesh', line: 'sheeeeeesh', mode: 'voice', pitch: 1.5, rate: 0.9 },
  { key: 'A', name: 'Sad Trombone', line: 'womp womp', mode: 'womp' },
  { key: 'S', name: 'NANI?!', line: 'nani', mode: 'voice', pitch: 1.9, rate: 1.2 },
  { key: 'D', name: 'Airhorn', line: 'airhorn', mode: 'horn' },
  { key: 'F', name: 'Mission Failed', line: 'we will get em next time', mode: 'voice', pitch: 0.7, rate: 0.9 },
  { key: 'Z', name: 'Among Us', line: 'sus', mode: 'voice', pitch: 1.2, rate: 0.85 },
  { key: 'X', name: 'Oh No', line: 'oh no no no', mode: 'voice', pitch: 1.3, rate: 1.05 },
  { key: 'C', name: 'Laugh Track', line: 'ha ha ha', mode: 'laugh' },
  { key: 'V', name: 'Windows Error', line: 'beep', mode: 'error' }
];

const board = document.getElementById('soundboard');
const volumeControl = document.getElementById('volume');
const randomBtn = document.getElementById('random');
const stopBtn = document.getElementById('stop');

const speech = window.speechSynthesis;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const activeNodes = [];

function currentVolume() {
  return Number(volumeControl.value) / 100;
}

function renderPads() {
  pads.forEach((pad) => {
    const button = document.createElement('button');
    button.className = 'pad';
    button.dataset.key = pad.key;
    button.innerHTML = `
      <span class="key">${pad.key}</span>
      <h3>${pad.name}</h3>
      <p>${pad.line}</p>
    `;
    button.addEventListener('click', () => playPad(pad, button));
    board.appendChild(button);
  });
}

function flashPad(key) {
  const pad = document.querySelector(`.pad[data-key="${key}"]`);
  if (!pad) return;
  pad.classList.add('active');
  setTimeout(() => pad.classList.remove('active'), 180);
}

function toneSweep(startHz, endHz, duration, type = 'sine') {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const now = audioCtx.currentTime;

  osc.type = type;
  osc.frequency.setValueAtTime(startHz, now);
  osc.frequency.exponentialRampToValueAtTime(endHz, now + duration);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.35 * currentVolume(), now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + duration);
  activeNodes.push(osc);
}

function playPattern(freqs, segment = 0.12, type = 'triangle') {
  const now = audioCtx.currentTime;
  freqs.forEach((f, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const start = now + idx * segment;
    const end = start + segment;

    osc.type = type;
    osc.frequency.setValueAtTime(f, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.26 * currentVolume(), start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(start);
    osc.stop(end);
    activeNodes.push(osc);
  });
}

function speak(text, pitch = 1, rate = 1) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.pitch = pitch;
  utter.rate = rate;
  utter.volume = currentVolume();
  speech.speak(utter);
}

function playPad(pad, button = null) {
  audioCtx.resume();
  flashPad(pad.key);

  switch (pad.mode) {
    case 'voice':
      speak(pad.line, pad.pitch, pad.rate);
      break;
    case 'boom':
      toneSweep(180, 30, 0.28, 'sawtooth');
      break;
    case 'horn':
      playPattern([440, 523, 659, 523], 0.09, 'square');
      break;
    case 'womp':
      playPattern([330, 247, 196], 0.18, 'triangle');
      break;
    case 'laugh':
      playPattern([800, 650, 740, 620, 700], 0.08, 'square');
      break;
    case 'error':
      playPattern([260, 210], 0.15, 'sawtooth');
      break;
  }

  if (button) {
    button.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(0.96)' },
      { transform: 'scale(1)' }
    ], { duration: 180, easing: 'ease-out' });
  }
}

function stopAllSounds() {
  speech.cancel();
  while (activeNodes.length) {
    const node = activeNodes.pop();
    try {
      node.stop();
    } catch {
      // Node already ended.
    }
  }
}

document.addEventListener('keydown', (event) => {
  const key = event.key.toUpperCase();
  const pad = pads.find((entry) => entry.key === key);
  if (pad) {
    playPad(pad);
  }
});

randomBtn.addEventListener('click', () => {
  const randomPad = pads[Math.floor(Math.random() * pads.length)];
  playPad(randomPad);
});

stopBtn.addEventListener('click', stopAllSounds);

renderPads();
