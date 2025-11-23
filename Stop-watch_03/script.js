const selectors = {
  card: document.querySelector('.stopwatch-card'),
  statusDot: document.querySelector('.status-dot'),
  statusValue: document.querySelector('.status-text .value'),
  hours: document.querySelector('.time.hours'),
  minutes: document.querySelector('.time.minutes'),
  seconds: document.querySelector('.time.seconds'),
  milliseconds: document.querySelector('.milliseconds'),
  startBtn: document.querySelector('[data-action="start"]'),
  stopBtn: document.querySelector('[data-action="stop"]'),
  resetBtn: document.querySelector('[data-action="reset"]'),
};

let isRunning = false;
let startTimestamp = 0;
let storedElapsed = 0;
let intervalId = null;

const formatTime = (ms) => {
  const totalSeconds = ms / 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor(ms % 1000);

  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    milliseconds: `.${String(milliseconds).padStart(3, '0')}`,
  };
};

const renderTime = (ms) => {
  const { hours, minutes, seconds, milliseconds } = formatTime(ms);
  selectors.hours.textContent = hours;
  selectors.minutes.textContent = minutes;
  selectors.seconds.textContent = seconds;
  selectors.milliseconds.textContent = milliseconds;
};

const updateUIState = (state) => {
  selectors.card.classList.toggle('active', state !== 'Ready');
  selectors.statusDot.classList.toggle('active', state === 'Running');
  selectors.statusValue.textContent = state;

  selectors.startBtn.disabled = state === 'Running';
  selectors.stopBtn.disabled = state !== 'Running';
  selectors.resetBtn.disabled = storedElapsed === 0 && state !== 'Running';
};

const tick = () => {
  const elapsed = Date.now() - startTimestamp;
  renderTime(elapsed);
};

const start = () => {
  if (isRunning) return;
  isRunning = true;
  startTimestamp = Date.now() - storedElapsed;
  intervalId = setInterval(tick, 16);
  updateUIState('Running');
};

const stop = () => {
  if (!isRunning) return;
  isRunning = false;
  clearInterval(intervalId);
  intervalId = null;
  storedElapsed = Date.now() - startTimestamp;
  renderTime(storedElapsed);
  updateUIState('Paused');
};

const reset = () => {
  stop();
  storedElapsed = 0;
  renderTime(0);
  updateUIState('Ready');
};

selectors.startBtn.addEventListener('click', start);
selectors.stopBtn.addEventListener('click', stop);
selectors.resetBtn.addEventListener('click', reset);

document.addEventListener('keydown', (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
    return;
  }

  if (event.code === 'Space') {
    event.preventDefault();
    isRunning ? stop() : start();
  }

  if (event.code === 'KeyR') {
    reset();
  }
});

renderTime(0);
updateUIState('Ready');

