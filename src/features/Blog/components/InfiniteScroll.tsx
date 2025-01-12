import React, { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { fetchPokemonData } from "../api/pokemon";

interface Poke {
  id: number;
  name: string;
  height: number;
  weight: number;
  baseExperience: number;
}

const InfiniteScroll: React.FC = () => {
  const { ref, inView } = useInView();

  const { data, error, status, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["items"],
      queryFn: ({ pageParam = 0 }: { pageParam?: number }) =>
        fetchPokemonData<Poke>({
          url: "https://pokeapi.co/api/v2/pokemon/",
          pageParam, // getNextPageParam에서 반환된 값을 다음 호출에 전달
          limit: pageParam === 0 ? 30 : 10,
          dataMapper: (item: any) => ({
            id: item.id,
            name: item.name,
            height: item.height,
            weight: item.weight,
            baseExperience: item.base_experience,
          }),
        }),
      getNextPageParam: (lastPage) => lastPage.nextPage, // 각 페이지 요청이 끝난 후, 다음에 요청할 페이지의 pageParam 값을 반환
      initialPageParam: 0,
    });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return status === "pending" ? (
    <div>Loading...</div>
  ) : status === "error" ? (
    <div>{(error as Error)?.message}</div>
  ) : (
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
            {data?.pages.map((page, index) => (
              <React.Fragment key={index}>
                {page.data.map((poke) => (
                  <tr
                    key={poke.id}
                    className="hover:bg-gray-100 transition duration-200"
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {poke.id}
                    </td>
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
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div ref={ref} className="mt-4 text-center">
        {isFetchingNextPage && "Fetching more data..."}
      </div>
    </div>
  );
};

export default InfiniteScroll;
