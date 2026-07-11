"use client";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 text-6xl">📡</div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--heading)" }}>
          You&apos;re offline
        </h1>
        <p className="text-lg mb-6" style={{ color: "var(--muted-foreground)" }}>
          It looks like you&apos;ve lost your internet connection. Some content may still be available from your cache.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-lg font-medium text-accent-foreground transition-colors"
          style={{ backgroundColor: "var(--accent)" }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-hover)")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "var(--accent)")}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
