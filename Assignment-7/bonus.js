/**
 * Assignment 7 Bonus - Remove Element (LeetCode 27)
 *
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
  let pointer = 0;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] == val) continue;

    nums[pointer] = nums[i];

    pointer++;
  }
  return pointer;
};

// console.log(removeElement([3, 2, 2, 3], 3)); // 2
// console.log(removeElement([0,1,2,2,3,0,4,2], 2)); // 5
