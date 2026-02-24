import { AuthForm } from "../features/auth/components/AuthForm";

export const RegisterPage = () => {
  return (
    <section>
      <h1>Register</h1>
      <AuthForm mode="register" />
    </section>
  );
};
