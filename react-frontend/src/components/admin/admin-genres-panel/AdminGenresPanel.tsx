import { useState, useEffect, useCallback, useMemo } from "react";
import * as categoryService from "../../../services/categoryService";
import type { icategory } from "../../../types/category.types";

export default function AdminGenresPanel() {
  const [genres, setGenres] = useState<icategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<icategory | null>(null);
  const [genreName, setGenreName] = useState("");

  const filteredGenres = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term
      ? genres.filter((g) => g.genreName.toLowerCase().includes(term))
      : [...genres];
  }, [genres, search]);

  const loadGenres = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await categoryService.getAllCategories();
      setGenres(res.data);
    } catch {
      setError("Could not load genres.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGenres();
  }, [loadGenres]);

  const openCreate = () => {
    setEditingGenre(null);
    setGenreName("");
    setIsModalOpen(true);
  };

  const openEdit = (genre: icategory) => {
    setEditingGenre(genre);
    setGenreName(genre.genreName);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const submit = async () => {
    const name = genreName.trim();
    if (!name) {
      setError("Genre name is required.");
      return;
    }

    setLoading(true);
    try {
      if (editingGenre) {
        await categoryService.updateCategory(editingGenre.genreId, name);
      } else {
        await categoryService.createCategory(name);
      }
      setIsModalOpen(false);
      await loadGenres();
    } catch {
      setError("Could not save genre.");
      setLoading(false);
    }
  };

  const deleteGenre = async (genre: icategory) => {
    if (!confirm(`Delete genre "${genre.genreName}"?`)) return;
    setLoading(true);
    try {
      await categoryService.deleteCategory(genre.genreId);
      await loadGenres();
    } catch {
      setError("Could not delete genre.");
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel active d-block">
      {/* Header */}
      <div className="section-header mb-4">
        <div className="dash-section-title">Genres Management</div>
        <button className="btn-gold-dash" type="button" onClick={openCreate}>
          <i className="bi bi-plus-lg" /> Add New Genre
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
              placeholder="Search genres..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* States */}
        {loading && <div className="admin-state">Loading genres...</div>}
        {!loading && error && <div className="admin-state error">{error}</div>}
        {!loading && !error && filteredGenres.length === 0 && (
          <div className="admin-state">No genres found.</div>
        )}

        {/* Table */}
        {!loading && !error && filteredGenres.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Genre</th>
                <th>Books</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGenres.map((genre) => (
                <tr key={genre.genreId}>
                  <td style={{ fontWeight: 600 }}>{genre.genreName}</td>
                  <td>{genre.count ?? 0}</td>
                  <td>
                    <button
                      className="action-btn edit"
                      type="button"
                      title="Edit genre"
                      onClick={() => openEdit(genre)}
                    >
                      <i className="bi bi-pencil" />
                    </button>
                    <button
                      className="action-btn del"
                      type="button"
                      title="Delete genre"
                      onClick={() => void deleteGenre(genre)}
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

      {/* Modal */}
      {isModalOpen && (
        <>
          <div className="admin-modal-backdrop" onClick={closeModal} />
          <div className="admin-modal">
            <div className="drawer-header">
              <div className="dash-section-title">
                {editingGenre ? "Edit Genre" : "Add Genre"}
              </div>
              <button
                className="action-btn"
                type="button"
                title="Close"
                onClick={closeModal}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <div className="drawer-body">
              <label className="form-label-sm">Genre name</label>
              <input
                className="form-control-custom mb-4"
                type="text"
                value={genreName}
                onChange={(e) => setGenreName(e.target.value)}
              />
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
                  onClick={closeModal}
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
