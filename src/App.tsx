import { motion } from "framer-motion";
import { Routes, Route, useNavigate } from "react-router-dom";
import Blog from "./features/Blog/pages/Blog";

const sections = [
  {
    id: 1,
    title: "About me",
    content: `안녕하세요, 저는 강재연이라고 합니다. 프론트엔드 개발자로서 사용자 중심의 웹 애플리케이션 개발에 관심이 많습니다. 
이 프로젝트는 제 포트폴리오를 위한 작업으로 현재 Blog 기능을 먼저 구현 중입니다. 
앞으로 이 포트폴리오를 정리해 이력서와 함께 활용할 예정입니다. Blog 페이지를 눌러 내용을 확인해주세요.`,
  },
  {
    id: 2,
    title: "Skills",
    content:
      "React, JavaScript, CSS, HTML, 그리고 다양한 프론트엔드 도구를 활용하여 개발합니다.",
  },
  {
    id: 3,
    title: "Blog",
    content: "프론트엔드 개발과 관련된 글들을 정리한 페이지입니다.",
    path: "/blog",
  },
];

export default function App() {
  const navigate = useNavigate();

  const handleNavigate = (path: string | undefined) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="h-screen overflow-y-scroll bg-gray-900 text-white">
            {sections.map((section) => (
              <motion.div
                key={section.id}
                className="h-screen flex flex-col items-center justify-center text-4xl font-bold px-4"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeIn" }}
                viewport={{ once: false, amount: 0.3 }}
              >
                <span
                  className={`mb-6 ${
                    section.path
                      ? "mt-4 text-blue-400 hover:underline cursor-pointer"
                      : ""
                  }`}
                  onClick={() => handleNavigate(section.path)}
                >
                  {section.title}
                </span>
                <div className="text-base font-light text-center max-w-2xl leading-relaxed">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>
        }
      />
      <Route path="/blog" element={<Blog />} />
    </Routes>
  );
}
