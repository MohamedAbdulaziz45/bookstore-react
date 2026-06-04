import { useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import AuthModal from "../auth-modal/AuthModal";
import { useAuthStore } from "../../services/auth/useAuthStore";
import { useCartStore, selectTotalItems } from "../../store/useCartStore";
import { showToast } from "../../utils/toast";
import ChangePasswordModal from "../change-password-modal/ChangePasswordModal";

type AuthMode = "login" | "signup";

const navItems = [
  { label: "Genres", path: "/genres" },
  { label: "All Books", path: "/all-books" },
  { label: "New Arrival", path: "/new-arrival" },
  { label: "Featured Books", path: "/featured-books" },
  { label: "Editor's Pick", path: "/editors-pick" },
  { label: "About", path: "/about" },
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const userRole = useAuthStore((state) => state.userRole);
  const logout = useAuthStore((state) => state.logout);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const switchToGuestCart = useCartStore((state) => state.switchToGuestCart);
  const totalItems = useCartStore(selectTotalItems);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    navigate(`/search-results?search=${encodeURIComponent(trimmedQuery)}`);
    setSearchQuery("");
    setIsNavOpen(false);
  };

  const openAuthModal = (mode: AuthMode = "login") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const onLogin = () => {
    showToast("Successfully logged in!", "success");
  };

  const onLogout = () => {
    logout();
    switchToGuestCart();
    navigate("/");
    setIsUserMenuOpen(false);
    showToast("Successfully logged out", "info");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg main-navbar sticky-top">
        <div className="container">
          <Link
            className="navbar-brand d-flex align-items-center gap-2"
            to="/"
            onClick={() => setIsNavOpen(false)}
          >
            <div
              className="d-flex align-items-center justify-content-center rounded-2 bg-gold"
              style={{ width: "38px", height: "38px", flexShrink: 0 }}
            >
              <i className="bi bi-book" />
            </div>
            <span
              className="fw-bold fs-4"
              style={{
                color: "var(--brand-dark)",
                fontFamily: '"Lato", sans-serif',
              }}
            >
              Book<span className="text-gold">Worms</span>
            </span>
          </Link>

          <button
            className="navbar-toggler border-0 p-1"
            type="button"
            onClick={() => setIsNavOpen((current) => !current)}
            aria-label="Toggle navigation"
            aria-expanded={isNavOpen}
          >
            <i
              className="bi bi-list"
              style={{ fontSize: "1.6rem", color: "var(--brand-dark)" }}
            />
          </button>

          <div
            className={`collapse navbar-collapse${isNavOpen ? " show" : ""}`}
            id="mainNav"
          >
            <ul className="navbar-nav mx-auto gap-lg-1 py-3 py-lg-0">
              {navItems.map((item) => (
                <li className="nav-item" key={item.label}>
                  <NavLink
                    className="nav-link"
                    to={item.path}
                    onClick={() => setIsNavOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="d-flex align-items-center gap-1 mt-2 mt-lg-0">
              <form
                className="d-flex me-2 position-relative"
                onSubmit={onSearch}
              >
                <input
                  type="text"
                  className="form-control form-control-sm rounded-pill px-3 py-1"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  style={{
                    borderColor: "#c78b51",
                    minWidth: "160px",
                    fontSize: "0.85rem",
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-sm position-absolute end-0 top-50 translate-middle-y"
                  style={{
                    color: "#c78b51",
                    border: "none",
                    background: "transparent",
                  }}
                >
                  <i className="bi bi-search" />
                </button>
              </form>

              <button
                className="icon-btn"
                onClick={toggleCart}
                aria-label="Cart"
              >
                <i className="bi bi-bag" />
                {totalItems > 0 && (
                  <span className="cart-pill">{totalItems}</span>
                )}
              </button>

              {!isLoggedIn ? (
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="Account"
                  onClick={() => openAuthModal("login")}
                >
                  <i className="bi bi-person" />
                </button>
              ) : (
                <div className="dropdown d-inline-block">
                  <button
                    className="icon-btn dropdown-toggle"
                    type="button"
                    onClick={() => setIsUserMenuOpen((current) => !current)}
                    aria-expanded={isUserMenuOpen}
                    style={{ border: "none", background: "transparent" }}
                  >
                    <i className="bi bi-person-check fs-5" />
                  </button>

                  <ul
                    className={`dropdown-menu dropdown-menu-end mt-2 shadow border-0${
                      isUserMenuOpen ? " show" : ""
                    }`}
                    style={{ minWidth: "200px" }}
                  >
                    <li>
                      <Link
                        className="dropdown-item py-2"
                        to={
                          userRole === "Admin"
                            ? "/admin-dashboard"
                            : "/my-account"
                        }
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <i
                          className={`bi ${
                            userRole === "Admin"
                              ? "bi-speedometer2"
                              : "bi-house-door"
                          } me-2 text-gold`}
                        />
                        {userRole === "Admin"
                          ? "Admin Dashboard"
                          : "My Account"}
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item py-2"
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <i className="bi bi-person-circle me-2 text-gold" />
                        Profile
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item py-2"
                        onClick={() => {
                          setShowChangePasswordModal(true);
                          setIsUserMenuOpen(false);
                        }}
                      >
                        <i className="bi bi-shield-lock me-2 text-gold" />
                        Change Password
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item py-2 text-danger"
                        onClick={onLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}

              <Link
                to="/cart"
                className="btn btn-gold btn-sm ms-2 px-3 text-uppercase fw-bold"
                style={{ letterSpacing: "0.05em", fontSize: "0.75rem" }}
              >
                <i className="bi bi-bag-check me-1" />
                Cart
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onLoggedIn={onLogin}
      />

      {showChangePasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}
    </>
  );
}
