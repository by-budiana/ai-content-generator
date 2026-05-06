import ky from "ky";

const API_URL = "http://localhost:5000/api";

export const api = ky.create({
  prefix: API_URL,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = localStorage.getItem("token");
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async ({ response }) => {
        if (response.status === 401) {
          localStorage.removeItem("token");
        }
      },
    ],
  },
});
