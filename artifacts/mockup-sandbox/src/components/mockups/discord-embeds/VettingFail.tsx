export function VettingFail() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#313338" }}>
      <div style={{ width: 520, fontFamily: "'gg sans', 'Noto Sans', Whitney, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif" }}>
        <div style={{ color: "#949ba4", fontSize: 12, marginBottom: 8, paddingLeft: 4 }}>
          #vetting-log · <span style={{ color: "#80848e" }}>Today at 11:02</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #ED4245, #8b1c1e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>❌</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ color: "#f2f3f5", fontWeight: 500, fontSize: 15 }}>TitanBot</span>
              <span style={{ background: "#5865F2", color: "white", fontSize: 10, fontWeight: 600, padding: "1px 4px", borderRadius: 3 }}>APP</span>
              <span style={{ color: "#949ba4", fontSize: 12 }}>Today at 11:02</span>
            </div>
            <div style={{ background: "#2b2d31", borderLeft: "4px solid #ED4245", borderRadius: "0 4px 4px 0", padding: "12px 16px", maxWidth: 480 }}>
              <div style={{ color: "#f2f3f5", fontWeight: 600, fontSize: 15, marginBottom: 10 }}>
                Vetting Request – Level 2
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", marginBottom: 8 }}>
                <Field label="User" value={<><span style={{ color: "#5865F2" }}>@AnotherUser</span> <span style={{ color: "#949ba4", fontSize: 11 }}>271828182845904000</span></>} />
                <Field label="Vetting Standard" value="Level 2 — Community" />
                <Field label="Requesting Member" value={<span style={{ color: "#5865F2" }}>@Moderator_X</span>} />
                <Field label="Reason" value="Insufficient activity period." />
              </div>

              <div style={{ marginBottom: 8 }}>
                <div style={{ color: "#b5bac1", fontSize: 11, fontWeight: 600, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>Result</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#1e1f22", borderRadius: 4, padding: "4px 10px" }}>
                  <span style={{ fontSize: 16 }}>❌</span>
                  <span style={{ color: "#ed4245", fontWeight: 700, fontSize: 14 }}>FAIL</span>
                </div>
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ color: "#b5bac1", fontSize: 11, fontWeight: 600, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>Fail Reason</div>
                <div style={{ background: "#1e1f22", borderRadius: 4, padding: "6px 10px", borderLeft: "3px solid #ed4245" }}>
                  <div style={{ color: "#dbdee1", fontSize: 13 }}>
                    Member has only been in the server for 12 days. Minimum requirement is 30 days of active participation. Additionally, two of the three vouch members do not meet the vouch eligibility criteria (Level 3+ required).
                  </div>
                </div>
              </div>

              <div style={{ background: "#1e1f22", borderRadius: 4, padding: "8px 10px", marginBottom: 10, fontSize: 13 }}>
                <div style={{ color: "#ed4245", fontWeight: 600, marginBottom: 2 }}>ℹ️ No Actions Taken</div>
                <div style={{ color: "#949ba4" }}>Member roles unchanged. May reapply after 30-day minimum is met.</div>
              </div>

              <div style={{ borderTop: "1px solid #3f4147", marginBottom: 8 }} />
              <div style={{ color: "#949ba4", fontSize: 11 }}>Vetting Number: LEV//USR//0024//271828182845904000</div>
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
