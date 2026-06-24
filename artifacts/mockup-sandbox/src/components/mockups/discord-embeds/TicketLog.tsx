export function TicketLog() {
  const events = [
    {
      color: "#2ecc71", title: "🎫 Report Ticket Opened", time: "09:00",
      fields: [
        { k: "🪪 Ticket ID", v: "1234567890-001-1", inline: true },
        { k: "🔢 Ticket Ref", v: "report-001", inline: true },
        { k: "🌐 Server", v: "1234567890", inline: false },
        { k: "👤 Opened by", v: "@Reporter at Jun 24, 2026 09:00", inline: false },
        { k: "📋 Reason", v: "`Harassment from user @Problematic in #general — screenshots attached.`", inline: false },
      ]
    },
    {
      color: "#3498db", title: "🙋 Ticket Claimed", time: "09:07",
      fields: [
        { k: "🪪 Ticket ID", v: "1234567890-001-1", inline: true },
        { k: "🔢 Ticket Ref", v: "report-001", inline: true },
        { k: "🙋 Claimed by", v: "@Sr_Moderator at Jun 24, 2026 09:07", inline: false },
      ]
    },
    {
      color: "#9b59b6", title: "🎯 Priority Updated", time: "09:10",
      fields: [
        { k: "🪪 Ticket ID", v: "1234567890-001-1", inline: true },
        { k: "🔢 Ticket Ref", v: "report-001", inline: true },
        { k: "📋 Reason", v: "`Escalated — involves banned alt account.`", inline: false },
      ]
    },
    {
      color: "#1abc9c", title: "📜 Transcript Created", time: "09:22",
      fields: [
        { k: "🪪 Ticket ID", v: "1234567890-001-1", inline: true },
        { k: "🔢 Ticket Ref", v: "report-001", inline: true },
      ]
    },
    {
      color: "#e74c3c", title: "🔓 Report Ticket Closed", time: "09:25",
      fields: [
        { k: "🪪 Ticket ID", v: "1234567890-001-1", inline: true },
        { k: "🔢 Ticket Ref", v: "report-001", inline: true },
        { k: "🕐 Closed by", v: "@Sr_Moderator at Jun 24, 2026 09:25", inline: false },
        { k: "📋 Reason", v: "`Resolved. User issued 7-day ban. Evidence archived.`", inline: false },
      ]
    },
  ];

  return (
    <div className="min-h-screen flex items-start justify-center p-6" style={{ background: "#313338" }}>
      <div style={{ width: 520, fontFamily: "'gg sans', 'Noto Sans', Whitney, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif" }}>
        <div style={{ color: "#949ba4", fontSize: 12, marginBottom: 6, paddingLeft: 4 }}>
          #ticket-log · <span style={{ color: "#80848e" }}>Today</span>
        </div>

        {events.map((evt, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ color: "#949ba4", fontSize: 11, marginBottom: 4, paddingLeft: 56 }}>
              {evt.time}
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, background: evt.color + "33", border: `2px solid ${evt.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                {evt.title.split(" ")[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ color: "#f2f3f5", fontWeight: 500, fontSize: 14 }}>TitanBot</span>
                  <span style={{ background: "#5865F2", color: "white", fontSize: 9, fontWeight: 600, padding: "1px 3px", borderRadius: 3 }}>APP</span>
                </div>
                <div style={{ background: "#2b2d31", borderLeft: `4px solid ${evt.color}`, borderRadius: "0 4px 4px 0", padding: "8px 12px", maxWidth: 440 }}>
                  <div style={{ color: "#f2f3f5", fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{evt.title}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px" }}>
                    {evt.fields.map((f, j) => (
                      <div key={j} style={{ gridColumn: f.inline ? "span 1" : "span 2" }}>
                        <div style={{ color: "#b5bac1", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 1 }}>{f.k}</div>
                        <div style={{ color: "#dbdee1", fontSize: 12 }}>
                          {f.v.startsWith("`") ? (
                            <code style={{ background: "#1e1f22", padding: "2px 5px", borderRadius: 3, fontSize: 11, color: "#dbdee1", fontFamily: "Consolas, monospace" }}>
                              {f.v.slice(1, -1)}
                            </code>
                          ) : f.v}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
