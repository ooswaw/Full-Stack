"use strict";

// TASK 7 - PROMISE-BASED MULTI-SERVICE REGISTRATION ENGINE

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

// PART A - PROMISE-BASED REGISTRATION CHAIN

function getStudent(studentId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const student = students.find(s => s.id === studentId);

            if (!student) {
                return reject(new Error("Student does not exist"));
            }

            resolve(student);
        }, 200);
    });
}

function getCourse(courseCode) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const course = courses.find(c => c.code === courseCode);

            if (!course) {
                return reject(new Error("Course does not exist"));
            }

            resolve(course);
        }, 200);
    });
}

function checkPrerequisites(student, course) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (
                course.prerequisite &&
                !student.completedCourses.includes(course.prerequisite)
            ) {
                return reject(new Error("Prerequisite not completed"));
            }

            resolve({ student, course });
        }, 200);
    });
}

function checkSeats(student, course) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (course.availableSeats <= 0) {
                return reject(new Error("Course is full"));
            }

            resolve({ student, course });
        }, 200);
    });
}

function registerStudent(student, course) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (student.registeredCourses.includes(course.code)) {
                return reject(new Error("Student already registered"));
            }

            if (course.availableSeats <= 0) {
                return reject(new Error("Course is full"));
            }

            student.registeredCourses.push(course.code);
            course.availableSeats--;

            resolve({
                studentId: student.id,
                course: course.code,
                status: "REGISTERED"
            });
        }, 200);
    });
}

// PART B - POST-REGISTRATION SERVICES

function sendEmail(confirmation) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("Email sent to student:", confirmation.studentId);
            resolve("Email sent");
        }, 200);
    });
}

function sendSMS(confirmation) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("SMS service unavailable"));
        }, 200);
    });
}

function writeAuditLog(confirmation) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("Audit log created:", confirmation.course);
            resolve("Audit log saved");
        }, 200);
    });
}

function runPostRegistrationServices(confirmation) {
    const services = ["Email", "SMS", "Audit"];

    return Promise.allSettled([
        sendEmail(confirmation),
        sendSMS(confirmation),
        writeAuditLog(confirmation)
    ]).then(results => {
        const report = results.map((result, index) => ({
            service: services[index],
            status: result.status
        }));

        console.log("\nPost-Registration Service Report:");
        console.table(report);

        return report;
    });
}

// COMPLETE REGISTRATION WORKFLOW

function startRegistration(studentId, courseCode) {
    let currentStudent;

    return getStudent(studentId)
        .then(student => {
            currentStudent = student;
            return getCourse(courseCode);
        })
        .then(course => {
            return checkPrerequisites(currentStudent, course);
        })
        .then(({ student, course }) => {
            return checkSeats(student, course);
        })
        .then(({ student, course }) => {
            return registerStudent(student, course);
        })
        .then(confirmation => {
            console.log("Registration Successful:", confirmation);

            return runPostRegistrationServices(confirmation)
                .then(report => ({
                    confirmation,
                    report
                }));
        })
        .catch(error => {
            console.log("Registration Failed:", error.message);
            return null;
        })
        .finally(() => {
            console.log("Registration process finished");
        });
}

// PART C - FIRST SUCCESSFUL COURSE SERVER

function courseServer1(courseCode) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("Server 1 unavailable"));
        }, 100);
    });
}

function courseServer2(courseCode) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const course = courses.find(c => c.code === courseCode);

            if (!course) {
                return reject(new Error("Course not found"));
            }

            resolve({
                server: "Server 2",
                course: course
            });
        }, 300);
    });
}

function getCourseFromServers(courseCode) {
    return Promise.any([
        courseServer1(courseCode),
        courseServer2(courseCode)
    ]);
}

// TEST CASES

function testRegistration(label, studentId, courseCode) {
    console.log("\n===== " + label + " =====");

    return startRegistration(studentId, courseCode);
}

testRegistration("SUCCESSFUL REGISTRATION", 101, "CS401")
    .then(() => {
        return testRegistration("STUDENT NOT FOUND", 999, "CS401");
    })
    .then(() => {
        return testRegistration("PREREQUISITE FAILED", 103, "CS401");
    })
    .then(() => {
        return testRegistration("COURSE FULL", 101, "CS402");
    })
    .then(() => {
        return testRegistration("ALREADY REGISTERED", 102, "CS401");
    })
    .then(() => {
        return testRegistration("COURSE NOT FOUND", 101, "CS999");
    })
    .then(() => {
        console.log("\n===== SERVER SELECTION =====");

        return getCourseFromServers("CS401")
            .then(result => {
                console.log("First successful response:", result);
            })
            .catch(error => {
                console.log("All servers failed:", error.message);
            });
    })
    .then(() => {
        console.log("\n===== ALL TESTS COMPLETED =====");
    })
    .catch(error => {
        console.log("Unexpected error:", error.message);
    });