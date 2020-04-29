const pigpio = require('pigpio');
const Gpio = pigpio.Gpio;

const baseDelay = 1911;

const scaleIndex = {
  'do': 0,
  'do#': 1,
  're': 2,
  're#': 3,
  'mi': 4,
  'fa': 5,
  'fa#': 6,
  'so': 7,
  'so#': 8,
  'ra': 9,
  'ra#': 10,
  'si': 11
};

module.exports = class buzzer {

  constructor(pin) {
    this.baseLength = 300;
    this.pin = pin;
    this.gpio = new Gpio(pin, { mode: Gpio.OUTPUT });
    this.reset();
  }

  reset() {
    this.gpio.digitalWrite(0);
    pigpio.waveClear();
  }

  setBaseLength(length) {
    this.baseLength = length;
  }

  makeSound(scale, level, length = 2) {
    const waveform = this.makeWaveform(scale, level, length);
    pigpio.waveAddGeneric(waveform);
    const waveId = pigpio.waveCreate();

    if (waveId >= 0) {
      pigpio.waveTxSend(waveId, pigpio.WAVE_MODE_ONE_SHOT);
    }

    while (pigpio.waveTxBusy()) { }
    pigpio.waveDelete(waveId);
  }

  makeWaveform(scale, level, length) {
    const delay = this.getDelay(scale, level);
    const relativeLength = this.getRelativeLength(length, delay);
    const waveform = [];
    for (let x = 0; x < relativeLength; x++) {
      if (x % 2 === 1) {
        waveform.push({ gpioOn: this.pin, gpioOff: 0, usDelay: delay });
      } else {
        waveform.push({ gpioOn: 0, gpioOff: this.pin, usDelay: delay });
      }
    }
    return waveform;
  }

  getRelativeLength(length, delay) {
    const baseDelay = this.getDelay('do', 0);
    return this.baseLength * length * (baseDelay / delay);
  }

  getDelay(scale, level) {
    const delay = baseDelay / this.getFreq(scale, level);
    return Math.floor(delay);
  }

  getFreq(scale, level) {
    return this.getRelativeFreq(scale) * (2 ** level);
  }

  getRelativeFreq(scale) {
    return 2 ** (scaleIndex[scale] / 12);
  }

}