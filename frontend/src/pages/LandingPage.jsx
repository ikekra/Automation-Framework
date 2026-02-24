import { Link } from "react-router-dom";

export const LandingPage = () => {
  return (
    <section>
      <h1>AutoForge AI</h1>
      <p>Generate production-ready automation framework blueprints.</p>
      <div>
        <Link to="/login">Login</Link>{" | "}
        <Link to="/register">Register</Link>
      </div>
    </section>
  );
};
