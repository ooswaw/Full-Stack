var name = "Uswa Masood";
var age = 20;
var isStudent = true;
var city = "Islamabad";
var university = "Air University";

var biography = {
    name: name,
    age: age,
    isStudent: isStudent,
    address: {
        city: city,
        country: "Pakistan"
    },
    degreeProgram: {
        degree: "BS Computer Science",
        university: university,
        semester: 5
    }
};

console.log("===== MY BIOGRAPHY =====");
console.log("Name:", biography.name);
console.log("Age:", biography.age);
console.log("Student:", biography.isStudent);
console.log("City:", biography.address.city);
console.log("Country:", biography.address.country);
console.log("Degree:", biography.degreeProgram.degree);
console.log("University:", biography.degreeProgram.university);
console.log("Semester:", biography.degreeProgram.semester);