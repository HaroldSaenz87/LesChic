import { Routes, Route } from "react-router-dom"
import { Hero } from "./sections/Hero"
import { ResetPassword } from "./components/ResetPassword"
import { DashBoard } from "./components/DashBoard"


function App() {
  
  return (

    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/reset-password" element={<ResetPassword />}/>
      <Route path="/dashboard" element={<DashBoard />} />
    </Routes>

    
    
  )
}

export default App
