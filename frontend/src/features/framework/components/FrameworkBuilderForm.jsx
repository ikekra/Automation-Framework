import { useState } from "react";
import { frameworkService } from "../../../services/api/frameworkService";
import { useFrameworkStore } from "../../../store/frameworkStore";

const initialState = {
  language: "TypeScript",
  automationTool: "Playwright",
  pattern: "Page Object Model",
  testRunner: "Playwright Test",
  cicd: "GitHub Actions",
  dockerSupport: true
};

export const FrameworkBuilderForm = () => {
  const [form, setForm] = useState(initialState);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const addHistoryItem = useFrameworkStore((state) => state.addHistoryItem);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await frameworkService.generate(form);
      setResponse(data);

      addHistoryItem({
        id: data.id,
        language: form.language,
        automationTool: form.automationTool,
        testRunner: form.testRunner,
        filesCount: data.files?.length || 0,
        downloadLink: data.download?.link || "",
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to generate framework");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="language">Language</label>
        <input
          id="language"
          value={form.language}
          onChange={(event) => onChange("language", event.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="automationTool">Automation Tool</label>
        <input
          id="automationTool"
          value={form.automationTool}
          onChange={(event) => onChange("automationTool", event.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="pattern">Pattern</label>
        <input
          id="pattern"
          value={form.pattern}
          onChange={(event) => onChange("pattern", event.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="testRunner">Test Runner</label>
        <input
          id="testRunner"
          value={form.testRunner}
          onChange={(event) => onChange("testRunner", event.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="cicd">CI/CD</label>
        <input
          id="cicd"
          value={form.cicd}
          onChange={(event) => onChange("cicd", event.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="dockerSupport">Docker Support</label>
        <input
          id="dockerSupport"
          type="checkbox"
          checked={form.dockerSupport}
          onChange={(event) => onChange("dockerSupport", event.target.checked)}
        />
      </div>

      {error ? <p>{error}</p> : null}

      <button type="submit" disabled={loading}>
        {loading ? "Generating..." : "Generate Framework"}
      </button>

      {response ? (
        <section>
          <h2>Generated Output</h2>
          <p>Folders: {response.folderStructure?.length || 0}</p>
          <p>Files: {response.files?.length || 0}</p>
          {response.download?.link ? (
            <a href={response.download.link} target="_blank" rel="noreferrer">
              Download ZIP
            </a>
          ) : null}
        </section>
      ) : null}
    </form>
  );
};
