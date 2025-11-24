# 한화시스템 Beyond SW 20기 백엔드 프로젝트 — 거기어때?

<img width="1124" height="581" alt="Image" src="https://github.com/user-attachments/assets/f7965036-ef64-4dbb-9ddc-198d322ed567" />

> 스포츠단체관람을 위해 음식점을 통대관할수 있게 도와주는 서비스

---

## 👥 팀 구성

| 이름 | 역할 | 주요 기술 |
|---|---:|---|
| 박규진 | 관람, 식당 백엔드 및 총괄 | Java, Spring Boot, JPA, Mybatis | 
| 박인수 | 결제, 알림 백엔드 | Java, Spring Boot, JPA, Mybatis | 
| 김성현 | 인증/인가 백엔드 | Java, Spring Boot, JPA, Mybatis | 
| 성현제 | 공지사항, 신고 백엔드 | Java, Spring Boot, JPA, Mybatis |

---

## 🛠️ 기술스택택

### 백엔드
<a href="https://spring.io/" target="_blank"><img src="https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white" alt="Spring"></a>
<a href="https://spring.io/projects/spring-boot" target="_blank"><img src="https://img.shields.io/badge/springboot-%236DB33F.svg?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot"></a>
<a href="https://spring.io/projects/spring-security" target="_blank"><img src="https://img.shields.io/badge/springsecurity-%236DB33F.svg?style=for-the-badge&logo=springsecurity&logoColor=white" alt="Spring Security"></a>
<a href="https://www.java.com/ko/" target="_blank"><img src="https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java"></a>
<a href="https://hibernate.org/" target="_blank"><img src="https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=Hibernate&logoColor=white" alt="Hibernate(Spring Data JPA)"></a>
<a href="https://mariadb.org/" target="_blank"><img src="https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white" alt="MariaDB"></a>
<a href="https://www.jwt.io/" target="_blank"><img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" alt="JWT"></a>

---
## ✏️ 프로젝트 개요
<p>요즘 스포츠 팬들은 단순한 경기 시청보다 같은 팀을 응원하며 함께 즐기는 경험을 원합니다.하지만 일반 음식점에서는 원하는 경기를 틀어주지 않거나, 단체로 응원하기 어려운 환경이 많습니다. 
따라서, 저희 플랫폼인 ‘거기어때?’는 사용자가 원하는 경기, 시간, 인원수, 음식점 분위기등을 선택하면 원하는 시간에 해당 경기를 틀어주는 음식점을 찾아 예약 및 결제까지 한 번에 해결할 수 있는 스포츠 관람 예약 플랫폼입니다.</p>

---
## 📄 프로젝트 배경
<details>
   <summary><strong> 기존시장의 문제점 </strong></summary>
<img width="1040" height="1087" alt="Image" src="https://github.com/user-attachments/assets/5416f8ee-d2c6-40db-9f4d-f66efe8aace9" />

<p>[첨부1,2 각각 구글, 당근중고 거래사이트  -   ‘스포츠 틀어주는 가게’ 연관 검색 결과 (검색 일시 2025.11.06  ) ]</p> 

<p>오늘날 스포츠 팬들에게 경기는 단순한 시청을 넘어 함께 어울려 응원하는 사회적 경험이 되고 있습니다.  혼자 집에서 보는 것보다 여러 사람이 한데 모여 같은 팀을 응원할 때 경기의 즐거움과 몰입감이 훨씬 커지기 때문입니다.  실제 설문에서도 팬들의 89%가 가족이나 친구와 함께 경기를 보는 것이 스포츠를 즐기는 데 중요하다고 답했고, 거의 절반은 이를 가장 중요한 요소로 꼽았습니다. 미국의 조사이긴 하지만, 2024년 기준 60% 이상의 팬들이 주로 다른 사람들과 함께 스포츠를 시청하고, 약 40%는 미리 일정을 맞춰 함께 볼 정도로 스포츠 경기를 계획된 사회활동으로 여기고 있었습니다. 이처럼 스포츠 경기 관람은 마지막 남은 실시간 공동체적 여가라는 말이 나올 정도로, 팬들은 함께 모여 응원하는 경험을 갈망합니다. </p>

<p>그러나 현실에서는 원하는 경기를 틀어주는 장소를 찾기가 쉽지 않은 문제가 있습니다. 일반 식당이나 술집에 가면 내가 보고 싶은 경기를 요청하기 어렵거나, 가게마다 TV 채널 사정이 달라 원하는 중계를 못 보는 경우가 많습니다. 특별한 스포츠펍들이 존재하지만, 어떤 펍이 어느 경기를 상영해주는지 정보를 얻기가 어렵고 보통 입소문이나 개별 SNS 공지에 의존해야 합니다. 실제로 유명 스포츠펍들은 중요한 경기 날이면 공식 인스타그램을 통해 예약 방법을 안내하는 식으로 개별 대응을 하고 있습니다. 인기 스포츠 경기의 경우 자리 확보도 큰 문제입니다. 예를 들어 한 야구 테마 포차는 야구 시즌 경기 당일에는 예약 없이는 앉을 자리가 없을 정도로 만석이 되며, 서울의 유명 축구 펍 역시 중요 경기가 있는 날엔 예약하지 않으면 자리가 없을 정도로 인기가 많다고 알려져 있습니다. 이러한 불편함 때문에 팬들은 직접 여러 장소에 전화를 걸어 중계 여부를 묻거나, 인터넷 블로그・카페 글을 찾아 헤매야 하는 실정입니다.</p>
</details>


## 📌타 서비스와의 차별점 
<details>
   <summary><strong> 차별점 </strong></summary>
<p>현재 국내에는 스포츠 경기 관람에 특화된 예약 플랫폼이 전무한 상황입니다. 일반적인 맛집 앱이나 포털 예약 서비스는 식당의 분위기나 메뉴는 안내하지만, 어떤 경기를 중계하는지 정보 제공이 없고 사용자도 그런 조건으로 검색할 수 없습니다. 스포츠 팬들은 주로 지인들에게 물어보거나, 앞서 언급한 대로 여기저기 SNS와 커뮤니티를 뒤져가며 장소를 찾아야 합니다. </p>

<p>일부 해외에서는 DIRECTV의 스포츠 바 찾기나 FANZO와 같이 경기 중계 펍을 찾는 전문 앱이 존재하여 편의를 높이고 있습니다. 예를 들어 영국의 FANZO 앱은 “어디서 어떤 경기를 틀어줄까?” 하는 고민을 덜어주며, 보고 싶은 경기와 가까운 펍을 찾아주고 몇 초 만에 테이블 예약까지 가능하게 합니다. 이를 통해 이용자는 펍에 일일이 전화하지 않아도 되고, 어느 곳에서 원하는 경기를 확실히 틀어주는지 미리 알 수 있습니다. 결국 FANZO는“라이브 스포츠는 여럿이 함께할 때 더 즐겁다”는 모토 아래 전 세계 250만 명 이상의 팬들이 이용하는 대표 플랫폼으로 성장했습니다. “거기어때?”는 이처럼 스포츠 관람에 특화된 원스톱 예약 서비스라는 점에서 기존 국내 서비스들과 명확히 구별됩니다.</p>

<p>또한 경기별로 최적화된 검색과 필터 기능을 제공합니다. 사용자는 종목이나 리그뿐 아니라 특정 경기/팀 단위로 검색해 그 경기를 보여주는 장소만 추려볼 수 있습니다. 원하는 경우 응원 분위기, 좌석 형태, 주류 판매 여부 등 세부 조건으로 필터링하여 선호에 맞는 장소를 찾을 수 있습니다.  이런 세분화된 검색은 일반 예약 앱에서는 불가능한, 스포츠 플랫폼만의 강점입니다.  

마지막으로 앱 내 예약 및 결제 연동을 통해 편의성을 극대화했습니다. 전화 예약이나 현장 대기가 아닌 온라인 사전예약이므로 경기 시작에 맞춰 편하게 착석할 수 있고, 선결제 시스템으로 노쇼(no-show) 방지와 원활한 정산도 가능합니다. 이처럼 ”거기어때?”는 스포츠 팬들의 요구에 특화된 기능과 사용자 경험으로 타 서비스와 차별화를 이루고 있습니다.</p>
</details>


## 📌서비스 대상 
| 고객군 | 핵심 니즈 | 이용 시나리오 |
|---|---|---|
| 프로스포츠 팬층 (남녀노소) | 큰 화면·응원 분위기, 케이블/대형TV가 없는 대체 공간 | 가족·개인 단위 경기일 방문, 생중계 응원 |
| 직장 동료·단체 관람 수요 | 단체 좌석·간편 예약·좌석 확보 보장 | 부서 회식·동호회·대학 동아리 단체 예약 |
| 특정 팀/종목 팬클럽 | 팀 맞춤 좌석·응원 도구·시간대 맞춤 서비스 | 해외 새벽 경기 등 팬클럽 오프라인 응원전 |
| 스포츠 관심 일반 고객층 | 이벤트성 분위기·색다른 데이트/모임 코스 | 월드컵·올림픽 시즌, 데이트·소규모 모임 |



## 📌기대효과
<details>
  <summary>첫번째</summary>
- 스포츠 팬들의 만족도 증대: 가장 직접적인 효과는 팬들이 응원 파트너를 쉽게 찾고 함께 즐길 기회가 늘어난다는 점입니다. 이제까지는 혼자 TV로 보거나 장소 수소문하는데 어려움을 겪었다면, 저희 플랫폼으로 간편히 모임을 갖고 열띤 응원 분위기를 즐길 수 있습니다. 이는 팬 경험의 질을 높여 더욱 충성도 높은 팬으로 발전시키는 선순환을 낳습니다. 실제로 여럿이 함께 시청하는 팬들은 경기에 몰입하고 오래 시청하는 경향이 높아, 스포츠 소비 자체가 증진되는 효과도 기대됩니다. 특히 미리 약속을 잡고 모이는 ‘계획된 관람’의 경우 경기 시청을 위한 음식과 음료 소비도 증진시켜준 것으로 조사되었습니다. 이는 팬들에게는 즐거운 소비 경험이 되고, 스포츠 산업 전체로도 긍정적인 영향을 줍니다.
  </details>
  <details>
    <summary>두번째</summary>
- 음식점/펍 매출 및 홍보 효과: 플랫폼에 참여하는 업주들에게는 매출 증대와 신규 고객 유입 효과가 있습니다. 평소 스포츠 중계를 제공하던 매장은 저희 플랫폼을 통해 팬층을 직접 타겟팅하여 빈자리 없이 손님을 채울 수 있습니다. 특히 인기 경기 일정에 맞춘 예약 선점으로 노쇼 감소와 안정적인 운영이 가능해집니다. 또한 잘 알려지지 않은 장소도 앱에서 스포츠 중계 장소로 노출되면서 새로운 고객층을 확보할 수 있습니다. 플랫폼 사용자들이 후기와 평점을 남기면 입소문 이상의 홍보 효과를 기대할 수도 있습니다. 결국 플랫폼이 성장하면 참여 매장들은 단골 커뮤니티 확보와 비수기 타개 등의 부가 이익도 얻을 것입니다.
    </details>
    <details>
      <summary>세번째</summary>
- 플랫폼 수익 모델 및 성장성: “거기어때?”는 수익 측면에서도 여러 경로의 비즈니스 모델을 갖추고 있습니다. 우선 예약 중개 수수료를 통해 기본적인 수익을 올릴 수 있습니다 (예: 예약 좌석당 일정 금액 혹은 결제액의 일정 비율). 또한 인기 시즌 광고 수익이 기대되는데, 중요한 경기나 대회 시즌에 맞춰 관련 음식점들의 배너 광고나 프로모션 노출 서비스를 유료화할 수 있습니다. 이 밖에도 스포츠 관련 업계와의 제휴를 통한 부가 수익을 모색합니다. 주요 주류 브랜드와 협업하여 앱 이용자 대상 할인 쿠폰을 발행하거나, 굿즈/응원용품 판매를 연계함으로써 수익을 다각화할 수 있습니다. 이러한 다양한 수익 채널은 플랫폼의 안정적 운영과 향후 투자 유치에도 긍정적으로 작용할 것입니다.
      </details>
      <details>
        <summary>네번째</summary>
- 스포츠 문화 및 산업에의 기여: 궁극적으로 “거기어때?” 의 활성화는 국내 스포츠 문화의 저변 확대로 이어질 수 있습니다. 팬들이 쉽게 모여 응원함으로써 종목을 불문하고 직관 못지않은 응원 문화가 형성되고, 이는 프로구단이나 리그의 인기도를 높여줄 가능성이 있습니다. 경기 관람을 하나의 사회적 이벤트로 자리매김시킴으로써 스포츠가 가지는 커뮤니티적 가치를 부각하고, 더 많은 잠재 팬층을 끌어들이는 효과도 기대됩니다. 나아가 이런 팬 활동 증가와 데이터 축적은 스포츠 마케팅이나 스폰서십 기회의 증대로도 연결될 수 있어, 스포츠 산업 전반에 활력을 불어넣는 역할을 할 것입니다.
</details>


## 주요 기능
| 구분   | 기능명                 | 설명                                               |
|--------|------------------------|----------------------------------------------------|
| 사용자 | 경기 검색              | 날짜, 종목, 팀 별로 보고 싶은 경기 선택            |
| 사용자 | 🍽️ 음식점 예약         | 경기 상영 가능한 음식점 목록 확인 및 인원, 메뉴, 시간 예약 |
| 사용자 | ⭐ 리뷰                 | 음식, 응원 분위기, 관람 환경 평가                 |
| 점주   | 📺 경기 등록            | 상영 가능한 경기 관람 등록                         |
| 점주   | 📊 예약 관리           | 예약 내역, 메뉴 준비 관리                         |
| 결제   | 💳 카드/계좌 결제      | 예약금 환불 제도, 점주 구독 결제     
---



## 📄 요구사항명세서·WBS (Google Sheets)

<details>
  <summary>요구사항명세서</summary>
    https://docs.google.com/spreadsheets/d/1fdSv-AS8EdeEeRGrgxjWvRoyUO11oDH1wEkOj6HnHXg/edit?gid=1436566125#gid=1436566125
<img width="1623" height="1025" alt="Image" src="https://github.com/user-attachments/assets/3625dc9a-fdb3-4daf-8bea-8ef111ca2c6c" />
<img width="1624" height="887" alt="Image" src="https://github.com/user-attachments/assets/99049308-92f7-4af3-a1e2-475bac665c40" />
<img width="1623" height="1057" alt="Image" src="https://github.com/user-attachments/assets/df012088-0d65-4465-9057-b291770bb277" />
</details>

## 📄 DDD (miro)

<details>
   <summary>DDD</summary>
     https://miro.com/app/board/uXjVJ5lwdoc=/
<img width="1730" height="1083" alt="Image" src="https://github.com/user-attachments/assets/f6311ce3-3f07-4175-898f-e4c5e25978f9" />
</details>


## 📄 ERD (ERDCloud)

<details>
   <summary>ERD</summary>
     [https://www.erdcloud.com/d/BheLqjBhttiyWkdZj](https://www.erdcloud.com/d/A9A6aT89xQCdqGfiH)
   
  <img width="1516" height="795" alt="Image" src="https://github.com/user-attachments/assets/10ae4370-2ba3-4a85-b5fa-124cf6313740" />
</details>

  
 ## 📄POST MAN
 
 <details>
    <summary>POST MAN</summary>
https://www.postman.com/tjdguswp333-9617076/be20-geogieodae/collection/imgd5tf/geogieoddae?action=share&creator=49562230
</details>

 ## 📄Swagger

 <details>
    <summary>swagger</summary>
 [Geogieoddae REST API 명세서 (PDF)](https://drive.google.com/file/d/1B4QOAC8QPX8boM1XvGrU_wPsrS5z-yL5/view?usp=sharing))
</details>


 ## 📄**테스트 케이스 상세**



## 팀원 회고
<details>
 <summary> 박인수 </summary>


 </details>
<details>
 <summary> 박규진  </summary>

 </details>
<details>
 <summary> 김성현 </summary>



 </details>
<details>
 <summary> 성현제 </summary>



 </details>

