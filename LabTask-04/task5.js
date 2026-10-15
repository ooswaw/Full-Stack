function absMe(...numbers) {
    if (numbers.length === 0) {
        return 0;
    }

    if (numbers.length === 1) {
        return Math.abs(numbers[0]);
    }

    return numbers.map(num => Math.abs(num));
}

function ceilMe(...numbers) {
    if (numbers.length === 0) {
        return 0;
    }

    if (numbers.length === 1) {
        return Math.ceil(numbers[0]);
    }

    return numbers.map(num => Math.ceil(num));
}

function floorMe(...numbers) {
    if (numbers.length === 0) {
        return 0;
    }

    if (numbers.length === 1) {
        return Math.floor(numbers[0]);
    }

    return numbers.map(num => Math.floor(num));
}

// Testing absMe()
console.log("ABS:");
console.log(absMe());
console.log(absMe(-5));
console.log(absMe(-4, 7, -9));

// Testing ceilMe()
console.log("CEIL:");
console.log(ceilMe());
console.log(ceilMe(4.2));
console.log(ceilMe(4.2, 5.8, 9.1));

// Testing floorMe()
console.log("FLOOR:");
console.log(floorMe());
console.log(floorMe(4.8));
console.log(floorMe(4.8, 7.3, 9.9));