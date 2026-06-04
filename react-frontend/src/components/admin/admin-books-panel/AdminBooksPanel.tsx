import { useState, useEffect, useCallback, useMemo } from "react";
import * as bookService from "../../../services/bookService";
import * as authorService from "../../../services/authorService";
import * as categoryService from "../../../services/categoryService";
import type {
  AdminAuthor,
  AdminBook,
  AdminBookFormValue,
} from "../../../types/admin.types";
import type { icategory } from "../../../types/category.types";

const emptyForm = (): AdminBookFormValue => ({
  title: "",
  isbn: "",
  price: 0,
  quantityInStock: 0,
  publicationDate: new Date().toISOString().slice(0, 10),
  authorId: 0,
  genreIds: [],
  additionalDetails: "",
  isFeatured: false,
  isEditorsPick: false,
  image: null,
});

const formatCurrency = (value: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(value);

const stockClass = (book: AdminBook) =>
  book.stock <= 5 ? "pending" : "shipped";
const stockLabel = (book: AdminBook) =>
  book.stock <= 5 ? "Low Stock" : "Active";

const isFormValid = (form: AdminBookFormValue) =>
  !!form.title.trim() &&
  !!form.isbn.trim() &&
  form.authorId > 0 &&
  form.genreIds.length > 0 &&
  form.price >= 0 &&
  form.quantityInStock >= 0 &&
  !!form.publicationDate &&
  !!(form.additionalDetails ?? "").trim();

export default function AdminBooksPanel() {
  const [books, setBooks] = useState<AdminBook[]>([]);
  const [authors, setAuthors] = useState<AdminAuthor[]>([]);
  const [genres, setGenres] = useState<icategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<AdminBook | null>(null);
  const [form, setForm] = useState<AdminBookFormValue>(emptyForm());
  const [authorSearch, setAuthorSearch] = useState("");
  const [genreSearch, setGenreSearch] = useState("");
  const [quickAuthorName, setQuickAuthorName] = useState("");
  const [quickGenreName, setQuickGenreName] = useState("");

  // ── derived lists ──────────────────────────────────────────────────────
  const filteredBooks = useMemo(() => {
    const s = search.trim().toLowerCase();
    return books.filter((book) => {
      const matchesSearch =
        !s ||
        book.title.toLowerCase().includes(s) ||
        book.author.toLowerCase().includes(s) ||
        book.isbn.toLowerCase().includes(s);
      const matchesGenre =
        !genreFilter || book.genres.some((g) => String(g.id) === genreFilter);
      return matchesSearch && matchesGenre;
    });
  }, [books, search, genreFilter]);

  const filteredAuthors = useMemo(() => {
    const term = authorSearch.trim().toLowerCase();
    return term
      ? authors.filter((a) => a.name.toLowerCase().includes(term))
      : authors;
  }, [authors, authorSearch]);

  const filteredGenres = useMemo(() => {
    const term = genreSearch.trim().toLowerCase();
    return term
      ? genres.filter((g) => g.genreName.toLowerCase().includes(term))
      : genres;
  }, [genres, genreSearch]);

  const selectedGenreNames = useMemo(
    () =>
      genres
        .filter((g) => form.genreIds.includes(Number(g.genreId)))
        .map((g) => g.genreName),
    [genres, form.genreIds],
  );

  // ── loaders ────────────────────────────────────────────────────────────
  const loadAuthors = useCallback(async () => {
    try {
      const res = await authorService.getAllAuthors();
      setAuthors(res.data as AdminAuthor[]);
    } catch {
      setError("Could not load authors.");
    }
  }, []);

  const loadGenres = useCallback(async () => {
    try {
      const res = await categoryService.getAllCategories();
      setGenres(res.data);
    } catch {
      setError("Could not load genres.");
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await bookService.getAdminBooks(undefined, 100);
      setBooks(res.data.items);
    } catch {
      setError("Could not load books.");
    } finally {
      setLoading(false);
    }
    void loadAuthors();
    void loadGenres();
  }, [loadAuthors, loadGenres]);

  useEffect(() => {
    void loadAll();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── form helpers ───────────────────────────────────────────────────────
  const setField = <K extends keyof AdminBookFormValue>(
    key: K,
    value: AdminBookFormValue[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleGenre = (genreId: number, checked: boolean) =>
    setField(
      "genreIds",
      checked
        ? [...form.genreIds, genreId]
        : form.genreIds.filter((id) => id !== genreId),
    );

  const onImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setField("image", file);
  };

  // ── open / close ───────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingBook(null);
    setForm(emptyForm());
    setIsDrawerOpen(true);
  };

  const openEdit = (book: AdminBook) => {
    setEditingBook(book);
    setForm({
      title: book.title,
      isbn: book.isbn,
      price: book.price,
      quantityInStock: book.stock,
      publicationDate: book.publicationDate.slice(0, 10),
      authorId: book.authorId,
      genreIds: book.genres.map((g) => g.id),
      additionalDetails: book.additionalDetails ?? "",
      isFeatured: book.isFeatured,
      isEditorsPick: book.isEditorsPick,
      image: null,
    });
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  // ── quick create ───────────────────────────────────────────────────────
  const quickCreateAuthor = async () => {
    const name = quickAuthorName.trim();
    if (!name) return;
    try {
      await authorService.createAuthorForm({
        name,
        bio: "Biography pending.",
        isFeatured: false,
      });
      const res = await authorService.getAllAuthors();
      const list = res.data as AdminAuthor[];
      setAuthors(list);
      const created = list.find((a) => a.name === name);
      if (created) setField("authorId", created.authorId);
      setQuickAuthorName("");
    } catch {
      setError("Could not create author.");
    }
  };

  const quickCreateGenre = async () => {
    const genreName = quickGenreName.trim();
    if (!genreName) return;
    try {
      await categoryService.createCategory(genreName);
      const res = await categoryService.getAllCategories();
      setGenres(res.data);
      const created = res.data.find((g) => g.genreName === genreName);
      if (created) toggleGenre(Number(created.genreId), true);
      setQuickGenreName("");
    } catch {
      setError("Could not create genre.");
    }
  };

  // ── save / delete ──────────────────────────────────────────────────────
  const submit = async () => {
    if (!isFormValid(form)) {
      setError(
        "Title, ISBN, author, at least one genre, price, stock, date, and details are required.",
      );
      return;
    }
    setLoading(true);
    try {
      if (editingBook) {
        await bookService.updateAdminBook(editingBook.id, form);
      } else {
        await bookService.createAdminBook(form);
      }
      setIsDrawerOpen(false);
      await loadAll();
    } catch {
      setError("Could not save book.");
      setLoading(false);
    }
  };

  const deleteBook = async (book: AdminBook) => {
    if (!confirm(`Delete "${book.title}"?`)) return;
    setLoading(true);
    try {
      await bookService.deleteAdminBook(book.id);
      await loadAll();
    } catch {
      setError("Could not delete book.");
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel active d-block">
      {/* Header */}
      <div className="section-header mb-4">
        <div className="dash-section-title">Books Management</div>
        <button className="btn-gold-dash" type="button" onClick={openCreate}>
          <i className="bi bi-plus-lg" /> Add New Book
        </button>
      </div>

      <div className="data-card">
        {/* Toolbar */}
        <div className="data-card-header">
          <div className="search-wrap">
            <i className="bi bi-search" />
            <input
              className="search-input"
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="d-flex gap-2">
            <select
              className="dash-select"
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g.genreId} value={g.genreId}>
                  {g.genreName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* States */}
        {loading && <div className="admin-state">Loading books...</div>}
        {!loading && error && <div className="admin-state error">{error}</div>}
        {!loading && !error && filteredBooks.length === 0 && (
          <div className="admin-state">No books found.</div>
        )}

        {/* Table */}
        {!loading && !error && filteredBooks.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>ISBN</th>
                <th>Genre</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {book.imageUrl ? (
                        <img
                          className="book-thumb"
                          src={book.imageUrl}
                          alt=""
                        />
                      ) : (
                        <div className="book-thumb">
                          <i
                            className="bi bi-book"
                            style={{ fontSize: ".8rem", color: "var(--gold)" }}
                          />
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: ".87rem" }}>
                          {book.title}
                        </div>
                        <div
                          style={{
                            fontSize: ".75rem",
                            color: "var(--brand-gray)",
                          }}
                        >
                          {book.author}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "var(--brand-gray)" }}>{book.isbn}</td>
                  <td>
                    {book.genres.length ? book.genres[0].name : "Unassigned"}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {formatCurrency(book.price)}
                  </td>
                  <td>
                    <span
                      style={{
                        fontWeight: 600,
                        color: book.stock <= 5 ? "#dc3545" : "#198754",
                      }}
                    >
                      {book.stock}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${stockClass(book)}`}>
                      {stockLabel(book)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="action-btn edit"
                      type="button"
                      title="Edit book"
                      onClick={() => openEdit(book)}
                    >
                      <i className="bi bi-pencil" />
                    </button>
                    <button
                      className="action-btn del"
                      type="button"
                      title="Delete book"
                      onClick={() => void deleteBook(book)}
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
      {isDrawerOpen && (
        <>
          <div className="admin-modal-backdrop" onClick={closeDrawer} />
          <div className="admin-drawer wide">
            <div className="drawer-header">
              <div className="dash-section-title">
                {editingBook ? "Edit Book" : "Add Book"}
              </div>
              <button
                className="action-btn"
                type="button"
                title="Close"
                onClick={closeDrawer}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <div className="drawer-body">
              {/* Basic fields */}
              <div className="row g-3">
                <div className="col-md-8">
                  <label className="form-label-sm">Title</label>
                  <input
                    className="form-control-custom"
                    type="text"
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label-sm">ISBN</label>
                  <input
                    className="form-control-custom"
                    type="text"
                    value={form.isbn}
                    onChange={(e) => setField("isbn", e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label-sm">Price</label>
                  <input
                    className="form-control-custom"
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setField("price", Number(e.target.value))}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label-sm">Stock quantity</label>
                  <input
                    className="form-control-custom"
                    type="number"
                    min={0}
                    value={form.quantityInStock}
                    onChange={(e) =>
                      setField("quantityInStock", Number(e.target.value))
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label-sm">Publication date</label>
                  <input
                    className="form-control-custom"
                    type="date"
                    value={form.publicationDate}
                    onChange={(e) =>
                      setField("publicationDate", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Author */}
              <div className="admin-form-section">
                <label className="form-label-sm">Author</label>
                <input
                  className="form-control-custom mb-2"
                  type="text"
                  placeholder="Search authors..."
                  value={authorSearch}
                  onChange={(e) => setAuthorSearch(e.target.value)}
                />
                <select
                  className="form-control-custom"
                  value={form.authorId}
                  onChange={(e) => setField("authorId", Number(e.target.value))}
                >
                  <option value={0}>Select author</option>
                  {filteredAuthors.map((a) => (
                    <option key={a.authorId} value={a.authorId}>
                      {a.name}
                    </option>
                  ))}
                </select>
                <div className="quick-create-row">
                  <input
                    className="form-control-custom"
                    type="text"
                    placeholder="Create author..."
                    value={quickAuthorName}
                    onChange={(e) => setQuickAuthorName(e.target.value)}
                  />
                  <button
                    className="btn-outline-gold"
                    type="button"
                    onClick={() => void quickCreateAuthor()}
                  >
                    <i className="bi bi-plus-lg" /> Create
                  </button>
                </div>
              </div>

              {/* Genres */}
              <div className="admin-form-section">
                <label className="form-label-sm">Genres</label>
                <input
                  className="form-control-custom mb-2"
                  type="text"
                  placeholder="Search genres..."
                  value={genreSearch}
                  onChange={(e) => setGenreSearch(e.target.value)}
                />
                <div className="selector-list">
                  {filteredGenres.map((g) => (
                    <label key={g.genreId} className="selector-option">
                      <input
                        type="checkbox"
                        checked={form.genreIds.includes(Number(g.genreId))}
                        onChange={(e) =>
                          toggleGenre(Number(g.genreId), e.target.checked)
                        }
                      />
                      <span>{g.genreName}</span>
                    </label>
                  ))}
                </div>
                <div className="selected-tags">
                  {selectedGenreNames.map((name) => (
                    <span key={name}>{name}</span>
                  ))}
                </div>
                <div className="quick-create-row">
                  <input
                    className="form-control-custom"
                    type="text"
                    placeholder="Create genre..."
                    value={quickGenreName}
                    onChange={(e) => setQuickGenreName(e.target.value)}
                  />
                  <button
                    className="btn-outline-gold"
                    type="button"
                    onClick={() => void quickCreateGenre()}
                  >
                    <i className="bi bi-plus-lg" /> Create
                  </button>
                </div>
              </div>

              {/* Details */}
              <label className="form-label-sm">Additional details</label>
              <textarea
                className="form-control-custom mb-3"
                rows={4}
                value={form.additionalDetails ?? ""}
                onChange={(e) => setField("additionalDetails", e.target.value)}
              />

              {/* Image */}
              <label className="form-label-sm">Cover image</label>
              <input
                className="form-control-custom mb-3"
                type="file"
                accept="image/*"
                onChange={onImageSelected}
              />

              {/* Flags */}
              <div className="d-flex gap-4 mb-4">
                <label className="d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setField("isFeatured", e.target.checked)}
                  />
                  <span>Featured</span>
                </label>
                <label className="d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isEditorsPick}
                    onChange={(e) =>
                      setField("isEditorsPick", e.target.checked)
                    }
                  />
                  <span>Editor's Pick</span>
                </label>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn-gold-cust"
                  type="button"
                  onClick={() => void submit()}
                >
                  Save Book
                </button>
                <button
                  className="btn-outline-cust"
                  type="button"
                  onClick={closeDrawer}
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
