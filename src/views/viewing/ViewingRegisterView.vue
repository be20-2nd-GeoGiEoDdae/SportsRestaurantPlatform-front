<template>
  <div class="store-wrapper">
    <div class="content-box">

      <!-- 왼쪽: 가게 사진 가져오기 -->
      <div class="left-section">
        <Text tag="h3" class="title">가게 사진</Text>

        <!-- 대표 사진 -->
        <div class="main-photo">
          <span v-if="!previewMain">가게 사진</span>
          <img v-else :src="previewMain" class="preview-img" />
        </div>

        <!-- 서브 사진 -->
        <div class="sub-photos">
          <div
              class="photo-box"
              v-for="(img, i) in previewSubLimited"
              :key="i"
          >
            <img :src="img" class="preview-sub-img" />
          </div>

          <!-- +N 표시 -->
          <div v-if="extraCount > 0" class="photo-box more-box">
            +{{ extraCount }}
          </div>
        </div>
      </div>

      <!-- 오른쪽: 관람 입력 폼 -->
      <div class="right-section">
        <div class="form-container">

          <!-- 관람 제목 -->
          <div class="form-block">
            <label class="form-title">관람 제목</label>
            <Input v-model="form.viewingTitle" placeholder="관람 제목을 입력하세요." />
          </div>

          <!-- 관람 소개 -->
          <div class="form-block">
            <label class="form-title">관람 소개</label>
            <Input
                type="textarea"
                :rows="4"
                v-model="form.viewingBody"
                placeholder="최대 500자 이내로 작성하세요."
            />
          </div>

          <!-- 스포츠 -->
          <div class="form-block">
            <label class="form-title">스포츠 선택</label>
            <Dropdown
                v-model="form.sportsId"
                :options="sports"
                placeholder="스포츠 선택"
            />
          </div>

          <!-- 국가 -->
          <div class="form-block">
            <label class="form-title">국가 선택</label>
            <Dropdown
                v-model="form.countryId"
                :options="countries"
                placeholder="국가 선택"
                :disabled="!form.sportsId"
            />
          </div>

          <!-- 리그 -->
          <div class="form-block">
            <label class="form-title">리그 선택</label>
            <Dropdown
                v-model="form.leagueId"
                :options="leagues"
                placeholder="리그 선택"
                :disabled="!form.countryId"
            />
          </div>

          <!-- 팀 -->
          <div class="form-block">
            <label class="form-title">팀 선택(1~2개)</label>
            <Dropdown
                v-model="form.teamId"
                :options="teams"
                placeholder="팀 선택"
                multiple
                :disabled="!form.leagueId"
            />
          </div>

          <!-- 날짜/시간 -->
          <div class="form-block">
            <label class="form-title">관람 시간</label>
            <Input type="datetime-local" v-model="form.viewingAt" />
          </div>

          <!-- 버튼 -->
          <div class="btn-wrapper">
            <Button type="primary" size="large" @click="onSubmit">
              등록
            </Button>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from "vue";
import axios from "axios";

import Text from "@/components/shared/basic/Text.vue";
import Input from "@/components/shared/basic/Input.vue";
import Dropdown from "@/components/shared/form/Dropdown.vue";
import Button from "@/components/shared/basic/Button.vue";
import "@/assets/viewing/ViewingRegisterView.css";

/* ===============================
    공통 이미지 URL 처리 (레스토랑과 동일)
================================ */
const getImageUrl = (path) => {
  return path ? `http://localhost:8080${path}` : "/images/default.jpg";
};

/* ------------------------------
   가게 사진 불러오기
------------------------------- */

const restaurantId = 73;

const previewMain = ref(null);
const previewSub = ref([]);
const MAX_SUB_DISPLAY = 4;

const loadRestaurantImages = async () => {
  try {
    const res = await axios.get(
        `http://localhost:8080/api/restaurants/${restaurantId}/images`
    );
    const images = res.data.data;

    previewMain.value = images[0] ? getImageUrl(images[0]) : null;
    previewSub.value = images.slice(1).map((img) => getImageUrl(img));
  } catch (err) {
    console.error("가게 사진 불러오기 실패", err);
  }
};

onMounted(() => {
  loadRestaurantImages();
});

const previewSubLimited = computed(() =>
    previewSub.value.slice(0, MAX_SUB_DISPLAY - 1)
);

const extraCount = computed(() => {
  const total = previewSub.value.length;
  return total >= MAX_SUB_DISPLAY ? total - (MAX_SUB_DISPLAY - 1) : 0;
});

/* ------------------------------
   카테고리 옵션
------------------------------- */
const sports = ref([]);
const countries = ref([]);
const leagues = ref([]);
const teams = ref([]);

const form = reactive({
  viewingTitle: "",
  viewingBody: "",
  viewingAt: "",
  sportsId: null,
  countryId: null,
  leagueId: null,
  teamId: [],
  restaurantId: restaurantId,
});

/* 스포츠 목록 */
const loadSports = async () => {
  const res = await axios.get("http://localhost:8080/api/sports");
  sports.value = res.data.data.map((s) => ({
    label: s.sportName,
    value: s.sportCode,
  }));
};

onMounted(loadSports);

/* 국가 조회 */
watch(
    () => form.sportsId,
    async (val) => {
      form.countryId = null;
      form.leagueId = null;
      form.teamId = [];
      if (!val) return;

      const res = await axios.get(
          `http://localhost:8080/api/sports/${val}/countries`
      );
      countries.value = res.data.data.map((c) => ({
        label: c.countryName,
        value: c.countryId,
      }));
    }
);

/* 리그 조회 */
watch(
    () => form.countryId,
    async (val) => {
      form.leagueId = null;
      form.teamId = [];
      if (!val || !form.sportsId) return;

      const res = await axios.get(
          `http://localhost:8080/api/sports/${form.sportsId}/countries/${val}/leagues`
      );

      leagues.value = res.data.data.map((l) => ({
        label: l.leagueName,
        value: l.leagueId,
      }));
    }
);

/* 팀 조회 */
watch(
    () => form.leagueId,
    async (val) => {
      form.teamId = [];
      if (!val) return;

      const res = await axios.get(
          `http://localhost:8080/api/leagues/${val}/teams`
      );

      teams.value = res.data.data.map((t) => ({
        label: t.teamName,
        value: t.teamId,
      }));
    }
);

/* ------------------------------
   등록 처리
------------------------------- */
const onSubmit = async () => {
  const dto = {
    viewingTitle: form.viewingTitle,
    viewingBody: form.viewingBody,
    viewingAt: form.viewingAt,
    sportsId: form.sportsId,
    teamId: form.teamId,
    restaurantId: form.restaurantId,
  };

  try {
    await axios.post("http://localhost:8080/api/viewings", dto);
    alert("관람 등록 완료!");
  } catch (err) {
    console.error(err);
    alert("등록 실패");
  }
};
</script>
