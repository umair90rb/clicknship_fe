import type { LoginRequestBody } from '../../types/auth';
import { Axios } from '../axios';

class AuthService extends Axios {
  pathname = 'auth';

  fetchLogin = (body: LoginRequestBody) =>
    this.post(`${this.pathname}/login`, body);

  fetchLogout = () => this.post(`${this.pathname}/logout`);
}

export const authService = new AuthService();
