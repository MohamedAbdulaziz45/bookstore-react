import { useState } from "react";
import { Link } from "react-router-dom";

const socials = [
  { icon: "bi-facebook", label: "Facebook" },
  { icon: "bi-twitter-x", label: "Twitter" },
  { icon: "bi-instagram", label: "Instagram" },
  { icon: "bi-youtube", label: "YouTube" },
];

const columns: { heading: string; links: { label: string; path: string }[] }[] =
  [
    {
      heading: "Quick Links",
      links: [
        { label: "Home", path: "/" },
        { label: "All Books", path: "/all-books" },
        { label: "About", path: "/about" },
        { label: "Contact", path: "/contact" },
      ],
    },
    {
      heading: "Explore",
      links: [
        { label: "Best Sellers", path: "/best-seller" },
        { label: "Editor's Pick", path: "/editors-pick" },
        { label: "New Arrivals", path: "/new-arrival" },
        { label: "All Books", path: "/all-books" },
      ],
    },
    {
      heading: "Help",
      links: [
        { label: "Track Order", path: "#" },
        { label: "Delivery & Returns", path: "#" },
        { label: "FAQs", path: "#" },
        { label: "Community", path: "#" },
      ],
    },
  ];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);

  const onSubscribe = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!email) return;
    setOk(true);
    setEmail("");
    setTimeout(() => setOk(false), 3500);
  };

  return (
    <footer className="main-footer pt-5">
      <div className="container-fluid px-5">
        <div
          className="row g-4 pb-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        >
          {/* Brand + socials */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-2 bg-gold"
                style={{ width: 34, height: 34, flexShrink: 0 }}
              >
                <span>📚</span>
              </div>
              <span
                className="fw-bold fs-5 text-white"
                style={{ fontFamily: '"Lato", sans-serif' }}
              >
                BookWorms
              </span>
            </div>
            <p
              className="small mb-4"
              style={{ color: "rgba(255,255,255,0.55)", maxWidth: 260 }}
            >
              Your gateway to endless stories and knowledge. Discover, read, and
              grow with every page.
            </p>
            <div className="d-flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  className="social-link"
                  aria-label={s.label}
                >
                  <i className={`bi ${s.icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {columns.map((col) => (
            <div key={col.heading} className="col-6 col-md-2 col-lg-2">
              <p className="footer-col-title">{col.heading}</p>
              <ul className="list-unstyled mb-0">
                {col.links.map((link) => (
                  <li key={link.label} className="mb-2">
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between py-3 gap-2">
          <p className="small mb-0" style={{ color: "rgba(255,255,255,0.4)" }}>
            © 2026 BookWorms. All rights reserved to Mohamed Abdulaziz.
          </p>
        </div>
      </div>
    </footer>
  );
}
