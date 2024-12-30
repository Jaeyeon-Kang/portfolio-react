import Pagination from "../components/Pagination";
import { useState } from "react";

const Blog = () => {
  const [showMenu, setShowMenu] = useState(false);
  const menu = [
    {
      id: 1,
      title: "Pagination",
    },
  ];

  const handleMenu = (id) => {
    setShowMenu((prev) => !prev);
    console.log(`Menu ID clicked: ${id}`);
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col items-center justify-start">
      <h1 className="text-4xl font-bold mb-6">Blog Page</h1>

      {menu.map((menuItem) => (
        <button
          className="text-blue-700"
          key={menuItem.id}
          onClick={() => handleMenu(menuItem.id)}
        >
          {menuItem.title}
        </button>
      ))}
      {showMenu && <Pagination />}
    </div>
  );
};

export default Blog;
