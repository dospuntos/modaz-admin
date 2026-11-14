import { handleResponse, handleError } from "./apiUtils";

const API_URL = import.meta.env.VITE_API2_URL;

function getToken() {
  try {
    return JSON.parse(localStorage.getItem("token"));
  } catch {
    return null;
  }
}

async function request(endpoint, options = {}) {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body instanceof FormData
          ? {}
          : options.body
            ? { "Content-Type": "application/json" }
            : {}),
        ...(token?.access_token ? { Authorization: token.access_token } : {}),
        ...options.headers,
      },
    });

    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}

export function apiGet(endpoint) {
  return request(endpoint);
}

export function apiPost(endpoint, data) {
  return request(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function apiPatch(endpoint, data) {
  return request(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function apiDelete(endpoint) {
  return request(endpoint, {
    method: "DELETE",
  });
}
