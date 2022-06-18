import { ListResponse, Paginator } from "./api";

export interface Student {
    id: number;
    name: string;
    country: string;
    email: string;
    courses: string;
    type: {id:string,name:string};
    createdAt: string;
  }

export interface AddStudentRequest {
    name: string;
    country: string;
    email:string;
    type: number;
}

export interface StudentsRequest extends Paginator {
  query?: string;
  userId?: number;
}

export interface StudentsResponse extends ListResponse {
  students: Student[];
}

export type AddStudentResponse = Student;
export type UpdateStudentResponse = Student;

export interface UpdateStudentRequest extends AddStudentRequest {
  id: number;
}
