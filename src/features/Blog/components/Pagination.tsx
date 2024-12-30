import React, { useState, useEffect } from "react";

const POKEMON_LIMIT = 50; // 전체 포켓몬 수 제한
const POKEMON_PER_PAGE = 1; // 한 페이지당 포켓몬 수
const PAGES_PER_GROUP = 10; // 페이지 그룹당 표시할 페이지 수

interface Pokemon {
  name: string;
  url: string;
}

const Pagination: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]); // 전체 포켓몬 데이터
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지
  const [currentPageGroup, setCurrentPageGroup] = useState<number>(0); // 페이지 그룹 관리

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_LIMIT}`
        );
        const data = await response.json();
        setPokemon(data.results);
      } catch (error) {
        console.error("Failed to fetch Pokémon data:", error);
      }
    };
    fetchPokemon();
  }, []);

  // 현재 페이지에 표시할 포켓몬 계산
  const currentPokemon = pokemon.slice(
    (currentPage - 1) * POKEMON_PER_PAGE,
    currentPage * POKEMON_PER_PAGE
  );

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(POKEMON_LIMIT / POKEMON_PER_PAGE);

  // 현재 페이지 그룹의 시작/끝 페이지 계산
  const startPage = currentPageGroup * PAGES_PER_GROUP + 1;
  const endPage = Math.min(startPage + PAGES_PER_GROUP - 1, totalPages);

  // 페이지네이션 로직
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const nextPageGroup = () => {
    if (endPage < totalPages) setCurrentPageGroup(currentPageGroup + 1);
  };

  const prevPageGroup = () => {
    if (currentPageGroup > 0) setCurrentPageGroup(currentPageGroup - 1);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 flex justify-center">
        Pokémon Pagination
      </h2>
      <div className="flex flex-col items-center">
        <ul>
          {currentPokemon.map((poke, index) => (
            <li key={index} className="mb-4 text-center">
              <h3 className="text-xl capitalize">{poke.name}</h3>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                  (currentPage - 1) * POKEMON_PER_PAGE + index + 1
                }.png`}
                alt={poke.name}
                className="w-20 h-20 mx-auto"
              />
            </li>
          ))}
        </ul>
        <div className="flex space-x-2 mt-4 items-center">
          {/* 이전 페이지 그룹 */}
          {currentPageGroup > 0 && (
            <button
              onClick={prevPageGroup}
              className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
            >
              &lt;
            </button>
          )}
          {/* 현재 페이지 그룹에 속한 페이지 번호 */}
          {[...Array(endPage - startPage + 1)].map((_, idx) => {
            const pageNumber = startPage + idx;
            return (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`px-3 py-1 border rounded ${
                  currentPage === pageNumber
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
          {/* 다음 페이지 그룹 */}
          {endPage < totalPages && (
            <button
              onClick={nextPageGroup}
              className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
            >
              &gt;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pagination;
