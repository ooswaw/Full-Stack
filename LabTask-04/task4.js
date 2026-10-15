function roundMe(...numbers) {
    if (numbers.length === 0) {
        return 0;
    }

    if (numbers.length === 1) {
        return Math.round(numbers[0]);
    }

    return numbers.map(num => Math.round(num));
}

console.log(roundMe());
console.log(roundMe(4.7));
console.log(roundMe(4.7, 4.4));
console.log(roundMe(2.3, 5.8, 9.1));