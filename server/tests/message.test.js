const expect = require('expect');
const {generateMessage, generateLocationMessage} = require('./../utils/message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    let from = 'Chris';
    let text = 'Testing generateMessage';
    let message = generateMessage(from, text);

    expect(message).toInclude( {from, text} );
    expect(message.createdAt).toBeA('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate readable url link for location', () => {
    let from = 'Chris';
    let latitude = 26;
    let longitude = 20127;
    let url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    let message = generateLocationMessage(from, latitude, longitude);

    expect(message).toInclude( {from, url});
    expect(message.createdAt).toBeA('number');
  });
});
