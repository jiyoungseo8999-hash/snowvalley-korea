# SNOW VALLEY KOREA

스노우밸리 코리아 브랜드 홈페이지. 빌드 도구나 설치할 패키지가 없는 HTML/CSS/JavaScript 정적 사이트입니다.

## 페이지
- `index.html`: 홈, 대표 제품 3개, 최신 이야기 3개
- `about.html`: 창업자의 이야기와 확인된 연혁
- `products.html`: 제품 목록
- `story/index.html`: 이야기 목록
- `story/post.html?id=why-snowvalley`: 이야기 상세
- `contact.html`: 이메일, SNS, 스토어
- `404.html`: 없는 페이지 안내

## 수정할 내용
1. `products.json`: 실제 제품명(`name`), 설명(`description`), 이미지(`image`), 가격(`price`), 구매 링크(`purchaseUrl`). 홈 노출은 `featured: true`, 준비 완료 후 `status: "published"`로 변경합니다. 사진은 `assets/products/`에 저장하고 `image`에 해당 경로를 입력하세요. 가격이 없으면 표시하지 않으며, 구매 링크가 없으면 구매 정보 준비 중으로 표시합니다. 정보가 없는 항목은 빈 값 또는 null을 유지합니다.
2. `story/posts.json`: 제목, 요약, 분류, 본문(`body`: 문단 문자열 배열), 날짜(`date`: YYYY-MM-DD), 상태. 실제 글은 `status: "published"`로 설정합니다. 최신 글은 날짜 내림차순으로 자동 표시됩니다. 샘플 글은 모두 준비 중이며 실제 발행일을 넣지 않았습니다.
3. `contact.json`: 이메일·SNS·스토어 주소를 `value`에 입력합니다. 이메일은 이메일 주소만, SNS/스토어는 https://로 시작하는 주소를 입력하세요. 빈 값일 때 가짜 버튼 대신 ‘준비 중’이 표시됩니다.
4. `about.html`: 인터뷰 기반 이야기와 연혁입니다. 대표 사진은 추후 제공할 사진으로 교체합니다.
5. `index.html`: 제공된 인트로.png를 웹용 assets/intro.webp로 적용했습니다. 홈 인트로 교체 시 해당 이미지 파일과 대체 텍스트를 수정하세요. `about.html`의 대표 이미지 자리는 추후 교체할 수 있습니다.
6. `assets/site.js`: 공통 텍스트 로고와 푸터. 자료 반영 완료 후 준비 중 안내도 업데이트하세요.

## 미리 보기
JSON 데이터를 불러오므로 파일을 더블클릭하는 대신 정적 HTTP 서버로 실행하세요.

```sh
python -m http.server 4173
```

브라우저에서 http://localhost:4173 을 엽니다.

## Vercel 배포
GitHub 저장소를 Import하고 Framework Preset은 Other, Root Directory는 저장소 루트로 설정하세요. 빌드 명령은 필요 없습니다. `vercel.json`에 정적 사이트 설정이 포함되어 있습니다.

## 디자인 및 데이터
화이트, 아이스 블루, 네이비. 모바일 메뉴, 키보드 포커스, 본문 바로가기, 작은 화면 레이아웃을 지원합니다. 공통 메뉴와 푸터는 site.js에서 관리합니다. 글 본문은 텍스트로 출력하여 HTML이 실행되지 않습니다. 실제 확인되지 않은 인증, 연혁, 판매 수치, 효능, 리뷰는 포함하지 않습니다.

Google Fonts의 Noto Sans KR을 사용하며, 연결되지 않으면 시스템 sans-serif 폰트로 표시됩니다. 홈 인트로는 사용자가 제공한 이미지를 사용합니다. 제품 14종과 제공된 제품 사진 13개가 반영되어 있습니다. 오로라 스트레이트컷 사진이 필요합니다. 6종은 쿠팡 구매 링크가 연결돼 있습니다. 블로그는 JSON 파일을 수정하여 발행하는 방식이며 관리자 화면이나 자동 발행 서비스는 포함하지 않습니다.

블로그 관리: story/admin.html (키트 원본). 저장소 jiyoungseo8999-hash/snowvalley-korea, 브랜치 main, 경로 story/posts.json. 샘플 글 2개는 원본 그대로이며 화면에 샘플 안내를 표시합니다.
