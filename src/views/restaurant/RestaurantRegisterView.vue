<template>
  <div class="store-wrapper">
    <div class="content-box">

      <!-- ================= 왼쪽: 사진 등록 ================= -->
      <div class="left-section">
        <Text tag="h3" class="title">사진 등록</Text>

        <div class="main-photo" @click="openFileSelect">
          <span v-if="!previewMain">대표 사진</span>
          <img v-else :src="previewMain" class="preview-img" />
        </div>

        <div class="sub-photos">
          <div class="photo-box" v-for="(img, i) in previewSubLimited" :key="i">
            <img :src="img" class="preview-sub-img" />
          </div>
          <div v-if="extraCount > 0" class="photo-box more-box">
            +{{ extraCount }}
          </div>
        </div>

        <input
            type="file"
            ref="fileInput"
            multiple
            accept="image/*"
            style="display:none"
            @change="handleFileChange"
        />

        <Button type="primary" plain @click="openFileSelect">
          사진 추가
        </Button>

        <p class="notice-text">※ 사진은 최대 10장까지 업로드할 수 있습니다.</p>

        <!-- 가게 정보 요약 -->
        <div class="info-summary">
          <h4 class="summary-title">가게 정보 요약</h4>
          <p><strong>이름:</strong> {{ form.restaurantName || "입력 전" }}</p>
          <p><strong>소개:</strong> {{ form.restaurantContents || "입력 전" }}</p>
          <p><strong>카테고리:</strong> {{ form.restaurantCategoryKor || "선택 전" }}</p>
          <p><strong>정원:</strong> {{ form.restaurantPeopleNumber || "입력 전" }}</p>
          <p><strong>평점:</strong> {{ form.restaurantScore || "입력 전" }}</p>
          <p><strong>주소:</strong> {{ form.restaurantLocation || "입력 전" }}</p>
          <p><strong>위도:</strong> {{ form.latitude || "없음" }}</p>
          <p><strong>경도:</strong> {{ form.longitude || "없음" }}</p>
        </div>
      </div>

      <!-- ================= 오른쪽: 입력 폼 ================= -->
      <div class="right-section">
        <div class="form-container">

          <div class="form-block">
            <label class="form-title">가게 이름</label>
            <Input v-model="form.restaurantName" placeholder="이름을 입력하세요" />
          </div>

          <div class="form-block">
            <label class="form-title">소개</label>
            <Input type="textarea" :rows="4" v-model="form.restaurantContents" placeholder="최대 500자 입력" />
          </div>

          <div class="form-block">
            <label class="form-title">음식 카테고리</label>
            <Dropdown
                v-model="form.restaurantCategoryKor"
                placeholder="카테고리 선택"
                :options="categoryOptions"
            />
          </div>

          <div class="form-block">
            <label class="form-title">정원</label>
            <Input type="number" v-model="form.restaurantPeopleNumber" />
          </div>

          <div class="form-block">
            <label class="form-title">평점 (초기값)</label>
            <Input type="number" v-model="form.restaurantScore" />
          </div>

          <!-- ================= 키워드 ================= -->
          <div class="form-block">
            <label class="form-title">키워드 카테고리</label>

            <Dropdown
                v-model="selectedKeywordCategory"
                placeholder="카테고리 선택"
                :options="keywordCategoryOptions"
            />
          </div>

          <div class="form-block">
            <label class="form-title">키워드</label>

            <Dropdown
                v-model="tempSelectKeyword"
                placeholder="키워드 선택"
                :options="filteredKeywords"
                :disabled="!selectedKeywordCategory"
            />

            <div class="keyword-selected-box">
              <div
                  v-for="(item, i) in selectedKeywordObjects"
                  :key="i"
                  class="keyword-tag"
              >
                {{ item.label }}
                <span class="delete-x" @click="removeKeyword(item.value)">×</span>
              </div>
            </div>

            <p class="keyword-limit" v-if="form.keywordIds.length >= 10">
              키워드는 최대 10개까지 선택할 수 있습니다.
            </p>
          </div>

          <!-- 주소 -->
          <div class="form-block">
            <label class="form-title">주소</label>
            <Input
                ref="addressInput"
                v-model="form.restaurantLocation"
                placeholder="주소 검색"
            />
            <p class="coord-result">
              위도: {{ form.latitude || "없음" }} / 경도: {{ form.longitude || "없음" }}
            </p>
          </div>

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
import { reactive, ref, onMounted, computed, watch } from "vue";
import axios from "axios";

import Button from "@/components/shared/basic/Button.vue";
import Text from "@/components/shared/basic/Text.vue";
import Input from "@/components/shared/basic/Input.vue";
import Dropdown from "@/components/shared/form/Dropdown.vue";

import "@/assets/restaurant/RestaurantRegisterView.css";

/* ================= 이미지 ================= */
const fileInput = ref(null);
const files = ref([]);
const previewMain = ref(null);
const previewSub = ref([]);

const MAX_TOTAL = 10;
const MAX_SUB_DISPLAY = 4;

/* ================= 음식 카테고리 ================= */
const categoryOptions = [
  { label: "한식", value: "한식" },
  { label: "중식", value: "중식" },
  { label: "일식", value: "일식" },
  { label: "양식", value: "양식" },
  { label: "기타", value: "기타" }
];

const categoryMap = {
  "한식": "KOREAN",
  "중식": "CHINESE",
  "일식": "JAPANESE",
  "양식": "WESTERN",
  "기타": "OTHER"
};

/* ================= 키워드 ENUM 입력용 ================= */
const keywordCategoryOptions = [
  { label: "맛", value: "TASTE" },
  { label: "분위기", value: "MOOD" },
  { label: "서비스", value: "SERVICE" },
  { label: "가격", value: "PRICE" },
  { label: "청결", value: "CLEANLINESS" },
  { label: "기타", value: "ETC" }
];

const keywordMap = ref({
  TASTE: [],
  MOOD: [],
  SERVICE: [],
  PRICE: [],
  CLEANLINESS: [],
  ETC: []
});

const selectedKeywordCategory = ref(null);
const tempSelectKeyword = ref(null);

/* ================= 키워드 로딩 ================= */
const loadKeywords = async () => {
  try {
    console.log("=== [LOAD] 키워드 API 호출 시작 ===");

    const res = await axios.get("http://localhost:8080/api/keywords");

    console.log("=== [LOAD] 백엔드 응답 ===");
    console.log(res.data);

    const keywords = res.data.data;
    console.log("=== [LOAD] keywords(flat) ===");
    console.table(keywords);

    const groups = {
      TASTE: [],
      MOOD: [],
      SERVICE: [],
      PRICE: [],
      CLEANLINESS: [],
      ETC: []
    };

    keywords.forEach(k => {
      console.log(
          `[GROUP] keyword=${k.keyword}, code=${k.keywordCode}, category=${k.keywordCategory}`
      );

      if (!groups[k.keywordCategory]) {
        console.warn(
            `[WARN] 알 수 없는 categoryEnum '${k.keywordCategory}' → 그룹핑 불가`
        );
        return;
      }

      groups[k.keywordCategory].push({
        label: k.keywordName,
        value: k.keywordCode
      });
    });

    console.log("=== [LOAD] 그룹핑 결과 ===");
    console.log(groups);

    keywordMap.value = groups;

  } catch (e) {
    console.error("키워드 로딩 실패:", e);
  }
};

/* ================= 필터된 키워드 ================= */
const filteredKeywords = computed(() => {
  console.log("=== [COMPUTED] filteredKeywords 계산 ===");
  console.log("selectedKeywordCategory =", selectedKeywordCategory.value);

  if (!selectedKeywordCategory.value) {
    console.log("→ category 선택 안됨, 빈 배열 반환");
    return [];
  }

  const list = keywordMap.value[selectedKeywordCategory.value] || [];
  console.log(
      `[COMPUTED] '${selectedKeywordCategory.value}' 카테고리 키워드 목록`,
      list
  );

  return list;
});

/* ================= form ================= */
const form = reactive({
  restaurantName: "",
  restaurantContents: "",
  restaurantCategoryKor: "",
  restaurantPeopleNumber: null,
  restaurantScore: 5,
  restaurantLocation: "",
  latitude: null,
  longitude: null,
  entrepreneurCode: 1,
  keywordIds: [],
});

/* ================= 키워드 선택 ================= */
watch(() => tempSelectKeyword.value, (val) => {
  console.log("=== [WATCH] 키워드 선택 값 변경 ===", val);

  if (!val) return;

  if (form.keywordIds.length >= 10) {
    alert("키워드는 최대 10개까지 가능합니다.");
    tempSelectKeyword.value = null;
    return;
  }

  if (!form.keywordIds.includes(val)) {
    console.log(`[ADD] keywordId 추가 → ${val}`);
    form.keywordIds.push(val);
  } else {
    console.log(`[SKIP] 이미 선택된 keywordId → ${val}`);
  }

  console.log("[현재 선택된 keywordIds]", form.keywordIds);

  tempSelectKeyword.value = null;
});

/* ================= 선택된 태그 ================= */
const selectedKeywordObjects = computed(() => {
  const all = Object.values(keywordMap.value).flat();
  return all.filter(k => form.keywordIds.includes(k.value));
});

const removeKeyword = (value) => {
  console.log(`[REMOVE] 키워드 제거 → ${value}`);
  form.keywordIds = form.keywordIds.filter(v => v !== value);
  console.log("[현재 선택된 keywordIds]", form.keywordIds);
};

/* ================= 이미지 처리 ================= */
const openFileSelect = () => fileInput.value.click();

const handleFileChange = (e) => {
  const selected = Array.from(e.target.files);

  if (files.value.length + selected.length > MAX_TOTAL) {
    alert("사진은 최대 10장까지 업로드 가능합니다.");
    return;
  }

  files.value.push(...selected);

  previewMain.value = URL.createObjectURL(files.value[0]);
  previewSub.value = files.value.slice(1).map(f => URL.createObjectURL(f));
};

const previewSubLimited = computed(() =>
    previewSub.value.slice(0, MAX_SUB_DISPLAY - 1)
);

const extraCount = computed(() => {
  const total = previewSub.value.length;
  return total >= MAX_SUB_DISPLAY ? total - (MAX_SUB_DISPLAY - 1) : 0;
});

/* ================= 주소 자동완성 ================= */
const addressInput = ref(null);

onMounted(() => {
  loadKeywords();

  if (window.google && window.google.maps && addressInput.value?.input) {
    const autocomplete = new window.google.maps.places.Autocomplete(
        addressInput.value.input,
        { types: ["establishment", "geocode"] }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        form.latitude = null;
        form.longitude = null;
        return;
      }

      form.restaurantLocation = addressInput.value.input.value;
      form.latitude = place.geometry.location.lat();
      form.longitude = place.geometry.location.lng();
    });
  }
});

/* ================= 제출 ================= */
const onSubmit = async () => {
  const dto = {
    restaurantName: form.restaurantName,
    restaurantContents: form.restaurantContents,
    restaurantCategory: categoryMap[form.restaurantCategoryKor],
    restaurantPeopleNumber: form.restaurantPeopleNumber,
    restaurantScore: form.restaurantScore,
    restaurantLocation: form.restaurantLocation,
    latitude: form.latitude,
    longitude: form.longitude,
    entrepreneurCode: form.entrepreneurCode,
    keywordIds: form.keywordIds,
  };

  const formData = new FormData();
  formData.append(
      "restaurant",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
  );

  files.value.forEach(f => formData.append("pictures", f));

  try {
    await axios.post("http://localhost:8080/api/restaurants", formData);
    alert("등록 완료!");
  } catch (e) {
    console.error(e);
    alert("등록 실패");
  }
};
</script>
