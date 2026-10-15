
"use strict";

// TASK 8 - CONCURRENT ACADEMIC API AGGREGATOR

// FAKE API DATA

const apiData = {
    "/users": [
        { id: 1, name: "Ali", department: "CS" },
        { id: 2, name: "Sara", department: "CS" },
        { id: 3, name: "Usman", department: "SE" },
        { id: 4, name: "Hina", department: "AI" },
        { id: 5, name: "Ahmed", department: "SE" },
        { id: 6, name: "Zoya", department: "AI" }
    ],

    "/courses": [
        { code: "CS301", name: "Full Stack Development" },
        { code: "CS302", name: "Database Systems" },
        { code: "CS303", name: "Operating Systems" }
    ],

    "/results": [
        { studentId: 1, marks: 82 },
        { studentId: 2, marks: 91 },
        { studentId: 3, marks: 47 },
        { studentId: 4, marks: 73 },
        { studentId: 5, marks: 64 },
        { studentId: 6, marks: 91 }
    ]
};

// FAKE FETCH IMPLEMENTATION

function fakeFetch(url, options = {}) {
    return new Promise((resolve, reject) => {
        const signal = options.signal;
        let settled = false;
        let timer;

        function cleanup() {
            if (signal) {
                signal.removeEventListener("abort", onAbort);
            }
        }

        function onAbort() {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            cleanup();

            const error = new Error("Request aborted");
            error.name = "AbortError";
            reject(error);
        }

        if (signal?.aborted) {
            onAbort();
            return;
        }

        if (signal) {
            signal.addEventListener("abort", onAbort, { once: true });
        }

        const delay = url === "/slow" ? 2000 : 200;

        timer = setTimeout(() => {
            if (settled) return;

            settled = true;
            cleanup();

            if (url === "/network-error") {
                reject(new TypeError("Network connection failed"));
                return;
            }

            if (url === "/server-error") {
                resolve({
                    ok: false,
                    status: 500,
                    json: async () => ({ error: "Internal Server Error" })
                });
                return;
            }

            if (url === "/invalid-json") {
                resolve({
                    ok: true,
                    status: 200,
                    json: async () => {
                        throw new SyntaxError("Invalid JSON response");
                    }
                });
                return;
            }

            if (url === "/slow") {
                resolve({
                    ok: true,
                    status: 200,
                    json: async () => ({ message: "Slow response received" })
                });
                return;
            }

            if (!Object.hasOwn(apiData, url)) {
                resolve({
                    ok: false,
                    status: 404,
                    json: async () => ({ error: "Not Found" })
                });
                return;
            }

            resolve({
                ok: true,
                status: 200,
                json: async () => structuredClone(apiData[url])
            });
        }, delay);
    });
}

// GET JSON FUNCTION

async function getJSON(url, fetchImplementation = fakeFetch) {
    const response = await fetchImplementation(url);

    if (!response.ok) {
        throw new Error(
            `HTTP Error ${response.status} for ${url}`
        );
    }

    return await response.json();
}

// CONCURRENT DASHBOARD LOADING

async function loadDashboard() {
    console.log("\n===== CAMPUSFLOW DASHBOARD =====");

    try {
        const [users, courses, results] = await Promise.all([
            getJSON("/users"),
            getJSON("/courses"),
            getJSON("/results")
        ]);

        const validResults = results.filter(result =>
            typeof result.marks === "number" &&
            Number.isFinite(result.marks) &&
            result.marks >= 0 &&
            result.marks <= 100
        );

        const totalMarks = validResults.reduce(
            (sum, result) => sum + result.marks,
            0
        );

        const average = validResults.length > 0
            ? totalMarks / validResults.length
            : null;

        const rankedResults = [...validResults].sort(
            (a, b) => b.marks - a.marks
        );

        const highestResult = rankedResults[0] ?? null;

        const highestStudent = highestResult
            ? users.find(user => user.id === highestResult.studentId)
            : null;

        const failedStudents = validResults.filter(
            result => result.marks < 50
        ).length;

        const departmentStats = {};

        users.forEach(user => {
            const department = user.department;

            if (!Object.hasOwn(departmentStats, department)) {
                departmentStats[department] = {
                    students: 0,
                    totalMarks: 0,
                    resultCount: 0,
                    passed: 0,
                    failed: 0,
                    highest: null
                };
            }

            const stats = departmentStats[department];
            stats.students++;

            const studentResults = validResults.filter(
                result => result.studentId === user.id
            );

            studentResults.forEach(result => {
                stats.totalMarks += result.marks;
                stats.resultCount++;

                if (stats.highest === null ||
                    result.marks > stats.highest) {
                    stats.highest = result.marks;
                }

                if (result.marks >= 50) {
                    stats.passed++;
                } else {
                    stats.failed++;
                }
            });
        });

        Object.values(departmentStats).forEach(stats => {
            stats.average = stats.resultCount > 0
                ? Number(
                    (stats.totalMarks / stats.resultCount).toFixed(2)
                )
                : null;

            delete stats.totalMarks;
            delete stats.resultCount;
        });

        const dashboard = {
            totalStudents: users.length,
            totalCourses: courses.length,
            overallAverageMarks: average === null
                ? null
                : Number(average.toFixed(2)),
            highestPerformingStudent: highestStudent
                ? {
                    name: highestStudent.name,
                    marks: highestResult.marks
                }
                : null,
            failedStudents,
            departmentStats
        };

        console.log("Dashboard Report:");
        console.log(JSON.stringify(dashboard, null, 2));

        return dashboard;

    } catch (error) {
        console.log("Dashboard Error:", error.message);
        throw error;

    } finally {
        console.log("Dashboard loading finished");
    }
}

// FETCH WITH TIMEOUT

async function fetchWithTimeout(
    url,
    milliseconds,
    fetchImplementation = fakeFetch
) {
    if (!Number.isFinite(milliseconds) || milliseconds < 0) {
        throw new RangeError("Invalid timeout duration");
    }

    const controller = new AbortController();

    const timer = setTimeout(() => {
        controller.abort();
    }, milliseconds);

    try {
        const response = await fetchImplementation(url, {
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error("Request timed out or was aborted");
        }

        throw error;

    } finally {
        clearTimeout(timer);
    }
}

// ERROR HANDLING TESTS

async function testAPI(label, url) {
    console.log("\n===== " + label + " =====");

    try {
        const data = await getJSON(url);
        console.log("Success:", data);

    } catch (error) {
        console.log("Error Type:", error.name);
        console.log("Error Message:", error.message);

    } finally {
        console.log("API test finished");
    }
}

// TIMEOUT TESTS

async function testTimeout(label, url, milliseconds) {
    console.log("\n===== " + label + " =====");

    try {
        const data = await fetchWithTimeout(url, milliseconds);
        console.log("Success:", data);

    } catch (error) {
        console.log("Error Type:", error.name);
        console.log("Error Message:", error.message);

    } finally {
        console.log("Timeout test finished");
    }
}

// MAIN PROGRAM

async function main() {
    await loadDashboard();

    await testAPI("SUCCESS 200", "/users");
    await testAPI("HTTP 404", "/missing");
    await testAPI("HTTP 500", "/server-error");
    await testAPI("NETWORK FAILURE", "/network-error");
    await testAPI("INVALID JSON", "/invalid-json");

    await testTimeout("SUCCESS BEFORE TIMEOUT", "/users", 1000);
    await testTimeout("SLOW RESPONSE TIMEOUT", "/slow", 500);
    await testTimeout("HTTP ERROR WITH TIMEOUT", "/missing", 1000);

    console.log("\n===== ALL TASK 8 TESTS COMPLETED =====");
}

main().catch(error => {
    console.error("Unexpected Error:", error.message);
});
