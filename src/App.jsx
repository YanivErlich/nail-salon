import { useState, useEffect } from 'react'
import translations from './i18n'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Booking from './components/Booking'
import Footer from './components/Footer'
import Accessibility from './components/Accessibility'

export default function App() {
  const [lang, setLang] = useState('he')
  const t = translations[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = t.dir
  }, [lang, t.dir])

  return (
    <>
      <Navbar t={t} lang={lang} setLang={setLang} />
      <Hero t={t} />
      <Services t={t} />
      <About t={t} />
      <Gallery t={t} />
      <Testimonials t={t} />
      <Booking t={t} />
      <FAQ t={t} />
      <Footer t={t} />
      <Accessibility t={t} />
    </>
  )
}
