import { apiGet } from "./apiClient";

export function getStatistics() {
  return apiGet(`statistics`);
}

export function getMissingImages() {
  return Promise.resolve(null);
  return fetch(import.meta.env.VITE_API_URL + "getmissingimages.php?delay=3")
    .then(handleResponse)
    .catch(handleError);
}
