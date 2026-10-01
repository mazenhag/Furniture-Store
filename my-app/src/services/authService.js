import { apiFetch, authHeaders } from "./api";

export const registerUser = ({ name, email, password }) =>
  apiFetch("/api/Account/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });

export const loginUser = async ({ email, password }) => {
  const data = await apiFetch("/api/Account/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
  const token = typeof data === "string" ? data.trim() : data?.token?.trim();
  if (!token) throw new Error("Login succeeded, but no JWT token was returned.");
  localStorage.setItem("token", token);
  return { token };
};

export const getCurrentUser = () => apiFetch("/api/Account/profile", { headers: authHeaders() });
export const getToken = () => localStorage.getItem("token");
export const isAuthenticated = () => Boolean(getToken());
export const logoutUser = () => localStorage.removeItem("token");
