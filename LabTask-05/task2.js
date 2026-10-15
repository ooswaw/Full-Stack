// TASK 2 - ACADEMIC PERFORMANCE INTELLIGENCE ENGINE

const results = [
    { id: 1, name: "Ali", department: "CS", course: "FSWD", marks: 82 },
    { id: 2, name: "Sara", department: "CS", course: "FSWD", marks: 91 },
    { id: 3, name: "Usman", department: "SE", course: "FSWD", marks: 47 },
    { id: 4, name: "Hina", department: "AI", course: "FSWD", marks: 73 },
    { id: 5, name: "Ahmed", department: "SE", course: "FSWD", marks: 64 },
    { id: 6, name: "Zoya", department: "AI", course: "FSWD", marks: 91 }
];

// PART A - RESULT PROCESSING

function calculateGrade(marks) {
    if (typeof marks !== "number" ||
        !Number.isFinite(marks) ||
        marks < 0 || marks > 100) {
        return null;
    }

    if (marks >= 85) return { grade: "A", gradePoints: 4.0 };
    if (marks >= 80) return { grade: "A-", gradePoints: 3.7 };
    if (marks >= 75) return { grade: "B+", gradePoints: 3.3 };
    if (marks >= 70) return { grade: "B", gradePoints: 3.0 };
    if (marks >= 65) return { grade: "B-", gradePoints: 2.7 };
    if (marks >= 60) return { grade: "C+", gradePoints: 2.3 };
    if (marks >= 50) return { grade: "C", gradePoints: 2.0 };

    return { grade: "F", gradePoints: 0.0 };
}

const processedResults = results.map(student => {
    const grading = calculateGrade(student.marks);

    return {
        ...student,
        grade: grading?.grade ?? "INVALID",
        gradePoints: grading?.gradePoints ?? null,
        status: grading === null
            ? "INVALID"
            : grading.grade === "F" ? "FAIL" : "PASS"
    };
});

console.log("\n===== PART A: RESULT PROCESSING =====");
console.table(processedResults);


// PART B - RANKED MERIT LIST

const rankedStudents = [...processedResults].sort((a, b) => {
    if (b.marks !== a.marks) {
        return b.marks - a.marks;
    }

    return a.name.localeCompare(b.name);
});

console.log("\n===== PART B: RANKED MERIT LIST =====");
console.table(rankedStudents);

console.log(
    "Original array unchanged:",
    results[0].name === "Ali"
);


// PART C - DEPARTMENT STATISTICS

const departmentStats = {};

processedResults.forEach(student => {
    const dept = student.department;

    if (!Object.hasOwn(departmentStats, dept)) {
        departmentStats[dept] = {
            students: 0,
            totalMarks: 0,
            highest: null,
            passed: 0
        };
    }

    const stats = departmentStats[dept];

    stats.students++;

    if (student.status !== "INVALID") {
        stats.totalMarks += student.marks;

        if (stats.highest === null ||
            student.marks > stats.highest) {
            stats.highest = student.marks;
        }

        if (student.status === "PASS") {
            stats.passed++;
        }
    }
});

Object.keys(departmentStats).forEach(dept => {
    const stats = departmentStats[dept];

    const validCount = processedResults.filter(
        student =>
            student.department === dept &&
            student.status !== "INVALID"
    ).length;

    stats.average = validCount > 0
        ? Number((stats.totalMarks / validCount).toFixed(2))
        : null;

    delete stats.totalMarks;
});

console.log("\n===== PART C: DEPARTMENT STATISTICS =====");
console.log(departmentStats);


// PART D - ACADEMIC QUERIES

console.log("\n===== PART D: ACADEMIC QUERIES =====");

// 1. First student scoring more than 85
const firstAbove85 = processedResults.find(
    student => student.marks > 85
);

console.log("First student above 85:", firstAbove85?.name ?? "None");

// 2. Index of first failed student
const firstFailedIndex = processedResults.findIndex(
    student => student.status === "FAIL"
);

console.log("Index of first failed student:", firstFailedIndex);

// 3. Whether at least one student failed
const hasFailedStudent = processedResults.some(
    student => student.status === "FAIL"
);

console.log("At least one failed:", hasFailedStudent);

// 4. Whether all marks are valid
const allMarksValid = results.every(
    student => Number.isFinite(student.marks) &&
               student.marks >= 0 &&
               student.marks <= 100
);

console.log("All marks valid:", allMarksValid);

// 5. Students scoring above the overall average
const validStudents = processedResults.filter(
    student => student.status !== "INVALID"
);

const totalMarks = validStudents.reduce(
    (sum, student) => sum + student.marks, 0
);

const average = validStudents.length > 0
    ? totalMarks / validStudents.length
    : null;

const aboveAverage = validStudents.filter(
    student => student.marks > average
);

console.log("Overall average:", average?.toFixed(2) ?? "N/A");
console.log(
    "Students above average:",
    aboveAverage.map(student => student.name)
);

// 6. Names of top three students
const topThree = rankedStudents
    .slice(0, 3)
    .map(student => student.name);

console.log("Top three students:", topThree);


// ADDITIONAL TESTS

console.log("\n===== BOUNDARY AND INVALID TESTS =====");
console.log("Marks 85:", calculateGrade(85));
console.log("Marks 50:", calculateGrade(50));
console.log("Marks 0:", calculateGrade(0));
console.log("Marks 101:", calculateGrade(101));
console.log("Marks '90':", calculateGrade("90"));

// Demonstrate original array was not modified
console.log(
    "Original student data:",
    results[0]
);