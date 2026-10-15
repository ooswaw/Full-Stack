export default class Student {
    constructor(id, name, courses) {
        this.id = id;
        this.name = name;
        this.courses = courses;
    }

    getDetails() {
        return {
            id: this.id,
            name: this.name,
            courses: this.courses
        };
    }
}