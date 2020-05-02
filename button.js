const pigpio = require('pigpio');
const Gpio = pigpio.Gpio;


module.exports = class Button {

  constructor(pin) {
    this.setupButton(pin);
  }

  setupButton(pin) {
    this.gpio = new Gpio(pin, {
      mode: Gpio.INPUT,
      pullUpDown: Gpio.PUD_UP,
      alert: true
    });
    this.gpio.glitchFilter(10000);
    this.gpio.on('alert', (level, tick) => {
      if (level === 0) {
        this.onPushed();
      }
    });
  }

  setOnPushedCallback(callback) {
    this.onPushedCallback = callback;
  }

  onPushed() {
    if (typeof this.onPushedCallback === 'function') {
      this.onPushedCallback();
    }
  }

}