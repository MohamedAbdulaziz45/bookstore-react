import { Link } from "react-router-dom";

interface PageBannerProps {
  title: string;
  subtitle?: string;
  showBreadcrumb?: boolean;
}

export default function PageBanner({
  title,
  subtitle = "",
  showBreadcrumb = true,
}: PageBannerProps) {
  return (
    <div className="page-banner">
      <div className="container text-center">
        <h1 className="section-title mb-2">{title}</h1>

        {subtitle && (
          <p
            className="text-brand-gray mb-3"
            style={{ maxWidth: 580, margin: "0 auto" }}
          >
            {subtitle}
          </p>
        )}

        {showBreadcrumb && (
          <nav aria-label="breadcrumb" className="mt-2">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item">
                <Link to="/" className="text-gold">
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item active text-brand-gray">
                {title}
              </li>
            </ol>
          </nav>
        )}
      </div>
    </div>
  );
}
