import { useEffect, useState } from 'react'
import styles from './Navbar.module.css'
import { WHATSAPP_URL } from '../constants'

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/polina_nails_israel?igsh=dmpuMWYyM2tpcDd5&utm_source=qr',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 1.5A4 4 0 0 0 3.5 7.5v9A4 4 0 0 0 7.5 20.5h9a4 4 0 0 0 4-4v-9a4 4 0 0 0-4-4h-9zm4.5 2.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 1.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.5-.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61550945281301',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.99H7.898V12h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.772-1.63 1.562V12h2.773l-.443 2.888h-2.33v6.99C18.343 21.128 22 16.991 22 12z"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: WHATSAPP_URL,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
]

export default function Navbar({ t, lang, setLang }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <button className={styles.menuBtn} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
        ☰
      </button>

      <div className={styles.logo}>
        <span className={styles.logoName}>{t.logoName}</span>
        <span className={styles.logoSlogan}>{t.logoSlogan}</span>
      </div>

      <div className={styles.right}>
        <ul className={styles.links}>
          <li><a href="#services">{t.navServices}</a></li>
          <li><a href="#about">{t.navAbout}</a></li>
          <li><a href="#gallery">{t.navGallery}</a></li>
          <li><a href="#booking" className={styles.bookLink}>{t.navBook}</a></li>
        </ul>
        <div className={styles.socialIcons}>
          {SOCIALS.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer noopener"
              aria-label={s.label} className={styles.socialIcon}
            >
              {s.icon}
            </a>
          ))}
        </div>
        <div className={styles.langSwitcher}>
          {['en', 'ru', 'he'].map(l => (
            <button
              key={l}
              className={`${styles.langBtn} ${lang === l ? styles.active : ''}`}
              onClick={() => setLang(l)}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <aside className={`${styles.sidebar} ${menuOpen ? styles.open : ''}`}>
        <ul className={styles.sidebarLinks}>
          <li><a href="#services" onClick={closeMenu}>{t.navServices}</a></li>
          <li><a href="#about" onClick={closeMenu}>{t.navAbout}</a></li>
          <li><a href="#gallery" onClick={closeMenu}>{t.navGallery}</a></li>
          <li><a href="#booking" className={styles.bookLink} onClick={closeMenu}>{t.navBook}</a></li>
        </ul>
        <div className={styles.sidebarLangSwitcher}>
          {['en', 'ru', 'he'].map(l => (
            <button
              key={l}
              className={`${styles.langBtn} ${lang === l ? styles.active : ''}`}
              onClick={() => {
                setLang(l)
                closeMenu()
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <div className={styles.sidebarSocials}>
          {SOCIALS.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer noopener"
              aria-label={s.label} className={styles.socialIcon}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </aside>

      {menuOpen && <div className={styles.backdrop} onClick={closeMenu} />}
    </nav>
  )
}
