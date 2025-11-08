import { useQuery } from '@tanstack/react-query';

export async function fetchJSONData<T>(path: string): Promise<T> {
  const response = await fetch(path);

  if (!response.ok) throw new Error(`Failed to fetch JSON from ${path}`);

  return response.json() as Promise<T>;
}

export function useJSONData<T>(path: string) {
  return useQuery({
    queryKey: ['json-data', path],
    queryFn: () => fetchJSONData<T>(path),
  });
}
