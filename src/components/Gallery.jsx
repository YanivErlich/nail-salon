import { useState, useEffect, useRef } from 'react'
import useReveal from '../hooks/useReveal'
import styles from './Gallery.module.css'

import g1 from '../assets/gallery/gallery1.jpeg'
import g2 from '../assets/gallery/gallery2.jpeg'
import g3 from '../assets/gallery/gallery3.jpeg'
import g28 from '../assets/gallery/gallery28.png'
import g29 from '../assets/gallery/gallery29.png'

import g6 from '../assets/gallery/gallery6.jpeg'
import g7 from '../assets/gallery/gallery7.jpeg'
import g8 from '../assets/gallery/gallery8.jpeg'
import g9 from '../assets/gallery/gallery9.jpeg'
import g10 from '../assets/gallery/gallery10.jpeg'
import g11 from '../assets/gallery/gallery11.jpeg'
import g12 from '../assets/gallery/gallery12.jpeg'
import g13 from '../assets/gallery/gallery13.jpeg'
import g14 from '../assets/gallery/gallery14.jpeg'
import g15 from '../assets/gallery/gallery15.jpeg'
import g16 from '../assets/gallery/gallery16.jpeg'
import g17 from '../assets/gallery/gallery17.jpeg'
import g18 from '../assets/gallery/gallery18.jpeg'
import g19 from '../assets/gallery/gallery19.jpeg'
import g20 from '../assets/gallery/gallery20.jpeg'
import g21 from '../assets/gallery/gallery21.jpeg'
import g22 from '../assets/gallery/gallery22.jpeg'

import g26 from '../assets/gallery/gallery26.jpeg'
import g27 from '../assets/gallery/gallery27.jpeg'

const ALL_PHOTOS = [
  { src: g6,  cat: 'manicure' },
  { src: g3,  cat: 'manicure' },
  { src: g28, cat: 'manicure' },
  { src: g29, cat: 'manicure' },

  { src: g26, cat: 'pedicure' },
  { src: g27, cat: 'pedicure' },
  { src: g2,  cat: 'building' },
  { src: g7,  cat: 'building' },
  { src: g8,  cat: 'building' },
  { src: g9,  cat: 'building' },
  { src: g10, cat: 'building' },
  { src: g11, cat: 'building' },
  { src: g12, cat: 'building' },
  { src: g13, cat: 'building' },
  { src: g14, cat: 'building' },
  { src: g15, cat: 'building' },
  { src: g16, cat: 'building' },
  { src: g17, cat: 'building' },
  { src: g18, cat: 'building' },
  { src: g19, cat: 'building' },
  { src: g20, cat: 'building' },
  { src: g21, cat: 'building' },
  { src: g22, cat: 'building' },
  { src: g1,  cat: 'beforeAfter' },
]

const CATEGORIES = ['manicure', 'pedicure', 'building', 'beforeAfter']

export default function Gallery({ t }) {
  const headerRef = useReveal()
  const [activeCategory, setActiveCategory] = useState('manicure')
  const [fading, setFading] = useState(false)
  const [displayed, setDisplayed] = useState(ALL_PHOTOS.filter(p => p.cat === 'manicure'))
  const [lightbox, setLightbox] = useState(null)
  const touchStartX = useRef(null)

  const handleCategoryChange = (cat) => {
    if (cat === activeCategory) return
    setLightbox(null)
    setFading(true)
    setTimeout(() => {
      setActiveCategory(cat)
      setDisplayed(ALL_PHOTOS.filter(p => p.cat === cat))
      setFading(false)
    }, 220)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (lightbox === null) return
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % displayed.length)
      if (e.key === 'ArrowLeft') setLightbox(i => (i - 1 + displayed.length) % displayed.length)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lightbox, displayed.length])

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  const catLabel = (cat) => ({
    all: t.catAll,
    manicure: t.catManicure,
    pedicure: t.catPedicure,
    building: t.catBuilding,
    beforeAfter: t.catBeforeAfter,
  }[cat])

  return (
    <section className={styles.section} id="gallery">
      <div className={styles.header} ref={headerRef}>
        <span className={styles.label}>{t.galleryLabel}</span>
        <h2 className={styles.title}>{t.galleryTitle}</h2>
      </div>

      <div className={styles.filters}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {catLabel(cat)}
          </button>
        ))}
      </div>

      <div className={`${styles.gridWrapper} ${fading ? styles.fading : ''}`}>
        <div className={styles.grid}>
          {displayed.map((p, i) => (
            <div
              key={`${activeCategory}-${i}`}
              className={styles.item}
              onClick={() => setLightbox(i)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setLightbox(i)}
            >
              <img src={p.src} alt="" loading="lazy" />
              <div className={styles.overlay}>
                <span className={styles.zoomIcon}>⊕</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div
          className={styles.lightbox}
          onClick={() => setLightbox(null)}
          onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
          onTouchEnd={e => {
            if (touchStartX.current === null) return
            const delta = e.changedTouches[0].clientX - touchStartX.current
            if (Math.abs(delta) >= 50) {
              setLightbox(i => delta < 0
                ? (i + 1) % displayed.length
                : (i - 1 + displayed.length) % displayed.length)
            }
            touchStartX.current = null
          }}
        >
          <button className={styles.lbClose} onClick={() => setLightbox(null)} aria-label="Close">✕</button>
          <button
            className={`${styles.lbArrow} ${styles.lbPrev}`}
            onClick={e => { e.stopPropagation(); setLightbox(i => (i - 1 + displayed.length) % displayed.length) }}
            aria-label="Previous"
          >‹</button>
          <img
            src={displayed[lightbox]?.src}
            alt=""
            className={styles.lbImg}
            onClick={e => e.stopPropagation()}
          />
          <button
            className={`${styles.lbArrow} ${styles.lbNext}`}
            onClick={e => { e.stopPropagation(); setLightbox(i => (i + 1) % displayed.length) }}
            aria-label="Next"
          >›</button>
          <div className={styles.lbDots}>
            {displayed.map((_, i) => (
              <span
                key={i}
                className={`${styles.lbDot} ${i === lightbox ? styles.lbDotActive : ''}`}
                onClick={e => { e.stopPropagation(); setLightbox(i) }}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
