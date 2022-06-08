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