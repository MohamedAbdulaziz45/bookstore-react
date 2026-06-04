import { Link } from "react-router";
import type { icategory } from "../../types/category.types";
import { toSlug } from "../../utils/stringUtils";

interface CategoriesSectionProps {
  categories?: icategory[];
}

export default function CategoriesSection({
  categories = [],
}: CategoriesSectionProps) {
  return (
    <section className="section-py bg-warm">
      <div className="container-fluid px-2">
        <div className="text-center mb-5">
          <h2 className="section-title">Choose By Category</h2>
          <p
            className="text-brand-gray mt-2 mx-auto"
            style={{ maxWidth: "520px" }}
          >
            Explore our diverse collection organised by genre and interest
          </p>
        </div>

        <div className="row g-2">
          {categories.map((category, index) => (
            <div
              className={index === 3 ? "col-12 col-md-8" : "col-6 col-md-4"}
              key={category.genreName}
            >
              <Link
                className="category-card d-block text-decoration-none"
                style={{ height: "260px" }}
                to={`/genres/${category.genreId}/${toSlug(category.genreName)}`}
              >
                <img
                  src={category.imgUrl ?? ""}
                  alt={category.genreName}
                  loading="lazy"
                />
                <div className="cat-overlay">
                  <p className="cat-name px-3">{category.genreName}</p>
                  {category.count ? (
                    <small className="text-white-50 mt-1">
                      {category.count} books
                    </small>
                  ) : null}
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <Link
            to="/genres"
            className="btn btn-gold btn-lg px-5 text-uppercase fw-bold"
          >
            See All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
