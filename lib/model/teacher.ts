import { ListResponse, Paginator } from "./api";

export interface Teacher {
  id: number;
  name: string;
  country: string;
  phone: number;
  skills: Skill[];
  courseAmount: number;
  profileId: number;
  email: string;
  ctime: string;
  createdAt?:string
  updateAt: string;
}

export interface Skill {
  name: string;
  level: number;
}

export interface TeacherProfile {
  id: number;
  address: string[];
  gender: number;
  birthday: string;
  avatar: string;
  description: string;
  workExperience: WorkExperience[];
  education: Education[];
}

export interface Education {
  level: string;
  degree: string;
  startEnd: string;
}

export interface WorkExperience {
  company: string;
  post: string;
  startEnd: string;
}

export interface TeachersRequest extends Partial<Paginator> {
  query?: string;
}

export interface TeachersResponse extends ListResponse {
  teachers: Teacher[];
}