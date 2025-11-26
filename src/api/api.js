import api from './axios.js';

export async function viewingPayList(userCode,{page,size}) {
  return await api.get(`/api/viewingPay/search/member/${userCode}`, {
    params: {page, size}   // Spring Pageable 파라미터
  });
}
export async function viewingLogList(userCode,{
  page,size
}) {
  return await api.get(`/api/viewings/user/${userCode}`,{params:{page,size}});
}

export async function subscribeCancel(entrepreneurCode) {
  const res=await api.delete(`/api/subscribe/charge/${entrepreneurCode}`);
  return res.data.data;
}

export const getSubscribeBillingInfo = async (customerKey) => {
  const res = await api.get(`/api/subscribe/index/${customerKey}`);
  return res.data;
};
export const subscribeLogList = async (userCode,{page,size}) => {
  return await api.get(`/api/subscribe/search/${userCode}`, {
    params: { page, size },   // Spring Pageable 파라미터
  });
};
export const cancelViewing = async (viewingCode,userCode) => {
  const res = await api.delete(`/api/viewingPay/cancel/${viewingCode}/${userCode}`);
  return res.data.data;
};
export const updateUserInfo= async ()=>{
  const res= await api.put('/api/user/update')//토큰 받아서 넘겨야 함
  return res.data.data;
}
export const entrepreneurRegister= async (dto)=>{
  const res=await api.post('/api/auth/entrepreneur/register',dto);
  return res.data;
}
export const createReport= async (userCode,reportDto)=>{
  const res=await api.post(`/api/reports/${userCode}`,reportDto);
  return res.data.data;
}
export const userViewingReservation= async (viewingDto)=>{
  const res=await api.post(`/api/viewingPay/info`,viewingDto);
  return res.data;
}
// api.js
export const entrepreneurChangeUserRole = async (userId, newRole) => {
  const res = await api.patch(
      `/api/admin/users/${userId}/role`,  // ✅ 여기서는 /api 붙이지 않음
      null,                           // ✅ body 없음
      {
        params: {                     // ✅ @RequestParam 으로 넘어감
          newRole,
        },
      }
  );

  return res.data;                  // 토큰 필요하면 반환
};

