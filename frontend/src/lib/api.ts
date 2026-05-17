import ky from "ky";

const api = ky.create({
  prefixUrl:
    import.meta.env.VITE_API_URL || "http://localhost:5000/api",

  credentials: "include",

  hooks: {
    beforeRequest: [
      (request) => {
        const token =
          localStorage.getItem(
            "token"
          );

        if (token) {
          request.headers.set(
            "Authorization",
            `Bearer ${token}`
          );
        }
      },
    ],

    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          localStorage.removeItem(
            "token"
          );

          window.location.href =
            "/login";
        }
      },
    ],
  },
});

export default api;