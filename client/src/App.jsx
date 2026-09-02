import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { authService } from "./services/authService";
import { problemService } from "./services/problemService";
import { taskService } from "./services/taskService";
import { universityService } from "./services/universityService";
import { dashboardService } from "./services/dashboardService";
import { notificationService } from "./services/notificationService";
import { profileService } from "./services/profileService";
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
  Check,
  Layers,
  Brain,
  Send,
  Zap,
} from "lucide-react";

const ROLES = {
  mentor: {
    label: "Faculty Mentor",
    subtitle: "Guide projects and mentor student teams",
    icon: GraduationCap,
    primary: "#3B82F6",
    dark: "#1D4ED8",
    soft: "#3B82F620",
    textLight: "#60A5FA",
    background: "#0C182D",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    description:
      "Connect with meaningful challenges, guide student teams and help turn ideas into real-world solutions.",
  },

  student: {
    label: "Student Developer",
    subtitle: "Build solutions for real-world challenges",
    icon: UserRound,
    primary: "#10B981",
    dark: "#047857",
    soft: "#10B98120",
    textLight: "#34D399",
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
    dark: "#B45309",
    soft: "#F59E0B20",
    textLight: "#FBBF24",
    background: "#1E1406",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    description:
      "Bring real-world problems to the right university, mentor and student team through intelligent routing.",
  },

  admin: {
    label: "Platform Administrator",
    subtitle: "Manage system governance and platform metrics",
    icon: ShieldCheck,
    primary: "#A855F7",
    dark: "#6B21A8",
    soft: "#A855F720",
    textLight: "#C084FC",
    background: "#1B0B2E",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    description:
      "Oversee user accounts, monitor AI classification accuracy, and manage platform governance.",
  },
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/collab" element={<CollabPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<RoleSelectionPage />} />
          <Route path="/login/:role" element={<LoginPageWrapper />} />
          <Route
            path="/dashboard/:role"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

/* ================================================================
   HEADER COMPONENT
================================================================ */

function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showBellDropdown, setShowBellDropdown] = useState(false);

  const loadNotifications = async () => {
    if (!isAuthenticated || !user) return;
    try {
      const [countRes, listRes] = await Promise.all([
        notificationService.getUnreadCount().catch(() => ({ unreadCount: 0 })),
        notificationService.getNotifications().catch(() => []),
      ]);
      setUnreadCount(countRes?.unreadCount || 0);
      if (Array.isArray(listRes)) setNotifications(listRes);
    } catch (_err) {
      // Ignore background notification polling errors
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setUnreadCount(0);
      setNotifications([]);
      return;
    }
    loadNotifications();
    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (n) => {
    try {
      if (!n.isRead) {
        await notificationService.markAsRead(n.id);
        await loadNotifications();
      }
      setShowBellDropdown(false);
      navigate("/collab");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.logoArea}>
        <div style={styles.logoIcon}>
          <span style={styles.logoMark}>S</span>
        </div>

        <div>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={styles.logo}>Solink AI</div>
            <div style={styles.logoSubtitle}>
              Intelligent Problem Routing
            </div>
          </Link>
        </div>
      </div>

      <nav style={styles.navMenu}>
        <Link to="/" style={styles.navLink}>Home</Link>
        <Link to="/about" style={styles.navLink}>About</Link>
        <Link to="/collab" style={styles.navLink}>Collab & AI Pipeline</Link>
        <Link to="/solutions" style={styles.navLink}>Solutions</Link>
        <Link to="/contact" style={styles.navLink}>Contact</Link>
      </nav>

      <div style={styles.headerActions}>
        {isAuthenticated ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
            {/* Notification Bell Icon */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setShowBellDropdown(!showBellDropdown)}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "50%",
                  width: 38,
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -2,
                      right: -2,
                      background: "#ef4444",
                      color: "#fff",
                      borderRadius: "50%",
                      fontSize: 10,
                      fontWeight: 700,
                      width: 18,
                      height: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #0f172a",
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Menu */}
              {showBellDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: 46,
                    right: 0,
                    width: 340,
                    maxHeight: 420,
                    overflowY: "auto",
                    background: "#1e293b",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: 12,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                    zIndex: 9999,
                    padding: 14,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #ffffff15" }}>
                    <strong style={{ color: "#fff", fontSize: 14 }}>In-App Notifications ({unreadCount} Unread)</strong>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        style={{ background: "none", border: "none", color: "#38bdf8", fontSize: 11, cursor: "pointer" }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {notifications.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          style={{
                            background: n.isRead ? "#0f172a80" : "#3b82f61a",
                            border: n.isRead ? "1px solid #334155" : "1px solid #3b82f655",
                            borderRadius: 8,
                            padding: 10,
                            cursor: "pointer",
                            transition: "background 150ms ease",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <strong style={{ color: n.isRead ? "#cbd5e1" : "#60a5fa", fontSize: 12 }}>{n.title}</strong>
                            <span style={{ fontSize: 10, color: "#64748b" }}>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p style={{ color: "#94a3b8", fontSize: 12, margin: 0, lineHeight: 1.4 }}>{n.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: "#64748b", fontSize: 13, textAlign: "center", padding: "16px 0" }}>
                      No notifications yet.
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => navigate(`/dashboard/${(user?.role || "student").toLowerCase()}`)}
              style={{ ...styles.primaryButton, padding: "8px 16px", background: "linear-gradient(135deg, #4f7bff, #1e3a8a)" }}
            >
              <UserRound size={16} style={{ marginRight: 6 }} />
              {user?.name ? user.name.split(" ")[0] : "User"} ({user?.role})
            </button>

            <button
              onClick={() => { logout(); navigate("/"); }}
              style={{ ...styles.secondaryButton, padding: "8px 14px", color: "#f87171", borderColor: "#f8717155" }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button onClick={() => navigate("/login")} style={styles.primaryButton}>Get Started / Login</button>
        )}
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
   ABOUT PAGE
================================================================ */

function AboutPage() {
  return <EditorialPage eyebrow="WHY SOLINK" title="Better routes for the problems that matter." description="A practical bridge between the people who know a place best and the teams with the tools to improve it." image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85"><section style={styles.editorialIntro}><p>Most local problems are noticed early, but they rarely reach the people who can act. Solink gives each report a clear path — from the community to the right university, mentor and delivery partner.</p><div style={styles.metricStrip}><div><strong>01</strong><span>shared place to report</span></div><div><strong>02</strong><span>thoughtful matching</span></div><div><strong>03</strong><span>visible progress</span></div></div></section><section style={styles.storyGrid}><img style={styles.storyImage} src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=85" alt="Students working together" /><div style={styles.storyText}><span style={styles.sectionKicker}>A shared starting point</span><h2>Local knowledge deserves a serious response.</h2><p>From water supply and road safety to public health, community observations become well-structured challenges that can be assessed and progressed.</p><Link to="/solutions" style={styles.inlineLink}>See how a report moves forward <ArrowRight size={16} /></Link></div></section><ConnectionPanel title="The right people, around one problem." copy="Explore how universities, mentors and partners work together once a challenge is matched." link="/collab" label="Explore collaboration" /></EditorialPage>;
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
        <p style={{ marginTop: 20 }}>
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
  const navigate = useNavigate();
  const { role: roleParam } = useParams();
  const { user } = useAuth();
  const roleKey = roleParam || "student";
  const role = ROLES[roleKey] || ROLES.student;
  const [activeTab, setActiveTab] = useState("overview");

  const [dbStats, setDbStats] = useState(null);
  const [domainAnalytics, setDomainAnalytics] = useState([]);
  const [dbProblems, setDbProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    category: "Industrial IoT & Infrastructure",
    district: "",
    village: "",
    severity: "High",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const theme = {
    accent: role.primary,
    accentDark: role.dark,
    accentSoft: role.soft,
    shell: "linear-gradient(180deg, #ffffff, #f8fafc)",
    action: `linear-gradient(135deg, ${role.primary}, ${role.dark})`,
    chipBackground: role.soft,
    chipText: role.dark,
  };

  const [userProfile, setUserProfile] = useState(null);

  const getRoleTabs = () => {
    const normRole = (user?.role || roleKey).toUpperCase();
    if (normRole === "PUBLISHER") {
      return [
        { id: "overview", label: "Dashboard" },
        { id: "report", label: "Post a Challenge" },
        { id: "my_challenges", label: "My Challenges" },
        { id: "notifications", label: "Notifications" },
        { id: "profile", label: "Profile" },
      ];
    } else if (normRole === "FACULTY" || roleKey === "mentor") {
      return [
        { id: "overview", label: "Dashboard" },
        { id: "relevant", label: "Relevant Challenges" },
        { id: "mentorship", label: "Mentorship Opportunities" },
        { id: "notifications", label: "Notifications" },
        { id: "profile", label: "Profile" },
      ];
    } else if (normRole === "ADMIN") {
      return [
        { id: "overview", label: "Dashboard" },
        { id: "users", label: "Users Overview" },
        { id: "challenges", label: "All Challenges" },
        { id: "notifications", label: "Notifications" },
        { id: "profile", label: "Profile" },
      ];
    }
    return [
      { id: "overview", label: "Dashboard" },
      { id: "discover", label: "Discover Challenges" },
      { id: "my_interested", label: "My Interested Challenges" },
      { id: "notifications", label: "Notifications" },
      { id: "profile", label: "Profile" },
    ];
  };

  const currentTabs = getRoleTabs();

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, domainsData, problemsData, profileRes] = await Promise.all([
        dashboardService.getStats().catch(() => null),
        dashboardService.getAnalyticsDomain().catch(() => []),
        problemService.getProblems().catch(() => []),
        profileService.getProfile().catch(() => null),
      ]);

      if (statsData) setDbStats(statsData);
      if (Array.isArray(domainsData)) setDomainAnalytics(domainsData);
      if (Array.isArray(problemsData)) setDbProblems(problemsData);
      if (profileRes?.profile) setUserProfile(profileRes.profile);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill in both title and description.");
      return;
    }

    setSubmitting(true);
    setSubmitMessage("");
    try {
      const orgName = formData.village || formData.district ? `${formData.village || "Village"}, ${formData.district || "District"}` : (user?.name || "Community Author");
      const fullDescription = `[${formData.severity} Priority] ${formData.title}: ${formData.description}`;
      
      await problemService.createProblem({
        org: orgName,
        domain: formData.category,
        description: fullDescription,
      });

      setSubmitMessage("Issue successfully saved to database & queued for routing!");
      setFormData({
        title: "",
        category: "Industrial IoT & Infrastructure",
        district: "",
        village: "",
        severity: "High",
        description: "",
      });
      await loadDashboardData();
    } catch (err) {
      alert("Error submitting issue: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const tabConfig = [
    { id: "overview", label: "Overview" },
    { id: "report", label: "New report" },
    { id: "alerts", label: "Alerts & Pipeline" },
  ];

  const statCards = [
    {
      label: "Total Database Problems",
      value: dbStats ? dbStats.totalProblems : "...",
      trend: `${dbStats?.submittedProblems || 0} newly submitted`,
    },
    {
      label: "Active Pipelines",
      value: dbStats ? dbStats.routedProblems : "...",
      trend: `${dbStats?.completedProblems || 0} resolved`,
    },
    {
      label: "Partner Universities",
      value: dbStats ? dbStats.totalUniversities : "...",
      trend: `${dbStats?.totalFaculty || 0} mentors registered`,
    },
    {
      label: "Registered Solvers",
      value: dbStats ? dbStats.totalStudents : "...",
      trend: `${dbStats?.totalUsers || 0} total platform users`,
    },
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
            <div style={styles.cardTitle}>Live Pipeline Snapshot</div>
            <span style={{ ...styles.pillSuccess, background: theme.accentSoft, color: theme.accentDark }}>Live</span>
          </div>

          {loading ? (
            <div style={{ padding: 20, color: "#94a3b8" }}>Loading live analytics...</div>
          ) : (
            <div style={styles.progressList}>
              <div style={styles.progressRow}>
                <div>
                  <div style={styles.progressLabel}>Submitted Challenges</div>
                  <div style={styles.progressMeta}>Initial intake</div>
                </div>
                <strong style={{ ...styles.progressValue, color: theme.accent }}>
                  {dbStats?.submittedProblems || 0}
                </strong>
              </div>
              <div style={styles.progressBarTrack}>
                <div
                  style={{
                    ...styles.progressBarFill,
                    width: `${dbStats?.totalProblems ? Math.round(((dbStats.submittedProblems || 0) / dbStats.totalProblems) * 100) : 0}%`,
                    background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentDark})`,
                  }}
                />
              </div>

              <div style={styles.progressRow}>
                <div>
                  <div style={styles.progressLabel}>Routed & In-Progress</div>
                  <div style={styles.progressMeta}>Assigned to university teams</div>
                </div>
                <strong style={{ ...styles.progressValue, color: theme.accent }}>
                  {dbStats?.routedProblems || 0}
                </strong>
              </div>
              <div style={styles.progressBarTrack}>
                <div
                  style={{
                    ...styles.progressBarFill,
                    width: `${dbStats?.totalProblems ? Math.round(((dbStats.routedProblems || 0) / dbStats.totalProblems) * 100) : 0}%`,
                    background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
                  }}
                />
              </div>

              <div style={styles.progressRow}>
                <div>
                  <div style={styles.progressLabel}>Completed Solutions</div>
                  <div style={styles.progressMeta}>Done Kanban status</div>
                </div>
                <strong style={{ ...styles.progressValue, color: theme.accent }}>
                  {dbStats?.completedProblems || 0}
                </strong>
              </div>
              <div style={styles.progressBarTrack}>
                <div
                  style={{
                    ...styles.progressBarFill,
                    width: `${dbStats?.totalProblems ? Math.round(((dbStats.completedProblems || 0) / dbStats.totalProblems) * 100) : 0}%`,
                    background: "linear-gradient(90deg, #14b8a6, #34d399)",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div style={{ ...styles.featureCardLarge, borderColor: `${theme.accent}26` }}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>Domain Demand Taxonomy</div>
            <span style={styles.pillNeutral}>Live Demand</span>
          </div>
          <div style={styles.regionTable}>
            {domainAnalytics.length > 0 ? (
              domainAnalytics.map((item) => (
                <div key={item.domain} style={styles.regionRow}>
                  <span>{item.domain}</span>
                  <strong>{item.count}</strong>
                </div>
              ))
            ) : (
              <div style={{ padding: 12, color: "#94a3b8", fontSize: 13 }}>
                No domain analytics registered yet.
              </div>
            )}
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
            <div style={{ ...styles.formEyebrow, color: theme.accentDark }}>New Challenge Submission</div>
            <h2 style={styles.formTitle}>Submit a Problem Statement</h2>
          </div>
          <div style={{ ...styles.statusPill, background: theme.accentSoft, color: theme.accentDark }}>
            <CheckCircle2 size={14} />
            Verified Input
          </div>
        </div>

        {submitMessage && (
          <div style={{ background: "#10b98120", border: "1px solid #10b981", borderRadius: 8, padding: 12, color: "#34d399", marginBottom: 16 }}>
            {submitMessage}
          </div>
        )}

        <div style={styles.formGrid}>
          <label style={styles.fieldWrap}>
            <span style={styles.fieldLabel}>Issue title</span>
            <input
              name="title"
              value={formData.title}
              onChange={handleFieldChange}
              placeholder="e.g. Effluent Discharge Monitoring System"
              style={styles.fieldInput}
              required
            />
          </label>

          <label style={styles.fieldWrap}>
            <span style={styles.fieldLabel}>Category / Domain</span>
            <select
              name="category"
              value={formData.category}
              onChange={handleFieldChange}
              style={styles.fieldInput}
            >
              <option>Industrial IoT & Infrastructure</option>
              <option>Water & Sanitation</option>
              <option>Road & Transport</option>
              <option>Healthcare</option>
              <option>Education</option>
              <option>Agriculture & AgriTech</option>
            </select>
          </label>

          <label style={styles.fieldWrap}>
            <span style={styles.fieldLabel}>District / Organization</span>
            <input
              name="district"
              value={formData.district}
              onChange={handleFieldChange}
              placeholder="e.g. Coimbatore Smart City Ltd."
              style={styles.fieldInput}
            />
          </label>

          <label style={styles.fieldWrap}>
            <span style={styles.fieldLabel}>Locality / Sub-unit</span>
            <input
              name="village"
              value={formData.village}
              onChange={handleFieldChange}
              placeholder="e.g. Industrial Corridor"
              style={styles.fieldInput}
            />
          </label>

          <label style={styles.fieldWrap}>
            <span style={styles.fieldLabel}>Severity Level</span>
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
        </div>

        <label style={styles.fieldWrap}>
          <span style={styles.fieldLabel}>Problem Statement Details</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleFieldChange}
            placeholder="Provide explicit technical details of the challenge for AI extraction and university matching..."
            style={styles.textArea}
            required
          />
        </label>

        <div style={styles.submitRow}>
          <button type="submit" disabled={submitting} style={{ ...styles.primarySubmitButton, background: theme.action, opacity: submitting ? 0.7 : 1 }}>
            {submitting ? "Saving to Database..." : "Save Problem to Database"}
          </button>
        </div>
      </form>

      <aside style={styles.sidePanel}>
        <div style={styles.sideCard}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>Recent Database Problems</div>
            <span style={styles.dotBadge} />
          </div>
          {dbProblems.length > 0 ? (
            dbProblems.slice(0, 4).map((prob) => (
              <div key={prob.id} style={styles.updateItem}>
                <strong>{prob.org}</strong>
                <span>{prob.domain} ({prob.status})</span>
              </div>
            ))
          ) : (
            <div style={{ padding: 10, color: "#94a3b8", fontSize: 13 }}>
              No problems created yet.
            </div>
          )}
        </div>
      </aside>
    </div>
  );

  const renderAlerts = () => (
    <div style={styles.alertGrid}>
      {dbProblems.length > 0 ? (
        dbProblems.map((prob) => (
          <div key={prob.id} style={{ ...styles.alertCardAccent, borderColor: `${theme.accent}55` }}>
            <div style={styles.alertHeaderRow}>
              <span style={{ ...styles.alertChip, background: `${theme.accent}1a`, color: theme.accentDark }}>
                {prob.status}
              </span>
              <span style={styles.timeStamp}>
                {new Date(prob.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h3 style={styles.alertTitle}>{prob.org}</h3>
            <p style={styles.alertText}>{prob.description}</p>
            <div style={styles.alertMeta}>Domain: {prob.domain || prob.primaryDomain}</div>

            {/* Why You Received This Explanation */}
            {(user?.role === "STUDENT" || user?.role === "FACULTY" || roleKey === "mentor" || roleKey === "student") && (
              <WhyYouReceivedThisCard problem={prob} userProfile={userProfile} />
            )}
          </div>
        ))
      ) : (
        <div style={{ color: "#94a3b8", padding: 20, textAlign: "center", gridColumn: "1 / -1" }}>
          No records currently available in the database. Submit a problem to populate the pipeline!
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    if (activeTab === "overview") return renderOverview();
    if (activeTab === "report") return renderReport();
    return renderAlerts();
  };

  const getRoleBg = () => {
    const normRole = (user?.role || roleKey).toUpperCase();
    if (normRole === "PUBLISHER") {
      return "radial-gradient(ellipse at top, #2e1805 0%, #170d03 60%, #030712 100%)";
    } else if (normRole === "FACULTY" || roleKey === "mentor") {
      return "radial-gradient(ellipse at top, #0c1c38 0%, #081021 60%, #030712 100%)";
    } else if (normRole === "ADMIN") {
      return "radial-gradient(ellipse at top, #250b3d 0%, #120521 60%, #030712 100%)";
    }
    return "radial-gradient(ellipse at top, #052622 0%, #041412 60%, #030712 100%)";
  };

  return (
    <div style={{ ...styles.dashboardPage, background: getRoleBg() }}>
      <style>{globalCSS}</style>
      <div style={styles.backgroundGlowOne} />
      <div style={styles.backgroundGlowTwo} />

      <Header />

      <main style={styles.dashboardShell}>
        <aside style={{ ...styles.sidebarPanel, borderColor: `${theme.accent}25`, boxShadow: `0 20px 38px ${theme.accent}08` }}>
          <div style={styles.profileCard}>
            <div style={{ ...styles.avatarBadge, background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDark})` }}>
              {role.label.charAt(0)}
            </div>
            <div>
              <div style={styles.profileName}>{role.label} Workspace</div>
              <div style={styles.profileMeta}>User: {user?.name || role.label} ({user?.role || roleKey})</div>
            </div>
          </div>

          <nav style={styles.navStack}>
            {currentTabs.map(({ id, label }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    if (id === "profile") {
                      navigate("/profile");
                    } else if (id === "report") {
                      setActiveTab("report");
                    } else {
                      setActiveTab(id);
                    }
                  }}
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
            <div style={{ ...styles.quickInfoLabel, color: theme.accentDark }}>System Status</div>
            <div style={{ ...styles.quickInfoValue, color: theme.accentDark }}>Live Connected</div>
            <div style={styles.quickInfoMeta}>{dbProblems.length} challenges active</div>
          </div>
        </aside>

        <section style={styles.dashboardContent}>
          <div style={styles.dashboardHeader}>
            <div>
              <div style={{ ...styles.headerEyebrow, color: theme.accent }}>SoLink AI Platform Desk</div>
              <h1 style={{ ...styles.dashboardTitle, color: "#f8fafc" }}>{role.label} Dashboard</h1>
            </div>
          </div>

          {renderTabContent()}
        </section>
      </main>
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
   ROLE SELECTION PAGE
================================================================ */

function RoleSelectionPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.landing}>
      <style>{globalCSS}</style>
      <div style={styles.backgroundGlowOne} />
      <div style={styles.backgroundGlowTwo} />

      <Header />

      <main style={{ maxWidth: 1100, margin: "40px auto", padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={styles.eyebrowDot} />
          <span style={{ color: "#4F7BFF", fontSize: 13, fontWeight: 700, letterSpacing: 1.5, marginLeft: 8 }}>
            SOLINK AI AUTHENTICATION PORTAL
          </span>
          <h1 style={{ color: "#ffffff", fontSize: 36, fontWeight: 800, marginTop: 12 }}>
            Choose Your Workspace Identity
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 16, maxWidth: 640, margin: "12px auto 0" }}>
            Select your role to sign in or register your account on the SoLink AI Open Innovation Platform.
          </p>
        </div>

        <div style={styles.roleGrid}>
          <RoleCard
            roleKey="mentor"
            role={ROLES.mentor}
            onClick={() => navigate("/login/mentor")}
          />
          <RoleCard
            roleKey="student"
            role={ROLES.student}
            onClick={() => navigate("/login/student")}
          />
          <RoleCard
            roleKey="publisher"
            role={ROLES.publisher}
            onClick={() => navigate("/login/publisher")}
          />
        </div>
      </main>

      <footer style={styles.footer}>
        <span>© 2026 SoLink AI (SIH26043)</span>
        <span>Intelligent routing for meaningful collaboration</span>
      </footer>
    </div>
  );
}

/* ================================================================
   LOGIN PAGE WRAPPER (AUTHENTICATION CONTROLLER)
================================================================ */

function LoginPageWrapper() {
  const { role: roleParam } = useParams();
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();

  const roleKey = (roleParam && ROLES[roleParam]) ? roleParam : "student";
  const role = ROLES[roleKey];

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    selectedRole: roleKey === "publisher" ? "PUBLISHER" : roleKey === "mentor" ? "FACULTY" : "STUDENT",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/dashboard/${roleKey}`);
    }
  }, [isAuthenticated, navigate, roleKey]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setErrorMsg("");
    setSubmitting(true);
    try {
      const res = await login(demoEmail, demoPassword);
      const userRole = (res.user?.role || "STUDENT").toLowerCase();
      const targetRoleKey = userRole === "publisher" ? "publisher" : userRole === "faculty" ? "mentor" : "student";
      navigate(`/dashboard/${targetRoleKey}`);
    } catch (err) {
      setErrorMsg(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      if (isRegisterMode) {
        if (!formData.name || !formData.email || !formData.password) {
          throw new Error("Please fill in all required fields.");
        }
        const res = await register(
          formData.name,
          formData.email,
          formData.password,
          formData.selectedRole
        );
        const userRole = (res.user?.role || "STUDENT").toLowerCase();
        const targetRoleKey = userRole === "publisher" ? "publisher" : userRole === "faculty" ? "mentor" : "student";
        navigate(`/dashboard/${targetRoleKey}`);
      } else {
        if (!formData.email || !formData.password) {
          throw new Error("Please enter both email and password.");
        }
        const res = await login(formData.email, formData.password);
        const userRole = (res.user?.role || "STUDENT").toLowerCase();
        const targetRoleKey = userRole === "publisher" ? "publisher" : userRole === "faculty" ? "mentor" : "student";
        navigate(`/dashboard/${targetRoleKey}`);
      }
    } catch (err) {
      setErrorMsg(err.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  const Icon = role.icon;

  return (
    <div style={{ ...styles.loginPage, background: role.background }}>
      <style>{globalCSS}</style>

      {/* Left branding section */}
      <section
        style={{
          ...styles.loginBrand,
          background: `linear-gradient(180deg, rgba(10, 13, 17, 0.56), rgba(10, 13, 17, 0.72)), url(${role.image}) center/cover no-repeat`,
        }}
      >
        <button onClick={() => navigate("/login")} style={styles.backButton}>
          <ChevronLeft size={17} />
          Change role
        </button>

        <div style={styles.brandInner}>
          <div style={{ ...styles.brandIcon, background: "rgba(255,255,255,0.12)" }}>
            <Icon size={32} />
          </div>

          <div style={styles.brandRole}>{role.label}</div>

          <h1 style={styles.brandTitle}>
            {roleKey === "mentor" && <>Guide the next<br />generation.</>}
            {roleKey === "student" && <>Build something<br />that matters.</>}
            {roleKey === "publisher" && <>Turn problems<br />into solutions.</>}
          </h1>

          <p style={styles.brandDescription}>{role.description}</p>
        </div>

        <div style={styles.brandFooter}>
          <Sparkles size={14} />
          Powered by SoLink AI Intelligent Problem Routing
        </div>
      </section>

      {/* Right form section */}
      <section style={styles.loginContent}>
        <div style={styles.loginBox}>
          <div style={{ ...styles.smallRoleIcon, background: role.soft, color: role.primary }}>
            <Icon size={20} />
          </div>

          <div style={styles.loginEyebrow}>{role.label.toUpperCase()} PORTAL</div>

          <div style={{ display: "flex", gap: 16, marginBottom: 20, borderBottom: "1px solid #ffffff1a", paddingBottom: 8 }}>
            <button
              type="button"
              onClick={() => { setIsRegisterMode(false); setErrorMsg(""); }}
              style={{
                background: "none",
                border: "none",
                color: !isRegisterMode ? role.primary : "#94a3b8",
                fontSize: 18,
                fontWeight: 700,
                cursor: "pointer",
                borderBottom: !isRegisterMode ? `2px solid ${role.primary}` : "2px solid transparent",
                paddingBottom: 4,
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegisterMode(true); setErrorMsg(""); }}
              style={{
                background: "none",
                border: "none",
                color: isRegisterMode ? role.primary : "#94a3b8",
                fontSize: 18,
                fontWeight: 700,
                cursor: "pointer",
                borderBottom: isRegisterMode ? `2px solid ${role.primary}` : "2px solid transparent",
                paddingBottom: 4,
              }}
            >
              Create Account
            </button>
          </div>

          {errorMsg && (
            <div style={{
              background: "#ef44441f",
              border: "1px solid #ef4444",
              borderRadius: 8,
              padding: "10px 14px",
              color: "#fca5a5",
              fontSize: 14,
              marginBottom: 16,
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegisterMode && (
              <div style={{ marginBottom: 16 }}>
                <label style={styles.label}>Full Name</label>
                <div style={styles.inputWrapper}>
                  <UserRound size={17} color="#98A2B3" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    style={styles.input}
                    required
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <Mail size={17} color="#98A2B3" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={
                    roleKey === "student"
                      ? "student@university.edu"
                      : roleKey === "mentor"
                        ? "mentor@university.edu"
                        : "publisher@solink.ai"
                  }
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={17} color="#98A2B3" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  style={styles.input}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {isRegisterMode && (
              <div style={{ marginBottom: 20 }}>
                <label style={styles.label}>Account Role</label>
                <select
                  name="selectedRole"
                  value={formData.selectedRole}
                  onChange={handleChange}
                  style={{ ...styles.input, width: "100%", background: "#1e293b", color: "#fff", cursor: "pointer" }}
                >
                  <option value="PUBLISHER">Publisher / Problem Author</option>
                  <option value="STUDENT">Student Developer</option>
                  <option value="FACULTY">Faculty / Mentor</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.primaryButton,
                width: "100%",
                padding: "14px",
                fontSize: 16,
                fontWeight: 700,
                background: role.primary,
                color: "#fff",
                borderRadius: 8,
                marginTop: 8,
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Processing..." : isRegisterMode ? "Register Account" : "Sign In"}
            </button>
          </form>

          {/* Quick Demo Login Bar */}
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #ffffff1a" }}>
            <span style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
              Quick Demo Accounts
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button
                type="button"
                onClick={() => handleDemoLogin("publisher@solink.ai", "publisher123")}
                style={{ background: "#f59e0b20", color: "#fbbf24", border: "1px solid #f59e0b55", padding: "6px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}
              >
                Publisher Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("student@solink.ai", "student123")}
                style={{ background: "#17b38b20", color: "#34d399", border: "1px solid #17b38b55", padding: "6px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}
              >
                Student Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("faculty@solink.ai", "faculty123")}
                style={{ background: "#4f7bff20", color: "#60a5fa", border: "1px solid #4f7bff55", padding: "6px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}
              >
                Faculty Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("admin@solink.ai", "admin123")}
                style={{ background: "#a855f720", color: "#c084fc", border: "1px solid #a855f755", padding: "6px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}
              >
                Admin Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ================================================================
   WHY YOU RECEIVED THIS CHALLENGE EXPLANATION CARD
================================================================ */

function WhyYouReceivedThisCard({ problem, userProfile }) {
  if (!problem || !userProfile) return null;

  const userPrimary = (userProfile.primaryDomain || userProfile.primaryResearchDomain || "").toUpperCase();
  const userSecondaries = (userProfile.secondaryDomains || userProfile.secondaryResearchDomains || []).map((d) => String(d).toUpperCase());
  const userSkills = (userProfile.skills || []).map((s) => String(s).toLowerCase());
  const userInterests = (userProfile.interests || userProfile.expertise || userProfile.researchAreas || []).map((i) => String(i).toLowerCase());

  const problemDomain = (problem.primaryDomain || problem.domain || "").toUpperCase();
  const reqExpertise = (problem.aiRequiredExpertise || []).map((e) => String(e).toLowerCase());

  const primaryMatch = userPrimary && userPrimary === problemDomain;
  const secondaryMatch = userSecondaries.includes(problemDomain);
  const matchedSkills = userSkills.filter((s) => reqExpertise.some((r) => r.includes(s) || s.includes(r)));
  const matchedInterests = userInterests.filter((i) => reqExpertise.some((r) => r.includes(i) || i.includes(r)) || i.includes(problemDomain.toLowerCase()));

  return (
    <div style={{ background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(59, 130, 246, 0.12))", padding: 16, borderRadius: 10, border: "1px solid #10b98155", margin: "16px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "#34d399", fontWeight: 700, fontSize: 14 }}>
        <CheckCircle2 size={16} />
        Why You Received This Challenge:
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "#cbd5e1" }}>
        {primaryMatch && (
          <div>✓ <strong>Primary Domain Match:</strong> Your registered primary domain is <strong>{problemDomain}</strong></div>
        )}
        {secondaryMatch && !primaryMatch && (
          <div>✓ <strong>Secondary Domain Match:</strong> Matches your secondary domain in <strong>{problemDomain}</strong></div>
        )}
        {matchedInterests.length > 0 && (
          <div>✓ <strong>Interest / Research Overlap:</strong> Matches {matchedInterests.join(", ")}</div>
        )}
        {matchedSkills.length > 0 && (
          <div>✓ <strong>Skill Vector Overlap:</strong> Matches skill tags {matchedSkills.join(", ")}</div>
        )}
        {!primaryMatch && !secondaryMatch && matchedSkills.length === 0 && matchedInterests.length === 0 && (
          <div>✓ <strong>Domain Classification Match:</strong> Challenge categorized under <strong>{problemDomain}</strong></div>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   DYNAMIC PROFILE MANAGEMENT PAGE (POSTGRESQL BACKED)
================================================================ */

const CONTROLLED_DOMAINS = [
  "AGRICULTURE",
  "HEALTHCARE",
  "EDUCATION",
  "DISASTER_MANAGEMENT",
  "WATER_MANAGEMENT",
  "ENVIRONMENT",
  "ENERGY",
  "URBAN_DEVELOPMENT",
  "RURAL_LIVELIHOODS",
  "ACCESSIBILITY",
  "PUBLIC_ADMINISTRATION",
  "TECHNOLOGY",
  "OTHER",
];

function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [completeness, setCompleteness] = useState(50);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("info"); // info, projects
  const [saveMsg, setSaveMsg] = useState("");

  // Edit form state
  const [form, setForm] = useState({});

  // New Project Modal State
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    domain: "DISASTER_MANAGEMENT",
    technologies: "",
    completionYear: "2025",
    projectUrl: "",
  });

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await profileService.getProfile();
      if (res?.profile) {
        setProfileData(res.profile);
        setCompleteness(res.completeness || 50);
        setSuggestions(res.suggestions || []);

        setForm({
          name: res.user?.name || user?.name || "",
          universityName: res.profile.universityName || res.profile.organizationName || "",
          department: res.profile.department || res.profile.organizationType || "",
          designation: res.profile.designation || res.profile.yearOfStudy || "",
          location: res.profile.location || "",
          city: res.profile.city || "",
          district: res.profile.district || "",
          state: res.profile.state || "",
          primaryDomain: res.profile.primaryDomain || res.profile.primaryResearchDomain || "DISASTER_MANAGEMENT",
          secondaryDomains: (res.profile.secondaryDomains || res.profile.secondaryResearchDomains || res.profile.workingDomains || []).join(", "),
          skills: (res.profile.skills || []).join(", "),
          interests: (res.profile.interests || res.profile.expertise || res.profile.researchAreas || []).join(", "),
          bio: res.profile.bio || res.profile.organizationDescription || "",
        });
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    try {
      const payload = {
        name: form.name,
        universityName: form.universityName,
        organizationName: form.universityName,
        department: form.department,
        organizationType: form.department,
        designation: form.designation,
        yearOfStudy: form.designation,
        location: form.location,
        city: form.city,
        district: form.district,
        state: form.state,
        primaryDomain: form.primaryDomain,
        primaryResearchDomain: form.primaryDomain,
        secondaryDomains: form.secondaryDomains.split(",").map((s) => s.trim()).filter(Boolean),
        secondaryResearchDomains: form.secondaryDomains.split(",").map((s) => s.trim()).filter(Boolean),
        workingDomains: form.secondaryDomains.split(",").map((s) => s.trim()).filter(Boolean),
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        interests: form.interests.split(",").map((s) => s.trim()).filter(Boolean),
        expertise: form.interests.split(",").map((s) => s.trim()).filter(Boolean),
        researchAreas: form.interests.split(",").map((s) => s.trim()).filter(Boolean),
        bio: form.bio,
        organizationDescription: form.bio,
      };

      await profileService.updateProfile(payload);
      setSaveMsg("✓ Profile updated successfully in PostgreSQL!");
      await loadProfile();
    } catch (err) {
      alert("Failed to save profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title.trim() || !projectForm.description.trim()) {
      alert("Please provide project title and description.");
      return;
    }
    try {
      await profileService.addProject(projectForm);
      setShowProjectModal(false);
      setProjectForm({ title: "", description: "", domain: "DISASTER_MANAGEMENT", technologies: "", completionYear: "2025", projectUrl: "" });
      await loadProfile();
    } catch (err) {
      alert("Failed to add project: " + err.message);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await profileService.deleteProject(id);
      await loadProfile();
    } catch (err) {
      alert("Failed to delete project: " + err.message);
    }
  };

  const roleLabel = user?.role === "PUBLISHER" ? "Publisher / Host" : user?.role === "FACULTY" ? "Faculty Mentor" : "Student Innovation Developer";

  const getRoleTheme = (roleStr) => {
    const r = (roleStr || "").toUpperCase();
    if (r === "PUBLISHER") {
      return {
        cardBg: "linear-gradient(135deg, rgba(30, 22, 10, 0.95), rgba(15, 23, 42, 0.95))",
        cardBorder: "1px solid rgba(245, 158, 11, 0.4)",
        inputBg: "#120c05",
        inputBorder: "1px solid rgba(245, 158, 11, 0.5)",
        inputText: "#fffbeb",
        labelColor: "#fbbf24",
        buttonBg: "linear-gradient(135deg, #f59e0b, #b45309)",
        badgeText: "#f59e0b",
      };
    } else if (r === "FACULTY") {
      return {
        cardBg: "linear-gradient(135deg, rgba(13, 25, 46, 0.95), rgba(15, 23, 42, 0.95))",
        cardBorder: "1px solid rgba(59, 130, 246, 0.4)",
        inputBg: "#07101f",
        inputBorder: "1px solid rgba(59, 130, 246, 0.5)",
        inputText: "#eff6ff",
        labelColor: "#60a5fa",
        buttonBg: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        badgeText: "#60a5fa",
      };
    } else if (r === "ADMIN") {
      return {
        cardBg: "linear-gradient(135deg, rgba(26, 11, 46, 0.95), rgba(15, 23, 42, 0.95))",
        cardBorder: "1px solid rgba(168, 85, 247, 0.4)",
        inputBg: "#0d0517",
        inputBorder: "1px solid rgba(168, 85, 247, 0.5)",
        inputText: "#faf5ff",
        labelColor: "#c084fc",
        buttonBg: "linear-gradient(135deg, #a855f7, #6b21a8)",
        badgeText: "#c084fc",
      };
    }
    return {
      cardBg: "linear-gradient(135deg, rgba(11, 26, 24, 0.95), rgba(15, 23, 42, 0.95))",
      cardBorder: "1px solid rgba(16, 185, 129, 0.4)",
      inputBg: "#061210",
      inputBorder: "1px solid rgba(16, 185, 129, 0.5)",
      inputText: "#f0fdf4",
      labelColor: "#34d399",
      buttonBg: "linear-gradient(135deg, #10b981, #047857)",
      badgeText: "#34d399",
    };
  };

  const theme = getRoleTheme(user?.role);

  const inputStyle = {
    background: theme.inputBg,
    border: theme.inputBorder,
    color: theme.inputText,
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
    color: theme.labelColor,
    marginBottom: 6,
  };

  const getProfileBg = () => {
    const r = (user?.role || "").toUpperCase();
    if (r === "PUBLISHER") return "radial-gradient(ellipse at 50% 0%, #2e1805 0%, #170d03 60%, #030712 100%)";
    if (r === "FACULTY") return "radial-gradient(ellipse at 50% 0%, #0c1c38 0%, #081021 60%, #030712 100%)";
    if (r === "ADMIN") return "radial-gradient(ellipse at 50% 0%, #250b3d 0%, #120521 60%, #030712 100%)";
    return "radial-gradient(ellipse at 50% 0%, #052622 0%, #041412 60%, #030712 100%)";
  };

  return (
    <div style={{ ...styles.landing, background: getProfileBg() }}>
      <style>{globalCSS}</style>
      <div style={styles.backgroundGlowOne} />
      <div style={styles.backgroundGlowTwo} />

      <Header />

      <main style={{ maxWidth: 1000, margin: "30px auto", padding: "0 20px" }}>
        {/* Profile Banner */}
        <div style={{ background: theme.cardBg, padding: 24, borderRadius: 12, border: theme.cardBorder, marginBottom: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: theme.buttonBg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 24, fontWeight: 800 }}>
                {user?.name ? user.name.charAt(0) : "U"}
              </div>
              <div>
                <h1 style={{ color: "#fff", fontSize: 24, margin: 0 }}>{user?.name || "User Profile"}</h1>
                <div style={{ color: theme.labelColor, fontSize: 14, marginTop: 4, fontWeight: 600 }}>{roleLabel} • {user?.email}</div>
                <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 2 }}>{form.universityName || "Institution Not Specified"}</div>
              </div>
            </div>

            {/* Dynamic Profile Completeness Bar */}
            <div style={{ minWidth: 260, background: theme.inputBg, padding: 14, borderRadius: 10, border: theme.inputBorder }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#fff", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                <span>Profile Completeness</span>
                <span style={{ color: completeness >= 80 ? "#34d399" : "#f59e0b" }}>{completeness}%</span>
              </div>
              <div style={{ width: "100%", height: 8, background: "#1e293b", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${completeness}%`, height: "100%", background: completeness >= 80 ? "linear-gradient(90deg, #10b981, #34d399)" : "linear-gradient(90deg, #f59e0b, #fbbf24)", transition: "width 0.3s ease" }} />
              </div>
              {suggestions.length > 0 && (
                <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 8 }}>
                  Tip: {suggestions[0]}
                </div>
              )}
            </div>
          </div>

          {/* Profile Navigation Tabs */}
          <div style={{ display: "flex", gap: 12, marginTop: 24, borderBottom: "1px solid #ffffff15", paddingBottom: 12 }}>
            <button
              onClick={() => setActiveTab("info")}
              style={{ background: activeTab === "info" ? theme.buttonBg : "transparent", color: activeTab === "info" ? "#fff" : "#94a3b8", border: "none", padding: "8px 16px", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}
            >
              Basic Info & Domain Expertise
            </button>
            {(user?.role === "STUDENT" || user?.role === "FACULTY") && (
              <button
                onClick={() => setActiveTab("projects")}
                style={{ background: activeTab === "projects" ? theme.buttonBg : "transparent", color: activeTab === "projects" ? "#fff" : "#94a3b8", border: "none", padding: "8px 16px", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}
              >
                Projects & Research Showcase ({profileData?.projects?.length || 0})
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Profile Info Form */}
        {activeTab === "info" && (
          <form onSubmit={handleProfileSave} style={{ background: theme.cardBg, padding: 24, borderRadius: 12, border: theme.cardBorder, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
            {saveMsg && (
              <div style={{ background: "#10b98120", border: "1px solid #10b981", borderRadius: 8, padding: 12, color: "#34d399", marginBottom: 16 }}>
                {saveMsg}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>{user?.role === "PUBLISHER" ? "Organization Name" : "College / University"}</label>
                <input
                  type="text"
                  value={form.universityName || ""}
                  onChange={(e) => setForm({ ...form, universityName: e.target.value })}
                  style={inputStyle}
                  placeholder="e.g. Anna Institute of Technology"
                />
              </div>

              <div>
                <label style={labelStyle}>{user?.role === "PUBLISHER" ? "Organization Type" : "Department"}</label>
                <input
                  type="text"
                  value={form.department || ""}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  style={inputStyle}
                  placeholder="e.g. Computer Science & Engineering"
                />
              </div>

              <div>
                <label style={labelStyle}>{user?.role === "PUBLISHER" ? "Designation / Role" : user?.role === "FACULTY" ? "Designation" : "Year of Study"}</label>
                <input
                  type="text"
                  value={form.designation || ""}
                  onChange={(e) => setForm({ ...form, designation: e.target.value })}
                  style={inputStyle}
                  placeholder="e.g. Professor / 3rd Year B.Tech"
                />
              </div>

              <div>
                <label style={labelStyle}>Primary Domain (Required)</label>
                <select
                  value={form.primaryDomain || "DISASTER_MANAGEMENT"}
                  onChange={(e) => setForm({ ...form, primaryDomain: e.target.value })}
                  style={inputStyle}
                >
                  {CONTROLLED_DOMAINS.map((d) => (
                    <option key={d} value={d} style={{ background: theme.inputBg, color: theme.inputText }}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Secondary Domains (Comma-separated)</label>
                <input
                  type="text"
                  value={form.secondaryDomains || ""}
                  onChange={(e) => setForm({ ...form, secondaryDomains: e.target.value })}
                  style={inputStyle}
                  placeholder="e.g. WATER_MANAGEMENT, ENVIRONMENT"
                />
              </div>

              <div>
                <label style={labelStyle}>Skills & Technologies (Comma-separated)</label>
                <input
                  type="text"
                  value={form.skills || ""}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  style={inputStyle}
                  placeholder="e.g. Python, IoT, Machine Learning"
                />
              </div>

              <div>
                <label style={labelStyle}>Areas of Interest / Research Expertise</label>
                <input
                  type="text"
                  value={form.interests || ""}
                  onChange={(e) => setForm({ ...form, interests: e.target.value })}
                  style={inputStyle}
                  placeholder="e.g. Flood Early Warning, Sensor Networks"
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Bio / Overview</label>
              <textarea
                value={form.bio || ""}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                style={{ ...inputStyle, height: 80, resize: "vertical" }}
                placeholder="Brief summary of your innovation background or organization mission..."
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{ background: theme.buttonBg, color: "#fff", border: "none", padding: "12px 28px", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}
            >
              {saving ? "Saving Changes..." : "Save Profile to PostgreSQL"}
            </button>
          </form>
        )}

        {/* Tab 2: Projects & Research Showcase */}
        {activeTab === "projects" && (
          <div style={{ background: theme.cardBg, padding: 24, borderRadius: 12, border: theme.cardBorder, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h3 style={{ color: "#fff", fontSize: 18, margin: 0 }}>Projects & Research Showcase</h3>
                <p style={{ color: "#94a3b8", fontSize: 13, margin: "4px 0 0 0" }}>Demonstrate your technical experience to strengthen future challenge recommendations.</p>
              </div>
              <button
                onClick={() => setShowProjectModal(true)}
                style={{ background: theme.buttonBg, color: "#fff", border: "none", padding: "8px 16px", borderRadius: 6, fontWeight: 700, cursor: "pointer" }}
              >
                + Add Project
              </button>
            </div>

            {/* Projects List */}
            {profileData?.projects?.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                {profileData.projects.map((proj) => (
                  <div key={proj.id} style={{ background: theme.inputBg, padding: 16, borderRadius: 10, border: theme.inputBorder }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <strong style={{ color: "#fff", fontSize: 15 }}>{proj.title}</strong>
                      <span style={{ background: `${theme.labelColor}20`, color: theme.labelColor, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{proj.domain}</span>
                    </div>
                    <p style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.4, margin: "8px 0" }}>{proj.description}</p>
                    <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 12 }}>
                      Tech: {proj.technologies?.join(", ") || "General"} ({proj.completionYear})
                    </div>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      style={{ background: "#ef444420", color: "#f87171", border: "1px solid #ef444455", padding: "4px 10px", borderRadius: 4, fontSize: 12, cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: "#94a3b8", textAlign: "center", padding: "30px 0", background: theme.inputBg, borderRadius: 8, border: "1px dashed #334155" }}>
                <p style={{ margin: 0 }}>No projects added yet.</p>
                <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Add your completed projects to help demonstrate your expertise.</p>
              </div>
            )}
          </div>
        )}

        {/* Add Project Modal */}
        {showProjectModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999 }}>
            <form onSubmit={handleAddProject} style={{ background: theme.cardBg, padding: 24, borderRadius: 12, border: theme.cardBorder, width: 480, maxWidth: "90%", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
              <h3 style={{ color: "#fff", fontSize: 18, marginBottom: 16 }}>+ Add New Project</h3>

              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Project Title</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  style={inputStyle}
                  placeholder="e.g. Smart Flood Prediction System"
                  required
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Domain</label>
                <select
                  value={projectForm.domain}
                  onChange={(e) => setProjectForm({ ...projectForm, domain: e.target.value })}
                  style={inputStyle}
                >
                  {CONTROLLED_DOMAINS.map((d) => (
                    <option key={d} value={d} style={{ background: theme.inputBg, color: theme.inputText }}>{d}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Technologies Used (Comma-separated)</label>
                <input
                  type="text"
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                  style={inputStyle}
                  placeholder="e.g. Python, ML, IoT"
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  style={{ ...inputStyle, height: 70 }}
                  placeholder="Brief summary of project objectives and results..."
                  required
                />
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  style={{ background: "#334155", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 6, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: theme.buttonBg, color: "#fff", border: "none", padding: "8px 16px", borderRadius: 6, fontWeight: 700, cursor: "pointer" }}
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

/* ================================================================
   COLLAB & LIVE AI PIPELINE PAGE
================================================================ */

function CollabPage() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    org: "",
    domain: "Industrial IoT & Infrastructure",
    description: "",
  });

  const [matches, setMatches] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const fetchProblems = async () => {
    try {
      const data = await problemService.getProblems();
      if (Array.isArray(data)) setProblems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const loadProblemDetail = async (id) => {
    try {
      const data = await problemService.getProblemById(id);
      setSelectedProblem(data);
      if (data.matches) setMatches(data.matches);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProblem = async (e) => {
    e.preventDefault();
    if (!form.org.trim() || !form.description.trim()) {
      alert("Please fill in both organization and description.");
      return;
    }
    setLoading(true);
    try {
      const created = await problemService.createProblem(form);
      setForm({ org: "", domain: "Industrial IoT & Infrastructure", description: "" });
      await fetchProblems();
      await loadProblemDetail(created.id);
    } catch (err) {
      alert("API Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedProblem) return;
    setLoading(true);
    try {
      const updated = await problemService.analyzeProblem(selectedProblem.id);
      await loadProblemDetail(updated.id);
    } catch (err) {
      alert("Analysis error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMatch = async () => {
    if (!selectedProblem) return;
    setLoading(true);
    try {
      const ranked = await problemService.matchProblem(selectedProblem.id);
      setMatches(ranked);
      await loadProblemDetail(selectedProblem.id);
    } catch (err) {
      alert("Match error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoute = async (universityId) => {
    if (!selectedProblem) return;
    setLoading(true);
    try {
      const updated = await problemService.routeProblem(selectedProblem.id, universityId);
      await loadProblemDetail(updated.id);
    } catch (err) {
      alert("Routing error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!selectedProblem || !newTaskTitle.trim()) return;
    try {
      await taskService.createTask(selectedProblem.id, newTaskTitle.trim());
      setNewTaskTitle("");
      await loadProblemDetail(selectedProblem.id);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMoveTask = async (taskId, column) => {
    try {
      await taskService.updateTaskStatus(taskId, column);
      await loadProblemDetail(selectedProblem.id);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={styles.landing}>
      <style>{globalCSS}</style>
      <div style={styles.backgroundGlowOne} />
      <div style={styles.backgroundGlowTwo} />

      <Header />

      <main style={{ maxWidth: 1200, margin: "30px auto", padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={styles.eyebrowDot} />
          <span style={{ color: "#f59e0b", fontSize: 13, fontWeight: 700, letterSpacing: 1.5, marginLeft: 8 }}>
            LIVE OPEN INNOVATION PIPELINE
          </span>
          <h1 style={{ color: "#ffffff", fontSize: 32, fontWeight: 800, marginTop: 8 }}>
            Problem Routing & Collaboration Studio
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 15 }}>
            Submit challenges $\rightarrow$ AI Tag Extraction $\rightarrow$ University Skill Matcher $\rightarrow$ Route $\rightarrow$ Real-Time Kanban
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
          {/* Create Problem Panel */}
          <div style={{ background: "#1e293b", padding: 24, borderRadius: 12, border: "1px solid #ffffff15" }}>
            <h2 style={{ color: "#fff", fontSize: 20, marginBottom: 16 }}>1. Submit Problem Statement</h2>
            <form onSubmit={handleCreateProblem}>
              <div style={{ marginBottom: 12 }}>
                <label style={styles.label}>Organization / Author</label>
                <input
                  type="text"
                  value={form.org}
                  onChange={(e) => setForm({ ...form, org: e.target.value })}
                  style={{ ...styles.input, width: "100%" }}
                  required
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={styles.label}>Domain & Theme</label>
                <input
                  type="text"
                  value={form.domain}
                  onChange={(e) => setForm({ ...form, domain: e.target.value })}
                  style={{ ...styles.input, width: "100%" }}
                  required
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={styles.label}>Problem Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{ ...styles.input, width: "100%", height: 90, resize: "vertical" }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ ...styles.primaryButton, width: "100%", background: "#4f7bff", padding: 12, borderRadius: 6, fontWeight: 700 }}
              >
                {loading ? "Submitting..." : "Submit to Database"}
              </button>
            </form>
          </div>

          {/* Submitted Problems List & Selection */}
          <div style={{ background: "#1e293b", padding: 24, borderRadius: 12, border: "1px solid #ffffff15" }}>
            <h2 style={{ color: "#fff", fontSize: 20, marginBottom: 16 }}>Submitted Challenges ({problems.length})</h2>
            <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
              {problems.length === 0 ? (
                <p style={{ color: "#94a3b8" }}>No problems submitted yet. Create one on the left!</p>
              ) : (
                problems.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => loadProblemDetail(p.id)}
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      background: selectedProblem?.id === p.id ? "#3b82f633" : "#0f172a",
                      border: selectedProblem?.id === p.id ? "1px solid #3b82f6" : "1px solid #334155",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#fff", fontWeight: 600 }}>
                      <span>{p.org}</span>
                      <span style={{ fontSize: 12, color: "#f59e0b", background: "#f59e0b20", padding: "2px 8px", borderRadius: 4 }}>
                        {p.status}
                      </span>
                    </div>
                    <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>{p.domain}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Selected Problem Active Controls */}
        {selectedProblem && (
          <div style={{ background: "#0f172a", padding: 24, borderRadius: 12, border: "1px solid #4f7bff44", marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <span style={{ color: "#38bdf8", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
                  Selected Problem ID: {selectedProblem.id}
                </span>
                <h3 style={{ color: "#fff", fontSize: 22, margin: "4px 0" }}>{selectedProblem.org} — {selectedProblem.domain}</h3>
                <p style={{ color: "#cbd5e1", fontSize: 14 }}>{selectedProblem.description}</p>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  style={{ background: "#8b5cf6", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}
                >
                  2. AI Analyze Tags
                </button>
                <button
                  onClick={handleMatch}
                  disabled={loading || selectedProblem.extractedTags.length === 0}
                  style={{ background: "#10b981", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}
                >
                  3. Match Universities
                </button>
              </div>
            </div>

            {/* AI Problem Understanding & Domain Classification Card */}
            {selectedProblem.primaryDomain && (
              <div style={{ background: "linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))", padding: 18, borderRadius: 10, border: "1px solid #8b5cf655", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Sparkles size={20} style={{ color: "#a855f7" }} />
                    <strong style={{ color: "#fff", fontSize: 16 }}>🤖 AI Domain Classification:</strong>
                    <span style={{ background: "#8b5cf6", color: "#fff", fontWeight: 700, padding: "4px 12px", borderRadius: 16, fontSize: 13, letterSpacing: 0.5 }}>
                      {selectedProblem.primaryDomain}
                    </span>
                  </div>
                  {selectedProblem.aiConfidence && (
                    <div style={{ color: "#34d399", fontWeight: 700, fontSize: 13, background: "#10b98120", border: "1px solid #10b98155", padding: "4px 10px", borderRadius: 12 }}>
                      Confidence: {Math.round(selectedProblem.aiConfidence * 100)}%
                    </div>
                  )}
                </div>

                {selectedProblem.aiSummary && (
                  <p style={{ color: "#e2e8f0", fontSize: 14, margin: "8px 0 12px 0", lineHeight: 1.5, fontStyle: "italic" }}>
                    "{selectedProblem.aiSummary}"
                  </p>
                )}

                {selectedProblem.aiRequiredExpertise?.length > 0 && (
                  <div>
                    <span style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
                      Required Ecosystem Expertise:
                    </span>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {selectedProblem.aiRequiredExpertise.map((exp) => (
                        <span key={exp} style={{ background: "#3b82f620", color: "#60a5fa", border: "1px solid #3b82f655", padding: "3px 8px", borderRadius: 6, fontSize: 12 }}>
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Extracted Tags Display */}
            {selectedProblem.extractedTags?.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <strong style={{ color: "#94a3b8", fontSize: 13, display: "block", marginBottom: 6 }}>
                  Extracted Skill Vectors (AI NLP Engine):
                </strong>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {selectedProblem.extractedTags.map((tag) => (
                    <span key={tag} style={{ background: "#38bdf820", color: "#38bdf8", border: "1px solid #38bdf855", padding: "4px 10px", borderRadius: 16, fontSize: 13 }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic AI Pipeline & Ecosystem Routing Status Card */}
            <div style={{ marginTop: 24, padding: 18, background: "#1e293b", borderRadius: 10, border: "1px solid #334155" }}>
              <h4 style={{ color: "#fff", fontSize: 16, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <ShieldCheck size={18} style={{ color: "#38bdf8" }} />
                AI Routing & Ecosystem Status
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                <div style={{ background: "#0f172a", padding: 12, borderRadius: 8, border: "1px solid #10b98144" }}>
                  <div style={{ color: "#10b981", fontWeight: 700, fontSize: 13 }}>✓ Challenge Submitted</div>
                  <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>Saved to PostgreSQL</div>
                </div>
                <div style={{ background: "#0f172a", padding: 12, borderRadius: 8, border: selectedProblem.primaryDomain ? "1px solid #10b98144" : "1px solid #f59e0b44" }}>
                  <div style={{ color: selectedProblem.primaryDomain ? "#10b981" : "#f59e0b", fontWeight: 700, fontSize: 13 }}>
                    {selectedProblem.primaryDomain ? "✓ AI Analysis Completed" : "⏳ Pending AI Analysis"}
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>
                    {selectedProblem.primaryDomain ? `Domain: ${selectedProblem.primaryDomain}` : "Click AI Analyze"}
                  </div>
                </div>
                <div style={{ background: "#0f172a", padding: 12, borderRadius: 8, border: "1px solid #38bdf844" }}>
                  <div style={{ color: "#38bdf8", fontWeight: 700, fontSize: 13 }}>Next Step: Stakeholder Alert</div>
                  <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>Relevant students, mentors & hubs notified</div>
                </div>
              </div>
            </div>

            {/* Kanban Collaboration Board */}
            {selectedProblem.status === "ROUTED" && (
              <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #ffffff1a" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h4 style={{ color: "#fff", fontSize: 20 }}>Real-Time Kanban Board (Collaborate Stage)</h4>
                  <form onSubmit={handleAddTask} style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Add new task..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      style={{ ...styles.input, width: 220 }}
                    />
                    <button type="submit" style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 6, fontWeight: 600 }}>
                      + Add Card
                    </button>
                  </form>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  {["TODO", "DOING", "DONE"].map((col) => {
                    const colTasks = (selectedProblem.tasks || []).filter((t) => t.column === col);
                    return (
                      <div key={col} style={{ background: "#1e293b", padding: 16, borderRadius: 8, minHeight: 180 }}>
                        <div style={{ color: "#94a3b8", fontWeight: 700, marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
                          <span>{col}</span>
                          <span>{colTasks.length}</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {colTasks.map((task) => (
                            <div key={task.id} style={{ background: "#0f172a", padding: 12, borderRadius: 6, border: "1px solid #334155" }}>
                              <div style={{ color: "#fff", fontSize: 14, marginBottom: 8 }}>{task.title}</div>
                              <div style={{ display: "flex", gap: 6 }}>
                                {col !== "TODO" && (
                                  <button onClick={() => handleMoveTask(task.id, col === "DONE" ? "DOING" : "TODO")} style={{ fontSize: 11, background: "#334155", color: "#cbd5e1", border: "none", padding: "4px 8px", borderRadius: 4, cursor: "pointer" }}>
                                    ← Move Left
                                  </button>
                                )}
                                {col !== "DONE" && (
                                  <button onClick={() => handleMoveTask(task.id, col === "TODO" ? "DOING" : "DONE")} style={{ fontSize: 11, background: "#3b82f6", color: "#fff", border: "none", padding: "4px 8px", borderRadius: 4, cursor: "pointer" }}>
                                    Move Right →
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <span>© 2026 SoLink AI (SIH26043)</span>
        <span>Intelligent routing for societal innovation</span>
      </footer>
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
    fontSize: 13,
    fontWeight: 700,
    color: "#f1f5f9",
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

