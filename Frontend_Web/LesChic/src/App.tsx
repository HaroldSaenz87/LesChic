import { Routes, Route } from "react-router-dom"
import { Hero } from "./sections/Hero"
import { ResetPassword } from "./components/ResetPassword"
import { VerifyEmail } from "./components/VerifyEmail"
import { DashBoard } from "./sections/DashBoard"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Overview } from "./components/Overview"


function App() {
  
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
          <Route path="closet" element={<div>My Closet Content</div>} />

          <Route path="lookbooks" element={<div>Lookbooks Content</div>} />
          
          <Route path="planner" element={<div>Planner Content</div>} />
        
        </Route>

      </Route>

    </Routes>

    
    
  )
}

export default App
