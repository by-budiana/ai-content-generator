import api from "@/lib/api";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const loginUser = async (
  data: LoginData
) => {
  return await api
    .post("auth/login", {
      json: data,
    })
    .json();
};

export const registerUser = async (
  data: RegisterData
) => {
  return await api
    .post("auth/register", {
      json: data,
    })
    .json();
};