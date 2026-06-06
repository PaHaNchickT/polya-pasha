export interface LoginResponse {
  token: string;
  user: {
    login: string;
    role: string;
  };
}

export interface Place {
  id: number;
  name: string;
  address: string;
  rating: number;
}
