export default function Footer() {
  return (
    <footer className="mx-auto mt-10 w-full max-w-6xl rounded-2xl border border-white/15 bg-slate-900/40 px-5 py-4 text-xs text-slate-300 backdrop-blur-xl md:text-sm">
      <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
        <p>Powered by FastAPI + AI inference</p>
        <div className="flex flex-wrap items-center gap-4">
          <a
            className="text-cyan-300 transition hover:text-cyan-200"
            target="_blank"
            rel="noreferrer"
            href="http://127.0.0.1:8000/health"
          >
            API Health
          </a>
          <a
            className="text-cyan-300 transition hover:text-cyan-200"
            target="_blank"
            rel="noreferrer"
            href="https://github.com"
          >
            GitHub Repo
          </a>
        </div>
      </div>
    </footer>
  )
}
