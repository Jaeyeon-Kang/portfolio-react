import InfiniteScroll from "../components/InfiniteScroll";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import { useState, ReactNode } from "react";

const Blog = () => {
  const [selectedMenuId, setSelectedMenuId] = useState<ReactNode>(1);

  const menu = [
    { id: 1, title: "Pagination" },
    { id: 2, title: "Infinite Scroll" },
    { id: 3, title: "Modal" },
  ];

  const handleMenu = (id: number) => {
    setSelectedMenuId(id);
  };

  const renderMenu = () => {
    switch (selectedMenuId) {
      case 1:
        return <Pagination />;
      case 2:
        return <InfiniteScroll />;
      case 3:
        return <Modal />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col items-center px-4 py-6">
      {/* 탭 네비게이션 */}
      <div className="flex justify-center space-x-6 border-b border-gray-300 w-full max-w-4xl">
        {menu.map((menuItem) => (
          <button
            key={menuItem.id}
            onClick={() => handleMenu(menuItem.id)}
            className={`pb-2 text-lg font-medium transition-colors duration-200 ${
              selectedMenuId === menuItem.id
                ? "border-b-4 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            {menuItem.title}
          </button>
        ))}
      </div>

      {/* 콘텐츠 */}
      <div className="mt-6 w-full max-w-4xl">{renderMenu()}</div>
    </div>
  );
};

export default Blog;
