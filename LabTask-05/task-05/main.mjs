import Student from "./Student.mjs";

import {
    calculateGrade as getGrade,
    calculateAverage,
    calculateGPA
} from "./gradeUtils.mjs";

import {
    processTranscript,
    reportToJSON
} from "./transcriptService.mjs";

// Valid JSON
const rawData = `
[
    {
        "id": 101,
        "name": "Ali",
        "courses": [
            { "code": "CS301", "marks": 81 },
            { "code": "CS302", "marks": 74 }
        ]
    },
    {
        "id": 102,
        "name": "Sara",
        "courses": [
            { "code": "CS301", "marks": 91 },
            { "code": "CS302", "marks": 86 }
        ]
    }
]
`;

function testTranscript(label, jsonData) {
    console.log("\n===== " + label + " =====");

    try {
        const report = processTranscript(jsonData);

        console.log("JavaScript Report:");
        console.log(report);

        console.log("JSON Report:");
        console.log(reportToJSON(report));

    } catch (error) {
        console.log("Error Type:", error.name);
        console.log("Error Message:", error.message);

    } finally {
        console.log("Transcript processing finished");
    }
}

// Normal Test
testTranscript("VALID TRANSCRIPT", rawData);

// Malformed JSON
testTranscript("MALFORMED JSON", "{invalid json}");

// Missing Student ID
testTranscript("MISSING ID", JSON.stringify([
    {
        name: "Ahmed",
        courses: [{ code: "CS301", marks: 80 }]
    }
]));

// Duplicate Student IDs
testTranscript("DUPLICATE ID", JSON.stringify([
    {
        id: 101,
        name: "Ali",
        courses: [{ code: "CS301", marks: 80 }]
    },
    {
        id: 101,
        name: "Sara",
        courses: [{ code: "CS302", marks: 90 }]
    }
]));

// Invalid Marks
testTranscript("INVALID MARKS", JSON.stringify([
    {
        id: 103,
        name: "Hina",
        courses: [{ code: "CS301", marks: 110 }]
    }
]));

// Missing Course Code
testTranscript("MISSING COURSE CODE", JSON.stringify([
    {
        id: 104,
        name: "Usman",
        courses: [{ marks: 75 }]
    }
]));

// Boundary Tests
testTranscript("BOUNDARY MARKS", JSON.stringify([
    {
        id: 105,
        name: "Zoya",
        courses: [
            { code: "CS301", marks: 0 },
            { code: "CS302", marks: 100 }
        ]
    }
]));

// Named Import Alias
console.log("\n===== NAMED IMPORT ALIAS =====");
console.log("Grade for 85:", getGrade(85));

// Named Export Tests
console.log("Average:", calculateAverage([
    { marks: 80 },
    { marks: 90 }
]));

console.log("GPA:", calculateGPA([
    { marks: 80 },
    { marks: 90 }
]));

// Default Import Test
console.log("\n===== DEFAULT IMPORT =====");

const student = new Student(106, "Ahmed", [
    { code: "CS301", marks: 88 }
]);

console.log(student.getDetails());