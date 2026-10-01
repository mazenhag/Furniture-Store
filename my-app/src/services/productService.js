import { apiFetch, authHeaders } from "./api";

const BACKEND_URL = "https://graduationecommerce.runasp.net";

const normalizeImage = (image) => {
  if (!image || typeof image !== "string") return image;
  if (/^(https?:|data:|blob:)/i.test(image)) return image;
  return `${BACKEND_URL}/${image.replace(/^\/+/, "")}`;
};

const normalizeProduct = (product) => product && typeof product === "object" ? { ...product, img: normalizeImage(product.img) } : product;

export const normalizeProducts = (data) => {
  const list = Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : Array.isArray(data?.data) ? data.data : Array.isArray(data?.$values) ? data.$values : [];
  return list.map(normalizeProduct);
};

export const getProducts = async () => normalizeProducts(await apiFetch("/api/Product"));
export const getProductById = async (id) => normalizeProduct(await apiFetch(`/api/Product/${id}`));
export const getCurrentUserProducts = async () => normalizeProducts(await apiFetch("/api/Product/user", { headers: authHeaders() }));

const appendCommonFields = (body, { name, description, price, quantity, category }) => {
  body.append("Name", name);
  body.append("Description", description);
  body.append("Price", price);
  body.append("quantity", quantity);
  body.append("category", category);
};

export const createProduct = ({ name, description, price, quantity, image, category }) => {
  const body = new FormData();
  appendCommonFields(body, { name, description, price, quantity, category });
  if (image) body.append("Img", image);
  return apiFetch("/api/Product", { method: "POST", headers: authHeaders(), body });
};

export const updateProduct = ({ id, name, description, price, quantity, image, category }) => {
  const body = new FormData();
  body.append("Id", id);
  appendCommonFields(body, { name, description, price, quantity, category });
  if (image) body.append("Img", image);
  return apiFetch("/api/Product", { method: "PUT", headers: authHeaders(), body });
};

export const deleteProduct = (id) => apiFetch(`/api/Product/${id}`, { method: "DELETE", headers: authHeaders() });

export async function imageUrlToFile(url, fileName = "product-image.jpg") {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not download the image from this link. Make sure the image URL is public and accessible.");
  const blob = await response.blob();
  const extension = blob.type?.split("/")[1] || "jpg";
  const safeName = fileName.includes(".") ? fileName : `${fileName}.${extension}`;
  return new File([blob], safeName, { type: blob.type || "image/jpeg" });
}
