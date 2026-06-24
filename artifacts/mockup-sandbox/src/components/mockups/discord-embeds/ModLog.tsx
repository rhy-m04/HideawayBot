export function ModLog() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#313338" }}>
      <div style={{ width: 520, fontFamily: "'gg sans', 'Noto Sans', Whitney, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif" }}>
        {/* Channel context */}
        <div style={{ color: "#949ba4", fontSize: 12, marginBottom: 8, paddingLeft: 4 }}>
          #mod-logs · <span style={{ color: "#80848e" }}>Today at 14:32</span>
        </div>

        {/* Webhook message */}
        <div style={{ display: "flex", gap: 16 }}>
          {/* Bot avatar */}
          <div style={{
            width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #5865F2, #4752C4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18
          }}>🛡️</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Username + bot badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ color: "#f2f3f5", fontWeight: 500, fontSize: 15 }}>TitanBot</span>
              <span style={{
                background: "#5865F2", color: "white", fontSize: 10, fontWeight: 600,
                padding: "1px 4px", borderRadius: 3, letterSpacing: 0.3
              }}>APP</span>
              <span style={{ color: "#949ba4", fontSize: 12 }}>Today at 14:32</span>
            </div>

            {/* Embed */}
            <div style={{
              background: "#2b2d31",
              borderLeft: "4px solid #e74c3c",
              borderRadius: "0 4px 4px 0",
              padding: "12px 16px",
              maxWidth: 480
            }}>
              {/* Title */}
              <div style={{ color: "#f2f3f5", fontWeight: 600, fontSize: 15, marginBottom: 8 }}>
                Moderation Action
              </div>

              {/* Fields grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", marginBottom: 8 }}>
                <Field label="User" value={<><span style={{ color: "#5865F2" }}>@ShadyUser</span><br /><span style={{ color: "#949ba4", fontSize: 11 }}>314159265358979323</span></>} />
                <Field label="Moderator" value={<><span style={{ color: "#5865F2" }}>@Titan_Mod</span><br /><span style={{ color: "#949ba4", fontSize: 11 }}>271828182845904523</span></>} />
                <Field label="Action" value={<span style={{ color: "#ed4245", fontWeight: 600 }}>🔨 Ban</span>} />
                <Field label="Duration" value="Permanent" />
              </div>

              {/* Reason - full width */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ color: "#b5bac1", fontSize: 11, fontWeight: 600, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>Reason</div>
                <div style={{ color: "#dbdee1", fontSize: 13 }}>
                  Repeated violations of community guidelines after multiple warnings. Harassment of members in DMs.
                </div>
              </div>

              {/* Evidence */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ color: "#b5bac1", fontSize: 11, fontWeight: 600, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>Evidence</div>
                <div style={{ color: "#00a8fc", fontSize: 13, textDecoration: "underline", cursor: "pointer" }}>
                  #mod-evidence › Screenshot 2026-06-24
                </div>
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px solid #3f4147", marginBottom: 10 }} />

              {/* Footer */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ color: "#949ba4", fontSize: 11 }}>Case ID: #0042</span>
                <span style={{ color: "#949ba4", fontSize: 11 }}>June 24, 2026 at 14:32</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div style={{ color: "#b5bac1", fontSize: 11, fontWeight: 600, marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
      <div style={{ color: "#dbdee1", fontSize: 13 }}>{value}</div>
    </div>
  );
}
