<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import SidebarAdmin from "@/components/shared/sidebar/admin/SidebarAdmin.vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

/* ===========================================
 * 상태값
 * =========================================== */

// 조회 목록
const sports = ref([]);
const countriesForCountry = ref([]);
const countriesForLeague = ref([]);
const leagues = ref([]);
const teams = ref([]);

// 입력값
const newSport = ref("");
const newCountry = ref("");
const newLeague = ref("");
const newTeam = ref("");

// 선택값 — 초기값 null
const selectedSportCountry = ref(null);
const selectedSportLeague = ref(null);
const selectedCountryForLeague = ref(null);
const selectedLeague = ref(null);

const router = useRouter();
const authStore = useAuthStore();

/* ===========================================
 * 조회 API (DTO: *QueryDto)
 * =========================================== */

const loadSports = async () => {
  console.log("[DEBUG] loadSports 실행됨");
  const res = await axios.get("/api/sports");
  sports.value = res.data.data;
  console.log("[DEBUG] sports 목록:", sports.value);
};

// 국가 목록 (국가 등록 화면용)
const loadCountriesForCountry = async () => {
  if (!selectedSportCountry.value) return;
  const res = await axios.get(`/api/sports/${selectedSportCountry.value}/countries`);
  countriesForCountry.value = res.data.data;
  // DTO: CountryQueryDto (countryId, countryName)
};

// 국가 목록 (리그 등록 화면용)
const loadCountriesForLeague = async () => {
  if (!selectedSportLeague.value) return;
  const res = await axios.get(`/api/sports/${selectedSportLeague.value}/countries`);
  countriesForLeague.value = res.data.data;
  // DTO: CountryQueryDto (countryId, countryName)
};

// 리그 목록
const loadLeagues = async () => {
  if (!selectedSportLeague.value || !selectedCountryForLeague.value) return;
  const res = await axios.get(
      `/api/sports/${selectedSportLeague.value}/countries/${selectedCountryForLeague.value}/leagues`
  );
  leagues.value = res.data.data;
  // DTO: LeagueQueryDto (leagueId, leagueName)
};

// 팀 목록
const loadTeams = async () => {
  if (!selectedLeague.value) return;
  const res = await axios.get(`/api/leagues/${selectedLeague.value}/teams`);
  teams.value = res.data.data;
  // DTO: TeamQueryDto (teamId, teamName)
};

/* ===========================================
 * 등록 API (DTO: *Request / *CreateRequest)
 * =========================================== */

// 스포츠 등록
const createSport = async () => {
  if (!newSport.value.trim()) {
    ElMessage.warning("스포츠 이름을 입력하세요.");
    return;
  }
  try {
    await axios.post("/api/admin/sports", { sportName: newSport.value });
    ElMessage.success("스포츠가 등록되었습니다!");
    newSport.value = "";
    await loadSports();
  } catch (e) {
    console.error(e);
    ElMessage.error("스포츠 등록 실패");
  }
};

// 국가 등록
const createCountry = async () => {
  if (!newCountry.value.trim()) {
    ElMessage.warning("국가 이름을 입력하세요.");
    return;
  }
  if (selectedSportCountry.value === null) {
    ElMessage.warning("스포츠를 선택하세요.");
    return;
  }

  // DTO: CountryCreateRequest (sportCode, name)
  const payload = {
    name: newCountry.value,
    sportCode: Number(selectedSportCountry.value)
  };

  try {
    await axios.post("/api/admin/sports/countries", payload);
    ElMessage.success("국가가 등록되었습니다!");
    newCountry.value = "";
    await loadCountriesForCountry();
  } catch (error) {
    console.error(error);
    ElMessage.error("국가 등록 실패");
  }
};

// 리그 등록
const createLeague = async () => {
  if (!newLeague.value.trim()) {
    ElMessage.warning("리그 이름을 입력하세요.");
    return;
  }
  if (selectedSportLeague.value === null || selectedCountryForLeague.value === null) {
    ElMessage.warning("스포츠와 국가를 선택하세요.");
    return;
  }

  // DTO: LeagueCreateRequest (sportId, countryId, name)
  try {
    await axios.post("/api/admin/sports/leagues", {
      name: newLeague.value,
      sportId: Number(selectedSportLeague.value),
      countryId: Number(selectedCountryForLeague.value)
    });
    ElMessage.success("리그가 등록되었습니다!");
    newLeague.value = "";
    await loadLeagues();
  } catch (e) {
    console.error(e);
    ElMessage.error("리그 등록 실패");
  }
};

// 팀 등록
const createTeam = async () => {
  if (!newTeam.value.trim() || selectedLeague.value === null) {
    ElMessage.warning("리그를 선택하고 팀 이름을 입력하세요.");
    return;
  }

  // DTO: TeamRequestDto (leagueId, name)
  // [주의] DTO 변수명이 teamName이 아니라 name 입니다.
  try {
    await axios.post("/api/admin/sports/teams", {
      name: newTeam.value,
      leagueId: Number(selectedLeague.value)
    });
    ElMessage.success("팀이 등록되었습니다!");
    newTeam.value = "";
    await loadTeams();
  } catch (e) {
    console.error(e);
    ElMessage.error("팀 등록 실패");
  }
};

onMounted(async () => {
  await authStore.loadFromToken();
  console.log("🔐 현재 사용자 role =", authStore.role);

  if (authStore.role !== "ROLE_ADMIN") {
    alert("관리자만 접근할 수 있습니다.");
    router.push("/");
    return;
  }
  loadSports();
});
</script>

<template>
  <div class="admin-page">
    <div class="admin-body">

      <aside class="admin-sidebar">
        <SidebarAdmin />
      </aside>

      <main class="admin-content">
        <h1 class="page-title">스포츠 관리</h1>

        <section class="box">
          <h2 class="section-title">스포츠 등록</h2>
          <div class="row">
            <input v-model="newSport" type="text" class="input" placeholder="스포츠 이름 입력" />
            <button class="btn btn-primary" @click="createSport">등록</button>
          </div>
          <div class="list">
            <div v-for="s in sports" :key="s.sportCode" class="item">
              {{ s.sportName }}
            </div>
          </div>
        </section>

        <section class="box">
          <h2 class="section-title">국가 등록</h2>

          <select v-model="selectedSportCountry" class="input" @change="loadCountriesForCountry">
            <option :value="null">스포츠 선택</option>
            <option v-for="s in sports" :key="s.sportCode" :value="s.sportCode">
              {{ s.sportName }}
            </option>
          </select>

          <div class="row">
            <input v-model="newCountry" type="text" class="input" placeholder="국가 이름 입력" />
            <button class="btn btn-primary" @click="createCountry">등록</button>
          </div>

          <div class="list">
            <div v-for="c in countriesForCountry" :key="c.countryId" class="item">
              {{ c.countryName }}
            </div>
          </div>
        </section>

        <section class="box">
          <h2 class="section-title">리그 등록</h2>
          <div class="row">
            <select
                v-model="selectedSportLeague"
                class="input"
                @change="() => { loadCountriesForLeague(); leagues = [] }"
            >
              <option :value="null">스포츠 선택</option>
              <option v-for="s in sports" :key="s.sportCode" :value="s.sportCode">
                {{ s.sportName }}
              </option>
            </select>

            <select v-model="selectedCountryForLeague" class="input" @change="loadLeagues">
              <option :value="null">국가 선택</option>
              <option v-for="c in countriesForLeague" :key="c.countryId" :value="c.countryId">
                {{ c.countryName }}
              </option>
            </select>
          </div>

          <div class="row">
            <input v-model="newLeague" type="text" class="input" placeholder="리그 이름 입력" />
            <button class="btn btn-primary" @click="createLeague">등록</button>
          </div>
          <div class="list">
            <div v-for="l in leagues" :key="l.leagueId" class="item">
              {{ l.leagueName }}
            </div>
          </div>
        </section>

        <section class="box">
          <h2 class="section-title">팀 등록</h2>
          <select v-model="selectedLeague" class="input" @change="loadTeams">
            <option :value="null">리그 선택</option>
            <option v-for="l in leagues" :key="l.leagueId" :value="l.leagueId">
              {{ l.leagueName }}
            </option>
          </select>

          <div class="row">
            <input v-model="newTeam" type="text" class="input" placeholder="팀 이름 입력" />
            <button class="btn btn-primary" @click="createTeam">등록</button>
          </div>
          <div class="list">
            <div v-for="t in teams" :key="t.teamId" class="item">
              {{ t.teamName }}
            </div>
          </div>
        </section>

      </main>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/shared/basic/buttons.css";

.admin-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.admin-body {
  display: flex;
}

.admin-sidebar {
  width: 200px;
  background: #fff;
  border-right: 1px solid #e9ecef;
}

.admin-content {
  flex: 1;
  padding: 30px 40px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
}

.box {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #dee2e6;
  padding: 20px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.input {
  flex: 1;
  height: 42px;
  padding: 0 12px;
  border-radius: 6px;
  border: 1px solid #ced4da;
  background: #f8f9fa;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item {
  padding: 8px 12px;
  background: #e9f3ff;
  border-radius: 6px;
}
</style>