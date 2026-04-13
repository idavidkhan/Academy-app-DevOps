import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Lock, User } from "lucide-react";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/admin");
    } catch (error) {
      alert("Login failed: " + error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md glass rounded-[2.5rem] p-10 shadow-2xl animate-fadeIn">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-600/20 rotate-12 group hover:rotate-0 transition-transform duration-500">
            <Lock className="w-10 h-10 text-white -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Admin <span className="text-teal-600">Portal</span></h2>
          <p className="text-slate-500 mt-2 font-medium">Secure access to TRESCOL management</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <div className="relative">
              <input
                className="input pl-14"
                type="text"
                placeholder="Manager access ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <input
                className="input pl-14"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>

          <button
            className="w-full btn-primary py-4 text-lg shadow-xl shadow-teal-600/20 flex items-center justify-center gap-3"
            type="submit"
          >
            Authenticate
            <span className="text-xl">→</span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-sm font-bold text-slate-400 hover:text-teal-600 transition-colors"
          >
            ← Back to Public Website
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
