import { jwtDecode } from "jwt-decode";

export const getAuthUser = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
        return jwtDecode(token);
    } catch (e) {
        return null;
    }
};
