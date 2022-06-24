import { ListResponse, Paginator } from "./api";
import { Course, CourseShort } from "./courses";

export interface Student<T = CourseShort> {
    id: number;
    name: string;
    country: string;
    email: string;
    courses: T[];
    type: {id:string,name:string};
    ctime: string;
    updateAt: string;
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

export interface SearchStudentByIdRequest {
  id: string;
}

export interface StudentsResponse extends ListResponse {
  students: Student[];
}

export type AddStudentResponse = Student;
export type UpdateStudentResponse = Student;
export type StudentResponse = StudentWithProfile | null;
export interface StudentWithProfile extends Student<Course>, StudentProfile {}


export interface UpdateStudentRequest extends AddStudentRequest {
  id: number;
}

export interface StudentProfile {
  id: number;
  name: string;
  country: string;
  email: string;
  address: string;
  phone: number;
  gender: number;
  education: string;
  age: number;
  interest: string[];
  avatar: string;
  memberStartAt: string;
  memberEndAt: string;
  description: string;
}