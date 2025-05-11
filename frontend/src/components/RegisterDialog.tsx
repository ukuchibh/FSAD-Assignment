import { useState, FormEvent } from "react";
import { useRouter } from "next/router";

interface RegisterResponse {
  message?: string;
}

export default function RegisterDialog() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        },
      );

      const data: RegisterResponse = await response.json();

      if (response.ok) {
        router.push("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="p-2 bg-gray-300 rounded-lg border-2 border-black w-[300px]">
      <h1 className="my-4 text-2xl font-bold text-center select-none">
        Register
      </h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form className="flex flex-col gap-y-2 p-2" onSubmit={handleSubmit}>
        <label className="text-sm font-bold select-none">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 rounded-md bg-slate-100"
          required
        />
        <label className="text-sm font-bold select-none">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
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
          required
        />
        <button className="p-2 mt-4 text-black bg-violet-300 rounded-lg border-2 border-black transition-all cursor-pointer hover:text-white hover:bg-violet-500">
          Sign Up!
        </button>
      </form>
    </div>
  );
}
