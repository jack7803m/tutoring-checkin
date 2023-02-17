export class Student {
    id: string;
    name: string;
    token: string;
    time: number;

    constructor(name: string) {
        // Generate a random ID for this student.
        this.id = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
        this.name = name;
        // Generate a random token for this student.
        this.token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
        this.time = Date.now();
    }
}