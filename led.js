const pigpio = require('pigpio');
const Gpio = pigpio.Gpio;


module.exports = class led {

  constructor(pin) {
    this.gpio = new Gpio(pin, { mode: Gpio.OUTPUT });
    this.state = 0;
  }

  on() {
    this.state = 1;
    this.setState();
  }

  off() {
    clearInterval(this.blinkTimer);
    this.state = 0;
    this.setState();
  }

  toggle() {
    this.state = [1, 0][this.state]
    this.setState()
  }

  blink() {
    this.blinkTimer = setInterval(() => {
      this.toggle();
    }, 100);
  }

  setState() {
    this.gpio.digitalWrite(this.state);
  }

}