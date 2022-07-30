import { ListResponse, Paginator } from "./api";

interface Sales {
  id: number;
  batches: number;
  price: number;
  earnings: number;
  paidAmount: number;
  studentAmount: number;
  paidIds: number[];
}

export interface CourseShort {
  id: number;
  name: string;
  courseId: number;
}

export interface Schedule {
  id: number;
  status: number;
  current: number;
  chapters: Chapter[];
  classTime: string[];
}

export interface Chapter {
  name: string;
  id: number;
  content: string;
  order: number;
}

export interface Course {
  id: number;
  name: string;
  uid: string; //code
  detail: string;
  startTime: string;
  price: number;
  maxStudents: number;
  star: number;
  status: CourseStatus;
  duration: number;
  durationUnit: DurationUnit;
  cover: string;
  teacherName: string;
  teacherId: number;
  type: CourseType[];
  ctime: string;
  createdAt?: string
  scheduleId: number;
}

type CourseStatus = 0 | 1 | 2;

type DurationUnit = 1 | 2 | 3 | 4 | 5;

export interface CourseType {
  id: number;
  name: string;
}

export interface ClassSchedule extends Course {
  schedule: Schedule;
}

export interface CoursesResponse extends ListResponse {
  courses: Course[];
}

export interface CoursesRequest {
  page?: number;
  limit?: number;
  name?: string;
  uid?: string;
  typeId?: number;
  userId?: number;
}

export interface CourseDetail extends Course {
  sales: Sales;
  schedule: Schedule;
}

export type CourseDetailResponse = CourseDetail;

export interface CourseRequest extends Paginator {
  code?: string;
  name?: string;
  type?: number;
  userId?: number;
  own?: any; // ?这个字段是多余的，真实的后台可以根据token等鉴定用户权限
}

export type AddCourseRequest = Pick<
  Course,
  | 'cover'
  | 'detail'
  | 'duration'
  | 'durationUnit'
  | 'maxStudents'
  | 'name'
  | 'price'
  | 'startTime'
  | 'uid'
> & { type: number | number[]; teacherId: number };

export type AddCourseResponse = Course;

export interface UpdateCourseRequest {
  id: number;
}

export type UpdateCourseResponse = Course;

export interface ScheduleRequest {
  scheduleId?: number;
  courseId?: number;
  current?: number;
  statue?: number;
  chapters?: Omit<Chapter, 'id'>[];
  classTime?: string[];
}