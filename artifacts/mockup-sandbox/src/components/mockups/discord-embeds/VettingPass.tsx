export function VettingPass() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#313338" }}>
      <div style={{ width: 520, fontFamily: "'gg sans', 'Noto Sans', Whitney, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif" }}>
        <div style={{ color: "#949ba4", fontSize: 12, marginBottom: 8, paddingLeft: 4 }}>
          #vetting-log · <span style={{ color: "#80848e" }}>Today at 10:44</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #57F287, #2d7a4b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✅</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ color: "#f2f3f5", fontWeight: 500, fontSize: 15 }}>TitanBot</span>
              <span style={{ background: "#5865F2", color: "white", fontSize: 10, fontWeight: 600, padding: "1px 4px", borderRadius: 3 }}>APP</span>
              <span style={{ color: "#949ba4", fontSize: 12 }}>Today at 10:44</span>
            </div>
            <div style={{ background: "#2b2d31", borderLeft: "4px solid #57F287", borderRadius: "0 4px 4px 0", padding: "12px 16px", maxWidth: 480 }}>
              <div style={{ color: "#f2f3f5", fontWeight: 600, fontSize: 15, marginBottom: 10 }}>
                Vetting Request – Level 2
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", marginBottom: 8 }}>
                <Field label="User" value={<><span style={{ color: "#5865F2" }}>@NewMember</span> <span style={{ color: "#949ba4", fontSize: 11 }}>314159265358979323</span></>} />
                <Field label="Vetting Standard" value="Level 2 — Community" />
                <Field label="Requesting Member" value={<span style={{ color: "#5865F2" }}>@Sr_Moderator</span>} />
                <Field label="Reason" value="30-day review, 3 vouches." />
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ color: "#b5bac1", fontSize: 11, fontWeight: 600, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>Result</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#1e1f22", borderRadius: 4, padding: "4px 10px" }}>
                  <span style={{ fontSize: 16 }}>✅</span>
                  <span style={{ color: "#57f287", fontWeight: 700, fontSize: 14 }}>PASS</span>
                </div>
              </div>

              <div style={{ background: "#1e1f22", borderRadius: 4, padding: "8px 10px", marginBottom: 10, fontSize: 13 }}>
                <div style={{ color: "#57f287", fontWeight: 600, marginBottom: 2 }}>✅ Actions Taken</div>
                <div style={{ color: "#dbdee1" }}>• Role <strong>Level 2 Verified</strong> assigned</div>
                <div style={{ color: "#dbdee1" }}>• Google Group <code style={{ background: "#2b2d31", padding: "1px 4px", borderRadius: 3, fontSize: 11 }}>level2-resources@hideaway.gg</code> enrolled</div>
                <div style={{ color: "#dbdee1" }}>• DM notification sent to member</div>
              </div>

              <div style={{ borderTop: "1px solid #3f4147", marginBottom: 8 }} />
              <div style={{ color: "#949ba4", fontSize: 11 }}>Vetting Number: LEV//USR//0023//314159265358979323</div>
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
