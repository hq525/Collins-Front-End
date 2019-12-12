import axios from 'axios';

export default class API {
  constructor() {}
  get(path: string) {
    return new Promise<any>((resolve, reject) => {
      axios
        .get(path)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error: any) => {
          reject(error.response);
        });
    });
  }
  post(path: string, data: any) {
    return new Promise<any>((resolve, reject) => {
      axios
        .post(path, data)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error.response);
        });
    });
  }
  put(path: string, data: any) {
    return new Promise<any>((resolve, reject) => {
      axios
        .put(path, data)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error.response);
        });
    });
  }
  delete(path: string, data: any) {
    return new Promise<any>((resolve, reject) => {
      axios
        .delete(path, data)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error.response);
        });
    });
  }
}
