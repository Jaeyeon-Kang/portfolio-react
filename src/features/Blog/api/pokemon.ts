import axios from "axios";

interface FetchParams {
  url: string; // API URL
  pageParam?: number; // 페이지 파라미터
  limit: number; // 한 페이지당 데이터 수
  dataMapper?: (data: any) => any; // 데이터를 가공하는 함수 (선택)
}

export async function fetchPokemonData<T>({
  url,
  pageParam = 0,
  limit,
  dataMapper,
}: FetchParams): Promise<{
  data: T[];
  currentPage: number;
  nextPage: number | null;
}> {
  const start = pageParam * limit;

  const responses = await Promise.all(
    Array.from({ length: limit }, (_, i) => axios.get(`${url}${start + i + 1}`))
  );

  const rawData = responses.map((res) => res.data);
  const data = dataMapper ? rawData.map(dataMapper) : rawData;

  return {
    data,
    currentPage: pageParam,
    nextPage: data.length === limit ? pageParam + 1 : null,
  };
}
