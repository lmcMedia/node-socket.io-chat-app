const expect = require('expect');
const {isRealString} = require('./../utils/validation');

describe('========= LOGIN STRING VALIDATION ==========', () => {

  it('should reject non-string values', () => {
    let res = isRealString(123456);
    expect(res).toBe(false);
  });

  it('should reject strings with only spaces', () => {
    let res = isRealString('   ');
    expect(res).toBe(false);
  });

  it('should allow string with non-space characters', () => {
    let res = isRealString(' chris ');
    expect(res).toBe(true);
  });
  
});
