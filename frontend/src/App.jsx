import "./App.css";
import Landing from './pages/Landing/Landing.jsx';

export default function App() {
  return (
    <div className="app">
      <Landing />
      {console.log(import.meta.env.VITE_API_URL)}
    </div>
    
  );
}