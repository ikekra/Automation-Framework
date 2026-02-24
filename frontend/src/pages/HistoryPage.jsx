import { motion } from "framer-motion";
import { PageShell } from "../components/PageShell";
import { useFrameworkStore } from "../store/frameworkStore";

export const HistoryPage = () => {
  const history = useFrameworkStore((state) => state.history);
  const deleteHistoryItem = useFrameworkStore((state) => state.deleteHistoryItem);

  return (
    <PageShell
      title="History"
      subtitle="Track all framework generations and access download links."
    >
      {history.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-sm text-slate-600">No generations yet. Create your first framework from Builder.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {item.language} • {item.automationTool} • {item.testRunner}
                </p>
                <p className="text-xs text-slate-500">
                  {item.filesCount} files • {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>

              {item.downloadLink ? (
                <a href={item.downloadLink} target="_blank" rel="noreferrer" className="btn-secondary">
                  Download ZIP
                </a>
              ) : null}
              <button
                type="button"
                onClick={() => deleteHistoryItem(item.id)}
                className="btn-secondary border-rose-200 text-rose-600 hover:bg-rose-50"
              >
                Delete
              </button>
            </motion.article>
          ))}
        </div>
      )}
    </PageShell>
  );
};
