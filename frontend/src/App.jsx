import MainWorkspaceLayout from "./layouts/MainWorkspaceLayout";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      {/* Header principal */}
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">VIHDataCare</h1>
        </div>
        
        <div className="header-right">
          <button className="header-icon"></button>
          <span className="hospital-name">VIH</span>
          <button className="header-icon"></button>
          <button className="header-icon"></button>
          <button className="header-icon"></button>
          <button className="header-icon"></button>
        </div>
      </header>

      {/* Menu de navigation */}
      <nav className="nav-menu">
        <button className="nav-item"></button>
        <button className="nav-item"></button>
        <button className="nav-item"></button>
        <button className="nav-item"></button>
        <button className="nav-item"></button>
        <button className="nav-item"></button>
        <button className="nav-item"></button>
        <button className="nav-item"></button>
        <button className="nav-item"></button>
        <button className="nav-item"></button>
      </nav>

      {/* Barre de recherche */}
      <div className="search-bar">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search for patient" 
            className="patient-search"
          />
        </div>
        <div className="action-buttons">
          <button className="action-btn"></button>
          <button className="action-btn"></button>
        </div>
      </div>

      {/* Layout principal avec panels resizables */}
      <MainWorkspaceLayout />
    </div>
  );
}