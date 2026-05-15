import { useEffect, useState, useRef } from "react";
import {
  User as UserIcon,
  Mail,
  Calendar,
  Shield,
  Camera,
  Save,
  Lock,
  LogOut,
  ChevronRight,
  MessageSquare,
  FileText,
  Tag,
  BarChart3,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useAuthStore } from "@/store/authStore";
import { changePassword } from "@/api/user";

const Profile = () => {
  const { profile, loading, fetchProfile, updateUser, updateAvatar } = useUserStore();
  const { logout } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setBio(profile.bio || "");
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({ name, bio });
    setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdLoading(true);
    try {
      await changePassword(passwordData);
      setMessage({ type: "success", text: "Password berhasil diganti!" });
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Gagal mengganti password" });
    } finally {
      setPwdLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await updateAvatar(file);
      setMessage({ type: "success", text: "Foto profil berhasil diperbarui!" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading && !profile) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#020617]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const API_URL = "http://localhost:5000";

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 lg:p-8 font-sans overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Account Settings</h1>
            <p className="text-slate-400 mt-1">Manage your profile, account preferences, and security.</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-all font-medium border border-red-500/20"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl border animate-in fade-in slide-in-from-top-4 duration-300 ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: PROFILE CARD & STATS */}
          <div className="lg:col-span-1 space-y-8">
            {/* PROFILE CARD */}
            <div className="glass-card overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <div className="px-6 pb-6 relative">
                <div className="relative -mt-12 mb-4 group cursor-pointer" onClick={handleAvatarClick}>
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-slate-900 shadow-2xl relative">
                    {profile?.avatar ? (
                      <img
                        src={`${API_URL}${profile.avatar}`}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400 text-3xl font-bold">
                        {profile?.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <Camera className="text-white" size={24} />
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white">{profile?.name}</h2>
                  <p className="text-sm text-slate-400 flex items-center gap-2">
                    <Mail size={14} />
                    {profile?.email}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-800/50 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Shield size={14} />
                      Role
                    </span>
                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {profile?.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Calendar size={14} />
                      Joined
                    </span>
                    <span className="text-slate-300 font-medium">
                      {profile && new Date(profile.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* STATS CARD */}
            <div className="glass-card p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                  <BarChart3 size={20} />
                </div>
                <h3 className="font-bold text-white">Usage Statistics</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Total Chat", value: profile?.stats.total, icon: MessageSquare, color: "text-blue-400" },
                  { label: "Captions", value: profile?.stats.caption, icon: FileText, color: "text-emerald-400" },
                  { label: "Descriptions", value: profile?.stats.description, icon: FileText, color: "text-amber-400" },
                  { label: "Taglines", value: profile?.stats.tagline, icon: Tag, color: "text-purple-400" },
                ].map((stat, i) => (
                  <div key={i} className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50">
                    <stat.icon size={16} className={`${stat.color} mb-2`} />
                    <p className="text-2xl font-bold text-white">{stat.value || 0}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: EDIT FORMS */}
          <div className="lg:col-span-2 space-y-8">
            {/* EDIT PROFILE FORM */}
            <div className="glass-card p-6 lg:p-8">
              <h3 className="text-xl font-bold text-white mb-6">Profile Information</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none transition-all text-slate-100"
                        required
                      />
                    </div>
                    <div className="space-y-2 opacity-60">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile?.email}
                        disabled
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm cursor-not-allowed outline-none text-slate-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
                      Bio / About Me
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us a little bit about yourself..."
                      rows={4}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none transition-all text-slate-100 resize-none"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 px-8"
                  >
                    <Save size={18} />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>

            {/* CHANGE PASSWORD FORM */}
            <div className="glass-card p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-500/10 text-red-400 rounded-lg">
                  <Lock size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Security & Password</h3>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-red-500/50 outline-none transition-all text-slate-100"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none transition-all text-slate-100"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none transition-all text-slate-100"
                      required
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={pwdLoading}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium py-3 px-8 rounded-xl border border-slate-700 transition-all"
                  >
                    {pwdLoading ? "Updating..." : "Update Password"}
                    <ChevronRight size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
