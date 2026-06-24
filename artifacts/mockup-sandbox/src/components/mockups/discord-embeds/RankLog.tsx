export function RankLog() {
  return (
    <div className="min-h-screen flex items-start justify-center p-6" style={{ background: "#313338" }}>
      <div style={{ width: 520, fontFamily: "'gg sans', 'Noto Sans', Whitney, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif" }}>
        <div style={{ color: "#949ba4", fontSize: 12, marginBottom: 8, paddingLeft: 4 }}>
          #rank-log · <span style={{ color: "#80848e" }}>Today at 13:20</span>
        </div>

        {/* ADDITION embed */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #57F287, #2d7a4b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎖️</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ color: "#f2f3f5", fontWeight: 500, fontSize: 15 }}>TitanBot</span>
              <span style={{ background: "#5865F2", color: "white", fontSize: 10, fontWeight: 600, padding: "1px 4px", borderRadius: 3 }}>APP</span>
              <span style={{ color: "#949ba4", fontSize: 12 }}>Today at 13:20</span>
            </div>
            <div style={{ background: "#2b2d31", borderLeft: "4px solid #57F287", borderRadius: "0 4px 4px 0", padding: "12px 16px", maxWidth: 480 }}>
              <div style={{ color: "#f2f3f5", fontWeight: 600, fontSize: 15, marginBottom: 10 }}>
                Rank Changed — Addition
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px 12px", marginBottom: 8 }}>
                <Field label="👤 User" value={<>CoolMember<br /><span style={{ color: "#949ba4", fontSize: 11 }}>314159265358979323</span></>} />
                <Field label="🎖️ Role Added" value={<span style={{ color: "#57f287", fontWeight: 600 }}>Level 2 Verified</span>} />
                <Field label="🛡️ Issued By" value={<>Sr_Moderator<br /><span style={{ color: "#949ba4", fontSize: 11 }}>→ mod_sr</span></>} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", marginBottom: 8 }}>
                <Field label="🗑️ Roles Removed" value={<span style={{ color: "#faa81a" }}>Level 1 Verified</span>} />
                <Field label="📋 Reason" value="Passed Level 2 vetting process." />
              </div>
              <div>
                <div style={{ color: "#b5bac1", fontSize: 11, fontWeight: 600, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>📊 Status</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#1e1f22", borderRadius: 4, padding: "3px 8px" }}>
                  <span>✅</span>
                  <span style={{ color: "#57f287", fontWeight: 600, fontSize: 13 }}>SUCCESS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REMOVAL embed */}
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #FEE75C, #b8a000)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🔴</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ color: "#f2f3f5", fontWeight: 500, fontSize: 15 }}>TitanBot</span>
              <span style={{ background: "#5865F2", color: "white", fontSize: 10, fontWeight: 600, padding: "1px 4px", borderRadius: 3 }}>APP</span>
              <span style={{ color: "#949ba4", fontSize: 12 }}>Today at 13:45</span>
            </div>
            <div style={{ background: "#2b2d31", borderLeft: "4px solid #FEE75C", borderRadius: "0 4px 4px 0", padding: "12px 16px", maxWidth: 480 }}>
              <div style={{ color: "#f2f3f5", fontWeight: 600, fontSize: 15, marginBottom: 10 }}>
                🔴 Rank Changed — Removal
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px 12px", marginBottom: 8 }}>
                <Field label="👤 User" value={<>ProblematicUser<br /><span style={{ color: "#949ba4", fontSize: 11 }}>271828182845904000</span></>} />
                <Field label="🎖️ Role Removed" value={<span style={{ color: "#ed4245", fontWeight: 600 }}>Level 2 Verified</span>} />
                <Field label="🛡️ Issued By" value={<>Admin_Lead<br /><span style={{ color: "#949ba4", fontSize: 11 }}>→ admin_lead</span></>} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", marginBottom: 8 }}>
                <Field label="✅ Authorisation" value="Council vote #2026-06-24" />
                <Field label="📋 Reason" value="Repeated conduct violations in Level 2 channels." />
              </div>
              <div>
                <div style={{ color: "#b5bac1", fontSize: 11, fontWeight: 600, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>📊 Status</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#1e1f22", borderRadius: 4, padding: "3px 8px" }}>
                  <span>✅</span>
                  <span style={{ color: "#57f287", fontWeight: 600, fontSize: 13 }}>SUCCESS</span>
                </div>
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
