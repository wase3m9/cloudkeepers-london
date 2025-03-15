
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './components/HomePage'
import { ServicePage } from './components/ServicePage'
import { ContactPage } from './components/ContactPage'
import { DynamicPage } from './components/DynamicPage'
import { BlogsPage } from './components/BlogsPage'
import { ResourcesPage } from './components/ResourcesPage'
import { CalculatorsPage } from './components/CalculatorsPage'
import { Toaster } from './components/ui/toaster'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services/:slug" element={<ServicePage />} />
        <Route path="/:city/:service" element={<DynamicPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:slug" element={<DynamicPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/calculators" element={<CalculatorsPage />} />
        <Route path="/calculators/:slug" element={<DynamicPage />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App
