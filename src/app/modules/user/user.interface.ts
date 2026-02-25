import { UserRole, UserStatus } from "@prisma/client";

export interface IUser {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string | null;
  role?: UserRole;
  profileImage?: string | null;
  address?: string | null;
  country?: string | null;
  otp?: number | null;
  city?: string | null;
  isVerified?: boolean;
  isActive?: boolean;
  userStatus?: UserStatus;
}

export interface IUserUpdate {
  name?: string;
  email?: string;

  passwordHash?: string;

  phone?: string | null;

  profileImage?: string | null;
  address?: string | null;
  country?: string | null;
  city?: string | null;

  isVerified?: boolean;
  isActive?: boolean;

  userStatus?: UserStatus;

  role?: UserRole;
}
