import { handleResponse, handleError } from "./apiUtils";

const API_URL = import.meta.env.VITE_API2_URL;
const TOKEN_REFRESH_MARGIN = 30 * 1000;

let refreshPromise = null;

function getStoredToken() {
  try {
    return JSON.parse(localStorage.getItem("token")) || null;
  } catch {
    return null;
  }
}

function saveToken(token) {
  localStorage.setItem("token", JSON.stringify(token));
}

function clearToken() {
  localStorage.removeItem("token");
}

// Refresh the session if the access token is expired
// or about to expire.
async function refreshToken() {
  const token = getStoredToken();

  if (!token?.session_id || !token?.refresh_token) {
    throw new Error("No valid session available.");
  }

  // Check whether the refresh token itself has expired.
  if (
    token.refresh_token_expires &&
    Date.now() >= token.refresh_token_expires
  ) {
    clearToken();
    throw new Error("Session expired. Please log in again.");
  }

  // Avoid multiple simultaneous refresh requests.
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_URL}sessions/${token.session_id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token.access_token,
        },
        body: JSON.stringify({
          refresh_token: token.refresh_token,
        }),
      });

      const result = await handleResponse(response);

      // Adapt this if the API uses a different response structure.
      const data = result?.data ?? result;

      const now = Date.now();

      const updatedToken = {
        ...token,
        ...data,
        access_token_expires: now + data.access_token_expires_in * 1000,
        refresh_token_expires: now + data.refresh_token_expires_in * 1000,
      };

      saveToken(updatedToken);

      return updatedToken;
    } catch (error) {
      clearToken();
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// Return a valid token, refreshing it when necessary.
async function getValidToken() {
  const token = getStoredToken();

  if (!token?.access_token) {
    return null;
  }

  const expiresAt = Number(token.access_token_expires);

  if (expiresAt && Date.now() >= expiresAt - TOKEN_REFRESH_MARGIN) {
    return refreshToken();
  }

  return token;
}

// Generic API request
async function request(endpoint, options = {}, retry = true) {
  try {
    const token = await getValidToken();

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body !== undefined
          ? { "Content-Type": "application/json" }
          : {}),
        ...(token?.access_token ? { Authorization: token.access_token } : {}),
        ...options.headers,
      },
    });

    // If the server rejects an access token, try refreshing once.
    if (response.status === 401 && retry && token) {
      await refreshToken();

      return request(endpoint, options, false);
    }

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
