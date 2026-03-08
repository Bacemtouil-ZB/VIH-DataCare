import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth.js";

export default function AccountButton() {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  const onLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  return (
    <div className="account-dropdown">
      <button
        type="button"
        onClick={onLogout}
        className="account-logout-btn d-flex align-items-center justify-content-center gap-2"
      >
        <i className="bi bi-box-arrow-right"></i>
        <span>Deconnexion</span>
      </button>
    </div>
  );
}
