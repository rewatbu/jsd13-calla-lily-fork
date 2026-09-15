const BASE = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "calla-token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

function storeToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
}

const unauthorizedEvent = () => new CustomEvent("calla:unauthorized");

async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) {
      storeToken(null);
      window.dispatchEvent(unauthorizedEvent());
    }
    const error = new Error(data.message || "Something went wrong");
    error.status = res.status;
    throw error;
  }
  return data;
}

async function safeRequest(path, options) {
  try {
    return await request(path, options);
  } catch (error) {
    return { error: error.message };
  }
}

export const api = {
  getProducts: () => request("/products"),
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (data) => request("/products", { method: "POST", body: data }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: "PUT", body: data }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),

  login: (email, password) => safeRequest("/users/login", { method: "POST", body: { email, password } }),
  register: (data) => safeRequest("/users/register", { method: "POST", body: data }),
  getUsers: () => request("/users"),
  updateProfile: (id, data) => safeRequest(`/users/${id}/profile`, { method: "PUT", body: data }),
  changePassword: (id, currentPassword, newPassword) =>
    safeRequest(`/users/${id}/password`, { method: "PUT", body: { currentPassword, newPassword } }),

  getOrders: () => request("/orders"),
  getMyOrders: () => request("/orders/mine"),
  trackOrder: (query) => request(`/orders/track?q=${encodeURIComponent(query)}`),
  getOrder: (id) => request(`/orders/${id}`),
  createOrder: (data) => request("/orders", { method: "POST", body: data }),
  updateOrderStatus: (id, status) => request(`/orders/${id}`, { method: "PATCH", body: { status } }),
};

export const sortOrdersNewest = (orders) =>
  [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));