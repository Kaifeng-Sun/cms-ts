import {
  CalendarOutlined,
  DashboardOutlined,
  DeploymentUnitOutlined,
  EditOutlined,
  FileAddOutlined,
  MessageOutlined,
  ProfileOutlined,
  ProjectOutlined,
  ReadOutlined,
  SolutionOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Role } from '../model/role';
import { Role as Roles } from './role';

export interface SideBarItem {
  icon?: JSX.Element;
  label: string;
  path: string[];
  subMenu?: SideBarItem[];
  hide?: boolean;
  isLast?: boolean;
  hideLinkInBreadcrumb?: boolean; // 当前面包屑上的链接是否应该被隐藏
}

export enum RoutePath {
  manager = 'manager',
  teachers = 'teachers',
  students = 'students',
  courses = 'courses',
  addCourse = 'add-course',
  editCourse = 'edit-course',
  schedule = 'schedule',
  profile = 'profile',
  message = 'message',
}

const students: SideBarItem = {
  path: [RoutePath.students],
  label: 'Student',
  icon: <SolutionOutlined />,
  isLast: false,
  hideLinkInBreadcrumb: false,

  subMenu: [{ path: [''], label: 'Student List', icon: <TeamOutlined />, isLast: true }],
};

const teachers: SideBarItem = {
  path: [RoutePath.teachers],
  label: 'Teacher',
  icon: <DeploymentUnitOutlined />,
  isLast: false,
  hideLinkInBreadcrumb: true,
  subMenu: [
    {
      path: [''],
      label: 'Teacher List',
      icon: <TeamOutlined />,
      isLast: true
    },
  ],
};

const courses: SideBarItem = {
  path: [RoutePath.courses],
  label: 'Course',
  icon: <ReadOutlined />,
  isLast: false,
  hideLinkInBreadcrumb: true,
  subMenu: [
    { path: [''], label: 'All Courses', icon: <ProjectOutlined />, isLast: true },
    { path: [RoutePath.addCourse], label: 'Add Course', icon: <FileAddOutlined />, isLast: true },
    { path: [RoutePath.editCourse], label: 'Edit Course', icon: <EditOutlined />, isLast: true },
  ],
};

const overview: SideBarItem = {
  path: [],
  label: 'Overview',
  icon: <DashboardOutlined />,
  isLast: true
};

const messages: SideBarItem = {
  path: [RoutePath.message],
  label: 'Message',
  icon: <MessageOutlined />,
  isLast: true,
  hideLinkInBreadcrumb: true,
}

export const routes: Map<Role, SideBarItem[]> = new Map([
  [Roles.manager, [overview, students, teachers, courses, messages]],
]);