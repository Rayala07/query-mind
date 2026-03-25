import axios from "axios";

const auth_api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export const register = async ({ name, email, password }) => {
  try {
    const payload = {
      username: name,
      email,
      password,
    };
    const res = await auth_api.post("/api/auth/register", payload);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const login = async ({ email, password }) => {
  try {
    const payload = {
      email,
      password,
    };
    const res = await auth_api.post("/api/auth/login", payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getMe = async () => {
  try {
    const res = await auth_api.get("/api/auth/get-me");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
