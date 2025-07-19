import axios from 'axios';

export class Axios {
  serverUrl = import.meta.env.API_URL;
  defaultHeaders = {
    'Content-Type': 'application/json',
  };

  getJSON = (url: string, headers?: { [key: string]: string }) =>
    axios.get(url, { ...headers });

  post = (
    url: string,
    body?: any,
    headers: { [key: string]: string } = this.defaultHeaders
  ) => axios.post(url, body, { ...headers });

  put = (
    url: string,
    body?: any,
    headers: { [key: string]: string } = this.defaultHeaders
  ) => axios.put(url, body, { ...headers });

  patch = (
    url: string,
    body?: any,
    headers: { [key: string]: string } = this.defaultHeaders
  ) => axios.patch(url, body, { ...headers });

  delete = (
    url: string,
    headers: { [key: string]: string } = this.defaultHeaders
  ) => axios.delete(url, { ...headers });
}
