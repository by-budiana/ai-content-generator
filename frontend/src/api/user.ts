import api from "@/lib/api";

export type ProfileData = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  role: string;
  createdAt: string;
  stats: {
    total: number;
    caption: number;
    description: number;
    tagline: number;
  };
};

export const getProfile = async (): Promise<ProfileData> => {
  return await api.get("user/profile").json();
};

export const updateProfile = async (data: { name?: string; bio?: string }): Promise<{ success: boolean; user: ProfileData }> => {
  return await api.patch("user/profile", { json: data }).json();
};

export const changePassword = async (data: any): Promise<any> => {
  return await api.patch("user/profile/password", { json: data }).json();
};

export const uploadAvatar = async (file: File): Promise<{ success: boolean; user: ProfileData }> => {
  const formData = new FormData();
  formData.append("avatar", file);
  return await api.post("user/profile/avatar", { body: formData }).json();
};
