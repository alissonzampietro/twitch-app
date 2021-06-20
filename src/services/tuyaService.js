const TuyAPI = require('tuyapi');

class TuyaService {
  constructor() {
    this.device = new TuyAPI({
      id: process.env.TUYA_ID,
      key: process.env.TUYA_KEY,
      name: 'Smart WiFi music LED Strip'
    });
    
    this.stateHasChanged = false;
    
    // Find device on network
    this.device.find().then(() => {
      // Connect to device
      this.device.connect();
    });
    
    // Add event listeners
    this.device.on('connected', () => {
      console.log('Connected to device!');
    });
    
    this.device.on('disconnected', () => {
      console.log('Disconnected from device.');
    });
    
    this.device.on('error', error => {
      console.log('Error!', error);
    });
  }


  setColor(color) {
    let _this = this;
    this.runCommand(24, color)
  }

  runCommand(action, command) {
    let _this = this;
    this.device.on('data', data => {
      console.log('Data from device:', data);
    
      console.log(`Boolean status of default property: ${data.dps['1']}.`);
    
      // Set default property to opposite
      if (!_this.stateHasChanged) {
        _this.device.set({dps: action, set: command});
    
        // Otherwise we'll be stuck in an endless
        // loop of toggling the state.
        _this.stateHasChanged = true;
      }
    });
  }


  setGreen() {
    this.setColor('007603e803e8')
  }

  setRed() {
    this.setColor('015f03e803e8')
  }

  setBlue() {
    this.setColor('00dc03e803e8')
  }

  turnOff() {
    this.runCommand(20, false);
  }
}

module.exports = new TuyaService