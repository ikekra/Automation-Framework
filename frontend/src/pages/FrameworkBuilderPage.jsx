import { Link } from "react-router-dom";
import { PageShell } from "../components/PageShell";
import { FrameworkBuilderForm } from "../features/framework/components/FrameworkBuilderForm";

export const FrameworkBuilderPage = () => {
  return (
    <PageShell
      title="Framework Builder"
      subtitle="Configure your tech stack and generate a downloadable starter framework."
      action={(
        <Link to="/history" className="btn-secondary">
          View history
        </Link>
      )}
    >
      <FrameworkBuilderForm />
    </PageShell>
  );
};
