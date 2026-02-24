import { AuthForm } from "../features/auth/components/AuthForm";

export const LoginPage = () => {
  return (
    <section>
      <h1>Login</h1>
      <AuthForm mode="login" />
    </section>
  );
};
