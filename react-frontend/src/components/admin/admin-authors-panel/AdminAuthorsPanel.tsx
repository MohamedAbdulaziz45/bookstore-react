import { useState, useEffect, useCallback } from "react";
import * as authorService from "../../../services/authorService";
import type {
  AdminAuthor,
  AdminAuthorFormValue,
} from "../../../types/admin.types";

const emptyForm = (): AdminAuthorFormValue => ({
  name: "",
  bio: "",
  isFeatured: false,
  image: null,
});

export default function AdminAuthorsPanel() {
  const [authors, setAuthors] = useState<AdminAuthor[]>([]);
  const [filteredAuthors, setFilteredAuthors] = useState<AdminAuthor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<AdminAuthor | null>(null);
  const [form, setForm] = useState<AdminAuthorFormValue>(emptyForm());

  const applySearch = useCallback((list: AdminAuthor[], term: string) => {
    const t = term.trim().toLowerCase();
    setFilteredAuthors(
      t
        ? list.filter(
            (a) =>
              a.name.toLowerCase().includes(t) ||
              a.bio.toLowerCase().includes(t),
          )
        : [...list],
    );
  }, []);

  const loadAuthors = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await authorService.getAllAuthors();
      const list = res.data as AdminAuthor[];
      setAuthors(list);
      applySearch(list, search);
    } catch {
      setError("Could not load authors.");
    } finally {
      setLoading(false);
    }
  }, [search, applySearch]);

  useEffect(() => {
    void loadAuthors();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchChange = (value: string) => {
    setSearch(value);
    applySearch(authors, value);
  };

  const openCreate = () => {
    setEditingAuthor(null);
    setForm(emptyForm());
    setIsFormOpen(true);
  };

  const openEdit = (author: AdminAuthor) => {
    setEditingAuthor(author);
    setForm({
      name: author.name,
      bio: author.bio,
      isFeatured: author.isFeatured,
      image: null,
    });
    setIsFormOpen(true);
  };

  const closeForm = () => setIsFormOpen(false);

  const onImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, image: file }));
  };

  const submit = async () => {
    if (!form.name.trim() || !form.bio.trim()) {
      setError("Author name and bio are required.");
      return;
    }

    setLoading(true);
    try {
      if (editingAuthor) {
        await authorService.updateAuthorForm(editingAuthor.authorId, form);
      } else {
        await authorService.createAuthorForm(form);
      }
      setIsFormOpen(false);
      await loadAuthors();
    } catch {
      setError("Could not save author.");
      setLoading(false);
    }
  };

  const deleteAuthor = async (author: AdminAuthor) => {
    if (!confirm(`Delete author "${author.name}"?`)) return;
    setLoading(true);
    try {
      await authorService.deleteAuthor(author.authorId);
      await loadAuthors();
    } catch {
      setError("Could not delete author.");
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel active d-block">
      {/* Header */}
      <div className="section-header mb-4">
        <div className="dash-section-title">Authors Management</div>
        <button className="btn-gold-dash" type="button" onClick={openCreate}>
          <i className="bi bi-plus-lg" /> Add Author
        </button>
      </div>

      <div className="data-card">
        {/* Search */}
        <div className="data-card-header">
          <div className="search-wrap">
            <i className="bi bi-search" />
            <input
              className="search-input"
              type="text"
              placeholder="Search authors..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* States */}
        {loading && <div className="admin-state">Loading authors...</div>}
        {!loading && error && <div className="admin-state error">{error}</div>}
        {!loading && !error && filteredAuthors.length === 0 && (
          <div className="admin-state">No authors found.</div>
        )}

        {/* Table */}
        {!loading && !error && filteredAuthors.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Author</th>
                <th>Books</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAuthors.map((author) => (
                <tr key={author.authorId}>
                  {/* Author cell */}
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {author.image ? (
                        <img className="avatar-sm" src={author.image} alt="" />
                      ) : (
                        <div className="avatar-sm">
                          {author.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600 }}>{author.name}</div>
                        <div
                          className="text-truncate"
                          style={{
                            maxWidth: 420,
                            color: "var(--brand-gray)",
                            fontSize: ".78rem",
                          }}
                        >
                          {author.bio}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{author.booksCount ?? 0}</td>
                  <td>
                    <span
                      className={`status-badge ${author.isFeatured ? "status-shipped" : "status-pending"}`}
                    >
                      {author.isFeatured ? "Featured" : "Standard"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="action-btn edit"
                      type="button"
                      title="Edit author"
                      onClick={() => openEdit(author)}
                    >
                      <i className="bi bi-pencil" />
                    </button>
                    <button
                      className="action-btn del"
                      type="button"
                      title="Delete author"
                      onClick={() => void deleteAuthor(author)}
                    >
                      <i className="bi bi-trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Drawer */}
      {isFormOpen && (
        <>
          <div className="admin-modal-backdrop" onClick={closeForm} />
          <div className="admin-drawer">
            <div className="drawer-header">
              <div className="dash-section-title">
                {editingAuthor ? "Edit Author" : "Add Author"}
              </div>
              <button
                className="action-btn"
                type="button"
                title="Close"
                onClick={closeForm}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <div className="drawer-body">
              <label className="form-label-sm">Name</label>
              <input
                className="form-control-custom mb-3"
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />

              <label className="form-label-sm">Bio</label>
              <textarea
                className="form-control-custom mb-3"
                rows={5}
                value={form.bio}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, bio: e.target.value }))
                }
              />

              <label className="form-label-sm">Image</label>
              <input
                className="form-control-custom mb-3"
                type="file"
                accept="image/*"
                onChange={onImageSelected}
              />

              <label className="d-flex align-items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      isFeatured: e.target.checked,
                    }))
                  }
                />
                <span>Featured author</span>
              </label>

              <div className="d-flex gap-2">
                <button
                  className="btn-gold-cust"
                  type="button"
                  onClick={() => void submit()}
                >
                  Save
                </button>
                <button
                  className="btn-outline-cust"
                  type="button"
                  onClick={closeForm}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
