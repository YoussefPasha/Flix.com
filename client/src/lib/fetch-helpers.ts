const API_SERVER_URL = process.env.API_URL || "http://localhost:3000/api";

const API_CLIENT_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const API_BASE_URL =
  typeof window === "undefined" ? API_SERVER_URL : API_CLIENT_URL;

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  revalidate?: number | false;
}

function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  let url = `${API_BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  return url;
}

export async function fetchCached<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, revalidate = 3600, ...fetchOptions } = options;
  const url = buildUrl(endpoint, params);
  const response = await fetch(url, {
    ...fetchOptions,
    cache: "force-cache",
    next: { revalidate },
  });
  if (!response.ok) {
    throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchDynamic<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;
  const url = buildUrl(endpoint, params);
  console.log(url);
  
  const response = await fetch(url, {
    ...fetchOptions,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchWithTags<T>(
  endpoint: string,
  tags: string[],
  options: FetchOptions = {}
): Promise<T> {
  const { params, revalidate = 3600, ...fetchOptions } = options;
  const url = buildUrl(endpoint, params);

  const response = await fetch(url, {
    ...fetchOptions,
    next: { revalidate, tags },
  });

  if (!response.ok) {
    throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
