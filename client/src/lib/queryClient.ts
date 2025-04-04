import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { API_BASE_URL } from "./config";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    console.error(`Response not OK: ${res.status} ${res.statusText}`, text);
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  urlOrMethod: string,
  urlOrData?: string | unknown,
  data?: unknown,
): Promise<Response> {
  const method = data ? urlOrMethod : "GET";
  const url = data ? urlOrData as string : urlOrMethod;
  const body = data ?? urlOrData;

  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  console.log(`API Request: ${method} ${fullUrl}`);
  
  try {
    const res = await fetch(fullUrl, {
      method,
      headers: body && method !== "GET" ? { "Content-Type": "application/json" } : {},
      body: body && method !== "GET" ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`API Error: ${res.status} ${res.statusText}`, text);
      throw new Error(`${res.status}: ${text}`);
    }
    
    return res;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    console.log(`Query Function: ${fullUrl}`);
    
    try {
      const res = await fetch(fullUrl, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        console.log(`Query Function: ${fullUrl} - Unauthorized, returning null`);
        return null;
      }

      if (!res.ok) {
        const text = await res.text();
        console.error(`Query Function Error: ${res.status} ${res.statusText}`, text);
        throw new Error(`${res.status}: ${text}`);
      }
      
      const data = await res.json();
      console.log(`Query Function: ${fullUrl} - Success`, data);
      return data;
    } catch (error) {
      console.error(`Query Function Error: ${fullUrl}`, error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
