import { defineStore } from "pinia";
import { getAuthUser } from "@/utils/auth";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        userId: null,
        email: null,
        role: null
    }),

    actions: {
        loadFromToken() {
            console.log("🔍 loadFromToken() 실행됨");

            const decoded = getAuthUser();

            console.log("🟦 getAuthUser() 반환값:", decoded);

            if (!decoded) {
                console.warn("❌ 토큰 없음 → userId 초기화");
                this.userId = null;
                return;
            }

            console.log("🟩 JWT sub:", decoded.sub);

            this.userId = Number(decoded.sub);
            this.email = decoded.email;
            this.role = decoded.role;

            console.log("🔥 저장된 userId:", this.userId);
        }
    }
});
