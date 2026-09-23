import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import InstallarePage from './pages/InstallarePage'
import RationamentPage from './pages/RationamentPage'
import ToolsPage from './pages/ToolsPage'
import ComenziPage from './pages/ComenziPage'
import PromptingPage from './pages/PromptingPage'
import AvansatPage from './pages/AvansatPage'
import WorkflowsPage from './pages/WorkflowsPage'
import ReferintaPage from './pages/ReferintaPage'
import ModelsPage from './pages/ModelsPage'
import TokenuriPage from './pages/TokenuriPage'
import AutomationPage from './pages/AutomationPage'
import SkillsPage from './pages/SkillsPage'
import ProiectCompletPage from './pages/ProiectCompletPage'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen">
          <ScrollToTop />
          <Navbar />
          <Routes>
            <Route path="/"             element={<HomePage />} />
            <Route path="/instalare"    element={<InstallarePage />} />
            <Route path="/rationament"  element={<RationamentPage />} />
            <Route path="/tools"        element={<ToolsPage />} />
            <Route path="/comenzi"      element={<ComenziPage />} />
            <Route path="/prompting"    element={<PromptingPage />} />
            <Route path="/modele"       element={<ModelsPage />} />
            <Route path="/tokenuri"     element={<TokenuriPage />} />
            <Route path="/automatizare" element={<AutomationPage />} />
            <Route path="/avansat"      element={<AvansatPage />} />
            <Route path="/skills"       element={<SkillsPage />} />
            <Route path="/workflows"         element={<WorkflowsPage />} />
            <Route path="/proiect-complet"  element={<ProiectCompletPage />} />
            <Route path="/referinta"    element={<ReferintaPage />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
