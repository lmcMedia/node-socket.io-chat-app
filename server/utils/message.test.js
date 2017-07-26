const expect = require('expect');
const {generateMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    let from = 'Chris';
    let text = 'Testing generateMessage';
    let message = generateMessage(from, text);

    expect(message).toInclude( {from, text} );
    expect(message.createdAt).toBeA('number');
  });
})
