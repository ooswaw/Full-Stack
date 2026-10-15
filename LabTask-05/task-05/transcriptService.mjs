import Student from "./Student.mjs";

import {
    calculateAverage,
    calculateGPA,
    calculateGrade
} from "./gradeUtils.mjs";

export function processTranscript(rawData) {
    let data;

    if (typeof rawData !== "string") {
        throw new TypeError("Transcript input must be a JSON string");
    }

    try {
        data = JSON.parse(rawData);
    } catch (error) {
        throw new SyntaxError("Malformed JSON: " + error.message);
    }

    if (!Array.isArray(data)) {
        throw new TypeError("Transcript data must be an array");
    }

    const ids = new Set();

    const report = data.map(record => {
        if (!record || typeof record !== "object" ||
            Array.isArray(record)) {
            throw new TypeError("Invalid student record");
        }

        if (record.id === undefined ||
            record.id === null ||
            record.id === "") {
            throw new Error("Missing student ID");
        }

        if (ids.has(record.id)) {
            throw new Error("Duplicate student ID: " + record.id);
        }

        ids.add(record.id);

        if (typeof record.name !== "string" ||
            record.name.trim() === "") {
            throw new TypeError("Invalid student name");
        }

        if (!Array.isArray(record.courses)) {
            throw new TypeError("Courses must be an array");
        }

        if (record.courses.length === 0) {
            throw new RangeError("Student must have at least one course");
        }

        record.courses.forEach(course => {
            if (!course || typeof course !== "object") {
                throw new TypeError("Invalid course");
            }

            if (typeof course.code !== "string" ||
                course.code.trim() === "") {
                throw new Error("Missing course code");
            }

            if (typeof course.marks !== "number" ||
                !Number.isFinite(course.marks)) {
                throw new TypeError("Marks must be a valid number");
            }

            if (course.marks < 0 || course.marks > 100) {
                throw new RangeError("Marks must be between 0 and 100");
            }
        });

        const student = new Student(
            record.id,
            record.name,
            record.courses
        );

        return {
            id: student.id,
            name: student.name,
            courses: student.courses.map(course => ({
                ...course,
                grade: calculateGrade(course.marks)
            })),
            average: calculateAverage(student.courses),
            GPA: calculateGPA(student.courses)
        };
    });

    return report;
}

export function reportToJSON(report) {
    return JSON.stringify(report, null, 2);
}