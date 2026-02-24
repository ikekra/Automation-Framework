import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const AppLayout = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const onLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <header>
        <nav>
          <Link to="/dashboard">Dashboard</Link>{" | "}
          <Link to="/framework-builder">Framework Builder</Link>{" | "}
          <Link to="/history">History</Link>{" | "}
          <button type="button" onClick={onLogout}>
            Logout
          </button>
        </nav>
        <p>{user ? `Signed in as ${user.email}` : ""}</p>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};
