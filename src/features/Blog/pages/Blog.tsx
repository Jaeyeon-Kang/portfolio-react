import InfiniteScroll from "../components/InfiniteScroll";
import Pagination from "../components/Pagination";
import { useState, ReactNode } from "react";

const Blog = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<ReactNode>(null);
  const menu = [
    {
      id: 1,
      title: "Pagination",
    },
    { id: 2, title: "Infinite Scroll" },
  ];

  const handleMenu = (id: number) => {
    console.log(`Menu ID clicked: ${id}`);

    if (id === selectedMenuId) {
      setShowMenu(false);
      setSelectedMenuId(null);
      return;
    }

    setSelectedMenuId(id);
  };

  const renderMenu = () => {
    switch (selectedMenuId) {
      case 1:
        return <Pagination />;
      case 2:
        return <InfiniteScroll />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-start">
      <h1 className="text-4xl font-bold mb-6">Blog Page2</h1>

      {menu.map((menuItem) => (
        <button
          className="text-blue-700"
          key={menuItem.id}
          onClick={() => handleMenu(menuItem.id)}
        >
          {menuItem.title}
        </button>
      ))}
      {renderMenu()}
    </div>
  );
};

export default Blog;
