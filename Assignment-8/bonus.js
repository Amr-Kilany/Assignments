/**
 * Assignment 8 Bonus - Roman to Integer (LeetCode 13)
 * @param {string} s
 * @return {number}
 */
var romanToInt = function (s) {
  const romanArr = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  let total = 0;

  for (let i = 0; i < s.length; i++) {
    let current = romanArr[s[i]];
    let next = romanArr[s[i + 1]];

    if (next && current < next) {
      total -= current;
    } else {
      total += current;
    }
  }

  return total;
};

// console.log(romanToInt("MCMXCIV"));
