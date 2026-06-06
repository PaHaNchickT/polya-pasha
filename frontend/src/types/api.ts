export interface LoginResponse {
  token: string;
  user: {
    login: string;
    role: string;
  };
}
