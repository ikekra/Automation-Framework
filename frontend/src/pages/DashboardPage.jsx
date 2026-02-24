import { useAuthStore } from "../store/authStore";

export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <section>
      <h1>Dashboard</h1>
      <p>Welcome {user?.name || user?.email}.</p>
    </section>
  );
};
