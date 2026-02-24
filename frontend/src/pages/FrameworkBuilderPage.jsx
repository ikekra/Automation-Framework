import { PageShell } from "../components/PageShell";
import { FrameworkBuilderForm } from "../features/framework/components/FrameworkBuilderForm";

export const FrameworkBuilderPage = () => {
  return (
    <PageShell
      title="Framework Builder"
      subtitle="Configure your tech stack and generate a downloadable starter framework."
    >
      <FrameworkBuilderForm />
    </PageShell>
  );
};
