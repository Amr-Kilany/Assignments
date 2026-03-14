/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number}
 */
var findKthPositive = function(arr, k) {
    let currentNumber = 1; 
    let index = 0; 

    while (k > 0) {
        if (index < arr.length && arr[index] === currentNumber) {
            index++;
        } else {
            k--;
            if (k === 0) {
                return currentNumber;
            }
        }
        currentNumber++; 
    }
};

