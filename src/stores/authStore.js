import { defineStore } from "pinia";
import { getAuthUser } from "@/utils/auth";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        userId: null,
        email: null,
        role: null,
        user: null,    // 서버에서 받은 전체 사용자 정보
    }),

    actions: {
        /* ================================
           JWT → userId, email, role 로드
        ================================= */
        loadFromToken() {
            console.log("🔍 loadFromToken() 실행됨");

            const decoded = getAuthUser();
            console.log("🟦 getAuthUser() 반환값:", decoded);

            if (!decoded) {
                console.warn("❌ JWT 없음");
                this.userId = null;
                this.role = null;
                this.email = null;
                return;
            }

            const parsedId = Number(String(decoded.sub).trim());
            if (isNaN(parsedId)) {
                console.error("❌ userId 숫자 변환 실패");
                this.userId = null;
            } else {
                this.userId = parsedId;
            }

            this.email = decoded.email || null;
            this.role = decoded.role || null;

            console.log("🔥 저장된 userId:", this.userId);
            console.log("🔥 저장된 role:", this.role);
        },

        /* ================================
           서버에서 실제 유저 정보 조회
        ================================= */
        async fetchUserFromServer() {
            if (!this.userId) {
                console.warn("⚠️ userId 없음 → 서버 조회 불가");
                this.user = null;
                return;
            }

            try {
                console.log("📡 GET /api/admin/users/me");

                const res = await axios.get(
                    "http://localhost:8080/api/admin/users/me",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );

                this.user = res.data.data;
                console.log("🟢 서버 사용자 정보:", this.user);

            } catch (err) {
                console.error("❌ 사용자 상세 조회 실패:", err);
                this.user = null;
            }
        }
    }
});
