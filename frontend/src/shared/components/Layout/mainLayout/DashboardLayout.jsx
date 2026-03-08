import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar"; 
import './DashboardLayout.css';

export default function DashboardLayout() {
  return (
    <div className="d-flex vh-100">

      <div style={{ width: "250px" }}>
        <Sidebar />
      </div>

      <div className="flex-grow-1 d-flex flex-column">
        <Header />

        <main
            className="flex-grow-1 p-3"
          >
            <div className="bg-white rounded shadow p-3 h-100 outlet-container">
              <Outlet />
            </div>
        </main>
      </div>

    </div>
  );
}
