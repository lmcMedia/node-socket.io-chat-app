let isRealString = (str) => {
   // prevents empty string
  return typeof str === 'string' && str.trim().length > 0;
}

module.exports = {isRealString};
