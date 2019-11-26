import axios, { AxiosInstance, AxiosError } from "axios";

const host = "http://localhost:3000";

interface ApiOptions {
  client?: AxiosInstance;
  token?: string;
}

type UserCredentials = {
  login: string;
  password: string;
};

export default class Api {
  client: AxiosInstance;
  token?: string;
  users: any[];

  constructor(options: ApiOptions) {
    this.client = options.client || axios.create();
    this.token = options.token;
    this.users = [];

    this.client.interceptors.request.use(
      config => {
        if (!this.token) {
          return config;
        }
        const newConfig = {
          ...config
        };
        newConfig.headers.Authorization = `Bearer ${this.token}`;
        return newConfig;
      },
      error => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      res => res,
      async (error: AxiosError) => {
        if (error.response!.status !== 401) {
          throw error;
        }
      }
    );
  }

  async login({ login, password }: UserCredentials) {
    const { data } = await this.client.post(`${host}/auth/login`, {
      login,
      password
    });
    if (data) this.token = data.token;
  }

  logout() {
    this.token = undefined;
  }

  getUsers() {
    return this.client.get(`${host}/json/users`).then(res => {
      const { data } = res;
      if (data) {
        this.users = data;
      }
    });
  }
}
