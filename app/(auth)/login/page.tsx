"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("learner");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials. Please try again.");
      } else {
        router.push(data.role === "admin" ? "/admin" : "/learn");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-apollo-dark to-apollo flex flex-col items-center justify-center p-8 md:p-12 text-white">
        <div className="max-w-md w-full space-y-6">
          <div className="flex items-center gap-2 mb-8">
            <span className="font-outfit font-bold text-4xl">apollo</span>
            <span className="font-outfit font-light text-4xl opacity-80">tyres</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-outfit font-bold leading-tight">
            Your Growth,<br />Our Drive.
          </h1>
          <p className="text-lg opacity-80 font-sans">
            Welcome to the Apollo Tyres corporate learning platform.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 bg-surface">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-3xl font-outfit font-bold text-text-primary">
              Sign in to your account
            </h2>
            <p className="mt-2 text-text-secondary">
              Enter your credentials to access the platform
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-text-primary">Account Role</Label>
              <div className="flex p-1.5 bg-surface-secondary border border-gray-200 rounded-xl">
                <button
                  type="button"
                  onClick={() => setUsername("admin")}
                  className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    username === "admin"
                      ? "bg-apollo text-white shadow-md ring-1 ring-black/5"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/60"
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setUsername("learner")}
                  className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    username === "learner"
                      ? "bg-apollo text-white shadow-md ring-1 ring-black/5"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/60"
                  }`}
                >
                  Learner
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-text-primary">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pr-10 border-gray-200 bg-white text-text-primary focus-visible:ring-apollo"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-apollo hover:bg-apollo-dark text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          

        </div>
      </div>
    </div>
  );
}
