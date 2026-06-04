import { useEffect, useState, type FormEvent } from "react";
import { login, registerUser } from "../../services/auth/authService";
import { useAuthStore } from "../../services/auth/useAuthStore";
import { useCartStore } from "../../store/useCartStore";
import { showToast } from "../../utils/toast";

type AuthMode = "login" | "signup";

interface AuthModalProps {
  isOpen: boolean;
  initialMode: AuthMode;
  onClose: () => void;
  onLoggedIn: () => void;
}

const initialForm = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function AuthModal({
  isOpen,
  initialMode,
  onClose,
  onLoggedIn,
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const saveToken = useAuthStore((state) => state.saveToken);
  const syncGuestCartAfterLogin = useCartStore(
    (state) => state.syncGuestCartAfterLogin,
  );

  const isLogin = mode === "login";
  const passwordsMismatch =
    !isLogin &&
    form.confirmPassword.length > 0 &&
    form.password !== form.confirmPassword;
  const isFormInvalid =
    !form.email.trim() ||
    form.password.length < 6 ||
    (!isLogin &&
      (!form.username.trim() ||
        form.username.trim().length < 3 ||
        passwordsMismatch));

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setForm(initialForm);
    }
  }, [initialMode, isOpen]);

  const setAuthMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setForm(initialForm);
  };

  const closeModal = () => {
    setAuthMode("login");
    onClose();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormInvalid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = isLogin
        ? await login(form.email, form.password)
        : await registerUser(form.email, form.password, form.username);

      saveToken(response.data.token);
      await syncGuestCartAfterLogin();
      closeModal();
      onLoggedIn();
    } catch {
      showToast(
        isLogin ? "Invalid email or password" : "Registration failed. Try again.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={closeModal} />
      <div
        className="modal fade show d-block"
        id="authModal"
        tabIndex={-1}
        aria-labelledby="authModalLabel"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content border-0 shadow"
            style={{ borderRadius: "12px", overflow: "hidden" }}
          >
            <div className="modal-header border-0 pb-0 justify-content-end p-3">
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
                aria-label="Close"
              />
            </div>
            <div className="modal-body p-4 pt-1">
              <div className="text-center mb-4">
                <h4
                  id="authModalLabel"
                  className="fw-bold"
                  style={{ fontFamily: '"Lato", sans-serif' }}
                >
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h4>
                <p className="text-muted small">
                  {isLogin
                    ? "Login to access your cart and orders."
                    : "Sign up to get started."}
                </p>
              </div>

              <form onSubmit={onSubmit} autoComplete="off">
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="name@example.com"
                    required
                  />
                </div>

                {!isLogin && (
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.username}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          username: event.target.value,
                        }))
                      }
                      placeholder="AXZY"
                      required
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className="form-label small fw-semibold text-muted">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={form.password}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    placeholder="********"
                    required
                  />
                </div>

                {!isLogin && (
                  <div className="mb-4">
                    <label className="form-label small fw-semibold text-muted">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={form.confirmPassword}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          confirmPassword: event.target.value,
                        }))
                      }
                      placeholder="********"
                      autoComplete="new-password"
                      required
                    />
                    {passwordsMismatch && (
                      <div className="text-danger small mt-1">
                        Passwords do not match.
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-gold w-100 fw-bold py-2 mb-3"
                  disabled={isFormInvalid || isSubmitting}
                >
                  {isLogin ? "Sign In" : "Sign Up"}
                </button>
              </form>

              <div className="text-center">
                <p className="small text-muted mb-0">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none fw-semibold text-gold"
                    onClick={() => setAuthMode(isLogin ? "signup" : "login")}
                  >
                    {isLogin ? "Sign up" : "Log in"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
