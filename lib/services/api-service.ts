import { message } from 'antd';
import axios, { AxiosError } from 'axios';
import { DeleteResponse, IResponse, QueryParams } from '../model/api';
import { LoginRequest, LoginResponse } from '../model/login';
import { RootPath, SubPath } from './api-path';
import storage from './storage';
import AES from "crypto-js/aes";
import { 
  AddStudentRequest, 
  AddStudentResponse, 
  Student, 
  StudentResponse, 
  StudentsRequest, 
  StudentsResponse, 
  UpdateStudentRequest, 
  UpdateStudentResponse 
} from '../model/student';
import { Statistic, StatisticsOverviewResponse, StatisticsResponse, StatisticsType } from '../model/statistics';
import { ClassSchedule, Course, CourseDetailResponse, CoursesRequest, CoursesResponse } from '../model/courses';
import { MessagesRequest, MessagesResponse, MessageStatisticResponse } from '../model/message';

const baseURL = 'http://cms.chtoma.com/api';
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  responseType: 'json',
});

axiosInstance.interceptors.request.use((config) => {
  if (!config.url!.includes('login')) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: 'Bearer ' + storage?.token,
      },
    };
  }

  return config;
});

type IPath = (string | number)[] | string | number;

class BaseApiService {
  protected async get<T>(path: IPath, params?: QueryParams): Promise<T> {
    path = this.getPath(path);
    path = !!params
      ? `${path}?${Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')}`
      : path;

    return axiosInstance
      .get(path)
      .then((res) => res.data)
      .catch((err) => this.errorHandler(err));
  }

  protected async post<T>(path: IPath, params: object): Promise<T> {
    return axiosInstance
      .post(this.getPath(path), params)
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  protected async delete<T>(path: IPath): Promise<T> {
    return axiosInstance
      .delete(this.getPath(path))
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  protected async put<T>(path: IPath, params: object): Promise<T> {
    return axiosInstance
      .put(this.getPath(path), params)
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  protected isError(code: number): boolean {
    return !(code.toString().startsWith('2') || code.toString().startsWith('3'));
  }

  protected showMessage = (isSuccessDisplay = false) => (res: IResponse): IResponse => {
    const { code, msg } = res;
    const isError = this.isError(code);

    if (isError) {
      message.error(msg);
    }

    if (isSuccessDisplay && !isError) {
      message.success(msg);
    }

    return res;
  };

  private errorHandler(err: AxiosError<IResponse>): IResponse {
    const msg = err.response?.data.msg ?? 'unknown error';
    const code = err.response?.status ?? -1;

    if (!err.response) {
      console.error('%c [ err ]-149', 'font-size:13px; background:pink; color:#bf2c9f;', err);
    }

    return { msg, code };
  }

  private getPath(path: IPath): string {
    return !Array.isArray(path) ? String(path) : path.join('/');
  }

}

class ApiService extends BaseApiService {
  login({ password, ...rest }: LoginRequest): Promise<IResponse<LoginResponse>> {
    return this.post<IResponse<LoginResponse>>(RootPath.login, {
      ...rest,
      password: AES.encrypt(password, 'cms').toString(),
    }).then(this.showMessage());
  }

  logout(): Promise<IResponse<boolean>> {
    return this.post<IResponse<boolean>>(RootPath.logout, {}).then(this.showMessage());
  }

  getStudents(req?: StudentsRequest): Promise<IResponse<StudentsResponse>> {
    return this.get<IResponse<StudentsResponse>>(
      RootPath.students,
      (req as unknown) as QueryParams
    );
  }

  addStudent(req: AddStudentRequest): Promise<IResponse<AddStudentResponse>> {
    return this.post<IResponse<AddStudentResponse>>([RootPath.students], req).then(this.showMessage(true));
  }

  updateStudent(req: UpdateStudentRequest): Promise<IResponse<UpdateStudentResponse>> {
    return this.put<IResponse<UpdateStudentResponse>>([RootPath.students], req).then(this.showMessage(true));
  }

  deleteStudent(id: number): Promise<IResponse<DeleteResponse>> {
    return this.delete<IResponse<DeleteResponse>>([RootPath.students, id]).then(this.showMessage(true));
  }

  getStudentById(id:number): Promise<IResponse<StudentResponse>> {
    return this.get<IResponse<Student>>([RootPath.students, id]).then(this.showMessage());
  }

  getCourseById(id:number): Promise<IResponse<CourseDetailResponse>> {
    return this.get<IResponse<Course>>([RootPath.courses, SubPath.detail], { id }).then(this.showMessage());
  }

  getStatisticsOverview(): Promise<IResponse<StatisticsOverviewResponse>> {
    return this.get<IResponse<StatisticsOverviewResponse>>([
      RootPath.statistics,
      SubPath.overview,
    ]).then(this.showMessage());
  }

  getStatistics<T, U = Statistic>(
    type: StatisticsType,
    userId?: number
  ): Promise<IResponse<StatisticsResponse<T, U>>> {
    return this.get<IResponse<StatisticsResponse<T, U>>>(
      [RootPath.statistics, type],
      !!userId ? { userId } : {}
    ).then(this.showMessage());
  }

  getClassSchedule(userId: number): Promise<IResponse<ClassSchedule[]>> {
    return this.get<IResponse<ClassSchedule[]>>([RootPath.class, SubPath.schedule], {
      userId,
    }).then(this.showMessage());
  }

  getWorld = async () => {
    return await axios.get(
      'https://code.highcharts.com/mapdata/custom/world-palestine-highres.geo.json'
    );
  };

  getCourses(req?: CoursesRequest): Promise<IResponse<CoursesResponse>> {
    return this.get<IResponse<CoursesResponse>>(
      RootPath.courses,
      (req as unknown) as QueryParams
    );
  }

  getMessages(req: MessagesRequest): Promise<IResponse<MessagesResponse>> {
    return this.get<IResponse<MessagesResponse>>([RootPath.message], { ...req }).then(
      this.showMessage()
    );
  }

  getMessageStatistic(userId?: number): Promise<IResponse<MessageStatisticResponse>> {
    return this.get<IResponse<MessagesResponse>>(
      [RootPath.message, SubPath.statistics], userId ? { userId } : undefined
      ).then(this.showMessage());
  }

  markAsRead(ids: number[]): Promise<IResponse<boolean>> {
    return this.put<IResponse<boolean>>([RootPath.message], { status: 1, ids }).then(this.showMessage());
  }
}

export const apiService = new ApiService();

export default apiService;
