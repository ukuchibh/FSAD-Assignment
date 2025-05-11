import { useState, FormEvent } from "react";
import { useRouter } from "next/router";

interface LoginResponse {
  token?: string;
  message?: string;
}

export default function LoginDialog() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("authToken", data.token);
        router.push("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="p-2 bg-gray-300 rounded-lg border-2 border-black w-[300px]">
      <h1 className="my-4 text-2xl font-bold text-center select-none">Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form className="flex flex-col gap-y-2 p-2" onSubmit={handleSubmit}>
        <label className="text-sm font-bold select-none">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded-md bg-slate-100"
          required
        />
        <label className="mt-2 text-sm font-bold select-none">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded-md bg-slate-100"
        />
        <button className="p-2 mt-4 text-black bg-violet-300 rounded-lg border-2 border-black transition-all cursor-pointer hover:text-white hover:bg-violet-500">
          Log In!
        </button>
      </form>
    </div>
  );
}
