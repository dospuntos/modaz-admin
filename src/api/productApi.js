import { apiGet, apiPost, apiPatch, apiDelete } from "./apiClient";

// Products

export function getProducts(filters = {}) {
  const params = new URLSearchParams(filters);
  const query = params.toString();

  return apiGet(`products${query ? `?${query}` : ""}`);
}

export function getPublishedProducts() {
  return apiGet("products/published");
}

export function getUnpublishedProducts() {
  return apiGet("products/unpublished");
}

export function getProductsPage(page) {
  return apiGet(`products/page/${page}`);
}

export function getProductById(id) {
  return apiGet(`products/${id}`);
}

export function saveProduct(product) {
  if (product.id) {
    return apiPatch(`products/${product.id}`, product);
  }

  return apiPost("products", product);
}

export function deleteProduct(id) {
  return apiDelete(`products/${id}`);
}

// Variants

export function getVariantsById(productId) {
  return apiGet(`variants/${productId}`);
}

export function saveVariant(variant) {
  return apiPatch(`variants/${variant.variant_id}`, variant);
}

export function deleteVariant(variantId) {
  return apiDelete(`variants/${variantId}`);
}

// Stock

export function changeStock(variantId, quantity = 1, dir = 1) {
  const action = dir >= 0 ? "UP" : "DOWN";

  return apiPatch(`variants/${variantId}/${action}`, { quantity });
}

export function resetStock() {
  return Promise.resolve(null);
}

// Categories

export function getCategories() {
  return apiGet("categories");
}

export function getCategoryById(id) {
  return apiGet(`categories/${id}`);
}

export function saveCategory(category) {
  if (category.id) {
    return apiPatch(`categories/${category.id}`, category);
  }

  return apiPost("categories", category);
}

export function deleteCategory(id) {
  return apiDelete(`categories/${id}`);
}

// Product properties

export function togglePublished(id, published) {
  return apiPatch(`products/${id}`, { published });
}

export function toggleFeatured(id, featured) {
  return apiPatch(`products/${id}`, { featured });
}

// UPC lookup

export function searchUPC(upc) {
  return getProducts({ upc });
}

// Orders

export function createOrder() {
  return Promise.resolve(null);
}
