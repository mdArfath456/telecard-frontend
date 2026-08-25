import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
export const api = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});
let accessToken = null;
let refreshPromise = null;
export const setAccessToken = (token) => {
  accessToken = token || null;
};
api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original?.url?.includes("/api/auth/")
    ) {
      original._retry = true;
      try {
        refreshPromise ||= api.post("/api/auth/refresh");
        const response = await refreshPromise;
        refreshPromise = null;
        setAccessToken(response.data.accessToken);
        return api(original);
      } catch (e) {
        refreshPromise = null;
        setAccessToken(null);
      }
    }
    return Promise.reject(error);
  },
);
export const authApi = {
  login: (d) => api.post("/api/auth/login", d),
  register: (d) => api.post("/api/auth/register", d),
  refresh: () => api.post("/api/auth/refresh"),
  logout: () => api.post("/api/auth/logout"),
};
export const cardApi = {
  list: (p = {}) => api.get("/api/cards", { params: p }),
  get: (id) => api.get(`/api/cards/${id}`),
  all: () => api.get("/api/cards/admin/all"),
  create: (d) => api.post("/api/cards/admin", d),
  update: (id, d) => api.put(`/api/cards/admin/${id}`, d),
  status: (id, status) =>
    api.put(`/api/cards/admin/${id}/status`, null, { params: { status } }),
  remove: (id) => api.delete(`/api/cards/admin/${id}`),
};
export const categoryApi = {
  list: () => api.get("/api/categories"),
  all: () => api.get("/api/categories/admin/all"),
  create: (d) => api.post("/api/categories/admin", d),
  update: (id, d) => api.put(`/api/categories/admin/${id}`, d),
  activate: (id) => api.put(`/api/categories/admin/${id}/activate`),
  deactivate: (id) => api.put(`/api/categories/admin/${id}/deactivate`),
  remove: (id) => api.delete(`/api/categories/admin/${id}`),
};
export const cartApi = {
  get: () => api.get("/api/cart"),
  add: (d) => api.post("/api/cart/add", d),
  update: (id, d) => api.put(`/api/cart/item/${id}`, d),
  increase: (id) => api.put(`/api/cart/item/${id}/increase`),
  decrease: (id) => api.put(`/api/cart/item/${id}/decrease`),
  remove: (id) => api.delete(`/api/cart/item/${id}`),
  clear: () => api.delete("/api/cart/clear"),
};
export const orderApi = {
  create: (d) => api.post("/api/orders", d),
  mine: () => api.get("/api/orders/my"),
  mineOne: (id) => api.get(`/api/orders/my/${id}`),
  all: () => api.get("/api/orders/admin/all"),
  one: (id) => api.get(`/api/orders/admin/${id}`),
  status: (id, status, remarks) =>
    api.put(`/api/orders/admin/${id}/status`, null, {
      params: { status, remarks },
    }),
  fulfill: (id, d) => api.post(`/api/orders/admin/${id}/fulfill`, d),
};
export const paymentApi = {
  create: (orderId) => api.post(`/api/payments/order/${orderId}`),
  get: (orderId) => api.get(`/api/payments/order/${orderId}`),
  submit: (orderId, d) =>
    api.post(`/api/payments/order/${orderId}/submit`, d, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  all: () => api.get("/api/payments/admin/all"),
  submitted: () => api.get("/api/payments/admin/submitted"),
  one: (id) => api.get(`/api/payments/admin/${id}`),
  verify: (id, d) => api.post(`/api/payments/admin/${id}/verify`, d),
};
export const userApi = {
  profile: () => api.get("/api/user/profile"),
  update: (d) => api.put("/api/user/profile", d),
  password: (d) => api.put("/api/user/change-password", d),
  deactivate: () => api.delete("/api/user/account"),
};
export const adminApi = {
  users: () => api.get("/api/admin/users"),
  customers: () => api.get("/api/admin/users/customers"),
  user: (id) => api.get(`/api/admin/users/${id}`),
  block: (id) => api.put(`/api/admin/users/${id}/block`),
  activate: (id) => api.put(`/api/admin/users/${id}/activate`),
  remove: (id) => api.delete(`/api/admin/users/${id}`),
  role: (id, role) =>
    api.put(`/api/admin/users/${id}/role`, null, { params: { role } }),
};
