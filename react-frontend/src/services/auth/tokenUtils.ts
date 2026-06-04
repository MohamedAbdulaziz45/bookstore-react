export const isTokenExpired = (token?: string): boolean => {
  const t = token ?? localStorage.getItem("token");
  if (!t) return true;
  try {
    const payload = JSON.parse(atob(t.split(".")[1]));
    return Date.now() >= payload["exp"] * 1000;
  } catch {
    return true;
  }
};

export const getRoleFromToken = (token: string): string | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return (
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      payload["role"] ||
      null
    );
  } catch {
    return null;
  }
};

export const getUserIdFromToken = (token: string): string | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload["sub"] || null;
  } catch {
    return null;
  }
};
