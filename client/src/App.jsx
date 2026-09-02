import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import {
  GraduationCap,
  UserRound,
  Building2,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  UploadCloud,
  MapPin,
  Camera,
  FileText,
  CheckCircle2,
  Bell,
  Home,
} from "lucide-react";

const ROLES = {
  mentor: {
    label: "Mentor",
    subtitle: "Guide projects and mentor student teams",
    icon: GraduationCap,
    primary: "#4F7BFF",
    dark: "#1E3A8A",
    soft: "#DCE7FF",
    background: "#0C182D",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    description:
      "Connect with meaningful challenges, guide student teams and help turn ideas into real-world solutions.",
  },

  student: {
    label: "Student",
    subtitle: "Build solutions for real-world challenges",
    icon: UserRound,
    primary: "#17B38B",
    dark: "#0A655A",
    soft: "#D5FFF4",
    background: "#081C1A",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    description:
      "Discover projects matched to your skills, collaborate with mentors and build solutions that matter.",
  },

  publisher: {
    label: "Publisher / Problem Author",
    subtitle: "Submit challenges that need innovative solutions",
    icon: Building2,
    primary: "#F59E0B",
    dark: "#92400E",
    soft: "#FFE9BF",
    background: "#1E1406",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    description:
      "Bring real-world problems to the right university, mentor and student team through intelligent routing.",
  },
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/collab" element={<CollabPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<RoleSelectionPage />} />
        <Route path="/login/:role" element={<LoginPageWrapper />} />
        <Route path="/dashboard/:role" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

/* ================================================================
   HEADER COMPONENT
================================================================ */

function Header() {
  const navigate = useNavigate();

  return (
    <header style={styles.header}>
      <div style={styles.logoArea}>
        <div style={styles.logoIcon}>
          <span style={styles.logoMark}>S</span>
        </div>

        <div>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={styles.logo}>Solink</div>
            <div style={styles.logoSubtitle}>
              Intelligent Problem Routing
            </div>
          </Link>
        </div>
      </div>

      <nav style={styles.navMenu}>
        <Link to="/" style={styles.navLink}>Home</Link>
        <Link to="/about" style={styles.navLink}>About</Link>
        <Link to="/collab" style={styles.navLink}>Collab</Link>
        <Link to="/solutions" style={styles.navLink}>Solutions</Link>
        <Link to="/contact" style={styles.navLink}>Contact</Link>
      </nav>

      <div style={styles.headerActions}>
        <button onClick={() => navigate("/login")} style={styles.primaryButton}>Get Started</button>
      </div>
    </header>
  );
}

/* ================================================================
   LANDING PAGE
================================================================ */

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.landing}>
      <style>{globalCSS}</style>

      {/* Background decoration */}
      <div style={styles.backgroundGlowOne} />
      <div style={styles.backgroundGlowTwo} />

      {/* Header */}
      <Header />

      {/* Main */}
      <main style={styles.landingMain}>
        <div style={styles.heroRow}>
          <div style={styles.heroText}>
            <div style={styles.eyebrow}>
              <span style={styles.eyebrowDot} />
              CITIZEN-POWERED SOLUTIONS
            </div>

            <h1 style={styles.heroTitle}>
              Connect rural problems
              <br />
              <span style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>with innovation.</span>
            </h1>

            <p style={styles.heroDescription}>
              Solink intelligently connects real community challenges with universities, mentors and students equipped to build lasting solutions. Every problem is a pathway to impact.
            </p>
          </div>

          <div style={styles.heroVisual}>
            <div style={styles.heroImageCard}>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                alt="Students and mentors collaborating"
                style={styles.heroImage}
              />
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <span>© 2026 Solink</span>
        <span>Intelligent routing for meaningful collaboration</span>
      </footer>
    </div>
  );
}

/* ================================================================
   LOGIN PAGE WRAPPER
================================================================ */

function LoginPageWrapper() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { role } = useParams();
  const roleKey = role || "student";
  const selectedRole = ROLES[roleKey] || ROLES.student;

  return (
    <LoginPage
      role={selectedRole}
      roleKey={roleKey}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      onBack={() => navigate("/")}
      onLogin={() => navigate(`/dashboard/${roleKey}`)}
    />
  );
}

function RoleSelectionPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.landing}>
      <style>{globalCSS}</style>
      <div style={styles.backgroundGlowOne} />
      <div style={styles.backgroundGlowTwo} />
      <Header />
      <main style={{ ...styles.landingMain, paddingTop: 88 }}>
        <div style={styles.chooseText}>
          <span style={{ color: "#f59e0b", fontWeight: 800 }}>01</span>
          <div>
            <strong style={{ fontSize: 28 }}>Choose how you want to use Solink</strong>
            <p style={{ color: "#cbd5e1", margin: "8px 0 0" }}>Select your role, then sign in to open your workspace.</p>
          </div>
        </div>
        <div style={styles.roleGrid}>
          {Object.entries(ROLES).map(([roleKey, role]) => (
            <RoleCard key={roleKey} role={role} onClick={() => navigate(`/login/${roleKey}`)} />
          ))}
        </div>
      </main>
      <footer style={styles.footer}>
        <span>© 2026 Solink</span>
        <span>Intelligent routing for meaningful collaboration</span>
      </footer>
    </div>
  );
}

/* ================================================================
   ABOUT PAGE
================================================================ */

function AboutPage() {
  return <EditorialPage eyebrow="WHY SOLINK" title="Better routes for the problems that matter." description="A practical bridge between the people who know a place best and the teams with the tools to improve it." image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85"><section style={styles.editorialIntro}><p>Most local problems are noticed early, but they rarely reach the people who can act. Solink gives each report a clear path — from the community to the right university, mentor and delivery partner.</p><div style={styles.metricStrip}><div><strong>01</strong><span>shared place to report</span></div><div><strong>02</strong><span>thoughtful matching</span></div><div><strong>03</strong><span>visible progress</span></div></div></section><section style={styles.storyGrid}><img style={styles.storyImage} src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=85" alt="Students working together" /><div style={styles.storyText}><span style={styles.sectionKicker}>A shared starting point</span><h2>Local knowledge deserves a serious response.</h2><p>From water supply and road safety to public health, community observations become well-structured challenges that can be assessed and progressed.</p><Link to="/solutions" style={styles.inlineLink}>See how a report moves forward <ArrowRight size={16} /></Link></div></section><ConnectionPanel title="The right people, around one problem." copy="Explore how universities, mentors and partners work together once a challenge is matched." link="/collab" label="Explore collaboration" /></EditorialPage>;
  return (
    <ContentPage title="About Solink">
      <div style={styles.sectionContent}>
        <p>
          <strong>Solink</strong> is a digital platform designed to bridge the gap between citizens who identify real-world societal challenges and the universities, experts, and industry partners equipped to solve them.
        </p>
        
        <h3 style={styles.subsectionTitle}>The Problem</h3>
        <p>
          Many societal issues—damaged infrastructure, water shortages, waste management problems, environmental concerns—are first noticed by ordinary citizens and local communities. However, there's often no structured system to:
        </p>
        <ul style={styles.bulletList}>
          <li>Collect these problems systematically</li>
          <li>Deduplicate similar reports</li>
          <li>Connect them with capable institutions and experts</li>
        </ul>

        <h3 style={styles.subsectionTitle}>Our Solution</h3>
        <p>
          Solink creates a centralized ecosystem where:
        </p>
        <ul style={styles.bulletList}>
          <li><strong>Citizens</strong> submit real-world problems with details and evidence</li>
          <li><strong>Intelligent Analysis</strong> classifies, validates, and deduplicates submissions</li>
          <li><strong>Smart Matching</strong> connects problems to universities based on expertise and capabilities</li>
          <li><strong>Collaboration</strong> enables student teams, mentors, and industry partners to develop solutions</li>
          <li><strong>Tracking</strong> monitors progress from submission to implementation</li>
        </ul>

        <p style={{marginTop: 20}}>
          <strong>Our mission:</strong> Ensure that real problems identified at the ground level are transformed into structured challenges and connected with the right institutions to develop practical solutions.
        </p>
      </div>
    </ContentPage>
  );
}

/* ================================================================
   COLLABORATION PAGE
================================================================ */

function CollabPage() {
  return <EditorialPage eyebrow="WORK TOGETHER" title="Good projects need more than one point of view." description="Solink brings the community, campus and delivery partners into the same working rhythm." image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85"><section style={styles.partnerGrid}><PartnerCard image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=85" title="Student teams" copy="Turn a real brief into a field-tested solution." /><PartnerCard image="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=85" title="Mentors" copy="Bring experience, context and constructive challenge." /><PartnerCard image="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=85" title="Delivery partners" copy="Help promising work travel beyond a prototype." /></section><section style={styles.storyGrid}><div style={styles.storyText}><span style={styles.sectionKicker}>One working loop</span><h2>Share context. Build trust. Keep moving.</h2><p>Each challenge has a clear owner, a visible next step and room for the people closest to the work to contribute.</p><Link to="/contact" style={styles.inlineLink}>Bring your organisation in <ArrowRight size={16} /></Link></div><img style={styles.storyImage} src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=85" alt="People collaborating" /></section></EditorialPage>;
  return (
    <ContentPage title="Collaboration">
      <div style={styles.sectionContent}>
        <p>
          Solink fosters meaningful collaboration between different stakeholders:
        </p>
        <ul style={styles.bulletList}>
          <li><strong>Universities:</strong> Leverage research capabilities and student talent to solve real challenges</li>
          <li><strong>Students:</strong> Work on projects that matter, mentored by experienced faculty</li>
          <li><strong>Mentors:</strong> Guide solution development with domain expertise</li>
          <li><strong>Industry Partners:</strong> Provide technical support, funding, and implementation assistance</li>
          <li><strong>Government & Communities:</strong> Submit challenges and receive actionable solutions</li>
        </ul>
        <p>
          Through intelligent matching and structured workflows, we ensure the right teams connect with the right problems at the right time.
        </p>
      </div>
    </ContentPage>
  );
}

/* ================================================================
   SOLUTIONS PAGE
================================================================ */

function SolutionsPage() {
  return <EditorialPage eyebrow="HOW IT WORKS" title="From an observed issue to practical action." description="A simple process that respects local evidence and keeps every hand-off visible." image="https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1200&q=85"><section style={styles.processList}><ProcessStep number="01" title="Capture what is happening" copy="A clear description, location and supporting photographs make the first report useful." /><ProcessStep number="02" title="Shape the challenge" copy="Related reports are reviewed together so effort goes to the real issue, not duplicate paperwork." /><ProcessStep number="03" title="Match the people who can help" copy="The challenge is routed to teams with relevant skills, mentorship and local capacity." /><ProcessStep number="04" title="Track the work in the open" copy="Every stage has an owner and a visible update, from first review through implementation." /></section><ConnectionPanel title="Ready to make a useful first report?" copy="Choose your role to access the workspace built for your next step." link="/login" label="Choose your role" /></EditorialPage>;
  return (
    <ContentPage title="How It Works">
      <div style={styles.sectionContent}>
        <p>
          The Solink workflow transforms problems into solutions:
        </p>
        <ol style={styles.numberList}>
          <li><strong>Submission:</strong> Citizens submit challenges with text, photos, videos, and location details</li>
          <li><strong>Validation:</strong> System verifies and classifies problems into thematic domains</li>
          <li><strong>Deduplication:</strong> Intelligent analysis groups related reports into consolidated challenges</li>
          <li><strong>Routing:</strong> Problems are matched with universities based on expertise and research capabilities</li>
          <li><strong>Development:</strong> University teams evaluate, form student groups, and develop solutions</li>
          <li><strong>Partnership:</strong> Industry provides mentorship, funding, and implementation support</li>
          <li><strong>Tracking:</strong> Analytics dashboard monitors progress and outcomes</li>
        </ol>
      </div>
    </ContentPage>
  );
}

/* ================================================================
   CONTACT PAGE
================================================================ */

function ContactPage() {
  return <EditorialPage eyebrow="START A CONVERSATION" title="Bring a local challenge to the right table." description="Tell us what you are working on. We will help point you to the most useful next step." image="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85"><section style={styles.contactGrid}><div style={styles.contactDetails}><span style={styles.sectionKicker}>Get in touch</span><h2>For communities, campuses and partners.</h2><p>Whether you have a challenge to share or want to support a project, we would like to hear the context first.</p><a href="mailto:contact@solink.io" style={styles.contactLink}>contact@solink.io</a><span style={styles.contactSmall}>Usually replies within two working days.</span></div><form style={styles.contactForm} onSubmit={(event) => { event.preventDefault(); alert("Thanks — your message has been sent to the Solink team."); }}><label style={styles.contactLabel}>Your name<input required style={styles.contactInput} placeholder="Name" /></label><label style={styles.contactLabel}>Email address<input required type="email" style={styles.contactInput} placeholder="you@example.com" /></label><label style={styles.contactLabel}>What can we help with?<textarea required style={{ ...styles.contactInput, minHeight: 112, resize: "vertical" }} placeholder="A short note about your project or challenge" /></label><button type="submit" style={styles.primaryButton}>Send message <ArrowRight size={16} /></button></form></section></EditorialPage>;
  return (
    <ContentPage title="Get in Touch">
      <div style={styles.sectionContent}>
        <p>
          Have a problem to submit? Want to partner with us? Interested in joining as a mentor or university?
        </p>
        <p>
          <strong>Contact us today to be part of the change:</strong>
        </p>
        <div style={styles.contactInfo}>
          <p>📧 Email: contact@solink.io</p>
          <p>📞 Phone: +91 (XXX) XXX-XXXX</p>
          <p>🌐 Website: www.solink.io</p>
        </div>
        <p style={{marginTop: 20}}>
          Let's work together to transform societal challenges into meaningful solutions.
        </p>
      </div>
    </ContentPage>
  );
}

/* ================================================================
   CONTENT PAGE WRAPPER
================================================================ */

function ContentPage({ title, children }) {
  return (
    <div style={styles.landing}>
      <style>{globalCSS}</style>
      <div style={styles.backgroundGlowOne} />
      <div style={styles.backgroundGlowTwo} />

      <Header />

      <div style={styles.contentSection}>
        <div style={styles.sectionContainer}>
          <h2 style={styles.sectionTitle}>{title}</h2>
          {children}
        </div>
      </div>

      <footer style={styles.footer}>
        <span>© 2026 Solink</span>
        <span>Intelligent routing for meaningful collaboration</span>
      </footer>
    </div>
  );
}

function EditorialPage({ eyebrow, title, description, image, children }) {
  return <div style={styles.landing}><style>{globalCSS}</style><div style={styles.backgroundGlowOne} /><div style={styles.backgroundGlowTwo} /><Header /><main style={styles.editorialPage}><section style={styles.editorialHero}><div><span style={styles.sectionKicker}>{eyebrow}</span><h1 style={styles.editorialTitle}>{title}</h1><p style={styles.editorialDescription}>{description}</p></div><img src={image} alt="Community work in progress" style={styles.editorialHeroImage} /></section><div style={styles.editorialContent}>{children}</div></main><footer style={styles.footer}><span>© 2026 Solink</span><span>Intelligent routing for meaningful collaboration</span></footer></div>;
}

function PartnerCard({ image, title, copy }) { return <article style={styles.partnerCard}><img src={image} alt="" style={styles.partnerImage} /><div style={styles.partnerBody}><h3>{title}</h3><p>{copy}</p></div></article>; }
function ProcessStep({ number, title, copy }) { return <article style={styles.processStep}><strong>{number}</strong><div><h3>{title}</h3><p>{copy}</p></div></article>; }
function ConnectionPanel({ title, copy, link, label }) { return <section style={styles.connectionPanel}><div><span style={styles.sectionKicker}>Continue exploring</span><h2>{title}</h2><p>{copy}</p></div><Link to={link} style={styles.connectionButton}>{label} <ArrowRight size={16} /></Link></section>; }

/* ================================================================
   DASHBOARD PAGE
================================================================ */

function DashboardPage() {
  const { role: roleParam } = useParams();
  const roleKey = roleParam || "student";
  const role = ROLES[roleKey] || ROLES.student;
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    title: "",
    category: "Water & Sanitation",
    district: "",
    village: "",
    severity: "High",
    description: "",
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState("");

  const theme = {
    accent: role.primary,
    accentDark: role.dark,
    accentSoft: role.soft,
    shell: "linear-gradient(180deg, #ffffff, #f8fafc)",
    action: `linear-gradient(135deg, ${role.primary}, ${role.dark})`,
    chipBackground: role.soft,
    chipText: role.dark,
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFormData((prev) => ({ ...prev, photo: file }));
    const objectUrl = URL.createObjectURL(file);
    setPhotoPreview(objectUrl);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(
      `Issue submitted successfully for ${formData.village || "your village"}. It has been routed for review.`
    );
  };

  const tabConfig = [
    { id: "overview", label: "Overview" },
    { id: "report", label: "New report" },
    { id: "alerts", label: "Alerts" },
    { id: "map", label: "Local map" },
  ];

  const statCards =
    roleKey === "mentor"
      ? [
          { label: "Teams guided", value: "21", trend: "+4 this month" },
          { label: "Projects active", value: "14", trend: "Across 5 districts" },
          { label: "Student matches", value: "63", trend: "13 pending review" },
          { label: "Mentor hours", value: "186", trend: "+22% this week" },
        ]
      : roleKey === "publisher"
      ? [
          { label: "Challenges raised", value: "96", trend: "+12 this month" },
          { label: "Under evaluation", value: "17", trend: "9 new this week" },
          { label: "Institutions linked", value: "08", trend: "3 universities active" },
          { label: "Solved cases", value: "41", trend: "+6 this week" },
        ]
      : [
          { label: "Reports submitted", value: "248", trend: "+18 this month" },
          { label: "Under review", value: "41", trend: "Across 6 districts" },
          { label: "Matched to partners", value: "16", trend: "3 universities engaged" },
          { label: "Resolved", value: "72", trend: "+9 this week" },
        ];

  const renderOverview = () => (
    <>
      <div style={styles.statsGrid}>
        {statCards.map((card) => (
          <div key={card.label} style={styles.statCard}>
            <div style={styles.statLabel}>{card.label}</div>
            <div style={styles.statValue}>{card.value}</div>
            <div style={{ ...styles.statTrend, color: theme.accent }}>{card.trend}</div>
          </div>
        ))}
      </div>

      <div style={styles.overviewGrid}>
        <div style={{ ...styles.featureCardLarge, borderColor: `${theme.accent}26` }}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>Impact snapshot</div>
            <span style={{ ...styles.pillSuccess, background: theme.accentSoft, color: theme.accentDark }}>Live</span>
          </div>
          <div style={styles.progressList}>
            <div style={styles.progressRow}>
              <div>
                <div style={styles.progressLabel}>{roleKey === "mentor" ? "Mentorship coverage" : roleKey === "publisher" ? "Problem routing" : "Water access"}</div>
                <div style={styles.progressMeta}>Current community demand</div>
              </div>
              <strong style={{ ...styles.progressValue, color: theme.accent }}>72%</strong>
            </div>
            <div style={styles.progressBarTrack}>
              <div style={{ ...styles.progressBarFill, width: "72%", background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentDark})` }} />
            </div>

            <div style={styles.progressRow}>
              <div>
                <div style={styles.progressLabel}>{roleKey === "mentor" ? "Team readiness" : roleKey === "publisher" ? "Partner response" : "Road safety"}</div>
                <div style={styles.progressMeta}>Operational health</div>
              </div>
              <strong style={{ ...styles.progressValue, color: theme.accent }}>58%</strong>
            </div>
            <div style={styles.progressBarTrack}>
              <div style={{ ...styles.progressBarFill, width: "58%", background: "linear-gradient(90deg, #f59e0b, #fbbf24)" }} />
            </div>

            <div style={styles.progressRow}>
              <div>
                <div style={styles.progressLabel}>{roleKey === "mentor" ? "Student engagement" : roleKey === "publisher" ? "Submission quality" : "Healthcare outreach"}</div>
                <div style={styles.progressMeta}>Delivery confidence</div>
              </div>
              <strong style={{ ...styles.progressValue, color: theme.accent }}>86%</strong>
            </div>
            <div style={styles.progressBarTrack}>
              <div style={{ ...styles.progressBarFill, width: "86%", background: "linear-gradient(90deg, #14b8a6, #34d399)" }} />
            </div>
          </div>
        </div>

        <div style={{ ...styles.featureCardLarge, borderColor: `${theme.accent}26` }}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>Regional demand</div>
            <span style={styles.pillNeutral}>Updated 2m ago</span>
          </div>
          <div style={styles.regionTable}>
            <div style={styles.regionRow}><span>Ganjam</span><strong>34</strong></div>
            <div style={styles.regionRow}><span>Rayagada</span><strong>28</strong></div>
            <div style={styles.regionRow}><span>Koraput</span><strong>21</strong></div>
            <div style={styles.regionRow}><span>Khordha</span><strong>19</strong></div>
          </div>
        </div>
      </div>
    </>
  );

  const renderReport = () => (
    <div style={styles.reportLayout}>
      <form onSubmit={handleSubmit} style={styles.reportForm}>
        <div style={styles.formHeaderRow}>
          <div>
            <div style={{ ...styles.formEyebrow, color: theme.accentDark }}>New issue</div>
            <h2 style={styles.formTitle}>Report a rural problem</h2>
          </div>
          <div style={{ ...styles.statusPill, background: theme.accentSoft, color: theme.accentDark }}>
            <CheckCircle2 size={14} />
            Verified need
          </div>
        </div>

        <div style={styles.formGrid}>
          <label style={styles.fieldWrap}>
            <span style={styles.fieldLabel}>Issue title</span>
            <input
              name="title"
              value={formData.title}
              onChange={handleFieldChange}
              placeholder="Broken handpump in the school area"
              style={styles.fieldInput}
            />
          </label>

          <label style={styles.fieldWrap}>
            <span style={styles.fieldLabel}>Category</span>
            <select
              name="category"
              value={formData.category}
              onChange={handleFieldChange}
              style={styles.fieldInput}
            >
              <option>Water & Sanitation</option>
              <option>Road & Transport</option>
              <option>Healthcare</option>
              <option>Education</option>
              <option>Electricity</option>
              <option>Waste Management</option>
            </select>
          </label>

          <label style={styles.fieldWrap}>
            <span style={styles.fieldLabel}>District</span>
            <input
              name="district"
              value={formData.district}
              onChange={handleFieldChange}
              placeholder="e.g. East Godavari"
              style={styles.fieldInput}
            />
          </label>

          <label style={styles.fieldWrap}>
            <span style={styles.fieldLabel}>Village / locality</span>
            <input
              name="village"
              value={formData.village}
              onChange={handleFieldChange}
              placeholder="e.g. Kothapalli"
              style={styles.fieldInput}
            />
          </label>

          <label style={styles.fieldWrap}>
            <span style={styles.fieldLabel}>Severity</span>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleFieldChange}
              style={styles.fieldInput}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </label>

          <label style={styles.fieldWrap}>
            <span style={styles.fieldLabel}>Coordinates</span>
            <input
              value="17.1234° N, 82.4312° E"
              readOnly
              style={{ ...styles.fieldInput, background: "#F9FAFB" }}
            />
          </label>
        </div>

        <label style={styles.fieldWrap}>
          <span style={styles.fieldLabel}>Problem details</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleFieldChange}
            placeholder="Describe what is happening, how it impacts the community, and any urgency or history of the issue."
            style={styles.textArea}
          />
        </label>

        <div style={styles.uploadSection}>
          <div style={{ ...styles.uploadBox, borderColor: `${theme.accent}4d`, background: theme.accentSoft }}>
            <input
              id="issue-photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="issue-photo" style={{ ...styles.uploadLabel, color: theme.accentDark }}>
              <Camera size={20} />
              Upload photo evidence
            </label>

            {photoPreview ? (
              <img src={photoPreview} alt="Issue preview" style={styles.previewImage} />
            ) : (
              <div style={{ ...styles.placeholderImage, color: theme.accentDark, background: `${theme.accent}12` }}>
                <UploadCloud size={24} />
                Add a clear image of the issue
              </div>
            )}
          </div>

          <div style={styles.supportingBox}>
            <div style={styles.supportingTitle}>Optional supporting documents</div>
            <div style={styles.supportingItem}>
              <FileText size={16} />
              Attendance / complaint copy
            </div>
            <div style={styles.supportingItem}>
              <FileText size={16} />
              Community note or local referral
            </div>
            <button type="button" style={{ ...styles.secondaryButton, borderColor: `${theme.accent}55` }}>
              Add file
            </button>
          </div>
        </div>

        <div style={styles.submitRow}>
          <label style={styles.checkboxRow}>
            <input type="checkbox" defaultChecked />
            I confirm this issue is from a real community need and can be reviewed.
          </label>
          <button type="submit" style={{ ...styles.primarySubmitButton, background: theme.action }}>
            Submit issue for review
          </button>
        </div>
      </form>

      <aside style={styles.sidePanel}>
        <div style={styles.sideCard}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>Live community updates</div>
            <span style={styles.dotBadge} />
          </div>
          <div style={styles.updateItem}>
            <strong>Water tank repair</strong>
            <span>2 nearby villages flagged</span>
          </div>
          <div style={styles.updateItem}>
            <strong>School sanitation</strong>
            <span>Mentor team matched</span>
          </div>
          <div style={styles.updateItem}>
            <strong>Road blockage</strong>
            <span>Pending district review</span>
          </div>
        </div>

        <div style={styles.sideCard}>
          <div style={styles.cardTitle}>Checklist before submission</div>
          <ul style={styles.checkList}>
            <li>Photo evidence attached</li>
            <li>Village name confirmed</li>
            <li>Impact on residents noted</li>
            <li>Priority level selected</li>
          </ul>
        </div>
      </aside>
    </div>
  );

  const renderAlerts = () => (
    <div style={styles.alertGrid}>
      <div style={{ ...styles.alertCardAccent, borderColor: `${theme.accent}55` }}>
        <div style={styles.alertHeaderRow}>
          <span style={{ ...styles.alertChip, background: `${theme.accent}1a`, color: theme.accentDark }}>High priority</span>
          <span style={styles.timeStamp}>14 min ago</span>
        </div>
        <h3 style={styles.alertTitle}>Broken handpump near school</h3>
        <p style={styles.alertText}>Village residents reported water shortage affecting 120 households.</p>
        <div style={styles.alertMeta}>Kothapalli • East Godavari</div>
      </div>

      <div style={styles.alertCardWarning}>
        <div style={styles.alertHeaderRow}>
          <span style={styles.alertChipWarning}>Needs review</span>
          <span style={styles.timeStamp}>1 hour ago</span>
        </div>
        <h3 style={styles.alertTitle}>Road washout after rain</h3>
        <p style={styles.alertText}>Reduced access to clinic and market during monsoon conditions.</p>
        <div style={styles.alertMeta}>Madhurapalli • Srikakulam</div>
      </div>

      <div style={styles.alertCardSuccess}>
        <div style={styles.alertHeaderRow}>
          <span style={styles.alertChipSuccess}>Resolved</span>
          <span style={styles.timeStamp}>Today</span>
        </div>
        <h3 style={styles.alertTitle}>Street light repair completed</h3>
        <p style={styles.alertText}>District maintenance team completed repair and validated the fix.</p>
        <div style={styles.alertMeta}>Narayana peta • Vizianagaram</div>
      </div>
    </div>
  );

  const renderMap = () => (
    <div style={styles.mapGrid}>
      <div style={styles.mapCard}>
        <div style={styles.cardHeader}>
          <div style={styles.cardTitle}>Local issue map</div>
          <span style={styles.pillNeutral}>Live coverage</span>
        </div>
        <div style={{ ...styles.mapCanvas, background: `linear-gradient(135deg, ${theme.accentSoft}, #ecfeff, #f0fdf4)` }}>
          <div style={{ ...styles.mapMarkerOne, background: theme.accent }}>1</div>
          <div style={{ ...styles.mapMarkerTwo, background: "#f59e0b" }}>3</div>
          <div style={{ ...styles.mapMarkerThree, background: "#10b981" }}>7</div>
          <div style={styles.mapLegend}>
            <span><b style={{ color: theme.accent }}>●</b> {roleKey === "mentor" ? "Mentor task" : roleKey === "publisher" ? "Routed issue" : "Critical"}</span>
            <span><b style={{ color: "#f59e0b" }}>●</b> Medium</span>
            <span><b style={{ color: "#10b981" }}>●</b> Resolved</span>
          </div>
        </div>
      </div>

      <div style={styles.sideCard}>
        <div style={styles.cardTitle}>Nearby interventions</div>
        <ul style={styles.checkList}>
          <li>Water task force assigned to Kothapalli</li>
          <li>Road maintenance team dispatched near Maliya</li>
          <li>School sanitation audit planned for Friday</li>
          <li>Mobile health camp scheduled in Araku</li>
        </ul>
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (activeTab === "overview") return renderOverview();
    if (activeTab === "report") return renderReport();
    if (activeTab === "alerts") return renderAlerts();
    return renderMap();
  };

  return (
    <div style={{ ...styles.dashboardPage, background: "linear-gradient(135deg, #0f172a 0%, #1a1f3a 50%, #0f172a 100%)" }}>
      <style>{globalCSS}</style>
      <div style={styles.backgroundGlowOne} />
      <div style={styles.backgroundGlowTwo} />

      <Header />

      <main style={styles.dashboardShell}>
        <aside style={{ ...styles.sidebarPanel, borderColor: `${theme.accent}25`, boxShadow: `0 20px 38px ${theme.accent}08` }}>
          <div style={styles.profileCard}>
            <div style={{ ...styles.avatarBadge, background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDark})` }}>{role.label.charAt(0)}</div>
            <div>
              <div style={styles.profileName}>{role.label} workspace</div>
              <div style={styles.profileMeta}>Logged in as {role.label.toLowerCase()}</div>
            </div>
          </div>

          <nav style={styles.navStack}>
            {tabConfig.map(({ id, label }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  style={
                    isActive
                      ? { ...styles.sideNavButtonActive, background: theme.accentSoft, color: theme.accentDark }
                      : styles.sideNavButton
                  }
                >
                  {label}
                </button>
              );
            })}
          </nav>

          <div style={{ ...styles.quickInfoBox, background: `linear-gradient(135deg, ${theme.accentSoft}, #ffffff)` }}>
            <div style={{ ...styles.quickInfoLabel, color: theme.accentDark }}>Priority</div>
            <div style={{ ...styles.quickInfoValue, color: theme.accentDark }}>Main village road</div>
            <div style={styles.quickInfoMeta}>12 reports reviewed this week</div>
          </div>
        </aside>

        <section style={styles.dashboardContent}>
          <div style={styles.dashboardHeader}>
            <div>
              <div style={{ ...styles.headerEyebrow, color: theme.accent }}>Community issue desk</div>
              <h1 style={{ ...styles.dashboardTitle, color: "#f8fafc" }}>{role.label} dashboard</h1>
            </div>
            <button type="button" style={{ ...styles.helpButton, background: theme.accentSoft, color: theme.accentDark, borderColor: `${theme.accent}20` }}>
              Need help?
            </button>
          </div>

          {renderTabContent()}
        </section>
      </main>
    </div>
  );
}

/* ================================================================
   LANDING PAGE (OLD)
================================================================ */

function LandingPageOld({ onSelectRole }) {
  return (
    <div style={styles.landing}>
      <style>{globalCSS}</style>

      {/* Background decoration */}
      <div style={styles.backgroundGlowOne} />
      <div style={styles.backgroundGlowTwo} />

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>
            <Sparkles size={19} />
          </div>

          <div>
            <div style={styles.logo}>Solink</div>
            <div style={styles.logoSubtitle}>
              Intelligent Problem Routing
            </div>
          </div>
        </div>

        <nav style={styles.navMenu}>
          <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about').scrollIntoView({ behavior: 'smooth' }); }} style={styles.navLink}>About</a>
          <a href="#collab" onClick={(e) => { e.preventDefault(); document.getElementById('collab').scrollIntoView({ behavior: 'smooth' }); }} style={styles.navLink}>Collab</a>
          <a href="#solutions" onClick={(e) => { e.preventDefault(); document.getElementById('solutions').scrollIntoView({ behavior: 'smooth' }); }} style={styles.navLink}>Solutions</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }); }} style={styles.navLink}>Contact</a>
        </nav>

        <div style={styles.headerActions}>
          <button style={styles.primaryButton}>Get Started</button>
        </div>
      </header>

      {/* Main */}
      <main style={styles.landingMain}>
        <div style={styles.heroRow}>
          <div style={styles.heroText}>
            <div style={styles.eyebrow}>
              <span style={styles.eyebrowDot} />
              CONNECT • COLLABORATE • SOLVE
            </div>

            <h1 style={styles.heroTitle}>
              Problems find the
              <br />
              <span>right people.</span>
            </h1>

            <p style={styles.heroDescription}>
              Solink intelligently connects real-world challenges
              with the universities, mentors and students best equipped
              to solve them.
            </p>
          </div>

          <div style={styles.heroVisual}>
            <div style={styles.heroImageCard}>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                alt="Students and mentors collaborating"
                style={styles.heroImage}
              />
            </div>
          </div>
        </div>

        <div style={styles.roleSection}>
          <div style={styles.chooseText}>
            <span>01</span>
            <div>
              <strong>Choose your role</strong>
              <p>Tell us how you'll be using Solink.</p>
            </div>
          </div>

          <div style={styles.roleGrid}>
            <RoleCard
              roleKey="mentor"
              role={ROLES.mentor}
              onClick={() => onSelectRole("mentor")}
            />

            <RoleCard
              roleKey="student"
              role={ROLES.student}
              onClick={() => onSelectRole("student")}
            />

            <RoleCard
              roleKey="publisher"
              role={ROLES.publisher}
              onClick={() => onSelectRole("publisher")}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <span>© 2026 Solink</span>
        <span>Intelligent routing for meaningful collaboration</span>
      </footer>
    </div>
  );
}

/* ================================================================
   ROLE CARD
================================================================ */

function RoleCard({ role, onClick }) {
  const Icon = role.icon;

  return (
    <button
      onClick={onClick}
      className="role-card"
      style={{
        ...styles.roleCard,
        "--role-color": role.primary,
      }}
    >
      <div style={styles.roleMediaWrap}>
        <img
          src={role.image}
          alt={role.label}
          style={styles.roleMedia}
        />
      </div>

      <div style={styles.roleContent}>
        <div style={styles.roleTitle}>{role.label}</div>

        <div style={styles.roleSubtitle}>
          {role.subtitle}
        </div>
      </div>

      <div
        className="role-arrow"
        style={{
          ...styles.roleArrow,
          color: role.primary,
        }}
      >
        <ArrowRight size={19} />
      </div>
    </button>
  );
}

/* ================================================================
   LOGIN PAGE
================================================================ */

function LoginPage({
  role,
  roleKey,
  showPassword,
  setShowPassword,
  onBack,
  onLogin,
}) {
  const Icon = role.icon;

  return (
    <div
      style={{
        ...styles.loginPage,
        background: role.background,
      }}
    >
      <style>{globalCSS}</style>

      {/* Left branding section */}
      <section
        style={{
          ...styles.loginBrand,
          background: `linear-gradient(180deg, rgba(10, 13, 17, 0.56), rgba(10, 13, 17, 0.72)), url(${role.image}) center/cover no-repeat`,
        }}
      >
        <button
          onClick={onBack}
          style={styles.backButton}
        >
          <ChevronLeft size={17} />
          Change role
        </button>

        <div style={styles.brandInner}>
          <div
            style={{
              ...styles.brandIcon,
              background: "rgba(255,255,255,0.12)",
            }}
          >
            <Icon size={32} />
          </div>

          <div style={styles.brandRole}>
            {role.label}
          </div>

          <h1 style={styles.brandTitle}>
            {roleKey === "mentor" && (
              <>
                Guide the next
                <br />
                generation.
              </>
            )}

            {roleKey === "student" && (
              <>
                Build something
                <br />
                that matters.
              </>
            )}

            {roleKey === "publisher" && (
              <>
                Turn problems
                <br />
                into solutions.
              </>
            )}
          </h1>

          <p style={styles.brandDescription}>
            {role.description}
          </p>

          <div style={styles.brandFeatures}>
            {roleKey === "mentor" && (
              <>
                <Feature text="Review matched challenges" />
                <Feature text="Guide student teams" />
                <Feature text="Track project progress" />
              </>
            )}

            {roleKey === "student" && (
              <>
                <Feature text="Discover relevant projects" />
                <Feature text="Collaborate with mentors" />
                <Feature text="Build real-world solutions" />
              </>
            )}

            {roleKey === "publisher" && (
              <>
                <Feature text="Submit real-world problems" />
                <Feature text="Reach the right experts" />
                <Feature text="Track solution progress" />
              </>
            )}
          </div>
        </div>

        <div style={styles.brandFooter}>
          <Sparkles size={14} />
          Powered by intelligent problem routing
        </div>
      </section>

      {/* Right login section */}
      <section style={styles.loginContent}>
        <div style={styles.loginBox}>
          <div
            style={{
              ...styles.smallRoleIcon,
              background: role.soft,
              color: role.primary,
            }}
          >
            <Icon size={20} />
          </div>

          <div style={styles.loginEyebrow}>
            {role.label.toUpperCase()} PORTAL
          </div>

          <h2 style={styles.loginTitle}>
            Welcome back
          </h2>

          <p style={styles.loginSubtitle}>
            Sign in to continue to your Solink workspace.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (onLogin) {
                onLogin();
                return;
              }
              alert(`${role.label} login clicked`);
            }}
          >
            <label style={styles.label}>
              Email address
            </label>

            <div style={styles.inputWrapper}>
              <Mail
                size={17}
                color="#98A2B3"
              />

              <input
                type="email"
                placeholder={
                  roleKey === "student"
                    ? "student@university.edu"
                    : roleKey === "mentor"
                    ? "mentor@university.edu"
                    : "author@organisation.com"
                }
                style={styles.input}
              />
            </div>

            <label style={{ ...styles.label, marginTop: 18 }}>
              Password
            </label>

            <div style={styles.inputWrapper}>
              <Lock
                size={17}
                color="#98A2B3"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                style={styles.input}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>

            <div style={styles.loginOptions}>
              <label style={styles.remember}>
                <input type="checkbox" />
                Remember me
              </label>

              <button
                type="button"
                style={{
                  ...styles.forgot,
                  color: role.primary,
                }}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="login-button"
              style={{
                ...styles.loginButton,
                background: role.primary,
              }}
            >
              Sign in
              <ArrowRight size={17} />
            </button>
          </form>

          <div style={styles.divider}>
            <span />
            <small>OR</small>
            <span />
          </div>

          <button
            type="button"
            style={styles.demoButton}
          >
            Continue with demo account
          </button>

          <p style={styles.loginFooter}>
            Don't have an account?{" "}
            <button
              style={{
                ...styles.createAccount,
                color: role.primary,
              }}
            >
              Create account
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}

/* ================================================================
   FEATURE
================================================================ */

function Feature({ text }) {
  return (
    <div style={styles.feature}>
      <div style={styles.featureCheck}>✓</div>
      <span>{text}</span>
    </div>
  );
}

/* ================================================================
   GLOBAL STYLES
================================================================ */

const globalCSS = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family:
      Inter,
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  }

  button,
  input {
    font: inherit;
  }

  button {
    cursor: pointer;
  }

  .role-card {
    transition:
      transform 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease;
  }

  .role-card:hover {
    transform: translateY(-4px);
    border-color: var(--role-color) !important;
    box-shadow:
      0 18px 40px rgba(16, 24, 40, 0.09);
  }

  .role-card:hover .role-arrow {
    transform: translateX(4px);
  }

  .role-arrow {
    transition: transform 180ms ease;
  }

  .login-button {
    transition:
      transform 150ms ease,
      box-shadow 150ms ease;
  }

  .login-button:hover {
    transform: translateY(-1px);
    box-shadow:
      0 10px 22px rgba(16, 24, 40, 0.14);
  }

  @media (max-width: 900px) {
    .role-grid {
      grid-template-columns: 1fr !important;
    }
  }

  @media (max-width: 760px) {
    .login-page {
      display: block !important;
    }

    .login-brand {
      min-height: 390px !important;
      padding: 28px !important;
    }

    .brand-title {
      font-size: 36px !important;
    }

    .login-content {
      padding: 35px 20px !important;
    }

    .header-badge {
      display: none !important;
    }

    .hero-title {
      font-size: 45px !important;
    }
  }

  @media (max-width: 980px) {
    .hero-row {
      grid-template-columns: 1fr !important;
    }

    .hero-image-card {
      max-width: 100% !important;
    }
  }
`;

/* ================================================================
   STYLES
================================================================ */

const styles = {
  landing: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(135deg, #0f172a 0%, #1a1f3a 50%, #0f172a 100%)",
    color: "#ffffff",
  },

  backgroundGlowOne: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: "rgba(217, 119, 6, 0.06)",
    filter: "blur(100px)",
    top: -150,
    right: 50,
    pointerEvents: "none",
  },

  backgroundGlowTwo: {
    position: "absolute",
    width: 450,
    height: 450,
    borderRadius: "50%",
    background: "rgba(59, 130, 246, 0.04)",
    filter: "blur(90px)",
    bottom: -100,
    left: 100,
    pointerEvents: "none",
  },

  header: {
    height: 72,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 6%",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    background: "rgba(15, 23, 42, 0.7)",
    backdropFilter: "blur(10px)",
    position: "relative",
    zIndex: 2,
  },

  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "linear-gradient(135deg, #d97706, #f59e0b)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
  },

  logoMark: { fontSize: 24, fontWeight: 900, fontFamily: "Georgia, serif", lineHeight: 1, fontStyle: "italic" },

  logo: {
    fontSize: 18,
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: "#ffffff",
  },

  logoSubtitle: {
    fontSize: 11,
    color: "#cbd5e1",
    marginTop: 2,
    fontWeight: 500,
  },

  navMenu: {
    display: "flex",
    alignItems: "center",
    gap: 32,
  },

  navLink: {
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "color 200ms ease",
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  textButton: {
    background: "transparent",
    border: "none",
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: 500,
  },

  primaryButton: {
    border: "none",
    background: "linear-gradient(135deg, #d97706, #f59e0b)",
    color: "#ffffff",
    borderRadius: 8,
    padding: "12px 24px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    transition: "transform 200ms ease, box-shadow 200ms ease",
  },

  landingMain: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "64px 28px 40px",
    position: "relative",
    zIndex: 1,
  },

  heroRow: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    alignItems: "center",
    gap: 28,
  },

  heroText: {
    maxWidth: 760,
  },

  heroVisual: {
    display: "flex",
    justifyContent: "center",
  },

  heroImageCard: {
    position: "relative",
    width: "100%",
    maxWidth: 420,
    borderRadius: 28,
    overflow: "hidden",
    border: "1px solid rgba(23, 19, 18, 0.08)",
    background: "#F5EEE8",
    boxShadow: "0 26px 60px rgba(26, 18, 12, 0.08)",
  },

  heroImage: {
    display: "block",
    width: "100%",
    height: 520,
    objectFit: "cover",
  },

  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.05em",
    marginBottom: 20,
  },

  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#f59e0b",
  },

  heroTitle: {
    fontSize: "clamp(52px, 6vw, 92px)",
    lineHeight: 1.08,
    letterSpacing: "-0.02em",
    margin: 0,
    fontWeight: 900,
    color: "#ffffff",
    textShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
  },

  heroDescription: {
    fontSize: 17,
    lineHeight: 1.8,
    color: "#cbd5e1",
    maxWidth: 660,
    marginTop: 28,
    fontWeight: 400,
  },

  roleSection: {
    marginTop: 90,
  },

  chooseText: {
    display: "flex",
    alignItems: "flex-start",
    gap: 18,
    marginBottom: 32,
  },

  chooseTextSpan: {
    color: "#64748B",
  },

  roleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 18,
  },

  roleCard: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    textAlign: "left",
    width: "100%",
    minHeight: 200,
    padding: 28,
    borderRadius: 16,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.4))",
    backdropFilter: "blur(8px)",
    color: "#ffffff",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 300ms ease",
  },

  roleMediaWrap: {
    position: "relative",
    width: 92,
    height: 120,
    borderRadius: 16,
    overflow: "hidden",
    flexShrink: 0,
    border: "1px solid rgba(23, 19, 18, 0.06)",
  },

  roleMedia: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  roleMediaBadge: {
    position: "absolute",
    left: 8,
    bottom: 8,
    width: 28,
    height: 28,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.12)",
  },

  roleIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 8px 20px rgba(217, 119, 6, 0.12)",
    background: "linear-gradient(135deg, #FEF3C7, #FEE5B3)",
  },

  roleContent: {
    marginLeft: 16,
    paddingRight: 28,
  },

  roleTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "#ffffff",
    letterSpacing: "-0.01em",
  },

  roleSubtitle: {
    fontSize: 13,
    lineHeight: 1.6,
    color: "#cbd5e1",
    marginTop: 8,
    fontWeight: 400,
  },

  roleArrow: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    maxWidth: 1120,
    margin: "0 auto",
    padding: "0 28px 30px",
    fontSize: 12,
    color: "#94a3b8",
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
    marginTop: 100,
    paddingTop: 30,
  },

  /* LOGIN */

  loginPage: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "43% 57%",
    background: "#F7F4F1",
  },

  loginBrand: {
    position: "relative",
    minHeight: "100vh",
    color: "#fff",
    padding: "30px 6vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
    background: "linear-gradient(180deg, #B8632A 0%, #A95B2E 100%)",
    boxShadow: "none",
    backgroundBlendMode: "multiply",
  },

  backButton: {
    width: "fit-content",
    display: "flex",
    alignItems: "center",
    gap: 5,
    border: "none",
    background: "transparent",
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    padding: 0,
  },

  brandInner: {
    maxWidth: 450,
    position: "relative",
    zIndex: 1,
  },

  brandIcon: {
    width: 66,
    height: 66,
    borderRadius: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },

  brandRole: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.13em",
    opacity: 0.7,
  },

  brandTitle: {
    fontSize: "clamp(42px, 4.3vw, 64px)",
    lineHeight: 1.03,
    letterSpacing: "-0.04em",
    margin: "12px 0 20px",
    fontWeight: 800,
  },

  brandDescription: {
    fontSize: 15,
    lineHeight: 1.7,
    maxWidth: 420,
    color: "rgba(255,255,255,0.74)",
  },

  brandFeatures: {
    marginTop: 35,
    display: "flex",
    flexDirection: "column",
    gap: 13,
  },

  feature: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 13,
    color: "rgba(255,255,255,0.86)",
  },

  featureCheck: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.13)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
  },

  brandFooter: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 11,
    color: "rgba(255,255,255,0.55)",
  },

  loginContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    background: "#F7F4F1",
  },

  loginBox: {
    width: "100%",
    maxWidth: 430,
  },

  smallRoleIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  loginEyebrow: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.12em",
    color: "#8F6D5B",
  },

  loginTitle: {
    fontSize: 36,
    letterSpacing: "-0.035em",
    margin: "7px 0 8px",
    color: "#2E241D",
  },

  loginSubtitle: {
    fontSize: 13,
    lineHeight: 1.6,
    color: "#735F54",
    margin: "0 0 30px",
  },

  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 650,
    color: "#5C4A42",
    marginBottom: 7,
  },

  inputWrapper: {
    height: 48,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 13px",
    background: "#FFFFFF",
    border: "1px solid rgba(23, 19, 18, 0.12)",
    borderRadius: 10,
  },

  input: {
    border: "none",
    outline: "none",
    flex: 1,
    width: "100%",
    fontSize: 13,
    color: "#2E241D",
    background: "transparent",
  },

  eyeButton: {
    border: "none",
    background: "transparent",
    color: "#8C6D5D",
    padding: 3,
    display: "flex",
  },

  loginOptions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "14px 0 22px",
  },

  remember: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11.5,
    color: "#6F5A4F",
  },

  forgot: {
    border: "none",
    background: "transparent",
    fontSize: 11.5,
    fontWeight: 650,
    padding: 0,
  },

  loginButton: {
    width: "100%",
    height: 48,
    border: "none",
    borderRadius: 10,
    color: "#fff",
    fontWeight: 700,
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  divider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "25px 0",
    color: "#A68973",
  },

  dividerSpan: {
    flex: 1,
  },

  demoButton: {
    width: "100%",
    height: 45,
    border: "1px solid #E5D7C9",
    borderRadius: 10,
    background: "#FFFDFB",
    color: "#4A3A31",
    fontSize: 12.5,
    fontWeight: 600,
  },

  loginFooter: {
    textAlign: "center",
    color: "#8C6D5D",
    fontSize: 11.5,
    marginTop: 24,
  },

  createAccount: {
    border: "none",
    background: "transparent",
    fontWeight: 700,
    padding: 0,
  },

  /* CONTENT SECTIONS */

  contentSection: {
    padding: "80px 5vw",
    borderTop: "1px solid rgba(15, 23, 42, 0.08)",
    background: "#F3F7F8",
  },

  sectionContainer: {
    maxWidth: 1000,
    margin: "0 auto",
  },

  sectionTitle: {
    fontSize: "clamp(32px, 4vw, 48px)",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    margin: "0 0 30px 0",
    color: "#171312",
  },

  subsectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#2E241D",
    margin: "28px 0 14px 0",
  },

  sectionContent: {
    fontSize: 15,
    lineHeight: 1.8,
    color: "#5C514C",
  },

  bulletList: {
    marginLeft: 20,
    color: "#5C514C",
  },

  numberList: {
    marginLeft: 20,
    color: "#5C514C",
  },

  contactInfo: {
    background: "#F8F5F2",
    padding: 20,
    borderRadius: 12,
    border: "1px solid rgba(23, 19, 18, 0.08)",
    marginTop: 16,
  },

  editorialPage: { maxWidth: 1120, margin: "0 auto", padding: "76px 28px 20px", position: "relative", zIndex: 1 },
  editorialHero: { display: "grid", gridTemplateColumns: "1fr 0.85fr", gap: 54, alignItems: "center", paddingBottom: 80, borderBottom: "1px solid rgba(255,255,255,0.12)" },
  sectionKicker: { display: "block", color: "#f59e0b", fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 },
  editorialTitle: { fontSize: "clamp(42px, 5.5vw, 72px)", lineHeight: 1.02, letterSpacing: "-0.055em", margin: 0, maxWidth: 640 },
  editorialDescription: { color: "#cbd5e1", fontSize: 17, lineHeight: 1.75, maxWidth: 550, margin: "24px 0 0" },
  editorialHeroImage: { width: "100%", height: 410, objectFit: "cover", borderRadius: 20, boxShadow: "0 24px 50px rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)" },
  editorialContent: { padding: "70px 0 20px" },
  editorialIntro: { maxWidth: 850, margin: "0 auto 72px", color: "#e2e8f0", fontSize: 23, lineHeight: 1.55, letterSpacing: "-0.02em" },
  metricStrip: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: 44, fontSize: 13, color: "#94a3b8" },
  storyGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 54, alignItems: "center", margin: "66px 0" },
  storyImage: { width: "100%", minHeight: 355, height: "100%", objectFit: "cover", borderRadius: 18 },
  storyText: { color: "#cbd5e1", fontSize: 16, lineHeight: 1.75 },
  inlineLink: { display: "inline-flex", alignItems: "center", gap: 8, marginTop: 20, color: "#fbbf24", fontWeight: 700, textDecoration: "none" },
  partnerGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 },
  partnerCard: { overflow: "hidden", borderRadius: 18, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" },
  partnerImage: { display: "block", width: "100%", height: 225, objectFit: "cover" },
  partnerBody: { padding: "20px 20px 23px", color: "#cbd5e1", lineHeight: 1.6, fontSize: 14 },
  processList: { borderTop: "1px solid rgba(255,255,255,0.12)" },
  processStep: { display: "grid", gridTemplateColumns: "120px 1fr", gap: 30, padding: "30px 0", borderBottom: "1px solid rgba(255,255,255,0.12)", color: "#cbd5e1", fontSize: 16, lineHeight: 1.65 },
  connectionPanel: { marginTop: 70, padding: "38px 42px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, borderRadius: 20, background: "linear-gradient(125deg, rgba(245,158,11,0.22), rgba(14,165,233,0.14))", border: "1px solid rgba(255,255,255,0.14)", color: "#cbd5e1" },
  connectionButton: { flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 18px", background: "#f59e0b", color: "#111827", fontWeight: 800, borderRadius: 9, textDecoration: "none" },
  contactGrid: { display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 70, alignItems: "start" },
  contactDetails: { color: "#cbd5e1", fontSize: 16, lineHeight: 1.7 },
  contactLink: { display: "block", color: "#fbbf24", fontWeight: 700, fontSize: 19, textDecoration: "none", marginTop: 28 },
  contactSmall: { display: "block", color: "#94a3b8", fontSize: 13, marginTop: 8 },
  contactForm: { display: "flex", flexDirection: "column", gap: 17, padding: 28, borderRadius: 18, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" },
  contactLabel: { display: "flex", flexDirection: "column", gap: 7, color: "#e2e8f0", fontSize: 13, fontWeight: 700 },
  contactInput: { width: "100%", background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "12px 13px", color: "#fff", outline: "none", font: "inherit" },

  dashboardPage: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#f8fafc",
    position: "relative",
  },

  dashboardShell: {
    maxWidth: 1360,
    margin: "0 auto",
    padding: "32px 28px 44px",
    display: "grid",
    gridTemplateColumns: "280px minmax(0, 1fr)",
    gap: 24,
  },

  sidebarPanel: {
    background: "rgba(15, 23, 42, 0.72)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 22,
    padding: 18,
    boxShadow: "0 16px 36px rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(12px)",
    height: "fit-content",
  },

  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 12px 18px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    marginBottom: 14,
  },

  avatarBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    background: "linear-gradient(135deg, #0F766E, #14B8A6)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
  },

  profileName: {
    fontWeight: 700,
    fontSize: 14,
    color: "#f8fafc",
   },

  profileMeta: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 3,
  },

  navStack: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  sideNavButton: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: "none",
    background: "rgba(255, 255, 255, 0.06)",
    color: "#cbd5e1",
    borderRadius: 12,
    padding: "12px 14px",
    fontWeight: 600,
    textAlign: "left",
  },

  sideNavImage: { width: 27, height: 27, objectFit: "cover", borderRadius: 8, flexShrink: 0 },

  alertGrid: { display: "grid", gap: 16 },
  alertCardAccent: { padding: 26, borderRadius: 18, background: "linear-gradient(135deg, rgba(15, 118, 110, 0.28), rgba(15, 23, 42, 0.9))", border: "1px solid rgba(20, 184, 166, 0.38)", color: "#f8fafc" },
  alertCardWarning: { padding: 26, borderRadius: 18, background: "linear-gradient(135deg, rgba(180, 83, 9, 0.26), rgba(15, 23, 42, 0.9))", border: "1px solid rgba(245, 158, 11, 0.4)", color: "#f8fafc" },
  alertCardSuccess: { padding: 26, borderRadius: 18, background: "linear-gradient(135deg, rgba(5, 150, 105, 0.25), rgba(15, 23, 42, 0.9))", border: "1px solid rgba(52, 211, 153, 0.38)", color: "#f8fafc" },
  alertHeaderRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 },
  alertChip: { padding: "6px 10px", borderRadius: 999, fontSize: 12, fontWeight: 800 },
  alertChipWarning: { padding: "6px 10px", borderRadius: 999, fontSize: 12, fontWeight: 800, color: "#fde68a", background: "rgba(245, 158, 11, 0.18)" },
  alertChipSuccess: { padding: "6px 10px", borderRadius: 999, fontSize: 12, fontWeight: 800, color: "#a7f3d0", background: "rgba(16, 185, 129, 0.18)" },
  timeStamp: { color: "#cbd5e1", fontSize: 13 },
  alertTitle: { margin: "20px 0 8px", color: "#ffffff", fontSize: 23, letterSpacing: "-0.02em" },
  alertText: { margin: 0, color: "#dbeafe", lineHeight: 1.65, fontSize: 15 },
  alertMeta: { marginTop: 18, color: "#cbd5e1", fontSize: 13, fontWeight: 700 },

  sideNavButtonActive: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: "none",
    background: "rgba(255, 255, 255, 0.12)",
    color: "#ffffff",
    borderRadius: 12,
    padding: "12px 14px",
    fontWeight: 700,
    textAlign: "left",
  },

  quickInfoBox: {
    marginTop: 18,
    background: "rgba(255, 255, 255, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
  },

  quickInfoLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#0EA5E9",
  },

  quickInfoValue: {
    fontSize: 20,
    fontWeight: 800,
    margin: "10px 0 6px",
    color: "#f8fafc",
  },

  quickInfoMeta: {
    fontSize: 12,
    color: "#cbd5e1",
  },

  dashboardContent: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },

  overviewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 20,
  },

  featureCardLarge: {
    background: "rgba(15, 23, 42, 0.72)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 22,
    padding: 22,
    boxShadow: "0 16px 28px rgba(0, 0, 0, 0.16)",
    backdropFilter: "blur(12px)",
  },

  progressList: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    marginTop: 10,
  },

  progressRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  progressLabel: {
    fontWeight: 700,
    color: "#f8fafc",
    marginBottom: 2,
  },

  progressMeta: {
    fontSize: 12,
    color: "#94a3b8",
  },

  progressValue: {
    fontSize: 16,
    color: "#f8fafc",
  },

  progressBarTrack: {
    height: 8,
    borderRadius: 999,
    background: "rgba(255, 255, 255, 0.12)",
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, #0ea5e9, #2563eb)",
  },

  regionTable: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 18,
  },

  regionRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
    color: "#e2e8f0",
    fontWeight: 600,
  },

  dashboardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: "6px 4px",
  },

  headerEyebrow: {
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#94a3b8",
    fontWeight: 700,
  },

  dashboardTitle: {
    margin: "7px 0 0",
    fontSize: "clamp(30px, 3vw, 40px)",
    letterSpacing: "-0.04em",
    color: "#f8fafc",
  },

  helpButton: {
    border: "1px solid rgba(15, 118, 110, 0.18)",
    background: "#ECFDF5",
    color: "#0F766E",
    borderRadius: 999,
    padding: "10px 16px",
    fontWeight: 700,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 16,
  },

  statCard: {
    background: "rgba(15, 23, 42, 0.72)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.16)",
  },

  statLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: 600,
  },

  statValue: {
    fontSize: 28,
    fontWeight: 800,
    color: "#f8fafc",
    margin: "10px 0 8px",
    letterSpacing: "-0.04em",
  },

  statTrend: {
    fontSize: 12,
    color: "#0F766E",
    fontWeight: 600,
  },

  reportLayout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.8fr) minmax(260px, 0.8fr)",
    gap: 24,
  },

  reportForm: {
    background: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    border: "1px solid rgba(15, 23, 42, 0.08)",
    boxShadow: "0 16px 30px rgba(15, 23, 42, 0.04)",
  },

  formHeaderRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 22,
  },

  formEyebrow: {
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#0F766E",
    fontWeight: 700,
  },

  formTitle: {
    fontSize: 28,
    letterSpacing: "-0.04em",
    margin: "8px 0 0",
    color: "#0F172A",
  },

  statusPill: {
    background: "#ECFDF5",
    color: "#0F766E",
    borderRadius: 999,
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
  },

  fieldWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 14,
  },

  fieldLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#475569",
  },

  fieldInput: {
    width: "100%",
    border: "1px solid rgba(148, 163, 184, 0.6)",
    borderRadius: 12,
    background: "#F8FAFC",
    padding: "12px 14px",
    fontSize: 14,
    color: "#0F172A",
    outline: "none",
  },

  textArea: {
    width: "100%",
    minHeight: 130,
    border: "1px solid rgba(148, 163, 184, 0.7)",
    borderRadius: 12,
    background: "#F8FAFC",
    padding: "12px 14px",
    resize: "vertical",
    fontSize: 14,
    color: "#0F172A",
    outline: "none",
  },

  uploadSection: {
    display: "grid",
    gridTemplateColumns: "1.3fr 0.7fr",
    gap: 16,
    marginTop: 16,
  },

  uploadBox: {
    border: "1px dashed rgba(15, 118, 110, 0.6)",
    background: "#F0FDFA",
    borderRadius: 18,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  uploadLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    color: "#0F766E",
    fontWeight: 700,
    cursor: "pointer",
  },

  placeholderImage: {
    minHeight: 180,
    borderRadius: 16,
    border: "1px solid rgba(15, 118, 110, 0.15)",
    background: "#ecfeff",
    color: "#0f766e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    textAlign: "center",
    padding: 14,
    fontSize: 13,
    fontWeight: 600,
  },

  previewImage: {
    width: "100%",
    height: 180,
    objectFit: "cover",
    borderRadius: 16,
    border: "1px solid rgba(15, 23, 42, 0.08)",
  },

  supportingBox: {
    background: "#F8FAFC",
    border: "1px solid rgba(148, 163, 184, 0.5)",
    borderRadius: 18,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  supportingTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0F172A",
  },

  supportingItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#475569",
  },

  secondaryButton: {
    marginTop: 8,
    border: "1px solid rgba(15, 23, 42, 0.12)",
    background: "#FFFFFF",
    borderRadius: 10,
    padding: "10px 12px",
    fontWeight: 700,
    color: "#0F172A",
  },

  submitRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 20,
    flexWrap: "wrap",
  },

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    color: "#475569",
    lineHeight: 1.5,
  },

  primarySubmitButton: {
    border: "none",
    background: "linear-gradient(135deg, #0F766E, #14B8A6)",
    color: "#fff",
    borderRadius: 12,
    padding: "12px 18px",
    fontWeight: 800,
    boxShadow: "0 12px 20px rgba(20, 184, 166, 0.2)",
  },

  sidePanel: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },

  sideCard: {
    background: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    border: "1px solid rgba(15, 23, 42, 0.08)",
    boxShadow: "0 12px 24px rgba(15, 23, 42, 0.03)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: "#0F172A",
  },

  dotBadge: {
    width: 10,
    height: 10,
    display: "inline-block",
    borderRadius: "50%",
    background: "#22C55E",
    boxShadow: "0 0 0 5px rgba(34, 197, 94, 0.12)",
  },

  updateItem: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    padding: "12px 0",
    borderTop: "1px solid rgba(148, 163, 184, 0.28)",
    color: "#334155",
  },

  checkList: {
    margin: "12px 0 0",
    paddingLeft: 18,
    color: "#475569",
    lineHeight: 1.8,
    fontSize: 14,
  },
};

export default App;

