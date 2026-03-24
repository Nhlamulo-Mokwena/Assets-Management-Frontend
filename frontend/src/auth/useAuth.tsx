// hooks/useAuth.ts
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  firstname: string;
  lastname: string;
}

export const useAuth = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return { role: null, user: null };

  const decoded = jwtDecode<JwtPayload>(token);
  return { role: decoded.role, user: decoded };
};
