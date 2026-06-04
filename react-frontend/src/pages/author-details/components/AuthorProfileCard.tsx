import "./AuthorProfileCard.css";

interface AuthorProfileCardProps {
  name?: string;
  bio?: string;
  stats?: { label: string; value: string }[];
  image?: string | null;
}

export default function AuthorProfileCard({
  name = "",
  bio = "",
  stats = [],
  image = null,
}: AuthorProfileCardProps) {
  return (
    <section className="author-card">
      <div className="author-header">
        {image && <img src={image} alt={name} className="author-img" />}
        <div>
          <p className="eyebrow">Author Details</p>
          <h2 className="author-name">{name}</h2>
        </div>
      </div>

      <p className="bio">{bio}</p>

      <div className="stats">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-item">
            <span className="stat-label">{stat.label}</span>
            <strong className="stat-value">{stat.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
