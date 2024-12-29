# 폴더구조 concept

```
  components/          # 재사용 가능한 공통 컴포넌트
    Button/
      Button.jsx
      Button.css
    Pagination/
      Pagination.jsx
      Pagination.css
  features/            # 기능별 컴포넌트 (Feature-based 구조)
    Blog/
      pages/
        Blog.jsx       # Blog 페이지 컴포넌트
      components/
        PostList.jsx   # 게시물 리스트
        Pagination.jsx # 페이지네이션 컴포넌트
      Blog.css         # Blog 관련 스타일
    About/
      About.jsx
    Skills/
      Skills.jsx
  layouts/             # 페이지 레이아웃 컴포넌트
    MainLayout.jsx
  App.jsx              # 메인 App 컴포넌트
  index.js             # 프로젝트 진입점
```
