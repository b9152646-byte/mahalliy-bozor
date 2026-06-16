"use client";

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <button type="button" onClick={handleLogout} className="btn-secondary text-xs sm:text-sm">
      Chiqish
    </button>
  );
}
