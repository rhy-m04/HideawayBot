export function VettingCheck() {
  return (
    <div className="min-h-screen flex items-start justify-center p-6" style={{ background: "#313338" }}>
      <div style={{ width: 520, fontFamily: "'gg sans', 'Noto Sans', Whitney, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif" }}>
        <div style={{ color: "#949ba4", fontSize: 12, marginBottom: 8, paddingLeft: 4 }}>
          #vetting · <span style={{ color: "#80848e" }}>Today at 09:15</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #5865F2, #4752C4)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
          }}>🛡️</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ color: "#f2f3f5", fontWeight: 500, fontSize: 15 }}>TitanBot</span>
              <span style={{ background: "#5865F2", color: "white", fontSize: 10, fontWeight: 600, padding: "1px 4px", borderRadius: 3 }}>APP</span>
              <span style={{ color: "#949ba4", fontSize: 12 }}>Today at 09:15</span>
            </div>
            <div style={{ background: "#2b2d31", borderLeft: "4px solid #5865F2", borderRadius: "0 4px 4px 0", padding: "12px 16px", maxWidth: 490 }}>
              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#5865F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>🛡</div>
                <span style={{ color: "#b5bac1", fontSize: 12, fontWeight: 500 }}>Hideaway Moderation Team</span>
              </div>

              {/* Title */}
              <div style={{ color: "#f2f3f5", fontWeight: 600, fontSize: 15, marginBottom: 8 }}>
                Level 2 Vetting Check
              </div>

              {/* Blockquote description */}
              <div style={{ borderLeft: "3px solid #4e5058", paddingLeft: 10, marginBottom: 10 }}>
                <div style={{ color: "#dbdee1", fontSize: 13, lineHeight: 1.6 }}>
                  <div>Vetting Level: <span style={{ fontWeight: 600 }}>Level 2 — Community</span></div>
                  <div>Authorisation: <span style={{ color: "#5865F2" }}>@Sr_Moderator</span> — <span style={{ color: "#949ba4" }}>271828182845904523</span></div>
                  <div>Reason: <span style={{ color: "#dbdee1" }}>Requested after 30-day activity review and vouches from 3 members.</span></div>
                </div>
              </div>

              {/* Inline fields row 1 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px 12px", marginBottom: 8 }}>
                <FieldInline label="Member Information" value={<><span style={{ color: "#5865F2" }}>@NewMember</span><br /><span style={{ color: "#949ba4", fontSize: 11 }}>👤 314159265358979323</span></>} />
                <FieldInline label="Server Join Date" value={<><span style={{ color: "#dbdee1" }}>📅 Jan 15, 2026</span><br /><span style={{ color: "#949ba4", fontSize: 11 }}>161 days ago</span></>} />
                <FieldInline label="Account Creation" value={<><span style={{ color: "#dbdee1" }}>📅 Mar 22, 2023</span><br /><span style={{ color: "#949ba4", fontSize: 11 }}>3 yrs ago</span></>} />
              </div>

              {/* Sanctions */}
              <FieldFull label="⚠️ Active Moderation Sanctions">
                <div style={{ background: "#1e1f22", borderRadius: 4, padding: "6px 8px", fontSize: 12 }}>
                  <div style={{ color: "#faa81a", marginBottom: 2 }}>• <span style={{ color: "#dbdee1" }}>Warn #001</span> — <span style={{ color: "#949ba4" }}>Spam in #general</span> · expires <span style={{ color: "#5865F2" }}>&lt;t:1751234567:R&gt;</span></div>
                  <div style={{ color: "#949ba4", fontStyle: "italic" }}>• No active bans or mutes</div>
                </div>
              </FieldFull>

              {/* Rank History */}
              <FieldFull label="🥇 Rank History">
                <div style={{ background: "#1e1f22", borderRadius: 4, padding: "6px 8px", fontSize: 12 }}>
                  <div style={{ color: "#57f287", marginBottom: 2 }}>➕ <span style={{ color: "#dbdee1" }}>Community Member</span> added by <span style={{ color: "#5865F2" }}>@Mod_Alpha</span> · <span style={{ color: "#949ba4" }}>Mar 1, 2026</span></div>
                  <div style={{ color: "#57f287" }}>➕ <span style={{ color: "#dbdee1" }}>Level 1 Verified</span> added by <span style={{ color: "#5865F2" }}>@Mod_Beta</span> · <span style={{ color: "#949ba4" }}>Feb 10, 2026</span></div>
                </div>
              </FieldFull>

              {/* Google Groups */}
              <FieldFull label="📋 Google Groups">
                <div style={{ background: "#1e1f22", borderRadius: 4, padding: "6px 8px", fontSize: 12 }}>
                  <div style={{ color: "#dbdee1", marginBottom: 2 }}>Linked: <span style={{ color: "#57f287" }}>✅</span> <span style={{ color: "#00a8fc" }}>member@gmail.com</span></div>
                  <div style={{ color: "#dbdee1", marginBottom: 2 }}>community-announcements@hideaway.gg <span style={{ color: "#57f287" }}>✅</span></div>
                  <div style={{ color: "#dbdee1" }}>level2-resources@hideaway.gg <span style={{ color: "#ed4245" }}>❌</span></div>
                </div>
              </FieldFull>

              {/* Internal Notes */}
              <FieldFull label="🗒️ Internal Notes">
                <div style={{ background: "#1e1f22", borderRadius: 4, padding: "6px 8px", fontSize: 12 }}>
                  <div style={{ color: "#dbdee1" }}><span style={{ color: "#5865F2" }}>@Sr_Moderator</span> <span style={{ color: "#949ba4" }}>(Jun 1, 2026):</span> Good standing, active in events. Recommend approval.</div>
                </div>
              </FieldFull>

              <div style={{ borderTop: "1px solid #3f4147", margin: "10px 0" }} />
              <div style={{ color: "#949ba4", fontSize: 11 }}>Vetting ID: LEV//USR//0023//314159265358979323</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldInline({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div style={{ color: "#b5bac1", fontSize: 11, fontWeight: 600, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
      <div style={{ color: "#dbdee1", fontSize: 13 }}>{value}</div>
    </div>
  );
}

function FieldFull({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ color: "#b5bac1", fontSize: 11, fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
      {children}
    </div>
  );
}
