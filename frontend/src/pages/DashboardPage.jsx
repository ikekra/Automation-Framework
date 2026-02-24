import { motion } from "framer-motion";
import { PageShell } from "../components/PageShell";
import { useAuthStore } from "../store/authStore";
import { useFrameworkStore } from "../store/frameworkStore";

export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const history = useFrameworkStore((state) => state.history);
  const deleteHistoryItem = useFrameworkStore((state) => state.deleteHistoryItem);

  const totalGenerated = history.length;
  const usageCount = history.reduce((sum, item) => sum + (item.filesCount || 0), 0);
  const recentGenerations = history.slice(0, 5);

  return (
    <PageShell
      title="Dashboard"
      subtitle="Overview of your AI automation framework generation workspace."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <motion.article
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-5"
        >
          <p className="text-sm text-slate-500">Account</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{user?.name || user?.email}</p>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="card p-5"
        >
          <p className="text-sm text-slate-500">Total Frameworks Generated</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{totalGenerated}</p>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="card p-5"
        >
          <p className="text-sm text-slate-500">Usage Count (Files Generated)</p>
          <p className="mt-2 text-2xl font-bold text-cyan-600">{usageCount}</p>
        </motion.article>
      </div>

      <section className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent Generations</h2>
          <span className="text-xs text-slate-500">Latest 5</span>
        </div>

        {recentGenerations.length === 0 ? (
          <p className="text-sm text-slate-600">No generations yet. Build your first framework from Builder.</p>
        ) : (
          <div className="space-y-3">
            {recentGenerations.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {item.language} • {item.automationTool} • {item.testRunner}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.filesCount} files • {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {item.downloadLink ? (
                      <a href={item.downloadLink} target="_blank" rel="noreferrer" className="btn-secondary">
                        Download
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => deleteHistoryItem(item.id)}
                      className="btn-secondary border-rose-200 text-rose-600 hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
};
