import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

const RegisterPage = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [department, setDepartment] = useState("");

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    const data = {
      firstName: firstname, // camelCase to match backend
      lastName: lastname, // camelCase to match backend
      email: email,
      password: password,
      role: role,
      department: department,
    };

    try {
      const res = await axios.post("http://localhost:3000/users", data);
      if (res.status === 200 || res.status === 201) {
        setFirstname("");
        setLastname("");
        setEmail("");
        setPassword("");
        setRole("employee");
        setDepartment("");
        toast.success("User successfully registered!");
      }
    } catch (error) {
      console.log(error);
      toast.error("failed to register user!");
    }
  };

  return (
    <div className="p-5 bg-slate-950 pt-20">
      <div className="w-full text-white shadow bg-slate-800 rounded-lg m-auto p-5 md:w-200">
        <h1 className="text-center uppercase text-amber-400 mt-10 mb-10 text-2xl">
          Register User
        </h1>
        <form onSubmit={submitForm}>
          <section className="grid gap-5 grid-cols-2">
            <div className="flex flex-col mb-4">
              <label htmlFor="firstname">FIRSTNAME</label>
              <input
                type="text"
                name="firstname"
                id="firstane"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="Enter Firstname"
                className="p-2 border border-amber-400 rounded-lg"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="lastname">LASTNAME</label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Enter Lastname"
                className="p-2 border border-amber-400 rounded-lg"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="email">EMAIL</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border border-amber-400 rounded-lg"
                placeholder="Enter Email"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="password">PASSWORD</label>
              <input
                type="password"
                name="password"
                id="password"
                className="p-2 border border-amber-400 rounded-lg"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="role">ROLE</label>
              <select
                name="role"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-10 border border-amber-400 rounded-lg"
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="department">DEPARTMENT</label>
              <input
                type="text"
                name="department"
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="h-10 border border-amber-400 rounded-lg"
                placeholder="Enter department"
              />
            </div>
          </section>
          <div className="flex flex-col mt-10 mb-5">
            <button
              type="submit"
              className="p-2 text-center bg-amber-400 shadow rounded-lg
               hover:cursor-pointer hover:bg-amber-500"
            >
              REGISTER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
