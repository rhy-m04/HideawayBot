export function CasesView() {
  const cases = [
    { id: "#0001", type: "Warn", reason: "Spam in #general — multiple rapid messages.", user: "@OffenderA", mod: "@Mod_Alpha", date: "Jan 5, 2026", color: "#faa81a", icon: "⚠️" },
    { id: "#0012", type: "Mute", reason: "Heated argument in #debate — 2h mute.", user: "@OffenderB", mod: "@Mod_Beta", date: "Feb 14, 2026", color: "#fee75c", icon: "🔇" },
    { id: "#0028", type: "Kick", reason: "Alt account confirmed by IP check.", user: "@OffenderC", mod: "@Mod_Alpha", date: "Mar 30, 2026", color: "#ed4245", icon: "👢" },
    { id: "#0041", type: "Ban", reason: "NSFW content posted in main channels. No prior warnings.", user: "@OffenderD", mod: "@Admin_Lead", date: "May 2, 2026", color: "#e74c3c", icon: "🔨" },
    { id: "#0042", type: "Warn", reason: "Minor rule violation - first offence.", user: "@OffenderE", mod: "@Mod_Beta", date: "Jun 20, 2026", color: "#faa81a", icon: "⚠️" },
  ];

  return (
    <div className="min-h-screen flex items-start justify-center p-6" style={{ background: "#313338" }}>
      <div style={{ width: 540, fontFamily: "'gg sans', 'Noto Sans', Whitney, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif" }}>
        <div style={{ color: "#949ba4", fontSize: 12, marginBottom: 8, paddingLeft: 4 }}>
          #mod-logs · <span style={{ color: "#80848e" }}>Today at 15:00</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #5865F2, #4752C4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📋</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ color: "#f2f3f5", fontWeight: 500, fontSize: 15 }}>TitanBot</span>
              <span style={{ background: "#5865F2", color: "white", fontSize: 10, fontWeight: 600, padding: "1px 4px", borderRadius: 3 }}>APP</span>
              <span style={{ color: "#949ba4", fontSize: 12 }}>Today at 15:00</span>
            </div>
            <div style={{ background: "#2b2d31", borderLeft: "4px solid #5865F2", borderRadius: "0 4px 4px 0", padding: "12px 16px", maxWidth: 500 }}>
              {/* Title */}
              <div style={{ color: "#f2f3f5", fontWeight: 600, fontSize: 15, marginBottom: 2 }}>
                📋 Cases — The Hideaway
              </div>
              <div style={{ color: "#949ba4", fontSize: 12, marginBottom: 12 }}>
                Showing 5 of 42 total cases · Filter: All types
              </div>

              {/* Case list */}
              {cases.map((c) => (
                <div key={c.id} style={{ background: "#1e1f22", borderRadius: 6, padding: "8px 10px", marginBottom: 8, borderLeft: `3px solid ${c.color}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13 }}>{c.icon}</span>
                      <span style={{ color: c.color, fontWeight: 700, fontSize: 13 }}>{c.type}</span>
                      <span style={{ color: "#949ba4", fontSize: 12 }}>{c.id}</span>
                    </div>
                    <span style={{ color: "#949ba4", fontSize: 11 }}>{c.date}</span>
                  </div>
                  <div style={{ color: "#dbdee1", fontSize: 12, marginBottom: 3 }}>{c.reason}</div>
                  <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
                    <span><span style={{ color: "#b5bac1" }}>User:</span> <span style={{ color: "#5865F2" }}>{c.user}</span></span>
                    <span><span style={{ color: "#b5bac1" }}>Mod:</span> <span style={{ color: "#5865F2" }}>{c.mod}</span></span>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {["◀ Prev", "Next ▶"].map((btn) => (
                    <button key={btn} style={{ background: "#4f545c", border: "none", color: "#dbdee1", padding: "5px 12px", borderRadius: 4, fontSize: 12, cursor: "pointer" }}>{btn}</button>
                  ))}
                </div>
                <span style={{ color: "#949ba4", fontSize: 11 }}>Page 1 / 9</span>
              </div>

              <div style={{ borderTop: "1px solid #3f4147", marginTop: 10, paddingTop: 8 }}>
                <span style={{ color: "#949ba4", fontSize: 11 }}>Use /case &lt;id&gt; for full details of a specific case</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
