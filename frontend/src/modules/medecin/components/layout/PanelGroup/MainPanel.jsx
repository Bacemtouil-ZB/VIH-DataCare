import { Outlet } from "react-router-dom";
import "./MainPanel.css";
export default function MainPanel() {
  return (
    <div className="main-content">
      <Outlet />
    </div>
  );
}
