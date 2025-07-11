import { useState } from 'react'

import './App.css'
import NavbarComponent from './components/Header'
import Hero from './components/Hero'
import Introduction from './components/Introduction'
import VideoOverlay from './components/Trailer'
import ProductCards from './components/ProductCard'

function App() {

  return (
    <>
      <NavbarComponent/>
      <Hero/>
      <Introduction/>
      <VideoOverlay/>
    
      <ProductCards/>
 
   
    </>
  )
}

export default App
