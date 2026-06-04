import { Link } from "react-router-dom";

export interface GenreCard {
  title: string;
  count: number;
  tone: string;
  description: string;
  link?: string;
  genreId?: number;
}

interface GenreGridProps {
  genres?: GenreCard[];
}

export default function GenreGrid({ genres = [] }: GenreGridProps) {
  return (
    <>
      <style>{`
        .genre-card {
          border-radius: 22px;
          background: #fff;
          padding: 1.4rem;
          min-height: 220px;
          box-shadow: 0 14px 35px rgba(34, 25, 15, 0.07);
          border: 1px solid rgba(199, 139, 81, 0.14);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: block;
          text-decoration: none;
          color: inherit;
        }
        .genre-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 45px rgba(34, 25, 15, 0.12);
          color: inherit;
        }
        .genre-card-disabled {
          opacity: 0.88;
          cursor: not-allowed;
        }
        .genre-card-disabled:hover {
          transform: none !important;
          box-shadow: 0 14px 35px rgba(34, 25, 15, 0.07) !important;
        }
        .genre-accent {
          width: 68px;
          height: 6px;
          border-radius: 999px;
          margin-bottom: 1rem;
        }
        .genre-meta {
          font-size: 0.78rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8f623a;
          margin-bottom: 0.7rem;
        }
        .genre-title {
          font-size: 1.2rem;
          color: var(--brand-dark);
          margin-bottom: 0.7rem;
          font-family: "Lato", sans-serif;
        }
        .genre-copy {
          color: var(--brand-gray);
          line-height: 1.65;
          margin-bottom: 1rem;
        }
        .genre-cta {
          font-weight: 700;
          color: #c78b51;
        }
        .genre-cta-muted {
          color: #8d847b;
        }
      `}</style>

      <div className="row g-4">
        {genres.map((genre) => (
          <div className="col-md-6 col-xl-4" key={genre.title}>
            {genre.link ? (
              <Link className="genre-card h-100" to={genre.link}>
                <div
                  className="genre-accent"
                  style={{ background: genre.tone }}
                />
                <p className="genre-meta">{genre.count} titles</p>
                <h3 className="genre-title">{genre.title}</h3>
                <p className="genre-copy">{genre.description}</p>
                <span className="genre-cta">Explore shelf</span>
              </Link>
            ) : (
              <div className="genre-card genre-card-disabled h-100">
                <div
                  className="genre-accent"
                  style={{ background: genre.tone }}
                />
                <p className="genre-meta">{genre.count} titles</p>
                <h3 className="genre-title">{genre.title}</h3>
                <p className="genre-copy">{genre.description}</p>
                <span className="genre-cta genre-cta-muted">
                  Browse unavailable
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
