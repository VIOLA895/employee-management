import api from "./api";

export const register = async (userData) => {
  return api("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const login = async (credentials) => {
  return api("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const logout = async () => {
  return api("/auth/logout", {
    method: "POST",
  });
};

export const getEmployees = async () => {
  return api("/employees");
};

