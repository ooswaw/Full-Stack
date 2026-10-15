export function calculateGrade(marks) {
    if (marks >= 85) return "A";
    if (marks >= 80) return "A-";
    if (marks >= 75) return "B+";
    if (marks >= 70) return "B";
    if (marks >= 65) return "B-";
    if (marks >= 60) return "C+";
    if (marks >= 50) return "C";
    return "F";
}

export function calculateAverage(courses) {
    if (!Array.isArray(courses) || courses.length === 0) {
        throw new RangeError("At least one course is required");
    }

    const total = courses.reduce(
        (sum, course) => sum + course.marks, 0
    );

    return Number((total / courses.length).toFixed(2));
}

export function calculateGPA(courses) {
    if (!Array.isArray(courses) || courses.length === 0) {
        throw new RangeError("At least one course is required");
    }

    const points = {
        "A": 4.0,
        "A-": 3.7,
        "B+": 3.3,
        "B": 3.0,
        "B-": 2.7,
        "C+": 2.3,
        "C": 2.0,
        "F": 0.0
    };

    const totalPoints = courses.reduce((sum, course) => {
        const grade = calculateGrade(course.marks);
        return sum + points[grade];
    }, 0);

    return Number((totalPoints / courses.length).toFixed(2));
}