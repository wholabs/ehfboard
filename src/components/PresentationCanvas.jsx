function PresentationCanvas() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-2xl border border-white/30 bg-white/40 text-center shadow-xl backdrop-blur-xl dark:bg-slate-800/40 dark:border-slate-600/30">
      <div>
        <h3 className="text-xl font-semibold text-[#0B1E3C] dark:text-slate-100">
          Presentation Mode
        </h3>
        <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
          Phase 4 placeholder. Nanti dapat ditambahkan fitur slide navigation,
          fullscreen, dan area selection.
        </p>
      </div>
    </div>
  );
}

export default PresentationCanvas;
