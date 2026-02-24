import { useFrameworkStore } from "../store/frameworkStore";

export const HistoryPage = () => {
  const history = useFrameworkStore((state) => state.history);

  return (
    <section>
      <h1>History</h1>
      {history.length === 0 ? <p>No generations yet.</p> : null}
      <ul>
        {history.map((item) => (
          <li key={item.id}>
            <p>{item.language} / {item.automationTool} / {item.testRunner}</p>
            <p>Files: {item.filesCount} | Generated: {new Date(item.createdAt).toLocaleString()}</p>
            {item.downloadLink ? (
              <a href={item.downloadLink} target="_blank" rel="noreferrer">
                Download ZIP
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
};
