/*
  Lightweight API client for Next.js (App Router compatible)
  - Works on server and client
  - Typed helpers: get, post, put, patch, del
  - JSON by default, supports FormData
  - Graceful errors with status and details

  Usage examples:
    import { api } from "@/lib/api";

    const list = await api.get<{ data: { novels: any[] } }>("/api/novels");
    const created = await api.post<{ data: { novel: any } }>("/api/novels", body);
*/

export type QueryValue = string | number | boolean | null | undefined | Array<string | number | boolean>;
export type Query = Record<string, QueryValue>;

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function isFormData(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

function buildQuery(params?: Query): string {
  if (!params) return "";
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const v of value) usp.append(key, String(v));
    } else {
      usp.set(key, String(value));
    }
  }
  const s = usp.toString();
  return s ? `?${s}` : "";
}

function joinUrl(base: string, path: string): string {
  if (!base) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return base.replace(/\/$/, "") + path;
  return base.replace(/\/$/, "") + "/" + path;
}

// Allows optionally setting a base URL, but works with relative paths by default.
const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""; // keep empty for same-origin

export type ApiRequestInit = Omit<RequestInit, "body"> & {
  baseUrl?: string;
  query?: Query;
  json?: boolean; // force JSON response parsing (default auto by content-type)
  text?: boolean; // force text response parsing
  body?: unknown; // we will stringify JSON unless FormData
};

async function request<T>(url: string, init: ApiRequestInit = {}): Promise<T> {
  const { baseUrl = DEFAULT_BASE_URL, query, body, headers, json, text, ...rest } = init;

  const finalUrl = joinUrl(baseUrl, url) + buildQuery(query);

  const h = new Headers(headers || {});

  const hasBody = body !== undefined && body !== null;
  let finalBody: BodyInit | undefined = undefined;

  if (hasBody) {
    if (isFormData(body)) {
      finalBody = body;
      // Let the browser set the correct Content-Type boundary
      // Do not set Content-Type when sending FormData
    } else if (body instanceof Blob) {
      finalBody = body;
    } else if (typeof body === "string") {
      finalBody = body;
      if (!h.has("Content-Type")) h.set("Content-Type", "text/plain;charset=UTF-8");
    } else {
      finalBody = JSON.stringify(body);
      if (!h.has("Content-Type")) h.set("Content-Type", "application/json");
    }
  }

  // Accept JSON by default
  if (!h.has("Accept")) h.set("Accept", "application/json, text/plain;q=0.8, */*;q=0.5");

  const resp = await fetch(finalUrl, {
    credentials: typeof window === "undefined" ? "include" : "same-origin",
    ...rest,
    headers: h,
    body: finalBody,
  });

  const ct = resp.headers.get("content-type") || "";

  let parsed: any = null;
  let parseError: unknown = undefined;

  try {
    if (json || (!text && ct.includes("application/json"))) {
      parsed = await resp.json();
    } else if (text || ct.startsWith("text/")) {
      parsed = await resp.text();
    } else if (ct.includes("application/octet-stream")) {
      parsed = await resp.arrayBuffer();
    } else if (ct.includes("application/pdf")) {
      parsed = await resp.blob();
    } else if (!ct) {
      // No content-type; try text first, then JSON
      try {
        parsed = await resp.text();
      } catch {
        parsed = await resp.arrayBuffer();
      }
    } else {
      // Fallback to text to avoid throwing on unknown content-types
      parsed = await resp.text();
    }
  } catch (e) {
    parseError = e;
  }

  if (!resp.ok) {
    const message = (parsed && (parsed.error || parsed.message)) || resp.statusText || "Request failed";
    throw new ApiError(String(message), resp.status, parsed ?? parseError);
  }

  return parsed as T;
}

function get<T>(url: string, init: Omit<ApiRequestInit, "body"> & { query?: Query } = {}) {
  return request<T>(url, { ...init, method: "GET" });
}

function del<T>(url: string, init: Omit<ApiRequestInit, "body"> & { query?: Query } = {}) {
  return request<T>(url, { ...init, method: "DELETE" });
}

function post<T>(url: string, body?: unknown, init: Omit<ApiRequestInit, "body"> = {}) {
  return request<T>(url, { ...init, method: "POST", body });
}

function put<T>(url: string, body?: unknown, init: Omit<ApiRequestInit, "body"> = {}) {
  return request<T>(url, { ...init, method: "PUT", body });
}

function patch<T>(url: string, body?: unknown, init: Omit<ApiRequestInit, "body"> = {}) {
  return request<T>(url, { ...init, method: "PATCH", body });
}

export const api = {
  request,
  get,
  post,
  put,
  patch,
  del,
  buildQuery,
  ApiError,
};

export type Api = typeof api;
