<!--
&lt;!&ndash; ReviewList.vue &ndash;&gt;
<script setup>
import {onMounted, ref} from "vue";
import SidebarUser from "@/components/shared/sidebar/user/SidebarUser.vue";

const reviews = ref([
  {
    id: 1,
    title: "삼성 롯데 경기 단체 관람",
    place: "모스키칸",
    rating: 4.0,
    watchedAt: "25-11-13 / 13 : 30",
    desc: "삼성팀이 나온 롯데와의 홈 경기, 응원도 열정적이었고 거기에 경기를 보며 먹는 음식까지 있어서 굉장히 알차게 보낸 경기 관람, 다음에도 또 관람하고 싶다.",
    image: "https://via.placeholder.com/120x90.png?text=이미지",
  },
  {
    id: 2,
    title: "삼성 롯데 경기 단체 관람",
    place: "모스키칸",
    rating: 4.5,
    watchedAt: "25-11-13 / 13 : 30",
    desc: "친구들이랑 단체로 가서 즐겁게 응원하고 왔습니다. 좌석도 좋았고, 현장 분위기가 정말 최고였습니다.",
    image: "https://via.placeholder.com/120x90.png?text=이미지",
  },
]);
const currentPage = ref(1);

// 로그인 유저 (나중에 store/useUser로 교체 가능)
const userId = 1;

// ===============================
// 이미지 URL 변환 (리뷰등록 페이지와 동일 로직)
// ===============================
const getImageUrl = (path) => {
  if (!path) return "/images/no-image.png";
  if (path.startsWith("http")) return path;
  return `http://localhost:8080${path}`;
};

const loading = ref(false);
const errorMessage = ref("");

// ===============================
// 리뷰 목록 API 호출
// ===============================
const loadReviews = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    // 🔹 실제 엔드포인트에 맞게 URL만 바꿔줘
    // 예시: GET /api/reviews/users/{userId}
    const res = await axios.get(
        `http://localhost:8080/api/reviews/users/${userId}`
    );

    // res.data 형식에 맞게 조정 필요
    const list = Array.isArray(res.data) ? res.data : res.data.data;

    reviews.value = list.map((r) => {
      // pictureUrls: " /img/a.jpg, /img/b.jpg " 이런 문자열이라고 가정
      let image = "/images/no-image.png";
      if (r.pictureUrls) {
        const first = r.pictureUrls.split(",")[0].trim();
        image = getImageUrl(first);
      }

      return {
        id: r.reviewCode || r.id,                // 백엔드 DTO에 맞게 필드명 조정
        title: r.reviewTitle,
        place: r.restaurantName,
        rating: r.reviewScore,
        watchedAt: r.viewingAt,                 // "25-11-13 / 13:30" 같은 포맷
        desc: r.reviewBody,
        image,
      };
    });
  } catch (e) {
    console.error("리뷰 목록 조회 실패", e);
    errorMessage.value = e.message || "리뷰 목록 조회 중 오류가 발생했습니다.";
  } finally {
    loading.value = false;
  }
};

const handleEdit = (row) => {
  console.log("리뷰 수정:", row);
  // TODO: 수정 페이지로 이동 or 다이얼로그 오픈
};

const handleDelete = (row) => {
  console.log("리뷰 삭제:", row);
  // TODO: 삭제 확인 후 삭제 API 호출
};

const handlePageChange = (page) => {
  currentPage.value = page;
  console.log("페이지 변경:", page);
  // TODO: 서버 페이징 연동 (page parameter 써서 loadReviews 호출)
};

// 컴포넌트 마운트 시 최초 1회 로딩
onMounted(() => {
  loadReviews();
});
</script>

<template>
  <div class="review-page">
    <div class="review-body">
      &lt;!&ndash; 왼쪽 사이드바 (사이드바 css 건드리지 않음) &ndash;&gt;
      <aside class="review-sidebar">
        <SidebarUser />
      </aside>

      &lt;!&ndash; 오른쪽 컨텐츠 &ndash;&gt;
      <main class="review-content">
        <h1 class="page-title">내 리뷰 목록</h1>

        &lt;!&ndash; 관리자 페이지의 table-section 느낌으로 감싸는 영역 &ndash;&gt;
        <section class="list-section">
          <div class="review-list">
            <article
                v-for="review in reviews"
                :key="review.id"
                class="review-card"
            >
              <div class="review-card-header">
                <h3 class="review-title">{{ review.title }}</h3>
                <p class="review-date">
                  관람일시 : {{ review.watchedAt }}
                </p>
              </div>

              <div class="review-card-body">
                <div class="review-image">
                  <img :src="review.image" alt="관람 이미지" />
                </div>

                <div class="review-content-inner">
                  <div class="review-info-top">
                    <span class="place">{{ review.place }}</span>
                    <span class="rating-pill">
                      {{ review.rating.toFixed(1) }}
                    </span>
                  </div>
                  <p class="review-desc">
                    {{ review.desc }}
                  </p>
                </div>

                <div class="review-actions">
                  <el-button
                      size="small"
                      class="btn-edit"
                      @click="handleEdit(review)"
                  >
                    리뷰 수정
                  </el-button>
                  <el-button
                      size="small"
                      class="btn-delete"
                      @click="handleDelete(review)"
                  >
                    리뷰 삭제
                  </el-button>
                </div>
              </div>
            </article>
          </div>

          &lt;!&ndash; 페이지네이션 &ndash;&gt;
          <div class="pagination-wrapper">
            <el-pagination
                :total="100"
                :page-size="10"
                :current-page="currentPage"
                layout="prev, pager, next"
                @current-change="handlePageChange"
            />
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/mypage/mypagereviewlog.css";
</style>
-->
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import SidebarUser from "@/components/shared/sidebar/user/SidebarUser.vue";

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