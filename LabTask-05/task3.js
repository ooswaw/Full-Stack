
"use strict";

// TASK 3 - SAFE STUDENT PROFILE UPDATE SERVICE

const student = {
    id: 101,
    name: "Ali",
    marks: 0,
    scholarship: false,
    address: {
        city: "Islamabad",
        sector: "F-10"
    },
    contact: {
        email: "ali@university.edu"
    }
};

const update = {
    name: "Ali Khan",
    address: {
        city: "Rawalpindi"
    },
    contact: {
        phone: "03001234567"
    }
};

// Safely update the student without mutation
function updateStudentProfile(original, changes) {
    if (!original || typeof original !== "object" ||
        Array.isArray(original)) {
        throw new TypeError("Invalid original student");
    }

    if (!changes || typeof changes !== "object" ||
        Array.isArray(changes)) {
        throw new TypeError("Invalid update data");
    }

    // Object destructuring with defaults
    const {
        name = original.name,
        marks = original.marks,
        scholarship = original.scholarship,
        address = {},
        contact = {},
        ...otherUpdates
    } = changes;

    // Nested destructuring and renaming
    const {
        city: newCity = original.address?.city
    } = address ?? {};

    // Nullish coalescing
    const studentName = name ?? original.name;

    // Spread operator and property shorthand
    const updatedStudent = {
        ...original,
        ...otherUpdates,
        name: studentName,
        marks,
        scholarship,

        address: {
            ...original.address,
            ...(address ?? {}),
            city: newCity
        },

        contact: {
            ...original.contact,
            ...(contact ?? {})
        }
    };

    return updatedStudent;
}

// Update the profile
const updatedStudent = updateStudentProfile(student, update);

console.log("===== ORIGINAL STUDENT =====");
console.log(student);

console.log("\n===== UPDATED STUDENT =====");
console.log(updatedStudent);


// REFERENCE COMPARISON

console.log("\n===== REFERENCE COMPARISON =====");

console.log(
    "Original === Updated:",
    student === updatedStudent
);

console.log(
    "Original address === Updated address:",
    student.address === updatedStudent.address
);

console.log(
    "Original contact === Updated contact:",
    student.contact === updatedStudent.contact
);


// ARRAY DESTRUCTURING

console.log("\n===== ARRAY DESTRUCTURING =====");

const courses = ["FSWD", "DAA", "OS"];
const [firstCourse, secondCourse, ...remainingCourses] = courses;

console.log("First Course:", firstCourse);
console.log("Second Course:", secondCourse);
console.log("Remaining Courses:", remainingCourses);


// REST PARAMETERS

function calculateTotal(...marks) {
    return marks.reduce((total, mark) => total + mark, 0);
}

console.log("\n===== REST PARAMETERS =====");
console.log("Total:", calculateTotal(80, 90, 70));


// NULLISH COALESCING TESTS

console.log("\n===== NULLISH COALESCING =====");

console.log("Marks:", student.marks ?? 50);
console.log("Scholarship:", student.scholarship ?? true);
console.log("Empty String:", "" ?? "Default Name");


// BOUNDARY AND INVALID TESTS

console.log("\n===== ADDITIONAL TESTS =====");

const boundaryUpdate = updateStudentProfile(student, {
    name: "",
    marks: 0,
    scholarship: false,
    address: {
        city: ""
    }
});

console.log("Boundary Update:", boundaryUpdate);

const partialUpdate = updateStudentProfile(student, {
    contact: {
        phone: "03111234567"
    }
});

console.log("Partial Update:", partialUpdate);

try {
    updateStudentProfile(student, null);
} catch (error) {
    console.log("Invalid update:", error.message);
}

// Verify original data was preserved
console.log("\nOriginal student unchanged:");
console.log(student);
