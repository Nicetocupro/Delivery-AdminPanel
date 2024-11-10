import axios from 'axios';
import router from '../src/router/router';

const instance = axios.create({
  baseURL: 'https://localhost',
});



instance.interceptors.response.use(

  (response) => {
    console.log(response);
    return response;
  },
  (error) => {

    if (error.status == 504 || error.status == 404) {
      console.log('服务器被吃了( ╯□╰ )504');
    } else if (error.status == 403) {
      console.log('服务器被吃了( ╯□╰ )403');
    } else if (error.status == 401) {
      console.log('accesstoken过期401!!!!!!!');
    } else {
      console.log(error);
    }
    console.log('返回reject');
    return Promise.reject(error);
  }

);




export default instance;