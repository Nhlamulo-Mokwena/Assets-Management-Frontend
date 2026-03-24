import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string; // user id
  email: string;
  role: string;
}

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      email: username,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        data,
      );
      if (response.status === 201) {
        const token = response.data.access_token;
        localStorage.setItem("access_token", token);
        const decoded = jwtDecode<JwtPayload>(token);
        navigate(`/user-home/${decoded.sub}`);
        toast.success("Login Successful!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        toast.error(error.response?.data?.message || "Invalid Credentials!");
      }
    }
  };

  return (
    <div className="p-5 bg-slate-950 pt-5">
      <div className="text-white p-5 w-full m-auto md:w-200 shadow rounded-lg bg-slate-800">
        <h1 className="text-2xl text-center font-semibold mt-7 mb-7">
          Login Form
        </h1>
        <form onSubmit={submitForm}>
          <div className="flex flex-col mb-5">
            <label htmlFor="username" className="uppercase">
              username
            </label>
            <input
              type="email"
              name="username"
              id="username"
              value={username}
              className="p-2 border border-amber-400 rounded-lg"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-col mb-5">
            <label htmlFor="password" className="uppercase">
              password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              className="p-2 border border-amber-400 rounded-lg"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col mb-7 mt-12">
            <button
              type="submit"
              className="p-2 bg-amber-500 hover:cursor-pointer text-white rounded-lg
              hover:bg-amber-400"
            >
              LOGIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
