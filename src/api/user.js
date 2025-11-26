import axios from './axios'

// 관리자 요청 토큰
const getToken = () => sessionStorage.getItem('adminToken')

// 회원 목록 조회 (role이 있으면 role 전용 엔드포인트 사용)
export const fetchUsers = (page = 1, size = 10, userRole = null) => {
  const token = getToken()
  if (userRole) {
    return axios.get('/api/admin/users-view-by-role', {
      params: { page, size, userRole },
      headers: { Authorization: `Bearer ${token}` }
    })
  }
  return axios.get('/api/admin/users-view', {
    params: { page, size },
    headers: { Authorization: `Bearer ${token}` }
  })
}

// 회원 권한별 조회(선택적 wrapper)
export const fetchUsersByRole = (userRole, page = 1, size = 10) => {
  return fetchUsers(page, size, userRole)
}

// 회원 검색
export const searchUsers = (page, size, searchQuery) => {
    const token = getToken()
    return axios.get('/api/admin/users-search', {
        params: {
            page,
            size,
            userEmail: searchQuery.userEmail || null,
            userName: searchQuery.userName || null,
            userPhoneNumber: searchQuery.userPhoneNumber || null,
        },
        headers: {
            Authorization: `Bearer ${token}`    // Authorization 헤더에 토큰 추가
        }
    });
};

// 회원 상세 조회
export const fetchUserDetail = (userCode) => {
  const token = getToken()
  return axios.get(`/api/admin/users/${userCode}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

// 사업자 상세 조회
export const fetchEntrepreneurDetail = (userCode) => {
  const token = getToken()
  return axios.get(`/api/admin/users/entrepreneurs/${userCode}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}