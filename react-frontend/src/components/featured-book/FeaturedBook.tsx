interface FeaturedBookProps {
  title: string;
  subtitle?: string;
  author: string;
  description: string;
  image: string;
  price?: string;
}

export default function FeaturedBook({
  title,
  subtitle,
  author,
  description,
  image,
  price,
}: FeaturedBookProps) {
  return (
    <section className="section-py bg-brand">
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Image */}
          <div className="col-lg-5 order-lg-1 order-2">
            <div className="split-img">
              <img src={image} alt={title} loading="lazy" />
            </div>
          </div>

          {/* Content */}
          <div className="col-lg-7 order-lg-2 order-1">
            <span className="section-label">World's Best Seller</span>

            {subtitle && (
              <p className="fst-italic text-brand-gray mb-2 small">
                {subtitle}
              </p>
            )}

            <h2
              className="section-title mb-3"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}
            >
              {title}
            </h2>

            <p className="fw-semibold text-brand-gray mb-3">{author}</p>
            <p className="text-brand-gray lh-lg mb-4">{description}</p>

            <div className="d-flex align-items-center gap-4 flex-wrap">
              {price && <span className="fs-2 fw-bold text-gold">{price}</span>}
              <button className="btn btn-gold btn-lg px-5 text-uppercase fw-bold">
                Buy Now
              </button>
            </div>

            <div
              className="mt-4"
              style={{
                width: 64,
                height: 4,
                background: "rgba(212,175,55,.3)",
                borderRadius: 2,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
