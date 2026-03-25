import { Routes, Route } from "react-router-dom"
import { Hero } from "./sections/Hero"
import { ResetPassword } from "./components/ResetPassword"
import { DashBoard } from "./sections/DashBoard"


function App() {
  
  return (

    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/reset-password" element={<ResetPassword />}/>

      <Route path="/dashboard" element={<DashBoard />} >

        <Route index element={<div>Dashboard Home Content</div>} />

        <Route path="closet" element={<div>My Closet Content</div>} />

        <Route path="lookbooks" element={<div>Lookbooks Content</div>} />
        
        <Route path="tags" element={<div>Tags Content</div>} />
      </Route>

    </Routes>

    
    
  )
}

export default App
