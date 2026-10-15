const applicants = [
    {
        id: "A101",
        name: "Sara Khan",
        age: "19",
        matricMarks: "91",
        intermediateMarks: "87",
        entryTest: "78",
        program: "BSCS",
        feePaid: "true"
    },
    {
        id: "A102",
        name: "Ahmed Ali",
        age: "twenty",
        matricMarks: "88",
        intermediateMarks: "",
        entryTest: "72",
        program: "BSSE",
        feePaid: "false"
    },
    {
        id: "A103",
        name: "Hassan",
        age: "18",
        matricMarks: "76",
        intermediateMarks: "83",
        entryTest: "91",
        program: "BSAI",
        feePaid: "true"
    }
];

const supportedPrograms = ["BSCS", "BSSE", "BSAI"];

function convertNumber(value) {
    if (value === null || value === undefined ||
        String(value).trim() === "") {
        return NaN;
    }

    return Number(value);
}

function processApplicant(applicant) {
    const age = convertNumber(applicant.age);
    const matric = convertNumber(applicant.matricMarks);
    const intermediate = convertNumber(applicant.intermediateMarks);
    const entryTest = convertNumber(applicant.entryTest);

    const feePaid = applicant.feePaid === "true";

    const errors = [];

    if (!Number.isInteger(age) || age < 17 || age > 30) {
        errors.push("Invalid age");
    }

    if (!Number.isFinite(matric) || matric < 0 || matric > 100) {
        errors.push("Invalid Matric marks");
    }

    if (!Number.isFinite(intermediate) ||
        intermediate < 0 || intermediate > 100) {
        errors.push("Invalid Intermediate marks");
    }

    if (!Number.isFinite(entryTest) ||
        entryTest < 0 || entryTest > 100) {
        errors.push("Invalid Entry Test marks");
    }

    if (!supportedPrograms.includes(applicant.program)) {
        errors.push("Unsupported program");
    }

    if (applicant.feePaid !== "true" &&
        applicant.feePaid !== "false") {
        errors.push("Invalid fee payment value");
    }

    if (errors.length > 0) {
        return {
            id: applicant.id,
            name: applicant.name,
            program: applicant.program,
            status: "INVALID DATA",
            merit: null,
            errors: errors
        };
    }

    const merit =
        matric * 0.20 +
        intermediate * 0.30 +
        entryTest * 0.50;

    let status;

    const eligible =
        merit >= 70 &&
        entryTest >= 60 &&
        intermediate >= 60;

    if (!eligible) {
        status = "REJECTED";
    } else if (merit >= 80 && feePaid) {
        status = "SELECTED";
    } else {
        status = "WAITING";
    }

    return {
        id: applicant.id,
        name: applicant.name,
        program: applicant.program,
        age: age,
        feePaid: feePaid,
        merit: Number(merit.toFixed(2)),
        status: status,
        errors: []
    };
}

function generateSummary(processed) {
    const valid = processed.filter(
        applicant => applicant.status !== "INVALID DATA"
    );

    const invalid = processed.filter(
        applicant => applicant.status === "INVALID DATA"
    );

    const sorted = [...valid].sort(
        (a, b) => b.merit - a.merit
    );

    const totalMerit = valid.reduce(
        (sum, applicant) => sum + applicant.merit, 0
    );

    const programCounts = {};

    processed.forEach(applicant => {
        const program = applicant.program;

        programCounts[program] =
            (programCounts[program] || 0) + 1;
    });

    return {
        validApplicants: valid.length,
        invalidApplicants: invalid.length,
        highestMeritApplicant: sorted[0]?.name ?? null,
        lowestMerit: sorted.length
            ? sorted[sorted.length - 1].merit
            : null,
        averageMerit: valid.length
            ? Number((totalMerit / valid.length).toFixed(2))
            : null,
        programCounts: programCounts
    };
}

// Process applicants
const processedApplicants = applicants.map(processApplicant);

// Display results
console.log("===== ADMISSION RESULTS =====");

processedApplicants.forEach(applicant => {
    console.log(applicant);
});

// Generate final summary
console.log("\n===== ADMISSION SUMMARY =====");
console.log(generateSummary(processedApplicants));

// Boundary and invalid tests
const testApplicant = {
    ...applicants[0],
    id: "TEST1",
    age: "17",
    matricMarks: "70",
    intermediateMarks: "70",
    entryTest: "70"
};

const invalidApplicant = {
    ...applicants[0],
    id: "TEST2",
    matricMarks: "105"
};

console.log("\n===== ADDITIONAL TESTS =====");
console.log(processApplicant(testApplicant));
console.log(processApplicant(invalidApplicant));