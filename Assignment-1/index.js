/* 😀 انا عارف ان في حاجات مخدنهاش. في حاجات كنت عارفها فجوبتها و في حاجات دورت عليها و افتكرتها 😀*/

// A. Part 1: Coding Questions

// 1- 
let str = "123";
let num = Number(str) + 7;
// anthor way 
let num2 = +str + 7;
console.log(num);
console.log(num2)
//////////////////////////////////////////////////////////////////////

// 2-
function checkFalsy(value) {
  return !value ? "Invalid" : value;
}
console.log(checkFalsy(0));
/////////////////////////////////////////////////////////////////////

// 3-
const arr = [];
for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) continue;
  arr.push(i);
}
console.log(arr);
/////////////////////////////////////////////////////////////////////

// 4-
function evenNumbers(arr) {
  return arr.filter(num => num % 2 === 0);
}
console.log(evenNumbers([1, 2, 3, 4, 5]));
/////////////////////////////////////////////////////////////////////

// 5-
function spreadArray(arr1,arr2) {
  return [...arr1,...arr2];
}
console.log(spreadArray([1, 2, 3],[4,5,6]));
/////////////////////////////////////////////////////////////////////

// 6-
function getDayName(day) {
  switch (day) {
    case 1:
      console.log("sunday");
      break;
    case 2:
      console.log("monday");
      break;
    case 3:
      console.log("tuesday");
      break;
    case 4:
      console.log("wednesday");
      break;
    case 5:
      console.log("thursday");
      break;
    case 6:
      console.log("friday");
      break;
    case 7:
      console.log("saturday");
      break;
    default:
      console.log("Invalid day");
  }
}
getDayName(2);
getDayName(1);
getDayName(7);
/////////////////////////////////////////////////////////////////////

// 7-
function arrayOfStingsLength(arr) {
  return arr.map(str => str.length);
}
console.log(arrayOfStingsLength(["a", "ab", "abc"]));
/////////////////////////////////////////////////////////////////////

// 8-
function numberIsDivisibleBy3And5(num) {
  if (num % 3 === 0 && num % 5 === 0) {
    return "Divisible by both";
  } else {
    return false;
  }
}
console.log(numberIsDivisibleBy3And5(15));
console.log(numberIsDivisibleBy3And5(10));
/////////////////////////////////////////////////////////////////////

// 9-
let squareOfNumber = num => num * num;
console.log(squareOfNumber(6));
/////////////////////////////////////////////////////////////////////

// 10-
function destructuresObjectToFormattedString(obj) {
  return `${obj.name} is ${obj.age} years old`;
}
console.log(destructuresObjectToFormattedString({ name: "John", age: 25 }));
/////////////////////////////////////////////////////////////////////

// 11-
function sumOfMultipleParameters(...nums) {
  return nums.reduce((sum, num) => sum + num, 0);
}
console.log(sumOfMultipleParameters(1, 2, 3, 4, 5));
/////////////////////////////////////////////////////////////////////

// 12-
function promisewhichresolvesAfter3Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Success");
    }, 3000);
  });
}
// promisewhichresolvesAfter3Seconds().then(result => console.log(result));
/////////////////////////////////////////////////////////////////////

// 13-
function largestNumberInArray(arr) {
  return Math.max(...arr);
}
console.log(largestNumberInArray([1, 3, 7, 2, 4]));
/////////////////////////////////////////////////////////////////////

// 14-
function objReturnsOnlyKeys (obj) {
  return Object.keys(obj);
}
console.log(objReturnsOnlyKeys({ name: "John", age: 30}));
/////////////////////////////////////////////////////////////////////

// 15-
function splitStringIntoArray(str) {
  return str.split(" ");
}
console.log(splitStringIntoArray("The quick brown fox"));




