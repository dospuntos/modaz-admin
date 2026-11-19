import { useState } from "react";

function getStoredToken() {
  try {
    return JSON.parse(localStorage.getItem("token")) || null;
  } catch {
    return null;
  }
}

export default function useToken() {
  const [token, setTokenState] = useState(getStoredToken);

  const setToken = (response) => {
    const data = response?.data ?? response;

    if (!data || !data.access_token) {
      return;
    }

    const now = Date.now();

    const userToken = {
      ...data,
      access_token_expires: now + data.access_token_expires_in * 1000,
      refresh_token_expires: now + data.refresh_token_expires_in * 1000,
    };

    localStorage.setItem("token", JSON.stringify(userToken));
    setTokenState(userToken);
  };

  const clearToken = () => {
    localStorage.removeItem("token");
    setTokenState(null);
  };

  return {
    token,
    setToken,
    clearToken,
  };
}
