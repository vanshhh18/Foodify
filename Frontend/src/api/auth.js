import api from "./axios";

export const getCurrentUser = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const register = async (fullName, email, password, phoneNumber, role) => {
  const response = await api.post("/auth/register", {
    full_name: fullName,
    email,
    password,
    phone_number: phoneNumber,
    role,
  });
  return response.data;
};