import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 서버 주소로 변경
  headers: {
    'Content-Type': 'application/json'
  }
})

export default instance
