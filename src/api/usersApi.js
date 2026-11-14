import { handleResponse, handleError } from "./apiUtils";

const MOCK_USERS = [
  { id: 1, name: "Ana Pérez", email: "ana@example.com" },
  { id: 2, name: "Carlos Ruiz", email: "carlos@example.com" },
  { id: 3, name: "María López", email: "maria@example.com" },
];

const USE_MOCK_DATA = true;

export function getUsers() {
  if (USE_MOCK_DATA) {
    return Promise.resolve(MOCK_USERS);
  }

  return fetch(import.meta.env.VITE_API_URL + "getusers.php")
    .then(handleResponse)
    .catch(handleError);
}

export function loginUser(credentials) {
  return fetch(import.meta.env.VITE_API2_URL + "sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })
    .then((data) => data.json())
    .catch(handleError);
}

export function logOut() {
  // Todo - logout from server using token and session ID
  const token = JSON.parse(localStorage.getItem("token"));
  if (token?.session_id) {
    // Todo - check token expiry and refresh if needed.
    return fetch(
      import.meta.env.VITE_API2_URL + "sessions/" + token.session_id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token.access_token,
        },
        body: JSON.stringify({ refresh_token: token.refresh_token }),
      },
    );
  }
}
