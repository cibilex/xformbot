import axios from "axios"

const myAxios=axios.create({
    // baseURL:"http://localhost:8000"
})

  myAxios.interceptors.response.use(function (response) {
    return response.data;
  }, function (error) {
      let err;
    if (error.response) {//server tarafında hata olduysa
        err=error.response.data.message
      } else if (error.request) {  //istek yapıldı ancak res gelmedi.fcon
        err=error.request
      } else { //bişeyler oldu
        err=error.message || "something went wrong"
      }
    return Promise.reject(err);
  });
export default myAxios