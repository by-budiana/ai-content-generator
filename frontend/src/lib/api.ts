import ky from "ky";

export const api = ky.create({
  prefix:
    "http://ip.atlantic-server.com:60599/api/",
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = localStorage.getItem("token");
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
  },
});
