// Return default image from image JSON
/* export function getDefaultImage(imgJSON) {
  let images = validateJSON(imgJSON);
  return import.meta.env.VITE_PROD_IMG_URL + images["0"]["image"];
} */

export function getDefaultImage(imgJSON) {
  let images = validateJSON(imgJSON);
  return import.meta.env.VITE_PROD_IMG_URL + images["0"]["image"];
}

// Return all images from JSON as array
export function getAllImages(imgJSON) {
  return validateJSON(imgJSON);
}

export function getImageCount(imgJSON) {
  return validateJSON(imgJSON).length;
}

export function getImagesByColor(imgJSON, color) {
  let images = validateJSON(imgJSON);
  if (color === null || color === "") color = "multi";

  const retval = images.find(
    (image) => image.color.toLowerCase() === color.toLowerCase(),
  );
  return retval
    ? import.meta.env.VITE_PROD_IMG_URL + retval.image
    : import.meta.env.VITE_PROD_IMG_URL + images["0"]["image"];
}

// Run some internal checks for possible errors in JSON encoded images
function defaultImages() {
  return [{ image: "default.png", color: "multi" }];
}

// Accepts either a JSON string or an already-parsed value
function validateJSON(imgJSON) {
  let value = imgJSON;

  if (typeof imgJSON === "string") {
    try {
      value = JSON.parse(imgJSON);
    } catch (err) {
      console.warn("Could not parse image JSON, using default:", imgJSON, err);
      return defaultImages();
    }
  }

  const isValid =
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (item) =>
        item !== null &&
        typeof item === "object" &&
        typeof item.image === "string" &&
        item.image !== "",
    );

  if (!isValid) {
    console.warn("Invalid image data, using default:", imgJSON);
    return defaultImages();
  }

  return value;
}
