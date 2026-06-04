interface GenreHeroProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export default function GenreHero({
  eyebrow = "",
  title = "",
  subtitle = "",
}: GenreHeroProps) {
  return (
    <section style={{ padding: "0 0 2rem" }}>
      <div
        style={{
          background:
            "linear-gradient(135deg, #f7efe5 0%, #fffaf4 55%, #f2e2cb 100%)",
          border: "1px solid rgba(199, 139, 81, 0.18)",
          borderRadius: "24px",
          padding: "2.25rem",
          boxShadow: "0 16px 50px rgba(70, 45, 18, 0.08)",
        }}
      >
        {eyebrow && (
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              fontSize: "0.74rem",
              color: "#8f623a",
              marginBottom: "0.85rem",
            }}
          >
            {eyebrow}
          </p>
        )}

        {title && (
          <h2
            style={{
              margin: "0 0 0.85rem",
              fontSize: "clamp(1.8rem, 3vw, 2.7rem)",
              color: "var(--brand-dark)",
              fontFamily: '"Lato", sans-serif',
            }}
          >
            {title}
          </h2>
        )}

        {subtitle && (
          <p
            style={{
              maxWidth: "720px",
              margin: 0,
              color: "var(--brand-gray)",
              lineHeight: 1.7,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
