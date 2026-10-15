"use strict";

// TASK 6 - LEGACY COURSE REGISTRATION USING CALLBACKS

const students = [
    {
        id: 101,
        name: "Ali",
        completedCourses: ["CS301", "CS302"],
        registeredCourses: []
    },
    {
        id: 102,
        name: "Sara",
        completedCourses: ["CS301"],
        registeredCourses: ["CS401"]
    },
    {
        id: 103,
        name: "Ahmed",
        completedCourses: [],
        registeredCourses: []
    }
];

const courses = [
    {
        code: "CS401",
        prerequisite: "CS301",
        availableSeats: 2
    },
    {
        code: "CS402",
        prerequisite: "CS302",
        availableSeats: 0
    }
];

// 1. LOAD STUDENT
function loadStudent(studentId, callback) {
    setTimeout(() => {
        const student = students.find(s => s.id === studentId);

        if (!student) {
            return callback(new Error("Student does not exist"), null);
        }

        callback(null, student);
    }, 300);
}

// 2. CHECK PREREQUISITES
function checkPrerequisites(student, courseCode, callback) {
    setTimeout(() => {
        const course = courses.find(c => c.code === courseCode);

        if (!course) {
            return callback(new Error("Course does not exist"), null);
        }

        if (
            course.prerequisite &&
            !student.completedCourses.includes(course.prerequisite)
        ) {
            return callback(
                new Error("Prerequisite not completed"),
                null
            );
        }

        callback(null, course);
    }, 300);
}

// 3. CHECK AVAILABLE SEATS
function checkAvailableSeats(course, callback) {
    setTimeout(() => {
        if (course.availableSeats <= 0) {
            return callback(new Error("Course is full"), null);
        }

        callback(null, course);
    }, 300);
}

// 4. REGISTER COURSE
function registerCourse(student, course, callback) {
    setTimeout(() => {
        if (student.registeredCourses.includes(course.code)) {
            return callback(
                new Error("Student already registered"),
                null
            );
        }

        if (course.availableSeats <= 0) {
            return callback(new Error("Course is full"), null);
        }

        student.registeredCourses.push(course.code);
        course.availableSeats--;

        const confirmation = {
            studentId: student.id,
            course: course.code,
            status: "REGISTERED"
        };

        callback(null, confirmation);
    }, 300);
}

// MAIN REGISTRATION WORKFLOW
function startRegistration(studentId, courseCode, callback) {

    loadStudent(studentId, (error, student) => {
        if (error) {
            return callback(error, null);
        }

        checkPrerequisites(student, courseCode, (error, course) => {
            if (error) {
                return callback(error, null);
            }

            checkAvailableSeats(course, (error, availableCourse) => {
                if (error) {
                    return callback(error, null);
                }

                registerCourse(student, availableCourse, (error, result) => {
                    if (error) {
                        return callback(error, null);
                    }

                    callback(null, result);
                });
            });
        });
    });
}

// TESTING FUNCTION
function testRegistration(label, studentId, courseCode, callback) {
    console.log("\n===== " + label + " =====");

    startRegistration(studentId, courseCode, (error, result) => {
        if (error) {
            console.log("Registration Failed:", error.message);
        } else {
            console.log("Registration Successful:", result);
        }

        callback();
    });
}

// TEST CASES
// Execute sequentially to avoid shared-seat conflicts.
const tests = [
    ["SUCCESSFUL REGISTRATION", 101, "CS401"],
    ["STUDENT NOT FOUND", 999, "CS401"],
    ["PREREQUISITE NOT COMPLETED", 103, "CS401"],
    ["COURSE FULL", 101, "CS402"],
    ["ALREADY REGISTERED", 102, "CS401"],
    ["COURSE NOT FOUND", 101, "CS999"],
    ["DUPLICATE REGISTRATION", 101, "CS401"]
];

function runTests(index) {
    if (index >= tests.length) {
        console.log("\n===== ALL TESTS COMPLETED =====");
        return;
    }

    const [label, studentId, courseCode] = tests[index];

    testRegistration(label, studentId, courseCode, () => {
        runTests(index + 1);
    });
}

runTests(0);