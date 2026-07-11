import React, { useState, useEffect, useContext, createContext, useMemo } from "react";
import {
  Swords, Dumbbell, Users, Flame, Play, X, Menu, LogOut, User, Mail, Lock,
  Eye, EyeOff, CheckCircle2, Circle, Clock, Filter, Search, ChevronRight,
  Instagram, Youtube, Twitter, MapPin, AlertCircle, ArrowRight, Award,
  TrendingUp, Video, ShieldCheck, Loader2, Target, RotateCcw, Zap
} from "lucide-react";

/* =========================================================================
   MOCK FIRESTORE — VIDEO LIBRARY DATA
   In production this collection would be fetched from Firestore:
   db.collection('videos').get() -> { id, title, category, level, duration,
   thumbnailUrl, videoUrl, description, takeaways, drills }
========================================================================= */
const VIDEO_LIBRARY = [
  {
    id: "v1", title: "Jab-Cross-Hook Combinations", category: "Striking", level: "Beginner",
    duration: "12:34", videoUrl: "https://www.youtube.com/embed/M7lc1UVf-VE",
    description: "The foundational three-punch combination every striker builds around. This session breaks down hip rotation, hand return speed, and how to chain the hook off a committed cross without dropping your guard.",
    takeaways: ["Keep your chin tucked behind your lead shoulder on the jab", "Rotate the hip fully before the hook lands", "Reset your hands to guard after every combo, no exceptions"],
    drills: "5 rounds x 2 minutes on the pads, 30 seconds rest between rounds"
  },
  {
    id: "v2", title: "Low Kick Setups & Checks", category: "Striking", level: "Intermediate",
    duration: "15:10", videoUrl: "https://www.youtube.com/embed/M7lc1UVf-VE",
    description: "How to disguise a low kick behind hand combinations, and the mechanics of checking one without eating the shin. Covers stance switching and the timing window for counter low kicks.",
    takeaways: ["Load the kick from the ball of your plant foot, not the hip", "Check with the shin angled, not flat-footed", "Feint high before committing low to break the read"],
    drills: "4 rounds x 3 minutes shadow work, then 3 rounds on the Thai pads"
  },
  {
    id: "v3", title: "Elbow & Knee Clinch Work", category: "Striking", level: "Advanced",
    duration: "18:20", videoUrl: "https://www.youtube.com/embed/M7lc1UVf-VE",
    description: "Muay Thai clinch fundamentals adapted for MMA — framing against the cage, off-balancing for knees, and short elbow angles that don't expose you to a takedown.",
    takeaways: ["Control the bicep and back of the head, not the neck alone", "Break posture before throwing the knee", "Keep elbows tight to avoid an underhook giveaway"],
    drills: "6 x 2 minute clinch rounds, live resistance from a partner"
  },
  {
    id: "v4", title: "Closed Guard Fundamentals", category: "BJJ", level: "Beginner",
    duration: "14:05", videoUrl: "https://www.youtube.com/embed/M7lc1UVf-VE",
    description: "Everything starts here. Proper hip and ankle positioning in closed guard, how to break posture, and the two grips that set up every submission and sweep in this position.",
    takeaways: ["Hips off the mat, not flat on your back", "Break posture with a wrist and collar grip combo", "Ankles crossed loose, never locked under pressure"],
    drills: "10 minutes of specific sparring starting from closed guard"
  },
  {
    id: "v5", title: "Triangle Choke from Guard", category: "BJJ", level: "Intermediate",
    duration: "16:45", videoUrl: "https://www.youtube.com/embed/M7lc1UVf-VE",
    description: "The angle-first approach to triangles — why most triangles fail on the finish, not the entry, and how to fix your leg angle before you ever lock the figure-four.",
    takeaways: ["Get your hips off-line before locking the triangle", "Pull the head down, not just the leg up", "Adjust the angle before you squeeze, not after"],
    drills: "3 sets of 5 reps per side on a compliant partner, then live rolling"
  },
  {
    id: "v6", title: "Back Take & Rear Naked Choke", category: "BJJ", level: "Advanced",
    duration: "19:30", videoUrl: "https://www.youtube.com/embed/M7lc1UVf-VE",
    description: "Transitioning from a body triangle to hooks, seatbelt control, and the finishing mechanics of a rear naked choke that doesn't rely on brute strength.",
    takeaways: ["Seatbelt grip before hooks, always", "Chin strap first to kill the frame", "Choke with the forearm bone, not the bicep alone"],
    drills: "5 rounds of back-control retention sparring, 3 minutes each"
  },
  {
    id: "v7", title: "Double Leg Takedown Mechanics", category: "Grappling", level: "Beginner",
    duration: "13:15", videoUrl: "https://www.youtube.com/embed/M7lc1UVf-VE",
    description: "Level change, penetration step, and the finish — the double leg broken into three teachable phases with common mistakes at every stage.",
    takeaways: ["Level change with the legs, not a bent-over back", "Drive through the hip on the penetration step", "Finish by running the feet, not just pulling in"],
    drills: "6 sets of 5 reps against a bag, then 4 live reps against resistance"
  },
  {
    id: "v8", title: "Sprawl & Takedown Defense", category: "Grappling", level: "Intermediate",
    duration: "11:50", videoUrl: "https://www.youtube.com/embed/M7lc1UVf-VE",
    description: "Reactive sprawling under fatigue, hip pressure to flatten a shot, and the whizzer versus underhook decision tree for scrambling back to your feet.",
    takeaways: ["Sprawl hips down and back, not just legs kicked back", "Apply downward pressure through the shoulders", "Choose whizzer or underhook based on their hip position"],
    drills: "5 rounds x 90 seconds of live shot entries from a partner"
  },
  {
    id: "v9", title: "Chain Wrestling & Scrambles", category: "Grappling", level: "Advanced",
    duration: "20:00", videoUrl: "https://www.youtube.com/embed/M7lc1UVf-VE",
    description: "Linking a failed shot into a second and third attempt without resetting position. Focuses on hip awareness during scrambles and staying offensive when the first takedown is stuffed.",
    takeaways: ["Never fully stand up between chained attempts", "Track hips, not hands, during a scramble", "Convert a stuffed shot into a leg ride immediately"],
    drills: "8 minutes of continuous live wrestling, restart on a stalemate only"
  },
  {
    id: "v10", title: "Fight Camp Conditioning Circuit", category: "Conditioning", level: "Beginner",
    duration: "25:00", videoUrl: "https://www.youtube.com/embed/M7lc1UVf-VE",
    description: "The exact circuit used in fight camp to build fight-specific gas tank — combining explosive output with the aerobic recovery capacity needed for a full three-round fight.",
    takeaways: ["Match work-to-rest ratio to your actual round length", "Explosive movements first, steady-state after", "Track heart rate recovery between rounds, not just output"],
    drills: "6 rounds x 5 minutes, 1 minute rest, full-body circuit"
  },
  {
    id: "v11", title: "Cage Wrestling & Fence Control", category: "Grappling", level: "Advanced",
    duration: "17:40", videoUrl: "https://www.youtube.com/embed/M7lc1UVf-VE",
    description: "MMA-specific wrestling against the cage — using the fence to finish takedowns, defend against it off your back, and control posture during a fence-assisted stand-up.",
    takeaways: ["Use the cage as a third point of control, not a wall to lean on", "Kill hip movement before attempting a stand-up", "Keep your head up during fence takedown defense"],
    drills: "5 rounds x 3 minutes of live cage wrestling"
  },
  {
    id: "v12", title: "MMA Round Simulation Conditioning", category: "Conditioning", level: "Advanced",
    duration: "22:15", videoUrl: "https://www.youtube.com/embed/M7lc1UVf-VE",
    description: "A five-round simulation mixing striking output, takedown entries, and ground-and-pound bursts to replicate genuine fight pace under real fatigue.",
    takeaways: ["Simulate all three phases of MMA every round, not just one", "Push through the fatigue dip in round three", "Recover actively between rounds, don't fully stop"],
    drills: "5 x 5 minute simulated rounds, 1 minute rest between"
  }
];

const CATEGORY_STYLES = {
  Striking: { icon: Flame, chip: "bg-red-600/15 text-red-400 border-red-600/30" },
  BJJ: { icon: Users, chip: "bg-orange-600/15 text-orange-400 border-orange-600/30" },
  Grappling: { icon: Target, chip: "bg-red-500/15 text-red-300 border-red-500/30" },
  Conditioning: { icon: Dumbbell, chip: "bg-neutral-600/20 text-neutral-300 border-neutral-500/30" }
};

const LEVEL_STYLES = {
  Beginner: "bg-emerald-600/15 text-emerald-400 border-emerald-600/30",
  Intermediate: "bg-amber-600/15 text-amber-400 border-amber-600/30",
  Advanced: "bg-red-600/15 text-red-400 border-red-600/30"
};

/* =========================================================================
   MOCK FIREBASE AUTH CONTEXT
   Mirrors the shape of a real Firebase Auth integration so swapping in
   `signInWithEmailAndPassword` / `createUserWithEmailAndPassword` from
   firebase/auth later requires no changes to consuming components.
========================================================================= */
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const signup = ({ name, email, password, confirmPassword }) => {
    return new Promise((resolve, reject) => {
      if (!name.trim()) return reject("Please enter your full name.");
      if (!validateEmail(email)) return reject("The email address is badly formatted.");
      if (password.length < 6) return reject("Password should be at least 6 characters.");
      if (password !== confirmPassword) return reject("Passwords do not match.");
      setAuthLoading(true);
      setTimeout(() => {
        setAuthLoading(false);
        const user = { uid: "mock-" + Date.now(), name, email };
        setCurrentUser(user);
        resolve(user);
      }, 900);
    });
  };

  const login = ({ email, password }) => {
    return new Promise((resolve, reject) => {
      if (!validateEmail(email)) return reject("The email address is badly formatted.");
      if (password.length < 6) return reject("Wrong password. Try again or reset it.");
      setAuthLoading(true);
      setTimeout(() => {
        setAuthLoading(false);
        const user = { uid: "mock-" + Date.now(), name: email.split("@")[0], email };
        setCurrentUser(user);
        resolve(user);
      }, 900);
    });
  };

  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, authLoading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/* =========================================================================
   MOCK FIRESTORE FETCH
========================================================================= */
function useVideoLibrary() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setVideos(VIDEO_LIBRARY);
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  return { videos, loading };
}

/* =========================================================================
   SHARED UI PIECES
========================================================================= */
function Logo({ onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 group">
      <span className="flex items-center justify-center w-9 h-9 rounded-md bg-red-600 group-hover:bg-red-500 transition-colors duration-300">
        <Swords className="w-5 h-5 text-black" strokeWidth={2.5} />
      </span>
      <span className="leading-none text-left">
        <span
          className="block text-xl text-white tracking-wide"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
        >
          VANGUARDS <span className="text-red-500">MMA</span>
        </span>
        <span className="block text-[10px] text-neutral-500 tracking-[0.3em]">ACADEMY</span>
      </span>
    </button>
  );
}

function Header({ view, setView, setAuthMode }) {
  const { currentUser, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (v) => { setView(v); setMobileOpen(false); };

  return (
    <header className="sticky top-0 z-40 bg-black/90 backdrop-blur border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logo onClick={() => go("landing")} />

        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => go("landing")}
            className={`text-sm font-medium tracking-wide transition-colors duration-200 ${view === "landing" ? "text-white" : "text-neutral-400 hover:text-white"}`}
          >
            HOME
          </button>
          <button
            onClick={() => go(currentUser ? "dashboard" : "auth")}
            className={`text-sm font-medium tracking-wide transition-colors duration-200 ${view === "dashboard" ? "text-white" : "text-neutral-400 hover:text-white"}`}
          >
            VIDEO LIBRARY
          </button>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-sm text-neutral-300">
                <span className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-red-400" />
                </span>
                {currentUser.name}
              </span>
              <button
                onClick={() => { logout(); go("landing"); }}
                className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-red-400 transition-colors duration-200 border border-neutral-800 hover:border-red-900 rounded-md px-3 py-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => { setAuthMode("login"); go("auth"); }}
                className="text-sm font-medium text-neutral-300 hover:text-white transition-colors duration-200 px-3 py-2"
              >
                Log In
              </button>
              <button
                onClick={() => { setAuthMode("signup"); go("auth"); }}
                className="text-sm font-semibold bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md transition-all duration-300 hover:scale-[1.02]"
              >
                Start Training
              </button>
            </>
          )}
        </div>

        <button className="md:hidden text-neutral-300" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-black px-4 py-4 space-y-3">
          <button onClick={() => go("landing")} className="block w-full text-left text-neutral-300 py-2">Home</button>
          <button onClick={() => go(currentUser ? "dashboard" : "auth")} className="block w-full text-left text-neutral-300 py-2">Video Library</button>
          {currentUser ? (
            <button onClick={() => { logout(); go("landing"); }} className="flex items-center gap-2 text-red-400 py-2">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          ) : (
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setAuthMode("login"); go("auth"); }} className="flex-1 border border-neutral-700 text-neutral-200 rounded-md py-2 text-sm">Log In</button>
              <button onClick={() => { setAuthMode("signup"); go("auth"); }} className="flex-1 bg-red-600 text-white rounded-md py-2 text-sm font-semibold">Sign Up</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function Footer({ setView }) {
  return (
    <footer className="bg-black border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <Logo onClick={() => setView("landing")} />
          <p className="mt-4 text-sm text-neutral-500 leading-relaxed max-w-xs">
            A no-nonsense academy built for people who want to actually get better —
            in the room and on the mat, round after round.
          </p>
          <div className="flex gap-3 mt-5">
            {[Instagram, Youtube, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-md bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-red-400 hover:border-red-900 transition-all duration-300"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold tracking-wide mb-4">QUICK LINKS</h4>
          <ul className="space-y-2.5 text-sm text-neutral-500">
            <li><button onClick={() => setView("landing")} className="hover:text-red-400 transition-colors duration-200">Home</button></li>
            <li><button onClick={() => setView("auth")} className="hover:text-red-400 transition-colors duration-200">Membership</button></li>
            <li><button onClick={() => setView("dashboard")} className="hover:text-red-400 transition-colors duration-200">Video Library</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold tracking-wide mb-4">THE ACADEMY</h4>
          <p className="flex items-start gap-2 text-sm text-neutral-500 mb-2">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
            412 Ironclad Row, Unit 3, Industrial District
          </p>
          <p className="text-sm text-neutral-500">Mon–Sat · 6AM – 10PM</p>
        </div>
      </div>

      <div className="border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between gap-3">
          <p className="text-xs text-neutral-600">© 2026 Vanguards MMA Academy. All rights reserved.</p>
          <p className="text-xs text-neutral-600 max-w-xl">
            Combat sports carry inherent risk of injury. Always train under qualified supervision and consult a physician before beginning any new training program.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================================
   LANDING PAGE
========================================================================= */
const PROGRAMS = [
  { name: "Striking / Kickboxing", icon: Flame, tags: ["Boxing", "Muay Thai", "Footwork"], desc: "Build fight-ready hands and kicks through pad work, combination drilling, and live sparring rounds." },
  { name: "Brazilian Jiu-Jitsu", icon: Users, tags: ["Guard", "Submissions", "Escapes"], desc: "From closed guard to advanced back takes — a curriculum built on control before submission." },
  { name: "Wrestling", icon: Target, tags: ["Takedowns", "Defense", "Scrambles"], desc: "Learn to dictate where the fight happens with real takedown offense and defense." },
  { name: "MMA Integration", icon: Swords, tags: ["Cage Work", "Transitions", "Fight IQ"], desc: "Combine every discipline into one system — the phase where fights are actually won." }
];

const FEATURES = [
  { icon: Video, title: "Full Online Video Library", desc: "Every technique taught in the gym, archived and searchable, so a missed class never means a missed lesson." },
  { icon: TrendingUp, title: "Track Your Progress", desc: "Mark techniques as completed and watch your training log build session by session, discipline by discipline." },
  { icon: ShieldCheck, title: "Expert Coaching", desc: "Every video is taught by our own coaching staff — the same voices you hear on the mat." }
];

function Landing({ setView, setAuthMode }) {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-black">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)"
          }}
        />
        <div className="absolute -top-24 -right-40 w-[600px] h-[600px] bg-red-700/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-red-900/20 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28 md:pt-36 md:pb-40">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-red-500 border border-red-900/60 bg-red-950/30 rounded-full px-3 py-1.5">
              <Flame className="w-3.5 h-3.5" /> ELITE MMA TRAINING
            </span>
            <h1
              className="mt-6 text-white leading-[0.95] text-6xl sm:text-7xl md:text-8xl"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.01em" }}
            >
              TRAIN UNTIL <br /> THE <span className="text-red-500">BELL RINGS</span>
            </h1>
            <p className="mt-6 text-neutral-400 text-lg max-w-xl leading-relaxed">
              Striking, jiu-jitsu, wrestling, and full MMA integration — taught by coaches
              who've been in the cage, with a video library that keeps the work going after you leave the mat.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => { setAuthMode("signup"); setView("auth"); }}
                className="group inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-sm tracking-wide px-7 py-4 rounded-md transition-all duration-300 hover:scale-[1.02]"
              >
                START TRAINING NOW
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button
                onClick={() => { setAuthMode("login"); setView("auth"); }}
                className="inline-flex items-center justify-center gap-2 border border-neutral-700 hover:border-neutral-500 text-neutral-200 font-semibold text-sm tracking-wide px-7 py-4 rounded-md transition-all duration-300 hover:scale-[1.02]"
              >
                Member Login
              </button>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-6 max-w-lg">
              {[["500+", "Fighters Trained"], ["12", "Coaching Staff"], ["4", "Core Disciplines"]].map(([num, label]) => (
                <div key={label}>
                  <div className="text-3xl md:text-4xl text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{num}</div>
                  <div className="text-xs text-neutral-500 tracking-wide mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="bg-neutral-950 border-t border-neutral-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <span className="text-xs font-semibold tracking-[0.25em] text-red-500">DISCIPLINES</span>
              <h2 className="mt-2 text-4xl md:text-5xl text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                WHAT WE TEACH
              </h2>
            </div>
            <p className="text-neutral-500 max-w-sm text-sm">
              Four disciplines, one system. Every program feeds directly into full MMA integration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROGRAMS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.name}
                  className="group bg-neutral-900 border border-neutral-800 hover:border-red-800/60 rounded-lg p-6 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="w-11 h-11 rounded-md bg-red-600/10 border border-red-700/30 flex items-center justify-center group-hover:bg-red-600/20 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="mt-5 text-white font-semibold text-lg">{p.name}</h3>
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed">{p.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="text-[11px] text-neutral-400 bg-neutral-800 rounded px-2 py-1">{t}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-black py-24 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-semibold tracking-[0.25em] text-red-500">THE PLATFORM</span>
            <h2 className="mt-2 text-4xl md:text-5xl text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              TRAINING THAT FOLLOWS YOU HOME
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="text-center px-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="mt-5 text-white font-semibold text-lg">{f.title}</h3>
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative bg-red-700 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 0px, #000 2px, transparent 2px, transparent 24px)" }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-4xl md:text-5xl text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            READY TO STEP IN?
          </h2>
          <p className="mt-3 text-red-100 max-w-lg mx-auto">
            Your first class is on us. No contracts, no pressure — just find out if this is the room for you.
          </p>
          <button
            onClick={() => { setAuthMode("signup"); setView("auth"); }}
            className="mt-7 inline-flex items-center gap-2 bg-black hover:bg-neutral-900 text-white font-semibold text-sm tracking-wide px-7 py-4 rounded-md transition-all duration-300 hover:scale-[1.02]"
          >
            CLAIM YOUR FIRST CLASS <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

/* =========================================================================
   AUTH PAGE (LOGIN / SIGNUP)
========================================================================= */
function AuthPage({ authMode, setAuthMode, setView }) {
  const { login, signup, authLoading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const isSignup = authMode === "signup";

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const action = isSignup ? signup(form) : login(form);
    action.then(() => setView("dashboard")).catch((msg) => setError(msg));
  };

  const switchMode = (mode) => {
    setAuthMode(mode);
    setError("");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden border border-neutral-800">
        {/* Branding panel */}
        <div className="hidden md:flex relative bg-neutral-950 p-10 flex-col justify-between">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 36px)" }}
          />
          <div className="relative">
            <Logo onClick={() => setView("landing")} />
          </div>
          <div className="relative">
            <p className="text-2xl text-white leading-snug" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              "DISCIPLINE ISN'T SOMETHING YOU FEEL. IT'S SOMETHING YOU DO ANYWAY."
            </p>
            <p className="mt-4 text-sm text-neutral-500">— Coaching Staff, Vanguards MMA</p>
          </div>
        </div>

        {/* Form panel */}
        <div className="bg-neutral-900 p-8 sm:p-10">
          <div className="flex gap-2 mb-8 bg-neutral-950 border border-neutral-800 rounded-md p-1">
            <button
              onClick={() => switchMode("login")}
              className={`flex-1 text-sm font-semibold py-2 rounded transition-all duration-300 ${!isSignup ? "bg-red-600 text-white" : "text-neutral-400 hover:text-white"}`}
            >
              Log In
            </button>
            <button
              onClick={() => switchMode("signup")}
              className={`flex-1 text-sm font-semibold py-2 rounded transition-all duration-300 ${isSignup ? "bg-red-600 text-white" : "text-neutral-400 hover:text-white"}`}
            >
              Sign Up
            </button>
          </div>

          <h2 className="text-2xl text-white font-semibold">
            {isSignup ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-sm text-neutral-500 mt-1 mb-6">
            {isSignup ? "Start tracking every technique you learn." : "Log in to pick up where you left off."}
          </p>

          {error && (
            <div className="mb-5 flex items-start gap-2 bg-red-950/50 border border-red-900 rounded-md px-3 py-2.5 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text" value={form.name} onChange={update("name")} required
                    placeholder="Alex Rivera"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-600 rounded-md pl-10 pr-3 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors duration-200"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email" value={form.email} onChange={update("email")} required
                  placeholder="you@example.com"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-600 rounded-md pl-10 pr-3 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPw ? "text" : "password"} value={form.password} onChange={update("password")} required
                  placeholder="••••••••"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-600 rounded-md pl-10 pr-10 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors duration-200"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {isSignup && <p className="text-[11px] text-neutral-600 mt-1.5">Minimum 6 characters.</p>}
            </div>

            {isSignup && (
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPw ? "text" : "password"} value={form.confirmPassword} onChange={update("confirmPassword")} required
                    placeholder="••••••••"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-600 rounded-md pl-10 pr-3 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors duration-200"
                  />
                </div>
              </div>
            )}

            <button
              type="submit" disabled={authLoading}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-md transition-all duration-300 hover:scale-[1.01] mt-2"
            >
              {authLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> {isSignup ? "Creating account..." : "Logging in..."}</>
              ) : (
                isSignup ? "Create Account" : "Log In"
              )}
            </button>
          </form>

          <p className="text-xs text-neutral-600 mt-6 text-center">
            This demo uses a simulated authentication layer. Connect Firebase Auth to enable real accounts.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   VIDEO CARD
========================================================================= */
function VideoCard({ video, completed, onToggleComplete, onOpen }) {
  const catStyle = CATEGORY_STYLES[video.category];
  const CatIcon = catStyle.icon;

  return (
    <div
      onClick={() => onOpen(video)}
      className="group relative bg-neutral-900 border border-neutral-800 hover:border-red-800/60 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]"
    >
      {/* ticket notches */}
      <div className="absolute top-16 -left-2 w-4 h-4 rounded-full bg-black border border-neutral-800 z-10" />
      <div className="absolute top-16 -right-2 w-4 h-4 rounded-full bg-black border border-neutral-800 z-10" />

      <div className="relative h-40 bg-gradient-to-br from-neutral-800 to-neutral-950 flex items-center justify-center overflow-hidden">
        <CatIcon className="w-16 h-16 text-neutral-700 group-hover:text-red-900/70 transition-colors duration-300" strokeWidth={1.5} />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-300">
          <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
          </div>
        </div>
        <span className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 text-neutral-300 text-[11px] px-2 py-0.5 rounded">
          <Clock className="w-3 h-3" /> {video.duration}
        </span>
      </div>

      <div className="p-4 border-t border-dashed border-neutral-800">
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded border ${catStyle.chip}`}>
            {video.category}
          </span>
          <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded border ${LEVEL_STYLES[video.level]}`}>
            {video.level}
          </span>
        </div>
        <h3 className="text-white font-semibold text-sm leading-snug">{video.title}</h3>

        <button
          onClick={(e) => { e.stopPropagation(); onToggleComplete(video.id); }}
          className={`mt-3 flex items-center gap-2 text-xs font-medium transition-colors duration-200 ${completed ? "text-emerald-400" : "text-neutral-500 hover:text-neutral-300"}`}
        >
          {completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
          {completed ? "Completed" : "Mark as Completed"}
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   VIDEO DETAIL MODAL
========================================================================= */
function VideoModal({ video, completed, onToggleComplete, onClose }) {
  if (!video) return null;
  const catStyle = CATEGORY_STYLES[video.category];
  const CatIcon = catStyle.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between p-5 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded border ${catStyle.chip}`}>
                {video.category}
              </span>
              <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded border ${LEVEL_STYLES[video.level]}`}>
                {video.level}
              </span>
            </div>
            <h2 className="text-xl text-white font-semibold">{video.title}</h2>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors duration-200 shrink-0 ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="aspect-video bg-black">
          <iframe
            src={video.videoUrl}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
              <CatIcon className="w-4 h-4 text-red-500" /> Technique Breakdown
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">{video.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-red-500" /> Key Takeaways
            </h3>
            <ul className="space-y-2">
              {video.takeaways.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-md p-4 flex items-start gap-3">
            <Zap className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wide">Drill Repetitions</h4>
              <p className="text-sm text-neutral-400 mt-1">{video.drills}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 p-5 border-t border-neutral-800">
          <button
            onClick={() => onToggleComplete(video.id)}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md transition-all duration-300 hover:scale-[1.02] ${
              completed ? "bg-emerald-600/15 text-emerald-400 border border-emerald-700/40" : "bg-red-600 hover:bg-red-500 text-white"
            }`}
          >
            {completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            {completed ? "Marked Completed" : "Mark as Completed"}
          </button>
          <button onClick={onClose} className="text-sm text-neutral-400 hover:text-white transition-colors duration-200">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   DASHBOARD (PROTECTED VIDEO LIBRARY)
========================================================================= */
const CATEGORIES = ["Striking", "BJJ", "Grappling", "Conditioning"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

function Dashboard({ setView, setAuthMode }) {
  const { currentUser } = useAuth();
  const { videos, loading } = useVideoLibrary();

  const [activeCategories, setActiveCategories] = useState([]);
  const [activeLevel, setActiveLevel] = useState("All");
  const [search, setSearch] = useState("");
  const [completedIds, setCompletedIds] = useState(new Set());
  const [openVideo, setOpenVideo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Protected route: redirect to auth if not logged in
  if (!currentUser) {
    return <AuthPage authMode="login" setAuthMode={setAuthMode} setView={setView} />;
  }

  const toggleCategory = (cat) => {
    setActiveCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  };

  const toggleComplete = (id) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const resetFilters = () => {
    setActiveCategories([]);
    setActiveLevel("All");
    setSearch("");
  };

  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const matchCat = activeCategories.length === 0 || activeCategories.includes(v.category);
      const matchLevel = activeLevel === "All" || v.level === activeLevel;
      const matchSearch = v.title.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchLevel && matchSearch;
    });
  }, [videos, activeCategories, activeLevel, search]);

  const progressPct = videos.length ? Math.round((completedIds.size / videos.length) * 100) : 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-semibold tracking-[0.25em] text-red-500">THE LIBRARY</span>
            <h1 className="text-3xl md:text-4xl text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              WELCOME BACK, {currentUser.name.toUpperCase()}
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden flex items-center gap-2 border border-neutral-800 text-neutral-300 text-sm px-3 py-2 rounded-md"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* SIDEBAR */}
          <aside className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-6 lg:sticky lg:top-24">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-2 tracking-wide">SEARCH</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Find a technique..."
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-600 rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-600 outline-none transition-colors duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-2 tracking-wide">CATEGORY</label>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => {
                    const active = activeCategories.includes(cat);
                    const Icon = CATEGORY_STYLES[cat].icon;
                    return (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`w-full flex items-center gap-2.5 text-sm px-3 py-2 rounded-md border transition-all duration-200 ${
                          active ? "bg-red-600/10 border-red-700/50 text-red-400" : "border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
                        }`}
                      >
                        <Icon className="w-4 h-4" /> {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-2 tracking-wide">DIFFICULTY</label>
                <div className="flex flex-wrap gap-2">
                  {["All", ...LEVELS].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setActiveLevel(lvl)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 ${
                        activeLevel === lvl ? "bg-red-600 border-red-600 text-white" : "border-neutral-800 text-neutral-400 hover:border-neutral-700"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-red-400 transition-colors duration-200"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset filters
              </button>

              <div className="pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                  <span>Your Progress</span>
                  <span className="text-white font-semibold">{completedIds.size}/{videos.length}</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            </div>
          </aside>

          {/* VIDEO GRID */}
          <div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-64 rounded-lg bg-neutral-900 border border-neutral-800 animate-pulse" />
                ))}
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-neutral-800 rounded-lg">
                <Search className="w-8 h-8 text-neutral-700 mb-3" />
                <p className="text-neutral-400 font-medium">No videos match your filters</p>
                <p className="text-sm text-neutral-600 mt-1">Try adjusting your category, level, or search terms.</p>
                <button onClick={resetFilters} className="mt-4 text-sm text-red-400 hover:text-red-300 font-medium">
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    completed={completedIds.has(video.id)}
                    onToggleComplete={toggleComplete}
                    onOpen={setOpenVideo}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <VideoModal
        video={openVideo}
        completed={openVideo ? completedIds.has(openVideo.id) : false}
        onToggleComplete={toggleComplete}
        onClose={() => setOpenVideo(null)}
      />
    </div>
  );
}

/* =========================================================================
   ROOT APP
========================================================================= */
export default function App() {
  const [view, setView] = useState("landing");
  const [authMode, setAuthMode] = useState("login");

  return (
    <AuthProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
      `}</style>
      <div className="bg-black min-h-screen flex flex-col">
        <Header view={view} setView={setView} setAuthMode={setAuthMode} />
        <main className="flex-1">
          {view === "landing" && <Landing setView={setView} setAuthMode={setAuthMode} />}
          {view === "auth" && <AuthPage authMode={authMode} setAuthMode={setAuthMode} setView={setView} />}
          {view === "dashboard" && <Dashboard setView={setView} setAuthMode={setAuthMode} />}
        </main>
        <Footer setView={setView} />
      </div>
    </AuthProvider>
  );
}
