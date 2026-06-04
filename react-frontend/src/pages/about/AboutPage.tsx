import { Link } from "react-router-dom";
import CartSidebar from "../../components/cart-sidebar/CartSidebar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageBanner from "../../components/page-banner/PageBanner";
import NewsletterSection from "../../components/newsletter-section/NewsletterSection";

const authors = [
  {
    id: "1",
    name: "Melissa Miner",
    role: "Author",
    image:
      "https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/author-image01.jpg",
  },
  {
    id: "2",
    name: "Steven Moore",
    role: "Author",
    image:
      "https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/author-image02.jpg",
  },
  {
    id: "3",
    name: "Jenny Sanders",
    role: "Author",
    image:
      "https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/author-image03.jpg",
  },
  {
    id: "4",
    name: "Andrew Woods",
    role: "Author",
    image:
      "https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/author-image04.jpg",
  },
];

const stats = [
  { num: "10,000+", label: "Books Available" },
  { num: "500+", label: "Published Authors" },
  { num: "50,000+", label: "Happy Readers" },
  { num: "100+", label: "Categories" },
];

const partnerLogos = [
  "https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/logoipsum-logo-4.svg",
  "https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/logoipsum-logo-5.svg",
  "https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/logoipsum-logo-3.svg",
  "https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/logoipsum-logo-2.svg",
  "https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/logoipsum-logo-1.svg",
];

export default function AboutPage() {
  return (
    <>
      <CartSidebar />
      <Header />
      <PageBanner
        title="About Us"
        subtitle="Learn about who we are, what we believe, and why books matter to us."
      />

      {/* Welcome */}
      <section className="section-py bg-brand">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="section-label">Our Story</span>
              <h2 className="section-title mb-4">Welcome to BookWorms</h2>
              <p className="text-brand-gray lh-lg mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem
                eget condimentum enim libero ultricies amet odio fringilla. Ut
                nibh morbi augue porta aliquet commodo. Fermentum auctor lacus
                eget in ut integer viverra sed.
              </p>
              <p className="text-brand-gray lh-lg mb-4">
                Penatibus tortor consequat, habitasse non nisl. Mus cras lacus
                tellus morbi viverra suspendisse ornare. Sit volutpat, volutpat
                ut netus malesuada enim penatibus non aliquet.
              </p>
              <Link
                to="/all-books"
                className="btn btn-gold btn-lg px-5 fw-bold text-uppercase"
              >
                Browse Books
              </Link>
            </div>
            <div className="col-lg-6">
              <div className="split-img">
                <img
                  src="https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/about-image.jpg"
                  alt="About BookWorms"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-py bg-warm">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <span className="section-label">What We Believe</span>
              <h2 className="section-title mb-4">Our Vision</h2>
              <p className="text-brand-gray lh-lg mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem
                eget condimentum enim libero ultricies amet odio fringilla. Ut
                nibh morbi augue porta aliquet commodo.
              </p>
              <p className="text-brand-gray lh-lg mb-4">
                Mus cras lacus tellus morbi viverra suspendisse ornare. Sit
                volutpat, volutpat ut netus malesuada enim penatibus non
                aliquet.
              </p>
              <blockquote
                className="ps-4 fst-italic fw-semibold"
                style={{
                  borderLeft: "4px solid var(--gold)",
                  color: "var(--brand-dark)",
                }}
              >
                Integ nosd quos cras demque sint fames sque optio aut Impedit
                metus quas neque accu minus be since 1918
              </blockquote>
            </div>
            <div className="col-lg-6">
              <span className="section-label">What We Do</span>
              <h2 className="section-title mb-4">Our Mission</h2>
              <p className="text-brand-gray lh-lg mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem
                eget condimentum enim libero ultricies amet odio fringilla. Ut
                nibh morbi augue porta aliquet commodo.
              </p>
              <p className="text-brand-gray lh-lg mb-3">
                Mus cras lacus tellus morbi viverra suspendisse ornare. Sit
                volutpat, volutpat ut netus malesuada enim penatibus non
                aliquet.
              </p>
              <p className="text-brand-gray lh-lg">
                Mus cras lacus tellus morbi viverra suspendisse ornare. Sit
                volutpat, volutpat ut netus malesuada enim penatibus non
                aliquet.
              </p>
            </div>
          </div>

          {/* As seen in */}
          <div className="mt-5 pt-4 border-top border-brand">
            <p
              className="text-center text-brand-gray small fw-bold text-uppercase mb-4"
              style={{ letterSpacing: ".14em" }}
            >
              As seen in:
            </p>
            <div className="d-flex flex-wrap justify-content-center align-items-center gap-4 gap-md-5">
              {partnerLogos.map((logo) => (
                <img
                  key={logo}
                  src={logo}
                  alt="Media partner"
                  style={{
                    height: 26,
                    opacity: 0.5,
                    filter: "grayscale(1)",
                    transition: "all .3s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = "1";
                    (e.currentTarget as HTMLImageElement).style.filter = "none";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = ".5";
                    (e.currentTarget as HTMLImageElement).style.filter =
                      "grayscale(1)";
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-py bg-brand">
        <div className="container">
          <div className="row row-cols-2 row-cols-md-4 g-4 text-center">
            {stats.map((s) => (
              <div key={s.label} className="col">
                <div className="stat-item">
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Authors */}
      <section className="section-py bg-warm">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Most Popular Authors</h2>
            <p
              className="text-brand-gray mt-2 mx-auto"
              style={{ maxWidth: 500 }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt.
            </p>
          </div>
          <div className="row row-cols-2 row-cols-md-4 g-4">
            {authors.map((author) => (
              <div key={author.id} className="col">
                <div className="text-center">
                  <div className="author-avatar mb-3">
                    <img src={author.image} alt={author.name} loading="lazy" />
                  </div>
                  <h6 className="fw-bold mb-0">{author.name}</h6>
                  <small className="text-brand-gray">{author.role}</small>
                  <div className="d-flex justify-content-center gap-2 mt-2">
                    {["Facebook", "LinkedIn", "Instagram"].map((s) => (
                      <a
                        key={s}
                        href="#"
                        className="small text-brand-gray fw-semibold"
                        style={{ transition: "color .2s" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "var(--gold)")
                        }
                        onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                      >
                        {s}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram feed */}
      <section className="section-py bg-brand text-center">
        <div className="container">
          <span className="section-label">Follow Us</span>
          <h2 className="section-title mb-2">Follow @bookworms</h2>
          <p className="text-brand-gray mb-4 mx-auto" style={{ maxWidth: 460 }}>
            Leo nulla cras augue eros, diam vivamus et lectus volutpat at
            facilisi tortor porta.
          </p>
          <div className="rounded-3 overflow-hidden mb-4 shadow">
            <img
              src="https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/instagram-feed.jpg"
              alt="Instagram"
              className="w-100"
              style={{ maxHeight: 320, objectFit: "cover" }}
            />
          </div>
          <a
            href="#"
            className="btn btn-gold btn-lg px-5 fw-bold text-uppercase"
          >
            <i className="bi bi-instagram me-2" />
            Visit Instagram
          </a>
        </div>
      </section>

      <NewsletterSection />
      <Footer />
    </>
  );
}
