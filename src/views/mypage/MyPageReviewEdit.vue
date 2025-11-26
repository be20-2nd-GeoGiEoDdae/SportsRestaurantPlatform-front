<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import SidebarUser from "@/components/shared/sidebar/user/SidebarUser.vue";

const route = useRoute();
const router = useRouter();

// ===============================
// API 테스트용 값 (나중에 store/useUser로 변경 가능)
// ===============================
const userId = 1;          // 로그인 유저 ID
const restaurantId = 1;   // 이 Viewing이 속한 식당 ID
const viewingCode = 1;     // summary API용

// ===============================
// 상태값
// ===============================
const matchTitle = ref("");
const placeName = ref("");
const typeName = ref("");
const pictureUrls = ref([]);

const reviewTitle = ref("");
const reviewText = ref("");
const rating = ref(0);

const uploadedPhoto = ref(null);
const fileInput = ref(null);

// 성공 메시지
const successMessage = ref("");

// ===============================
// 이미지 URL 변환
// ===============================
const getImageUrl = (path) => {
  if (!path) return "/images/no-image.png";
  if (path.startsWith("http")) return path;
  return `http://localhost:8080${path}`;
};

// ===============================
// summary API 호출
// ===============================
const loadViewingSimple = async () => {
  try {
    const res = await axios.get(
        `http://localhost:8080/api/viewings/${viewingCode}/simple`
    );

    matchTitle.value = res.data.viewingTitle;
    placeName.value = res.data.restaurantName;
    typeName.value = `${res.data.sportName} / ${res.data.teamName}`;

    pictureUrls.value = res.data.pictureUrls
        ? res.data.pictureUrls.split(",").map((u) => getImageUrl(u.trim()))
        : [];
  } catch (err) {
    console.error("요약 정보 로드 실패", err);
  }
};

// ===============================
// 파일 업로드 (대표사진 미리보기)
// ===============================
const onFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  uploadedPhoto.value = URL.createObjectURL(file);
};

// ===============================
// 리뷰 저장 (DB 저장)
// ===============================
const handleSave = async () => {
  successMessage.value = "";

  const reviewDto = {
    reviewTitle: reviewTitle.value,
    reviewBody: reviewText.value,
    reviewScore: rating.value,
    restaurantCode: restaurantId,
    userCode: userId,
    pictureUrls: []
  };

  const fd = new FormData();

  // review JSON 추가
  fd.append(
      "review",
      new Blob([JSON.stringify(reviewDto)], {
        type: "application/json"
      })
  );

  // 사진 파일 추가
  if (fileInput.value?.files?.length) {
    Array.from(fileInput.value.files).forEach((file) => {
      fd.append("pictures", file);
    });
  }

  try {
    const res = await axios.post(
        `http://localhost:8080/api/reviews/${userId}/${restaurantId}`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
    );

    // 성공 메시지 표시
    successMessage.value = "등록 완료! 🎉";

  } catch (err) {
    console.error("리뷰 저장 실패", err);
    successMessage.value = "등록 실패! ❌";
  }
};

onMounted(() => {
  loadViewingSimple();
});
</script>

<template>
  <div class="review-page">
    <div class="review-body">
      <!-- 왼쪽 사이드바 -->
      <aside class="review-sidebar">
        <SidebarUser />
      </aside>

      <!-- 오른쪽 본문 -->
      <main class="review-content">
        <h1 class="page-title">리뷰 등록</h1>

        <section class="review-section">
          <!-- ===============================
               상단 요약 박스
          =============================== -->
          <section class="match-summary">
            <div class="thumb-box">
              <img
                  v-if="pictureUrls.length > 0"
                  :src="pictureUrls[0]"
                  class="thumb-img"
              />
              <span v-else>사진 없음</span>
            </div>

            <div class="match-right">
              <p class="match-title">{{ matchTitle }}</p>
              <p>장소 : {{ placeName }}</p>
              <p>종류 : {{ typeName }}</p>
            </div>
          </section>

          <!-- ===============================
               리뷰 작성 영역
          =============================== -->
          <section class="review-edit-area">
            <!-- 왼쪽 큰 이미지 -->
            <div class="left-photo">
              <div class="big-photo">
                <img
                    v-if="uploadedPhoto"
                    :src="uploadedPhoto"
                    class="big-photo-img"
                />
                <span v-else>대표 사진 없음</span>
              </div>

              <div class="photo-buttons">
                <el-button size="small" @click="fileInput.click()">
                  사진 추가
                </el-button>

                <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    style="display:none"
                    @change="onFileChange"
                />
              </div>
            </div>

            <!-- 오른쪽 입력 폼 -->
            <div class="right-form">
              <div class="rating-row">
                <span class="rating-label">평점을 선택해주세요</span>
                <el-rate v-model="rating" :max="5" />
              </div>

              <el-input
                  v-model="reviewTitle"
                  class="title-input"
                  placeholder="제목을 입력해주세요"
              />

              <el-input
                  v-model="reviewText"
                  type="textarea"
                  :rows="7"
                  maxlength="500"
                  show-word-limit
                  placeholder="내용을 입력해주세요. 최대 500자까지 작성 가능합니다."
              />
            </div>
          </section>

          <!-- ===============================
               등록 버튼
          =============================== -->
          <div class="submit-row">
            <el-button type="primary" class="btn-save" @click="handleSave">
              리뷰 등록
            </el-button>
          </div>

          <!-- ===============================
               등록 성공 메시지
          =============================== -->
          <p v-if="successMessage" class="success-text">
            {{ successMessage }}
          </p>

        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/mypage/mypagerevieweidt.css";

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.big-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

/* 성공 문구 스타일 */
.success-text {
  margin-top: 20px;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  color: #2ecc71;
}
</style>
