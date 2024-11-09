import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://localhost',
});

instance.interceptors.response.use(

  (response) => {
    console.log(response);
    return response;
  },
  (error) => {

    console.log(error);

    if (error.status == 504 || error.status == 404) {
      console.log('服务器被吃了( ╯□╰ )504');
      return Promise.reject(error);
    } else if (error.status == 403) {
      console.log('服务器被吃了( ╯□╰ )403');
      return Promise.reject(error);
    } else if (error.status == 401) {
      console.log('服务器被吃了( ╯□╰ )401');
      return Promise.reject(error);
    } else {
      if (error.response.message) {
        console.log('服务器被吃了( ╯□╰ )123');
      } else {
        console.log('服务器被吃了( ╯□╰ )123');
      }
    }
  }

);


export default instance;