import React, { useState } from "react";
import {
  Radio,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  GraduationCap,
  Building2,
  Target,
  Zap,
  MapPin,
  Layers,
  MessageSquare,
  RotateCcw,
  AlertTriangle,
  Plus,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* API client                                                          */
/* ------------------------------------------------------------------ */
const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function apiCall(method, path, body) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(`Can't reach the API at ${BASE} — is the server running?`);
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed (${res.status})`);
  }
  return res.json();
}
const post = (path, body) => apiCall("POST", path, body);
const patch = (path, body) => apiCall("PATCH", path, body);

/* ------------------------------------------------------------------ */
/* Design tokens                                                       */
/* ------------------------------------------------------------------ */
const COLORS = {
  bg: "#F4F5F9",
  ink: "#12131A",
  card: "#FFFFFF",
  primary: "#3654FF",
  primaryDeep: "#1E3AC9",
  match: "#17B890",
  muted: "#6B7280",
  border: "#E4E6EF",
  noise: "#C7CBDA",
  danger: "#D64545",
};

const PRESETS = [
  {
    label: "Predictive Maintenance",
    domain: "Manufacturing",
    text:
      "Develop a system for predictive maintenance in manufacturing machines using sensor data, IoT devices and machine learning to flag failures before they happen. Needs a Python-based analytics pipeline and a cloud dashboard.",
  },
  {
    label: "Smart Irrigation",
    domain: "Agriculture",
    text:
      "Local farmers need an IoT and sensor based irrigation system that uses data analytics to schedule watering for crops, reducing water waste across small farms.",
  },
  {
    label: "Rural Health Records",
    domain: "Healthcare",
    text:
      "A district hospital needs a secure web platform with a patient database and machine learning based triage to manage rural health records and clinical scheduling.",
  },
];

const COL_KEY = { TODO: "todo", DOING: "doing", DONE: "done" };
const COL_VALUE = { todo: "TODO", doing: "DOING", done: "DONE" };
const emptyBoard = { todo: [], doing: [], done: [] };

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */
function Tag({ children, tone = "muted" }) {
  const tones = {
    muted: { bg: "#EEF0F6", color: COLORS.muted },
    primary: { bg: "#E8ECFF", color: COLORS.primaryDeep },
    match: { bg: "#E4F8F1", color: "#0F7A5C" },
  };
  const t = tones[tone];
  return (
    <span
      style={{
        background: t.bg,
        color: t.color,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11,
        letterSpacing: 0.2,
        padding: "3px 8px",
        borderRadius: 999,
        display: "inline-block",
        marginRight: 6,
        marginBottom: 6,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function ScoreBar({ score }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 120 }}>
      <div style={{ flex: 1, height: 6, background: "#E7E9F2", borderRadius: 999, overflow: "hidden" }}>
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            background: score >= 60 ? COLORS.match : COLORS.primary,
            borderRadius: 999,
            transition: "width 0.7s cubic-bezier(.2,.9,.2,1)",
          }}
        />
      </div>
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: COLORS.ink, width: 34, textAlign: "right" }}>
        {score}%
      </span>
    </div>
  );
}

function RoutingSignature({ active }) {
  const noiseNodes = [
    [70, 40], [40, 90], [90, 110], [30, 160], [95, 190],
    [60, 230], [20, 60], [100, 60], [45, 210], [80, 260],
  ];
  return (
    <svg viewBox="0 0 620 300" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs>
        <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g opacity={0.9}>
        {noiseNodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={5} fill={COLORS.noise} />
        ))}
      </g>
      <text x="20" y="20" fontFamily="'IBM Plex Mono', monospace" fontSize="11" fill={COLORS.muted}>
        BROADCAST — everyone sees it
      </text>
      <g>
        <circle cx="170" cy="150" r="14" fill={COLORS.ink} />
        <circle cx="170" cy="150" r="14" fill="none" stroke={COLORS.ink} strokeWidth="1" opacity="0.3">
          {active && <animate attributeName="r" values="14;30;14" dur="2.4s" repeatCount="indefinite" />}
          {active && <animate attributeName="opacity" values="0.35;0;0.35" dur="2.4s" repeatCount="indefinite" />}
        </circle>
        <text x="170" y="182" fontFamily="'IBM Plex Mono', monospace" fontSize="10" fill={COLORS.ink} textAnchor="middle">
          PROBLEM
        </text>
      </g>
      <path d="M184 150 C 300 150, 320 70, 460 65" fill="none" stroke={COLORS.primary} strokeWidth="2.5" strokeDasharray={active ? "0" : "6 6"} filter="url(#glow)" />
      <path d="M184 150 C 300 150, 330 220, 460 225" fill="none" stroke={COLORS.match} strokeWidth="2.5" strokeDasharray={active ? "0" : "6 6"} filter="url(#glow)" />
      <g>
        <circle cx="470" cy="65" r="10" fill={COLORS.primary} />
        <text x="486" y="60" fontFamily="'Space Grotesk', sans-serif" fontSize="13" fontWeight="600" fill={COLORS.ink}>Faculty</text>
        <text x="486" y="76" fontFamily="'IBM Plex Mono', monospace" fontSize="10" fill={COLORS.muted}>right expertise</text>
      </g>
      <g>
        <circle cx="470" cy="225" r="10" fill={COLORS.match} />
        <text x="486" y="220" fontFamily="'Space Grotesk', sans-serif" fontSize="13" fontWeight="600" fill={COLORS.ink}>Students</text>
        <text x="486" y="236" fontFamily="'IBM Plex Mono', monospace" fontSize="10" fill={COLORS.muted}>right skills</text>
      </g>
      <text x="620" y="150" fontFamily="'IBM Plex Mono', monospace" fontSize="11" fill={COLORS.primaryDeep} textAnchor="end">
        ROUTED — only the right people see it
      </text>
    </svg>
  );
}

const STEPS = ["Submit", "AI Analysis", "Matching", "Routing", "Collaborate"];

function StepRail({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 4 }}>
      {STEPS.map((label, i) => {
        const state = i < current ? "done" : i === current ? "active" : "todo";
        return (
          <React.Fragment key={label}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 12,
                  background: state === "todo" ? "#fff" : state === "active" ? COLORS.ink : COLORS.primary,
                  color: state === "todo" ? COLORS.muted : "#fff",
                  border: `1.5px solid ${state === "todo" ? COLORS.border : "transparent"}`,
                }}
              >
                {state === "done" ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 13,
                  fontWeight: state === "active" ? 700 : 500,
                  color: state === "todo" ? COLORS.muted : COLORS.ink,
                }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && <div style={{ width: 24, height: 1, background: COLORS.border, margin: "0 6px" }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "#FCEAEA",
        color: COLORS.danger,
        border: "1px solid #F3C3C3",
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 13,
        marginBottom: 16,
      }}
    >
      <AlertTriangle size={15} /> {message}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main app                                                             */
/* ------------------------------------------------------------------ */
export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ domain: "Manufacturing", text: PRESETS[0].text, org: "Coimbatore District Industries Assoc." });

  const [problemId, setProblemId] = useState(null);
  const [analysing, setAnalysing] = useState(false);
  const [matching, setMatching] = useState(false);
  const [tags, setTags] = useState([]);
  const [matches, setMatches] = useState([]);
  const [routedTo, setRoutedTo] = useState(null);
  const [board, setBoard] = useState(emptyBoard);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState(null);

  const applyPreset = (p) => setForm({ ...form, domain: p.domain, text: p.text });

  const runAnalysis = async () => {
    setError(null);
    setStep(1);
    setAnalysing(true);
    try {
      const problem = await post("/api/problems", { org: form.org, domain: form.domain, description: form.text });
      setProblemId(problem.id);
      const analyzed = await post(`/api/problems/${problem.id}/analyze`);
      setTags(analyzed.extractedTags);
    } catch (e) {
      setError(e.message);
      setStep(0);
    } finally {
      setAnalysing(false);
    }
  };

  const runMatching = async () => {
    setError(null);
    setStep(2);
    setMatching(true);
    try {
      const ranked = await post(`/api/problems/${problemId}/match`);
      setMatches(ranked);
    } catch (e) {
      setError(e.message);
    } finally {
      setMatching(false);
    }
  };

  const routeProblem = async (uni) => {
    setError(null);
    try {
      const result = await post(`/api/problems/${problemId}/route`, { universityId: uni.universityId });
      setRoutedTo(uni);
      const tasks = result.tasks || [];
      setBoard({
        todo: tasks.filter((t) => t.column === "TODO"),
        doing: tasks.filter((t) => t.column === "DOING"),
        done: tasks.filter((t) => t.column === "DONE"),
      });
      setStep(3);
    } catch (e) {
      setError(e.message);
    }
  };

  const enterCollaboration = () => setStep(4);

  const moveCard = async (task, fromCol, toCol) => {
    setBoard((b) => ({
      ...b,
      [fromCol]: b[fromCol].filter((t) => t.id !== task.id),
      [toCol]: [...b[toCol], { ...task, column: COL_VALUE[toCol] }],
    }));
    try {
      await patch(`/api/tasks/${task.id}`, { column: COL_VALUE[toCol] });
    } catch (e) {
      setError(e.message);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const task = await post(`/api/problems/${problemId}/tasks`, { title: newTask.trim() });
      setBoard((b) => ({ ...b, todo: [...b.todo, task] }));
      setNewTask("");
    } catch (e) {
      setError(e.message);
    }
  };

  const resetAll = () => {
    setStep(0);
    setProblemId(null);
    setTags([]);
    setMatches([]);
    setRoutedTo(null);
    setBoard(emptyBoard);
    setError(null);
  };

  return (
    <div style={{ minHeight: "100%", background: COLORS.bg, color: COLORS.ink, fontFamily: "'IBM Plex Sans', sans-serif", padding: "28px 20px 60px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        button { cursor: pointer; font-family: inherit; }
        button:focus-visible, input:focus-visible, textarea:focus-visible { outline: 2px solid #3654FF; outline-offset: 2px; }
      `}</style>

      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ marginBottom: 36 }}>
          
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "clamp(28px, 4vw, 42px)", lineHeight: 1.08, margin: "0 0 12px", letterSpacing: "-0.01em" }}>
            We don't wait for the right people to find the problem.
            <br />
            <span style={{ color: COLORS.primary }}>We make the problem reach them.</span>
          </h1>
          <p style={{ color: COLORS.muted, fontSize: 15, maxWidth: 560, margin: "0 0 20px" }}>
            An intelligent routing engine that reads a real-world problem, extracts the skills and
            domain it needs, and delivers it directly to the university, faculty and students best
            equipped to solve it — instead of broadcasting it to everyone.
          </p>
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "12px 20px" }}>
            <RoutingSignature active={step >= 2} />
          </div>
        </div>

        <StepRail current={step} />
        <ErrorBanner message={error} />

        {step === 0 && (
          <Panel icon={<Radio size={16} />} title="Submit a problem" subtitle="As a citizen, government body or industry partner">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p)}
                  style={{
                    background: form.text === p.text ? COLORS.ink : "#fff",
                    color: form.text === p.text ? "#fff" : COLORS.ink,
                    border: `1px solid ${form.text === p.text ? COLORS.ink : COLORS.border}`,
                    borderRadius: 999,
                    padding: "6px 14px",
                    fontSize: 13,
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <label style={labelStyle}>Submitting organisation</label>
            <input style={inputStyle} value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} />

            <label style={labelStyle}>Domain</label>
            <input style={inputStyle} value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} />

            <label style={labelStyle}>Describe the problem</label>
            <textarea style={{ ...inputStyle, minHeight: 110, resize: "vertical" }} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />

            <PrimaryButton onClick={runAnalysis} icon={<Sparkles size={15} />}>
              Run AI analysis
            </PrimaryButton>
          </Panel>
        )}

        {step === 1 && (
          <Panel icon={<Sparkles size={16} />} title="AI analysis" subtitle="Extracting domain, required skills and academic expertise">
            {analysing ? (
              <LoadingBlock text="parsing problem text · matching skill taxonomy · scoring domains…" />
            ) : (
              <>
                <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginBottom: 20 }}>
                  <MiniStat label="Domain" value={form.domain} />
                  <MiniStat label="Skills detected" value={String(tags.length)} />
                  <MiniStat label="Org" value={form.org} />
                </div>
                <label style={labelStyle}>Required skills</label>
                <div style={{ marginBottom: 20 }}>
                  {tags.length ? (
                    tags.map((t) => <Tag key={t} tone="primary">{t}</Tag>)
                  ) : (
                    <p style={{ color: COLORS.muted, fontSize: 13 }}>
                      No known skill keywords detected — go back and add more technical detail.
                    </p>
                  )}
                </div>
                <PrimaryButton onClick={runMatching} icon={<Target size={15} />} disabled={tags.length === 0}>
                  Find best-matched people
                </PrimaryButton>
              </>
            )}
          </Panel>
        )}

        {step === 2 && (
          <Panel icon={<Target size={16} />} title="Intelligent matching" subtitle={`Ranking universities, faculty and students against ${tags.length} required skill(s)`}>
            {matching ? (
              <LoadingBlock text="querying universities · scoring faculty & student profiles…" />
            ) : matches.length === 0 ? (
              <p style={{ color: COLORS.muted, fontSize: 13 }}>No matches found for the detected skills — go back and try a different problem.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {matches.map((u) => (
                  <div key={u.universityId} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 16, background: "#fff" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Building2 size={15} color={COLORS.primaryDeep} />
                          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15 }}>{u.name}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, color: COLORS.muted, fontSize: 12, marginTop: 2 }}>
                          <MapPin size={12} /> {u.location}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <ScoreBar score={u.score} />
                        <button
                          onClick={() => routeProblem(u)}
                          style={{ background: COLORS.primary, color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}
                        >
                          Route here <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 14 }}>
                      <div>
                        <div style={microLabel}><GraduationCap size={12} /> Faculty match</div>
                        {u.faculty.slice(0, 2).map((f) => (
                          <div key={f.id} style={{ marginBottom: 8 }}>
                            <div style={{ fontSize: 13, fontWeight: 500 }}>{f.name} <span style={{ color: COLORS.muted, fontWeight: 400 }}>— {f.role}</span></div>
                            <ScoreBar score={f.score} />
                          </div>
                        ))}
                      </div>
                      <div>
                        <div style={microLabel}><Users size={12} /> Student match</div>
                        {u.students.slice(0, 2).map((s) => (
                          <div key={s.id} style={{ marginBottom: 8 }}>
                            <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</div>
                            <ScoreBar score={s.score} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        )}

        {step === 3 && routedTo && (
          <Panel icon={<Zap size={16} />} title="Routed" subtitle="Targeted notification sent — not broadcast">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <CheckCircle2 size={20} color={COLORS.match} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 16 }}>
                {routedTo.name} was notified — match score {routedTo.score}%
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {[...routedTo.faculty.filter((f) => f.score > 0).slice(0, 1), ...routedTo.students.filter((s) => s.score > 0).slice(0, 2)].map((p) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: COLORS.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk', sans-serif", fontSize: 13 }}>
                      {p.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: COLORS.muted }}>{p.role || "Student mentee"}</div>
                    </div>
                  </div>
                  <Tag tone="match">received alert</Tag>
                </div>
              ))}
            </div>
            <PrimaryButton onClick={enterCollaboration} icon={<Layers size={15} />}>
              Open collaboration workspace
            </PrimaryButton>
          </Panel>
        )}

        {step === 4 && routedTo && (
          <Panel icon={<Layers size={16} />} title="Team workspace" subtitle={`${routedTo.name} · problem-to-solution board`}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {["todo", "doing", "done"].map((col) => (
                <div key={col} style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 12, minHeight: 160 }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: COLORS.muted, marginBottom: 10, textTransform: "uppercase" }}>
                    {col === "todo" ? "To do" : col === "doing" ? "In progress" : "Done"}
                  </div>
                  {board[col].map((task) => (
                    <div key={task.id} style={{ background: COLORS.bg, borderRadius: 8, padding: "8px 10px", fontSize: 12.5, marginBottom: 8 }}>
                      {task.title}
                      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                        {col !== "todo" && (
                          <button onClick={() => moveCard(task, col, col === "doing" ? "todo" : "doing")} style={miniBtn}>← back</button>
                        )}
                        {col !== "done" && (
                          <button onClick={() => moveCard(task, col, col === "todo" ? "doing" : "done")} style={miniBtn}>next →</button>
                        )}
                      </div>
                    </div>
                  ))}
                  {col === "todo" && (
                    <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                      <input
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTask()}
                        placeholder="Add a task…"
                        style={{ ...inputStyle, padding: "6px 8px", fontSize: 12 }}
                      />
                      <button onClick={addTask} style={{ ...miniBtn, padding: "6px 8px" }}><Plus size={12} /></button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18, color: COLORS.muted, fontSize: 13 }}>
              <MessageSquare size={14} /> Faculty mentor and student team chat threads live here in the full build.
            </div>

            <button onClick={resetAll} style={{ ...ghostBtn, marginTop: 20 }}>
              <RotateCcw size={13} /> Try another problem
            </button>
          </Panel>
        )}

       
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared sub-components / styles                                      */
/* ------------------------------------------------------------------ */
function Panel({ icon, title, subtitle, children }) {
  return (
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "22px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
        <span style={{ color: COLORS.primaryDeep }}>{icon}</span>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, margin: 0 }}>{title}</h2>
      </div>
      {subtitle && <p style={{ color: COLORS.muted, fontSize: 13, margin: "4px 0 18px" }}>{subtitle}</p>}
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, icon, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? COLORS.noise : COLORS.ink,
        color: "#fff",
        border: "none",
        borderRadius: 10,
        padding: "11px 20px",
        fontSize: 14,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        marginTop: 6,
      }}
    >
      {icon} {children}
    </button>
  );
}

function MiniStat({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function LoadingBlock({ text }) {
  return (
    <div style={{ padding: "30px 0", textAlign: "center" }}>
      <div style={{ width: 14, height: 14, borderRadius: "50%", background: COLORS.primary, margin: "0 auto" }} />
      <p style={{ color: COLORS.muted, fontSize: 13, marginTop: 14, fontFamily: "'IBM Plex Mono', monospace" }}>{text}</p>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 11,
  color: COLORS.muted,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  margin: "14px 0 6px",
};

const inputStyle = {
  width: "100%",
  border: `1px solid ${COLORS.border}`,
  borderRadius: 10,
  padding: "10px 12px",
  fontSize: 14,
  fontFamily: "'IBM Plex Sans', sans-serif",
  background: "#fff",
  color: COLORS.ink,
};

const microLabel = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 11,
  color: COLORS.muted,
  textTransform: "uppercase",
  letterSpacing: 0.4,
  marginBottom: 8,
};

const miniBtn = {
  background: "#fff",
  border: `1px solid ${COLORS.border}`,
  borderRadius: 6,
  fontSize: 11,
  padding: "3px 7px",
  color: COLORS.ink,
};

const ghostBtn = {
  background: "transparent",
  border: `1px solid ${COLORS.border}`,
  borderRadius: 10,
  padding: "9px 16px",
  fontSize: 13,
  color: COLORS.ink,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};
