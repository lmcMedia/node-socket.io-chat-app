// Known as the UNIX epic
// Jan 1st 1970 00:00:00 am
const moment = require('moment');

// let date = moment();
// date.add(1, 'year').subtract(9, 'months');
//
// // pass in patterns
// console.log(date.format('ddd MMM Do, YYYY'));

// 10:35 am
// 6:01 am (padded)

let someTimeStamp = moment().valueOf();
console.log(someTimeStamp);

let createdAt = 1234
let time = moment(createdAt);
console.log(time.format('h:mm a'));
