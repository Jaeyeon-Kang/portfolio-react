import { motion } from "framer-motion";
import { Routes, Route, useNavigate } from "react-router-dom";
import Blog from "./features/Blog/pages/Blog";

const sections = [
  {
    id: 1,
    title: "About Me",
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
          <div
            className="h-screen overflow-y-scroll bg-zinc-800
 text-white font-sans"
          >
            {sections.map((section) => (
              <motion.div
                key={section.id}
                className="h-screen flex flex-col items-center justify-center px-4"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                viewport={{ once: false, amount: 0.5 }}
              >
                <div
                  className={`text-5xl font-extrabold mb-6 transition-transform tracking-wide hover:scale-105 ${
                    section.path
                      ? "text-blue-400 hover:underline cursor-pointer"
                      : "text-gray-300"
                  }`}
                  onClick={() => handleNavigate(section.path)}
                >
                  {section.title}
                </div>
                <motion.div
                  className="text-lg font-light text-center max-w-3xl leading-relaxed text-gray-400"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  {section.content}
                </motion.div>
              </motion.div>
            ))}
          </div>
        }
      />
      <Route path="/blog" element={<Blog />} />
    </Routes>
  );
}
