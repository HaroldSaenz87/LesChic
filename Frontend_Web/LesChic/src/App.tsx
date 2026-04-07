import { Routes, Route, useNavigate } from "react-router-dom"
import { Hero } from "./sections/Hero"
import { ResetPassword } from "./components/AuthPages/ResetPassword"
import { VerifyEmail } from "./components/AuthPages/VerifyEmail"
import { DashBoard } from "./sections/DashBoard"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Overview } from "./components/Overview"
import { MyCloset } from "./components/MyCloset"
import { useEffect } from "react"
import { buildPath } from "./utils/buildPath"
import { Lookbooks } from "./components/Lookbooks"


function App() {

  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {


    const checkAndRenewToken = async () => {

      const storedUser = sessionStorage.getItem("user_data");
      
      if (!storedUser) return;

      try {
        const userData = JSON.parse(storedUser);
        console.log(`[${new Date().toLocaleTimeString()}] Sending token: ...${userData.token.slice(-5)}`);

        const { token } = userData;

        const response = await fetch(buildPath('api/auth/renew'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-token': token // This matches your backend: req.header('x-token')
          }
        });

        // If the server explicitly says 401, the token is dead
        if (response.status === 401) {

          console.warn("Session expired. Please log in again.");
          
          sessionStorage.removeItem("user_data");
          
          navigate("/"); // THIS forces the redirect to Hero
          return;
        }

        const data = await response.json();

        if (data.ok) {
          sessionStorage.setItem("user_data", JSON.stringify({
              ...userData,
              token: data.token, // Save the new token
              name: data.name
          }));
          
          // Log the new token (last 5 chars) to confirm it's different
          console.log(`[${new Date().toLocaleTimeString()}] ✔ New token received: ...${data.token.slice(-5)}`);
        
        }
      } catch (error) {
          console.error("Network error during sync:", error);
      }
  };

  // 1. CALL THE FUNCTION IMMEDIATELY (Fixes the refresh issue)
  checkAndRenewToken();

  // 2. SET THE HEARTBEAT (Fixes the timeout issue)
  const interval = setInterval(checkAndRenewToken, 30 *60 * 1000); // 30 minutes

  // 3. CLEANUP
  return () => clearInterval(interval);

  }, [navigate]);
  
  return (

    <Routes>

      {/* Public routes and accessible without login */}
      <Route path="/" element={<Hero />} />
      <Route path="/reset-password" element={<ResetPassword />}/>
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Protected routes and checks sessionStorage before rendering children */}
      <Route element={<ProtectedRoute />}>
      
        {/* Dashboard layout that has the SideNav + Outlet for nested pages */}
        <Route path="/dashboard" element={<DashBoard />} >

          {/* Default dashboard page at /dashboard */}
          <Route index element={<Overview />} />

          {/* Below are nested dashboard pages */}
          <Route path="closet" element={<MyCloset />} />

          <Route path="lookbooks" element={<Lookbooks />} />
          
          <Route path="planner" element={<div>Planner Content</div>} />
        
        </Route>

      </Route>

    </Routes>

    
    
  )
}

export default App
