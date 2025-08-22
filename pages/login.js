import { useState } from "react";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // redirect to main page
    } catch (err) {
      setError(err.message);
    }
  };

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/"); // redirect to main page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded space-y-4 w-96">
        <h1 className="text-2xl font-bold text-white">Flowcord Login</h1>
        <input
          className="w-full p-2 rounded bg-gray-700 text-white"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-2 rounded bg-gray-700 text-white"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex space-x-2">
          <button className="bg-blue-600 px-4 py-2 rounded" onClick={login}>Login</button>
          <button className="bg-green-600 px-4 py-2 rounded" onClick={signup}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}
