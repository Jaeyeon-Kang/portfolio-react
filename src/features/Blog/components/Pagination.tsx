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
  const [cachedPokemon, setCachedPokemon] = useState<Map<number, Pokemon[]>>(
    new Map()
  ); // 캐싱된 포켓몬 데이터
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon[]>([]); // 현재 페이지의 포켓몬 데이터
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지
  const [currentPageGroup, setCurrentPageGroup] = useState<number>(0); // 페이지 그룹 관리
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태

  // 페이지 그룹에 해당하는 데이터 가져오기
  const fetchPokemonByGroup = async (pageGroup: number) => {
    if (cachedPokemon.has(pageGroup)) {
      // 캐싱된 데이터 사용
      setCurrentPokemon(cachedPokemon.get(pageGroup) || []);
      return; // 로딩 상태 건너뜀
    }

    setLoading(true);
    setError(null);

    const start = pageGroup * PAGES_PER_GROUP * POKEMON_PER_PAGE;
    const end = Math.min(
      start + PAGES_PER_GROUP * POKEMON_PER_PAGE,
      POKEMON_LIMIT
    );

    try {
      const responses = await Promise.all(
        Array.from({ length: end - start }, (_, index) =>
          fetch(`${POKEMON_API_URL}${start + index + 1}`).then((res) =>
            res.json()
          )
        )
      );

      const pokemonData = responses.map((data) => ({
        name: data.name,
        image: data.sprites.front_default,
      }));

      // 데이터 캐싱
      setCachedPokemon((prevCache) =>
        new Map(prevCache).set(pageGroup, pokemonData)
      );
      setCurrentPokemon(pokemonData);
    } catch (err) {
      console.error("Failed to fetch Pokémon data:", err);
      setError("Failed to fetch Pokémon data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로드 및 페이지 그룹 변경 시 데이터 가져오기
  useEffect(() => {
    fetchPokemonByGroup(currentPageGroup);
  }, [currentPageGroup]);

  // 현재 페이지의 데이터 계산
  const getCurrentPokemon = () =>
    currentPokemon.slice(
      ((currentPage - 1) % PAGES_PER_GROUP) * POKEMON_PER_PAGE,
      (((currentPage - 1) % PAGES_PER_GROUP) + 1) * POKEMON_PER_PAGE
    );

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(POKEMON_LIMIT / POKEMON_PER_PAGE);

  // 현재 페이지 그룹의 시작/끝 계산
  const startPage = currentPageGroup * PAGES_PER_GROUP + 1;
  const endPage = Math.min(startPage + PAGES_PER_GROUP - 1, totalPages);

  // 페이지네이션 변경 함수
  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);
  const handleNextPageGroup = () => {
    if (endPage < totalPages) {
      setCurrentPageGroup(currentPageGroup + 1);
    }
  };
  const handlePrevPageGroup = () => {
    if (currentPageGroup > 0) {
      setCurrentPageGroup(currentPageGroup - 1);
    }
  };

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
        {loading && !cachedPokemon.has(currentPageGroup) ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="flex flex-wrap justify-center w-full gap-1 ">
            {getCurrentPokemon().map((poke, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center w-1/3 p-4 bg-white rounded-lg shadow-lg "
              >
                {poke.image ? (
                  <>
                    <h3 className="text-xl capitalize mb-2">{poke.name}</h3>
                    <img
                      src={poke.image}
                      alt={poke.name}
                      className="w-20 h-20 mx-auto duration-75"
                    />
                  </>
                ) : (
                  <SkeletonLoader />
                )}
              </div>
            ))}
          </div>
        )}

        <PaginationButtons />
      </div>
      <p className="mt-6 text-left text-gray-700 text-sm leading-relaxed max-w-xl">
        해당 페이지네이션 로직에서는{" "}
        <span className="font-semibold">
          currentPage와 currentPageGroup 라는 상태를 사용합니다.
        </span>
        <br />
        <span className="font-semibold text-blue-600">currentPage</span>는 현재
        사용자가 보고 있는 페이지 번호이자 currentPageGroup을 계산하는데
        사용됩니다. <br />
        <span className="font-semibold text-blue-600">currentPageGroup</span>은
        페이지네이션 버튼을 그룹 단위(ex. 1부터 10까지의 페이지 그룹)로 묶는 데
        사용되며, 해당 단위로 API 요청을 하여 데이터를 불러옵니다. 이를 통해
        데이터를 효율적으로 관리하고 빠르게 화면에 표시합니다.
      </p>
    </div>
  );
};

export default Pagination;
