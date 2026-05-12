import { Link } from "react-router-dom";
import { PageShell } from "../components/PageShell";
import { FrameworkBuilderForm } from "../features/framework/components/FrameworkBuilderForm";

export const FrameworkBuilderPage = () => {
  return (
    <PageShell
      title="Framework Builder"
      subtitle="Configure your stack, generate a starter framework, and save the result directly to your account history."
      eyebrow="Studio"
      action={(
        <Link to="/history" className="btn-secondary">
          Open history
        </Link>
      )}
    >
      <FrameworkBuilderForm />
    </PageShell>
  );
};
