// ============================================================
// About: หน้าแนะนำโปรเจกต์และทีม (/about)
// - Hero ส่วนหัวสีสันสดใส (แตกต่างจากธีมหลักของเว็บ)
// - สรุปโปรเจกต์ Calla Lily + ฟีเจอร์ + เทคโนโลยีที่ใช้
// - โปรไฟล์สมาชิกทีมทั้ง 4 คน (ข้อมูล mock แก้ไขทีหลังได้)
// ============================================================
import { Link } from "react-router-dom";

// ------------------------------------------------------------
// TEAM: โปรไฟล์สมาชิกทีม (MOCK)
// - ข้อมูลนี้เป็นตัวอย่างเท่านั้น เอาไว้แก้เป็นข้อมูลจริงทีหลัง
// - เปลี่ยนได้ที่: name, role, bio, tasks, avatar (รูป avatar
//   มาจาก DiceBear API ฟรี ลองเปลี่ยน seed ได้เลย)
// ------------------------------------------------------------
const TEAM = [
  {
    id: 1,
    name: "Black",
    role: "Auth & Homepage",
    avatar:
      "https://api.dicebear.com/9.x/adventurer/svg?seed=Black&backgroundColor=fbbf24",
    banner: "bg-gradient-to-br from-vibrant-amber to-vibrant-orange",
    badge: "bg-vibrant-amber/15 text-vibrant-amber",
    dot: "bg-vibrant-amber",
    bio: "Lines up the door of the shop — makes login and register feel easy, and shapes the homepage that welcomes every visitor.",
    tasks: ["Login / Register pages", "Auth state (login/logout)", "Homepage"],
  },
  {
    id: 2,
    name: "Bush",
    role: "Tracking & Account",
    avatar:
      "https://api.dicebear.com/9.x/adventurer/svg?seed=Bush&backgroundColor=2dd4bf",
    banner: "bg-gradient-to-br from-vibrant-teal to-vibrant-sky",
    badge: "bg-vibrant-teal/15 text-vibrant-teal",
    dot: "bg-vibrant-teal",
    bio: "Keeps customers in the loop — builds order tracking and the personal account area where users manage their details.",
    tasks: ["Tracking page", "Account page", "ProgressTracker design"],
  },
  {
    id: 3,
    name: "Toto",
    role: "Cart & Checkout",
    avatar:
      "https://api.dicebear.com/9.x/adventurer/svg?seed=Toto&backgroundColor=f472b6",
    banner: "bg-gradient-to-br from-vibrant-fuchsia to-vibrant-violet",
    badge: "bg-vibrant-fuchsia/15 text-vibrant-fuchsia",
    dot: "bg-vibrant-fuchsia",
    bio: "Turns browsing into buying — builds the live cart and a smooth checkout flow that gets orders placed without friction.",
    tasks: ["Cart state & UI", "Checkout page", "Place order logic"],
  },
  {
    id: 4,
    name: "Phupha",
    role: "Admin & Products",
    avatar:
      "https://api.dicebear.com/9.x/adventurer/svg?seed=Phupha&backgroundColor=38bdf8",
    banner: "bg-gradient-to-br from-vibrant-sky to-vibrant-violet",
    badge: "bg-vibrant-sky/15 text-vibrant-sky",
    dot: "bg-vibrant-sky",
    bio: "Runs the store behind the scenes — builds the product catalog (search, filter, sort), product detail, and admin pages.",
    tasks: ["Products page (search/filter)", "Product detail page", "Admin pages"],
  },
];

// ------------------------------------------------------------
// ฟีเจอร์หลักของเว็บ (ใช้ในส่วน "What we built")
// ------------------------------------------------------------
const FEATURES = [
  { label: "Product catalog with search & filter", dot: "bg-vibrant-amber" },
  { label: "Cart & checkout with Stripe payment", dot: "bg-vibrant-fuchsia" },
  { label: "User accounts with JWT auth", dot: "bg-vibrant-teal" },
  { label: "Order tracking for customers", dot: "bg-vibrant-sky" },
  { label: "Admin dashboard (products/orders/customers)", dot: "bg-vibrant-violet" },
  { label: "AI chat assistant (Calla AI)", dot: "bg-vibrant-rose" },
];

// ------------------------------------------------------------
// เทคโนโลยีที่ใช้
// ------------------------------------------------------------
const STACK = [
  "React 19",
  "Vite",
  "Tailwind CSS 4",
  "React Router 7",
  "Node.js & Express",
  "MongoDB & Mongoose",
  "Stripe",
  "Gemini AI",
];

export default function About() {
  return (
    <div>
      {/* ===================== Hero ===================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-vibrant-rose via-vibrant-violet to-vibrant-amber text-surface">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-vibrant-fuchsia/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-vibrant-amber/50 blur-3xl" />
        <div className="pointer-events-none absolute top-0 right-1/4 h-40 w-40 rounded-full bg-vibrant-sky/40 blur-2xl" />
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-surface/80 font-semibold mb-3">
            About the project
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Meet Calla Lily{" "}
            <span className="text-vibrant-amber">and the people</span> behind it
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-surface/85">
            A full-stack e-commerce store for handmade bath &amp; body products —
            built from scratch by a team of four in just a few sprints.
          </p>
          <a
            href="#team"
            className="mt-8 inline-flex items-center justify-center min-h-11 px-7 py-3 rounded-xl bg-surface text-primary font-semibold text-[15px] tracking-wide hover:bg-vibrant-amber/10 hover:-translate-y-px transition-all duration-150"
          >
            Meet the team ↓
          </a>
        </div>
      </section>

      {/* ===================== Our story ===================== */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <div className="bg-surface rounded-3xl shadow-md overflow-hidden flex flex-col md:flex-row">
          <div className="p-8 md:p-12 flex-1">
            <p className="text-sm uppercase tracking-widest text-vibrant-rose font-semibold mb-3">
              Our story
            </p>
            <h2 className="text-3xl font-bold text-foreground leading-tight">
              Small-batch soaps, one{" "}
              <span className="text-vibrant-violet">full website</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Calla Lily is an e-commerce platform for natural, handcrafted bath
              &amp; body care — bars, mists, and creams inspired by the peace of
              a quiet bath at the end of the day. What started as a catalog idea
              grew into a complete shopping experience: customers can browse and
              search products, read details, fill a cart, check out with real
              Stripe payments, track their orders, and chat with the Calla AI
              assistant, while admins manage products, orders, and customers
              from a dedicated dashboard.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              The project is developed as a four-person team (Black, Bush, Toto,
              and Phupha), continued from Sprint 1–2 through Sprint 3 — each
              member owning a slice of the storefront.
            </p>
          </div>
          <div className="md:w-2/5 min-h-56 bg-gradient-to-br from-vibrant-teal to-vibrant-sky">
            <img
              className="w-full h-full object-cover opacity-90"
              src="https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800"
              alt="Handmade lavender soap"
            />
          </div>
        </div>
      </section>

      {/* ===================== What we built ===================== */}
      <section className="max-w-6xl mx-auto px-6 pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-vibrant-fuchsia to-vibrant-violet text-surface rounded-3xl p-8 shadow-brand-md">
            <p className="text-sm uppercase tracking-widest text-surface/80 font-semibold mb-3">
              What we built
            </p>
            <h2 className="text-2xl font-bold leading-tight">
              Six features, one complete store
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {FEATURES.map((f) => (
                <li key={f.label} className="flex items-center gap-3">
                  <span
                    className={`h-2.5 w-2.5 rounded-full shrink-0 ${f.dot}`}
                  />
                  <span className="text-[15px] font-medium">{f.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface rounded-3xl border border-border shadow-md p-8 lg:col-span-2">
            <p className="text-sm uppercase tracking-widest text-vibrant-teal font-semibold mb-3">
              Tech stack
            </p>
            <h2 className="text-2xl font-bold text-foreground mb-5">
              Powered by a modern full-stack setup
            </h2>
            <div className="flex flex-wrap gap-3">
              {STACK.map((t) => (
                <span
                  key={t}
                  className="px-4 py-2 rounded-full bg-background text-foreground font-semibold text-sm border border-border"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/product"
                className="inline-flex items-center justify-center min-h-11 px-6 py-3 rounded-xl bg-primary text-background font-semibold text-[15px] tracking-wide border-2 border-primary hover:bg-primary-hover hover:border-primary-hover hover:-translate-y-px hover:shadow-button-hover transition-all duration-150"
              >
                Browse products
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center min-h-11 px-6 py-3 rounded-xl border-2 border-primary text-primary font-semibold text-[15px] hover:bg-primary/10 transition-colors duration-300"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== Team ===================== */}
      <section id="team" className="max-w-6xl mx-auto px-6 pb-16 md:pb-24">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-widest text-vibrant-sky font-semibold mb-3">
            Meet the team
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Four members, one little shop
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Each profile below is a placeholder for now — avatars come from a
            free avatar generator and bios will be updated with real info.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member) => (
            <div
              key={member.id}
              className="bg-surface rounded-2xl border border-border shadow-md overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-brand-md transition-all duration-200"
            >
              <div className={`h-24 ${member.banner}`} />
              <div className="px-6 pb-6 flex flex-col items-center -mt-10">
                <img
                  src={member.avatar}
                  alt={`${member.name} avatar`}
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-surface shadow-brand-md"
                />
                <h3 className="mt-3 text-xl font-bold text-foreground">
                  {member.name}
                </h3>
                <span
                  className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${member.badge}`}
                >
                  {member.role}
                </span>
                <p className="mt-4 text-sm text-muted-foreground text-center leading-relaxed">
                  {member.bio}
                </p>
                <ul className="mt-4 w-full flex flex-col gap-2 border-t border-border pt-4">
                  {member.tasks.map((task) => (
                    <li
                      key={task}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${member.dot}`} />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}