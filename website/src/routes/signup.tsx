import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export const Route = createFileRoute("/signup")({
  component: SignUpPage,
});

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await register(username, password);
      setSuccess("Account created! Redirecting...");
      setTimeout(() => navigate({ to: "/login" }), 1500);
    } catch {
      setError("Username already taken");
    }
  };

  return (
    <div className="container mx-auto px-6 py-32 max-w-md">
      <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Sign Up</h1>
        {error && <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-center">{error}</div>}
        {success && <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-center">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-5 py-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/50" required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/50" required />
          <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 cursor-pointer to-purple-600 rounded-lg font-bold text-white hover:shadow-xl transition">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}