import { useState, useRef, useEffect } from "react";

const SUPA_URL = "https://iepbehbcbaoeilzfwfjz.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllcGJlaGJjYmFvZWlsemZ3Zmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NzE4OTUsImV4cCI6MjA5MTE0Nzg5NX0._y8dThFzHZ9OIvsx31lQNTSSu91TNpKMa6G0-_3ZKmo";

const db = async (path, method = "GET", body) => {
  const headers = {
    apikey: SUPA_KEY,
    Authorization: `Bearer ${SUPA_KEY}`,
    "Content-Type": "application/json",
  };
  if (method === "POST") headers["Prefer"] = "return=representation";
  const res = await fetch(`${SUPA_URL}/rest/v1/${path}`, {
    method, headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status}: ${text}`);
  try { return JSON.parse(text); } catch { return text; }
};

const C = {
  bg: "#0d0f0f", surface: "#161918", surfaceHigh: "#1e2220",
  border: "#2a2f2c", borderHi: "#3a4238",
  lime: "#a8e63d", limeDim: "#1a2608", limeText: "#c6f56a",
  danger: "#ff5252", dangerDim: "#2e0e0e",
  amber: "#f5a623", amberDim: "#2e1f00", amberText: "#ffc85e",
  blue: "#4f9fff", blueDim: "#0d1e3a", blueText: "#89c4ff",
  text: "#f4f6f2", muted: "#6b7a68", mono: "'Courier New', monospace",
};

const s = {
  page: { background: C.bg, minHeight: "100vh", fontFamily: "system-ui,-apple-system,sans-serif", color: C.text },
  card: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px", marginBottom: 12 },
  label: { fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", color: C.muted, textTransform: "uppercase", marginBottom: 6, display: "block" },
  inp: { width: "100%", boxSizing: "border-box", background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: 10, padding: "13px 14px", fontSize: 16, color: C.text, outline: "none", fontFamily: "system-ui,sans-serif" },
  inpSm: { background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 13px", fontSize: 14, color: C.text, outline: "none", fontFamily: "system-ui,sans-serif" },
  btnLime: { width: "100%", padding: "15px", borderRadius: 12, border: "none", background: C.lime, color: "#0d1a02", fontSize: 16, fontWeight: 800, cursor: "pointer" },
  btnLimeSm: { padding: "10px 20px", borderRadius: 10, border: "none", background: C.lime, color: "#0d1a02", fontSize: 13, fontWeight: 800, cursor: "pointer" },
  btnBlue: { padding: "10px 20px", borderRadius: 10, background: C.blueDim, color: C.blueText, fontSize: 13, fontWeight: 800, cursor: "pointer", border: `1px solid ${C.blue}` },
  btnGhost: { padding: "8px 16px", borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  pill: (bg, color) => ({ background: bg, color, borderRadius: 20, padding: "4px 11px", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", display: "inline-block", whiteSpace: "nowrap" }),
  tab: (a) => ({ padding: "10px 20px", border: "none", background: "transparent", color: a ? C.text : C.muted, fontSize: 14, fontWeight: a ? 700 : 500, cursor: "pointer", borderBottom: a ? `2px solid ${C.lime}` : "2px solid transparent" }),
};

function Logo({ sub = "Logbook Scanner" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <svg width="34" height="34" viewBox="0 0 38 38" fill="none">
        <rect width="38" height="38" rx="8" fill="#0d0f0f"/>
        <line x1="4" y1="34" x2="14" y2="6" stroke="#a8e63d" strokeWidth="3.2" strokeLinecap="round"/>
        <line x1="34" y1="34" x2="24" y2="6" stroke="#a8e63d" strokeWidth="3.2" strokeLinecap="round"/>
        <line x1="10" y1="34" x2="17.5" y2="13" stroke="#a8e63d" strokeWidth="3.2" strokeLinecap="round"/>
        <line x1="28" y1="34" x2="20.5" y2="13" stroke="#a8e63d" strokeWidth="3.2" strokeLinecap="round"/>
        <line x1="16" y1="34" x2="19" y2="22" stroke="#a8e63d" strokeWidth="3.2" strokeLinecap="round"/>
        <line x1="22" y1="34" x2="19" y2="22" stroke="#a8e63d" strokeWidth="3.2" strokeLinecap="round"/>
      </svg>
      <div>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.text, letterSpacing: "0.05em", lineHeight: 1.2 }}>MURPHY TOWER</div>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.lime, letterSpacing: "0.12em", lineHeight: 1.3, textTransform: "uppercase" }}>{sub}</div>
      </div>
    </div>
  );
}

function PullTable({ items }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
      <thead>
        <tr style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          <td style={{ padding: "0 0 10px" }}>Part #</td>
          <td style={{ padding: "0 0 10px" }}>Description</td>
          <td style={{ padding: "0 0 10px", textAlign: "right" }}>Qty</td>
        </tr>
      </thead>
      <tbody>
        {items.map((item, i) => (
          <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
            <td style={{ padding: "10px 0", fontFamily: C.mono, fontWeight: 700, color: C.limeText, fontSize: 13 }}>{item.bin}</td>
            <td style={{ padding: "10px 8px", color: C.muted }}>{item.desc}</td>
            <td style={{ padding: "10px 0", textAlign: "right", fontWeight: 800 }}>{item.qty}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr style={{ borderTop: `2px solid ${C.border}` }}>
          <td colSpan={2} style={{ padding: "10px 0", fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Units</td>
          <td style={{ padding: "10px 0", textAlign: "right", fontWeight: 800, color: C.lime, fontSize: 16 }}>{items.reduce((a, i) => a + i.qty, 0)}</td>
        </tr>
      </tfoot>
    </table>
  );
}

// ─── QR SCANNER ──────────────────────────────────────────────────────────────
function QRScanner({ onScan, onClose }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const animRef = useRef();
  const [status, setStatus] = useState("Starting camera...");
  const [error, setError] = useState(null);
  const [jsQRLoaded, setJsQRLoaded] = useState(false);

  useEffect(() => {
    if (window.jsQR) { setJsQRLoaded(true); return; }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js";
    script.onload = () => setJsQRLoaded(true);
    script.onerror = () => setError("Failed to load QR scanner library.");
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!jsQRLoaded) return;
    let stream;
    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus("Point at a bin QR code");
        scan();
      } catch {
        setError("Camera access denied. Please allow camera permissions.");
      }
    };
    const scan = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);
        try {
          const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = window.jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" });
          if (code) {
            stream?.getTracks().forEach(t => t.stop());
            cancelAnimationFrame(animRef.current);
            onScan(code.data.trim());
            return;
          }
        } catch {}
      }
      animRef.current = requestAnimationFrame(scan);
    };
    start();
    return () => {
      stream?.getTracks().forEach(t => t.stop());
      cancelAnimationFrame(animRef.current);
    };
  }, [jsQRLoaded]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 100, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <span style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Scan Bin QR Code</span>
        <button onClick={onClose} style={{ background: C.dangerDim, border: `1px solid ${C.danger}`, borderRadius: 8, color: C.danger, padding: "6px 14px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Cancel</button>
      </div>
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {error ? (
          <div style={{ padding: 32, textAlign: "center", color: C.muted, fontSize: 15 }}>{error}</div>
        ) : (
          <>
            <video ref={videoRef} style={{ width: "100%", height: "100%", objectFit: "cover" }} playsInline muted />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <div style={{ width: 220, height: 220, position: "relative" }}>
                {[["top","left"],["bottom","left"],["top","right"],["bottom","right"]].map(([v,h], i) => (
                  <div key={i} style={{ position: "absolute", [v]: 0, [h]: 0, width: 36, height: 36, borderTop: v==="top" ? `3px solid ${C.lime}` : "none", borderBottom: v==="bottom" ? `3px solid ${C.lime}` : "none", borderLeft: h==="left" ? `3px solid ${C.lime}` : "none", borderRight: h==="right" ? `3px solid ${C.lime}` : "none" }} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <div style={{ padding: "16px 20px", background: C.surface, borderTop: `1px solid ${C.border}`, textAlign: "center", fontSize: 13, color: C.muted }}>{status}</div>
    </div>
  );
}

// ─── FIELD APP ───────────────────────────────────────────────────────────────
function FieldApp() {
  const [step, setStep] = useState("job");
  const [jobNum, setJobNum] = useState("");
  const [empName, setEmpName] = useState("");
  const [binInput, setBinInput] = useState("");
  const [qty, setQty] = useState("");
  const [desc, setDesc] = useState("");
  const [items, setItems] = useState([]);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [partNotFound, setPartNotFound] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanFlash, setScanFlash] = useState(false);
  const binRef = useRef();
  const qtyRef = useRef();

  const canStart = jobNum.trim() && empName.trim();
  const startJob = () => { if (!canStart) return; setItems([]); setStep("scan"); setTimeout(() => binRef.current?.focus(), 100); };

  const lookupPart = async (val) => {
    if (!val || val.length < 2) { setDesc(""); setPartNotFound(false); return; }
    try {
      const rows = await db(`parts?bin_id=ilike.${encodeURIComponent(val.trim())}&select=description&limit=1`);
      if (rows && rows.length > 0) { setDesc(rows[0].description); setPartNotFound(false); }
      else { setDesc(""); setPartNotFound(true); }
    } catch { setDesc(""); }
  };

  const handleScan = async (data) => {
    setScanning(false);
    setBinInput(data.toUpperCase());
    setScanFlash(true);
    setTimeout(() => setScanFlash(false), 600);
    await lookupPart(data);
    setTimeout(() => qtyRef.current?.focus(), 150);
  };

  const addItem = () => {
    if (!binInput.trim() || !qty || Number(qty) <= 0) return;
    setItems(prev => [...prev, { id: Date.now(), bin: binInput.trim().toUpperCase(), qty: Number(qty), desc: desc.trim() || "—" }]);
    setBinInput(""); setQty(""); setDesc(""); setPartNotFound(false);
    setTimeout(() => binRef.current?.focus(), 50);
  };

  const submitPull = async () => {
    setSaving(true); setError(null);
    try {
      await db("pulls", "POST", {
        job_number: jobNum,
        employee_name: empName,
        status: "pending",
        items: items.map(i => ({ bin: i.bin, desc: i.desc, qty: i.qty })),
      });
      setDone(true);
    } catch (e) { setError(`Error: ${e.message}`); }
    finally { setSaving(false); }
  };

  const reset = () => { setJobNum(""); setEmpName(""); setItems([]); setDone(false); setStep("job"); };

  if (done) return (
    <div style={s.page}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 20px" }}><Logo /></div>
      <div style={{ padding: "20px 16px" }}>
        <div style={{ ...s.card, border: `1px solid ${C.lime}`, textAlign: "center", padding: "36px 20px" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: C.limeDim, border: `2px solid ${C.lime}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 26, color: C.lime }}>✓</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Pull Submitted!</div>
          <div style={{ fontSize: 14, color: C.muted, marginBottom: 6 }}>Job #{jobNum} · {items.length} item{items.length !== 1 ? "s" : ""}</div>
          <div style={{ fontSize: 13, color: C.limeText, marginBottom: 24 }}>Saved to the live database →</div>
          <button style={s.btnLime} onClick={reset}>Start New Pull</button>
        </div>
      </div>
    </div>
  );

  if (step === "job") return (
    <div style={s.page}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 20px" }}><Logo /></div>
      <div style={{ padding: "24px 16px" }}>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Material Pull</div>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 20 }}>Enter your job info to begin</div>
        <div style={s.card}>
          <label style={s.label}>Job Number</label>
          <input style={{ ...s.inp, marginBottom: 16, fontSize: 22, fontWeight: 800, color: C.lime }} placeholder="e.g. 2024-1187" value={jobNum} onChange={e => setJobNum(e.target.value)} onKeyDown={e => e.key === "Enter" && startJob()} />
          <label style={s.label}>Your Name</label>
          <input style={{ ...s.inp, marginBottom: 20 }} placeholder="First Last" value={empName} onChange={e => setEmpName(e.target.value)} onKeyDown={e => e.key === "Enter" && startJob()} />
          <button style={{ ...s.btnLime, opacity: canStart ? 1 : 0.35 }} onClick={startJob}>Start Scanning →</button>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          {["Safety", "Integrity", "Quality", "Expertise"].map(v => (
            <div key={v} style={{ flex: 1, textAlign: "center", fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: "0.06em", textTransform: "uppercase" }}>{v}</div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      {scanning && <QRScanner onScan={handleScan} onClose={() => setScanning(false)} />}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Logo />
        {items.length > 0 && <div style={s.pill(C.limeDim, C.limeText)}>{items.length} item{items.length !== 1 ? "s" : ""}</div>}
      </div>
      <div style={{ background: C.surfaceHigh, borderBottom: `1px solid ${C.border}`, padding: "8px 20px", display: "flex", justifyContent: "space-between", fontSize: 13 }}>
        <span style={{ color: C.muted }}>Job <span style={{ color: C.lime, fontWeight: 700 }}>#{jobNum}</span></span>
        <span style={{ color: C.muted }}>{empName}</span>
      </div>
      <div style={{ padding: "16px 16px 110px" }}>
        {error && <div style={{ background: C.dangerDim, border: `1px solid ${C.danger}`, borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 13, color: C.danger }}>{error}</div>}
        <div style={{ ...s.card, border: scanFlash ? `1px solid ${C.lime}` : `1px solid ${C.border}`, transition: "border-color 0.3s" }}>
          <label style={s.label}>Part #</label>
          <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
            <input ref={binRef} style={{ ...s.inp, fontFamily: C.mono, fontSize: 18, fontWeight: 800, letterSpacing: "0.08em", color: C.limeText }} placeholder="Scan or type" value={binInput} onChange={e => { setBinInput(e.target.value.toUpperCase()); lookupPart(e.target.value); }} onKeyDown={e => e.key === "Enter" && addItem()} />
            <button onClick={() => setScanning(true)} style={{ padding: "0 16px", height: 50, borderRadius: 10, border: `1px solid ${C.lime}`, background: C.limeDim, color: C.lime, fontWeight: 800, fontSize: 22, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                <line x1="14" y1="14" x2="14" y2="14"/><line x1="17" y1="14" x2="17" y2="14"/><line x1="20" y1="14" x2="20" y2="14"/>
                <line x1="14" y1="17" x2="14" y2="17"/><line x1="17" y1="17" x2="20" y2="17"/><line x1="20" y1="20" x2="20" y2="20"/>
                <line x1="14" y1="20" x2="17" y2="20"/>
              </svg>
            </button>
          </div>
          {partNotFound && <div style={{ fontSize: 12, color: C.amber, marginBottom: 10 }}>⚠ Part not found — enter description manually</div>}
          {!partNotFound && <div style={{ marginBottom: 14 }} />}
          <label style={s.label}>Description <span style={{ color: C.border, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>auto-fills from catalog</span></label>
          <input style={{ ...s.inp, marginBottom: 14, color: desc ? C.text : C.muted }} placeholder="Auto-filling..." value={desc} onChange={e => setDesc(e.target.value)} onKeyDown={e => e.key === "Enter" && addItem()} />
          <label style={s.label}>Quantity</label>
          <div style={{ display: "flex", gap: 10 }}>
            <input ref={qtyRef} style={{ ...s.inp, fontSize: 26, fontWeight: 800, textAlign: "center" }} type="number" min="1" placeholder="0" value={qty} onChange={e => setQty(e.target.value)} onKeyDown={e => e.key === "Enter" && addItem()} />
            <button onClick={addItem} style={{ padding: "0 22px", borderRadius: 12, border: "none", background: C.lime, color: "#0d1a02", fontSize: 17, fontWeight: 800, cursor: "pointer" }}>+ Add</button>
          </div>
        </div>
        {items.length > 0 && (
          <div style={s.card}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Items Added</div>
            {[...items].reverse().map((item, i) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: C.mono, fontWeight: 700, fontSize: 15, color: C.limeText, letterSpacing: 1 }}>{item.bin}</div>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{item.desc}</div>
                </div>
                <div style={s.pill(C.limeDim, C.limeText)}>×{item.qty}</div>
                <button onClick={() => setItems(prev => prev.filter(x => x.id !== item.id))} style={{ background: C.dangerDim, border: `1px solid ${C.danger}`, borderRadius: 8, color: C.danger, width: 32, height: 32, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>
      {items.length > 0 && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 16px 20px", background: C.bg, borderTop: `1px solid ${C.border}` }}>
          <button style={{ ...s.btnLime, opacity: saving ? 0.6 : 1 }} onClick={submitPull} disabled={saving}>
            {saving ? "Submitting..." : `Submit Pull · ${items.length} item${items.length !== 1 ? "s" : ""}`}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── MANAGER LOGIN ────────────────────────────────────────────────────────────
function ManagerLogin({ onLogin }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [checking, setChecking] = useState(false);

  const attempt = async (p) => {
    setChecking(true);
    try {
      const rows = await db(`managers?pin_hash=eq.${p}&select=id,name`);
      if (rows && rows.length > 0) { onLogin(rows[0]); }
      else {
        setShake(true); setError(true);
        setTimeout(() => { setShake(false); setPin(""); setError(false); }, 700);
      }
    } catch { setError(true); setTimeout(() => { setError(false); setPin(""); }, 700); }
    finally { setChecking(false); }
  };

  const press = (val) => {
    if (checking) return;
    if (val === "del") { setPin(p => p.slice(0, -1)); return; }
    const next = pin + val;
    setPin(next);
    if (next.length === 4) setTimeout(() => attempt(next), 120);
  };

  const keys = ["1","2","3","4","5","6","7","8","9","","0","del"];

  return (
    <div style={{ ...s.page, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", padding: "40px 16px" }}>
      <Logo sub="Manager Dashboard" />
      <div style={{ marginTop: 32, marginBottom: 6, fontSize: 15, fontWeight: 700, color: C.text }}>Enter your PIN</div>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 28 }}>Manager access only</div>
      <div style={{ display: "flex", gap: 14, marginBottom: 32, animation: shake ? "shake 0.35s ease" : "none" }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width: 18, height: 18, borderRadius: "50%", background: pin.length > i ? C.lime : C.surfaceHigh, border: `2px solid ${error ? C.danger : pin.length > i ? C.lime : C.border}`, transition: "all 0.15s" }} />
        ))}
      </div>
      {error && <div style={{ fontSize: 13, color: C.danger, marginBottom: 16, fontWeight: 600 }}>Incorrect PIN — try again</div>}
      {checking && <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Checking...</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 72px)", gap: 12 }}>
        {keys.map((k, i) => (
          <button key={i} onClick={() => k !== "" && press(k)} style={{ height: 72, borderRadius: 14, border: `1px solid ${k === "" ? "transparent" : k === "del" ? C.danger : C.border}`, background: k === "" ? "transparent" : k === "del" ? C.dangerDim : C.surface, color: k === "del" ? C.danger : C.text, fontSize: k === "del" ? 18 : 22, fontWeight: 700, cursor: k === "" ? "default" : "pointer" }}>{k === "del" ? "⌫" : k}</button>
        ))}
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}60%{transform:translateX(8px)}}`}</style>
    </div>
  );
}

// ─── MANAGER DASHBOARD ───────────────────────────────────────────────────────
function ManagerDashboard({ manager, onLogout }) {
  const [pulls, setPulls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("active");
  const [filterJob, setFilterJob] = useState("");
  const [filterEmp, setFilterEmp] = useState("");
  const [archiveSearch, setArchiveSearch] = useState("");

  const loadPulls = async () => {
    setLoading(true);
    try {
      const rows = await db("pulls?select=*&order=submitted_at.desc");
      setPulls(rows || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadPulls(); }, []);

  const exportPull = async (pull) => {
    const now = new Date().toISOString();
    const h = "Job #,Employee,Part #,Description,Quantity,Submitted,Exported By,Exported At\n";
    const csv = h + pull.items.map(i =>
      `${pull.job_number},${pull.employee_name},${i.bin},"${i.desc}",${i.qty},${new Date(pull.submitted_at).toLocaleString()},"${manager.name}","${new Date(now).toLocaleString()}"`
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `pull-${pull.job_number}-${pull.employee_name.replace(" ","_")}-${Date.now()}.csv`;
    a.click(); URL.revokeObjectURL(url);
    await db(`pulls?id=eq.${pull.id}`, "PATCH", { status: "exported", exported_by: manager.name, exported_at: now });
    await loadPulls();
    setSelected(null);
  };

  const reExport = (pull) => {
    const h = "Job #,Employee,Part #,Description,Quantity,Submitted,Exported By,Exported At\n";
    const csv = h + pull.items.map(i =>
      `${pull.job_number},${pull.employee_name},${i.bin},"${i.desc}",${i.qty},${new Date(pull.submitted_at).toLocaleString()},"${pull.exported_by}","${new Date(pull.exported_at).toLocaleString()}"`
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `pull-${pull.job_number}-REEXPORT-${Date.now()}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const active = pulls.filter(p => p.status !== "exported");
  const archived = pulls.filter(p => p.status === "exported");
  const filteredActive = active.filter(p => (filterJob === "" || p.job_number.includes(filterJob)) && (filterEmp === "" || p.employee_name.toLowerCase().includes(filterEmp.toLowerCase())));
  const filteredArchive = archived.filter(p => archiveSearch === "" || p.employee_name.toLowerCase().includes(archiveSearch.toLowerCase()) || p.job_number.includes(archiveSearch) || (p.exported_by||"").toLowerCase().includes(archiveSearch.toLowerCase()));

  if (selected) {
    const current = pulls.find(p => p.id === selected.id) || selected;
    const isArchived = current.status === "exported";
    return (
      <div style={s.page}>
        <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo sub="Manager Dashboard" />
          <button style={s.btnGhost} onClick={() => setSelected(null)}>← Back</button>
        </div>
        <div style={{ padding: "20px 16px", maxWidth: 700, margin: "0 auto" }}>
          {isArchived && (
            <div style={{ background: C.blueDim, border: `1px solid ${C.blue}`, borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: C.blueText }}>
              Archived · Exported by <strong>{current.exported_by}</strong> on {new Date(current.exported_at).toLocaleString()}
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.lime }}>Job #{current.job_number}</div>
            <div style={{ fontSize: 14, color: C.muted, marginTop: 2 }}>{current.employee_name} · Submitted {new Date(current.submitted_at).toLocaleString()}</div>
          </div>
          <div style={s.card}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Line Items</div>
            <PullTable items={current.items} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {!isArchived && <button style={s.btnLimeSm} onClick={() => exportPull(current)}>Export to IES & Archive →</button>}
            {isArchived && <button style={s.btnBlue} onClick={() => reExport(current)}>Re-download CSV</button>}
            <button style={s.btnGhost} onClick={() => { loadPulls(); setSelected(null); }}>↻ Refresh</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Logo sub="Manager Dashboard" />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 12, color: C.muted }}>Logged in as <span style={{ color: C.text, fontWeight: 600 }}>{manager.name}</span></div>
          <button onClick={onLogout} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontWeight: 600 }}>Log out</button>
        </div>
      </div>
      <div style={{ padding: "20px 16px", maxWidth: 800, margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: C.muted, fontSize: 15 }}>Loading pulls...</div>
        ) : (
          <>
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              {[["Needs Action", active.length, active.length > 0 ? C.amberText : C.muted], ["Jobs Open", [...new Set(active.map(p => p.job_number))].length, C.text], ["Archived", archived.length, C.blueText]].map(([label, val, accent]) => (
                <div key={label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 18px", flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: accent, lineHeight: 1 }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}`, marginBottom: 20 }}>
              <div style={{ display: "flex" }}>
                <button style={s.tab(tab === "active")} onClick={() => setTab("active")}>
                  Needs Action
                  {active.length > 0 && <span style={{ marginLeft: 8, background: C.amberDim, color: C.amberText, borderRadius: 20, padding: "1px 8px", fontSize: 11, fontWeight: 700 }}>{active.length}</span>}
                </button>
                <button style={s.tab(tab === "archive")} onClick={() => setTab("archive")}>
                  Archive
                  {archived.length > 0 && <span style={{ marginLeft: 8, background: C.blueDim, color: C.blueText, borderRadius: 20, padding: "1px 8px", fontSize: 11, fontWeight: 700 }}>{archived.length}</span>}
                </button>
              </div>
              <button onClick={loadPulls} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontWeight: 600 }}>↻ Refresh</button>
            </div>
            {tab === "active" && (
              <>
                <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                  <input style={{ ...s.inpSm, flex: 1 }} placeholder="Filter by job #" value={filterJob} onChange={e => setFilterJob(e.target.value)} />
                  <input style={{ ...s.inpSm, flex: 1 }} placeholder="Filter by employee" value={filterEmp} onChange={e => setFilterEmp(e.target.value)} />
                </div>
                {filteredActive.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
                    <div style={{ fontSize: 36, marginBottom: 12, color: C.lime }}>✓</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 4 }}>All caught up</div>
                    <div style={{ fontSize: 14 }}>No pulls waiting for action</div>
                  </div>
                ) : filteredActive.map(pull => (
                  <div key={pull.id} onClick={() => setSelected(pull)} style={{ ...s.card, cursor: "pointer", borderLeft: `3px solid ${C.amber}` }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = C.surfaceHigh}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = C.surface}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{ fontWeight: 800, fontSize: 16, color: C.lime }}>Job #{pull.job_number}</div>
                      <div style={{ fontSize: 12, color: C.muted }}>{new Date(pull.submitted_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                      <span style={{ color: C.muted }}>{pull.employee_name} · <span style={{ color: C.text }}>{pull.items.length} line item{pull.items.length !== 1 ? "s" : ""}</span></span>
                      <span style={{ color: C.limeText, fontWeight: 700 }}>{pull.items.reduce((a, i) => a + i.qty, 0)} units →</span>
                    </div>
                  </div>
                ))}
              </>
            )}
            {tab === "archive" && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <input style={{ ...s.inpSm, width: "100%", boxSizing: "border-box" }} placeholder="Search by job #, employee, or exported by..." value={archiveSearch} onChange={e => setArchiveSearch(e.target.value)} />
                </div>
                {filteredArchive.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>🗄️</div>
                    <div style={{ fontSize: 15 }}>No archived pulls yet</div>
                  </div>
                ) : filteredArchive.map(pull => (
                  <div key={pull.id} onClick={() => setSelected(pull)} style={{ ...s.card, cursor: "pointer", borderLeft: `3px solid ${C.blue}` }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = C.surfaceHigh}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = C.surface}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{ fontWeight: 800, fontSize: 16, color: C.lime }}>Job #{pull.job_number}</div>
                      <div style={{ fontSize: 12, color: C.muted }}>{new Date(pull.submitted_at).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
                      <span style={{ color: C.muted }}>{pull.employee_name} · <span style={{ color: C.text }}>{pull.items.length} line item{pull.items.length !== 1 ? "s" : ""}</span></span>
                      <span style={{ color: C.limeText, fontWeight: 700 }}>{pull.items.reduce((a, i) => a + i.qty, 0)} units</span>
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
                      Exported by <span style={{ color: C.blueText, fontWeight: 600 }}>{pull.exported_by}</span> · {pull.exported_at ? new Date(pull.exported_at).toLocaleString() : ""}
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("field");
  const [manager, setManager] = useState(null);

  return (
    <div>
      <div style={{ display: "flex", background: "#070909", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 200 }}>
        {[["field", "📱 Field App"], ["manager", "🖥️ Manager Dashboard"]].map(([v, label]) => (
          <button key={v} onClick={() => setView(v)} style={{ flex: 1, padding: "12px 8px", border: "none", background: view === v ? C.surface : "transparent", color: view === v ? C.lime : C.muted, fontWeight: view === v ? 700 : 500, fontSize: 13, cursor: "pointer", borderBottom: view === v ? `2px solid ${C.lime}` : "2px solid transparent" }}>
            {label}
          </button>
        ))}
      </div>
      {view === "field"
        ? <FieldApp />
        : manager
          ? <ManagerDashboard manager={manager} onLogout={() => setManager(null)} />
          : <ManagerLogin onLogin={setManager} />
      }
    </div>
  );
}
