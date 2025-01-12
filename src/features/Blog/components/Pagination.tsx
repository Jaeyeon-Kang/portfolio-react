import React, { useState, useEffect } from "react";
import { fetchPokemonData } from "../api/pokemon";

const TOTAL_POKEMON = 100; // 전체 포켓몬 수 제한
const POKEMON_PER_PAGE = 10; // 한 페이지당 포켓몬 수
const PAGES_PER_GROUP = 5; // 페이지 그룹당 표시할 페이지 수
const POKEMON_API_URL = "https://pokeapi.co/api/v2/pokemon/";

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  baseExperience: number;
}

const Pagination: React.FC = () => {
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon[]>([]); // 현재 페이지의 포켓몬 데이터
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태

  const fetchPokemonByPage = async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const result = await fetchPokemonData<Pokemon>({
        url: POKEMON_API_URL,
        pageParam: pageNumber - 1, // 0-based index로 변환
        limit: POKEMON_PER_PAGE,
        dataMapper: (data) => ({
          id: data.id,
          name: data.name,
          height: data.height,
          weight: data.weight,
          baseExperience: data.base_experience,
        }),
      });

      setCurrentPokemon(result.data);
    } catch (err) {
      console.error("Failed to fetch Pokémon data:", err);
      setError("Failed to fetch Pokémon data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // 페이지 변경 시 데이터 가져오기
  useEffect(() => {
    fetchPokemonByPage(currentPage);
  }, [currentPage]);

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(TOTAL_POKEMON / POKEMON_PER_PAGE);

  // 현재 페이지 그룹의 시작/끝 계산
  const currentPageGroup = Math.floor((currentPage - 1) / PAGES_PER_GROUP);
  const startPage = currentPageGroup * PAGES_PER_GROUP + 1;
  const endPage = Math.min(startPage + PAGES_PER_GROUP - 1, totalPages);

  // 페이지네이션 변경 함수
  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleNextPageGroup = () => {
    if (endPage < totalPages) {
      setCurrentPage(startPage + PAGES_PER_GROUP);
    }
  };

  const handlePrevPageGroup = () => {
    if (currentPageGroup > 0) {
      setCurrentPage(startPage - PAGES_PER_GROUP);
    }
  };

  // UI 렌더링
  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Pokémon Table</h1>

      <div className="relative overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full text-center shadow-lg rounded-lg">
          <thead>
            <tr className="bg-blue-200">
              <th className="border border-gray-300 px-4 py-2 w-1/12 text-sm">
                ID
              </th>
              <th className="border border-gray-300 px-4 py-2 w-2/12 text-sm">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 w-3/12 text-sm">
                Height
              </th>
              <th className="border border-gray-300 px-4 py-2 w-3/12 text-sm">
                Weight
              </th>
              <th className="border border-gray-300 px-4 py-2 w-3/12 text-sm">
                Base Experience
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPokemon.map((poke) => (
              <tr
                key={poke.id}
                className="hover:bg-gray-100 transition duration-200"
              >
                <td className="border border-gray-300 px-4 py-2">{poke.id}</td>
                <td className="border border-gray-300 px-4 py-2 capitalize">
                  {poke.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {poke.height}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {poke.weight}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {poke.baseExperience}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 버튼 */}
      <div className="flex justify-center mt-4 space-x-2">
        {currentPageGroup > 0 && (
          <button
            onClick={handlePrevPageGroup}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
          >
            &lt;
          </button>
        )}
        {Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        ).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 border rounded ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
        {endPage < totalPages && (
          <button
            onClick={handleNextPageGroup}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
          >
            &gt;
          </button>
        )}
      </div>

      {/* 설명 부분 */}
      <div className="mt-6 text-sm text-gray-700 max-w-2xl mx-auto leading-relaxed">
        <p className="mb-4">
          <span className="font-bold text-blue-500">처음</span>에는 데이터를 한
          번에 모두 가져와서 클라이언트에서 관리하는 방식으로 페이지네이션을
          구현했어요. 성능을 높이기 위해 캐시를 활용했는데,{" "}
          <span className="font-semibold text-gray-900">
            데이터 양이 많아질수록 메모리 사용량이 증가하고, 캐시가 유지되는
            동안 불필요한 데이터가 많아져 로딩 속도가 느려지는 문제가
            발생했어요.
          </span>
        </p>
        <p className="mb-4">
          <span className="font-bold text-blue-500">
            이 문제를 해결하기 위해
          </span>{" "}
          <span className="bg-yellow-100 px-2 py-1 rounded">
            서버사이드 페이지네이션
          </span>
          으로 전환했어요. 필요한 데이터만 서버에서 가져오는 방식이라 데이터가
          많아도 효율적으로 처리할 수 있었죠. 하지만 처음엔 offset 기반
          페이지네이션을 사용했는데,{" "}
          <span className="font-semibold text-gray-900">
            offset 값이 커질수록 서버가 데이터를 건너뛰는 데 시간이 많이 걸려
            성능에 부담이 생기는 문제가 있었어요.
          </span>
        </p>
        <p>
          <span className="font-bold text-blue-500">그래서</span>{" "}
          <span className="bg-green-100 px-2 py-1 rounded">
            id 기반(커서 기반)
          </span>{" "}
          페이지네이션으로 바꿔봤어요. id를 기준으로 필요한 데이터만 요청하는
          방식이라{" "}
          <span className="font-semibold text-gray-900">
            서버 부하를 줄이고, 더 빠르게 데이터를 처리
          </span>
          할 수 있었어요. 덕분에 페이지네이션 시스템이 훨씬 안정적이고
          효율적으로 작동하게 되었어요.
        </p>
      </div>
    </div>
  );
};

export default Pagination;
