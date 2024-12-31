import React, { useState, useEffect } from "react";

const POKEMON_LIMIT = 50; // 전체 포켓몬 수 제한
const POKEMON_PER_PAGE = 2; // 한 페이지당 포켓몬 수
const PAGES_PER_GROUP = 10; // 페이지 그룹당 표시할 페이지 수
const POKEMON_API_URL = "https://pokeapi.co/api/v2/pokemon/";

interface Pokemon {
  name: string;
  image: string;
}

const Pagination: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]); // 전체 포켓몬 데이터
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지
  const [currentPageGroup, setCurrentPageGroup] = useState<number>(0); // 페이지 그룹 관리
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태

  // API 호출
  const fetchPokemon = async () => {
    setLoading(true);
    setError(null);
    try {
      const responses = await Promise.all(
        Array.from({ length: POKEMON_LIMIT }, (_, index) =>
          fetch(`${POKEMON_API_URL}${index + 1}`).then((res) => res.json())
        )
      );

      const pokemonData = responses.map((data) => ({
        name: data.name,
        image: data.sprites.front_default,
      }));

      setPokemon(pokemonData);
    } catch (err) {
      console.error("Failed to fetch Pokémon data:", err);
      setError("Failed to fetch Pokémon data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchPokemon();
  }, []);

  // 현재 페이지의 데이터 계산
  const getCurrentPokemon = () =>
    pokemon.slice(
      (currentPage - 1) * POKEMON_PER_PAGE,
      currentPage * POKEMON_PER_PAGE
    );

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(POKEMON_LIMIT / POKEMON_PER_PAGE);

  // 현재 페이지 그룹의 시작/끝 계산
  const startPage = currentPageGroup * PAGES_PER_GROUP + 1;
  const endPage = Math.min(startPage + PAGES_PER_GROUP - 1, totalPages);

  // 페이지네이션 변경 함수
  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);
  const handleNextPageGroup = () =>
    endPage < totalPages && setCurrentPageGroup(currentPageGroup + 1);
  const handlePrevPageGroup = () =>
    currentPageGroup > 0 && setCurrentPageGroup(currentPageGroup - 1);

  // 페이지네이션 버튼 그룹 컴포넌트
  const PaginationButtons: React.FC = () => (
    <div className="flex space-x-2 mt-4 items-center">
      {/* 이전 페이지 그룹 */}
      {currentPageGroup > 0 && (
        <button
          onClick={handlePrevPageGroup}
          className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
        >
          &lt;
        </button>
      )}
      {/* 현재 페이지 그룹 */}
      {[...Array(endPage - startPage + 1)].map((_, idx) => {
        const pageNumber = startPage + idx;
        return (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
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
          onClick={handleNextPageGroup}
          className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
        >
          &gt;
        </button>
      )}
    </div>
  );

  const SkeletonLoader = () => (
    <div className="w-20 h-20 bg-gray-200 animate-pulse mx-auto"></div>
  );

  // UI 렌더링
  return (
    <div className="p-4">
      <div className="flex flex-col items-center">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="flex items-center justify-center mx-auto w-full">
            <ul>
              {getCurrentPokemon().map((poke, index) => (
                <li key={index} className="mb-4">
                  <h3 className="text-xl capitalize">{poke.name}</h3>
                  {poke.image ? (
                    <img
                      src={poke.image}
                      alt={poke.name}
                      className="w-20 h-20 mx-auto"
                    />
                  ) : (
                    <SkeletonLoader />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        <PaginationButtons />
      </div>
      <p className="mt-6 text-left text-gray-700 text-sm leading-relaxed max-w-xl">
        해당 페이지네이션 로직에서는{" "}
        <span className="font-semibold">
          currentPage와 currentPageGroup 상태를 사용하여 데이터를 효율적으로
          관리합니다.
        </span>
        <br />
        <span className="font-semibold text-blue-600">currentPage</span>는 현재
        사용자가 보고 있는 페이지 번호를 나타내며, 이를 기반으로 현재 페이지에
        해당하는 포켓몬 데이터를 계산하고 화면에 표시합니다. 그리고{" "}
        <span className="font-semibold text-blue-600">currentPageGroup</span>은
        페이지네이션 버튼을 그룹 단위로 묶는 데 사용되며, 한 번에 보여줄 페이지
        번호의 범위를 관리합니다.
        <br />
        버튼 클릭 시 currentPage와 currentPageGroup 상태가 업데이트되며, 이를
        통해 화면에 표시되는 데이터와 페이지 버튼이 동적으로 변경됩니다. 즉,
        많은 페이지를 한꺼번에 보여주지 않고 그룹 단위로 관리할 수 있습니다.
      </p>
    </div>
  );
};

export default Pagination;
