import { Role } from './role'

export interface LoginResponse {
  token: string;
  role: Role;
  userId: number;
}

export interface LoginFormValues {
  role: Role;
  email: string;
  password: string;
  remember: boolean;
}

export type LoginRequest = LoginFormValues;