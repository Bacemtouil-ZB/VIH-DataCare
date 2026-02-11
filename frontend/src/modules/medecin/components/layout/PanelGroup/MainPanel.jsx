import { Outlet } from "react-router-dom";

export default function MainPanel() {
  return (
    <div className="main-content">
      <Outlet />
    </div>
  );
}
