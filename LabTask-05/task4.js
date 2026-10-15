"use strict";

// TASK 4 - UNIVERSITY USER HIERARCHY AND DYNAMIC THIS

// Parent Class
class Person {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    introduce() {
        return `Name: ${this.name}, Email: ${this.email}`;
    }
}

// Student Class
class Student extends Person {
    constructor(name, email, rollNo, marks) {
        super(name, email);
        this.rollNo = rollNo;
        this.marks = marks;
    }

    introduce() {
        return `${super.introduce()}, Roll No: ${this.rollNo}, Role: Student`;
    }

    getResult() {
        return this.marks >= 50 ? "PASS" : "FAIL";
    }
}

// Faculty Member Class
class FacultyMember extends Person {
    constructor(name, email, employeeId, department) {
        super(name, email);
        this.employeeId = employeeId;
        this.department = department;
    }

    introduce() {
        return `${super.introduce()}, Employee ID: ${this.employeeId}, Department: ${this.department}, Role: Faculty`;
    }
}

// Creating Objects
const student1 = new Student(
    "Ali",
    "ali@university.edu",
    "241101",
    85
);

const student2 = new Student(
    "Sara",
    "sara@university.edu",
    "241102",
    45
);

const student3 = new Student(
    "Hina",
    "hina@university.edu",
    "241103",
    70
);

const faculty1 = new FacultyMember(
    "Dr. Ahmed",
    "ahmed@university.edu",
    "EMP101",
    "Computer Science"
);

const faculty2 = new FacultyMember(
    "Dr. Fatima",
    "fatima@university.edu",
    "EMP102",
    "Software Engineering"
);

// Runtime Polymorphism
const users = [
    student1,
    student2,
    student3,
    faculty1,
    faculty2
];

console.log("===== RUNTIME POLYMORPHISM =====");

users.forEach(user => console.log(user.introduce()));

// Student Results
console.log("\n===== STUDENT RESULTS =====");

console.log(student1.name, student1.getResult());
console.log(student2.name, student2.getResult());
console.log(student3.name, student3.getResult());

// instanceof Operator
console.log("\n===== INSTANCEOF =====");

console.log(student1 instanceof Student);
console.log(student1 instanceof Person);
console.log(faculty1 instanceof FacultyMember);
console.log(faculty1 instanceof Person);
console.log(faculty1 instanceof Student);

// call() Method
console.log("\n===== CALL METHOD =====");

const guest = {
    name: "Dr. Ahmed",
    email: "ahmed@example.com"
};

const guestIntroduction = Person.prototype.introduce.call(guest);

console.log(guestIntroduction);

// Detached Method
console.log("\n===== DETACHED METHOD =====");

const fn = student1.introduce;

try {
    console.log(fn());
} catch (error) {
    console.log("Detached method error:", error.message);
}

// bind() Method
console.log("\n===== BIND METHOD =====");

const boundIntroduce = student1.introduce.bind(student1);

console.log(boundIntroduce());

// Additional Tests
console.log("\n===== ADDITIONAL TESTS =====");

const boundaryStudent = new Student(
    "Ahmed",
    "ahmed@student.edu",
    "241104",
    50
);

console.log("Marks 50:", boundaryStudent.getResult());

const failedStudent = new Student(
    "Usman",
    "usman@student.edu",
    "241105",
    0
);

console.log("Marks 0:", failedStudent.getResult());

const invalidStudent = new Student(
    "Test",
    "test@student.edu",
    "241106",
    -10
);

console.log(
    "Invalid marks:",
    invalidStudent.marks < 0 || invalidStudent.marks > 100
        ? "INVALID MARKS"
        : invalidStudent.getResult()
);