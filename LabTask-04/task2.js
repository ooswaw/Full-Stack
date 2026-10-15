let number = 11;
let nextNumber = number + 1;

while (true) {
    let isPrime = true;

    for (let i = 2; i < nextNumber; i++) {
        if (nextNumber % i === 0) {
            isPrime = false;
            break;
        }
    }

    if (isPrime) {
        console.log("Next prime number:", nextNumber);
        break;
    }

    nextNumber++;
}