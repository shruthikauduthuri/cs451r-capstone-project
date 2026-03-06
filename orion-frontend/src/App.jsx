import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import Login from "./components/Login"

import { Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App

