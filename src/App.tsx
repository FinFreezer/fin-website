import { useState } from 'react'
import { Routes, Route } from 'react-router'
import { HomePage } from './Pages/HomePage'
import { NotFoundPage } from './Pages/NotFoundPage'
import { VideosPage } from './Pages/VideosPage'
import { PicturesPage } from './Pages/PicturesPage'
import { GamesPage } from './Pages/GamesPage'
import type { UserType } from './utils/userTypeDef'
import './App.css'

function App() {
  const [activeUser, setActiveUser] = useState<UserType | null>(null);

  return (
    <Routes>
      <Route index element={<HomePage activeUser={activeUser} setActiveUser={setActiveUser} />} />
      <Route path="/videos" element={<VideosPage activeUser={activeUser} setActiveUser={setActiveUser} />} />
      <Route path="/comics" element={<PicturesPage activeUser={activeUser} setActiveUser={setActiveUser} />} />
      <Route path="/games" element={<GamesPage activeUser={activeUser} setActiveUser={setActiveUser} />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
