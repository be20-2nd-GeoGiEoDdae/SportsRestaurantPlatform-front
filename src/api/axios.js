import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  withCredentials: false // 쿠키 X, Stateless REST API 호출 시 설정
});

api.interceptors.response.use(
    (response) => {
      const body = response.data;
      if(body && body.success === false) { // 성공이지만 success=false인 경우 에러 처리
        const error = new Error(body.message || '요청이 실패했습니다.');
        error.response = response;
        throw error;
      }
      return response;
    },
    (error) => {
      // HTTP 에러 처리
      return Promise.reject(error);
    }
);

export default api;