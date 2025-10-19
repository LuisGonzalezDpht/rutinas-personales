export interface Users {
  [key: string]: string | Date;
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsersSignUp {
  [key: string]: string | undefined;
  phone?: string;
  email?: string;
  username?: string;
  password?: string;
}

export interface UsersLogin {
  [key: string]: string | undefined;
  email?: string;
  password?: string;
}

export interface SessionResponse {
  access_token: string;
  expires_in: number | undefined;
  expires_at: number | undefined;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserLoginResponse {
  session: SessionResponse;
  user: UserResponse;
}
