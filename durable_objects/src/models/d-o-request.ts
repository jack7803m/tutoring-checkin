import { Student } from "./student";

// This model is used to transport data between the pages Function and the Durable Object.
export interface DORequest {
    roomtoken?: string;
    studentid?: string;
    studentname?: string;
    studenttoken?: string;
    students?: Array<Student>;
}