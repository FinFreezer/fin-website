//import { useState } from 'react'
import { Routes, Route } from 'react-router'
import { HomePage } from './Pages/HomePage'
import { NotFoundPage } from './Pages/NotFoundPage'
import { VideosPage } from './Pages/VideosPage'
import './App.css'

function App() {

  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/videos" element={<VideosPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
