import { useState, useEffect, useRef } from 'react'
import useReveal from '../hooks/useReveal'
import styles from './Gallery.module.css'

import g1 from '../assets/gallery/gallery1.jpeg'
import g2 from '../assets/gallery/gallery2.jpeg'
import g3 from '../assets/gallery/gallery3.jpeg'
import g5 from '../assets/gallery/gallery5.jpeg'
import g6 from '../assets/gallery/gallery6.jpeg'
import g7 from '../assets/gallery/gallery7.jpeg'

const photos = [
  { src: g6, cls: 'tall' },
  { src: g5, cls: '' },
  { src: g2, cls: 'tall' },
  { src: g3, cls: '' },
  { src: g1, cls: '' },
  { src: g7, cls: 'wide' },
]

export default function Gallery({ t }) {
  const headerRef = useReveal()
  const gridRef = useReveal(100)
  const [lightbox, setLightbox] = useState(null)
  const touchStartX = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      if (lightbox === null) return
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % photos.length)
      if (e.key === 'ArrowLeft') setLightbox(i => (i - 1 + photos.length) % photos.length)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lightbox])

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  return (
    <section className={styles.section} id="gallery">
      <div className={styles.header} ref={headerRef}>
        <span className={styles.label}>{t.galleryLabel}</span>
        <h2 className={styles.title}>{t.galleryTitle}</h2>
      </div>
      <div className={styles.grid} ref={gridRef}>
        {photos.map((p, i) => (
          <div
            key={i}
            className={`${styles.item} ${p.cls ? styles[p.cls] : ''}`}
            onClick={() => setLightbox(i)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setLightbox(i)}
          >
            <img src={p.src} alt="" />
            <div className={styles.overlay}>
              <span className={styles.zoomIcon}>⊕</span>
            </div>
          </div>
        ))}
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
                ? (i + 1) % photos.length
                : (i - 1 + photos.length) % photos.length)
            }
            touchStartX.current = null
          }}
        >
          <button className={styles.lbClose} onClick={() => setLightbox(null)} aria-label="Close">✕</button>
          <button
            className={`${styles.lbArrow} ${styles.lbPrev}`}
            onClick={e => { e.stopPropagation(); setLightbox(i => (i - 1 + photos.length) % photos.length) }}
            aria-label="Previous"
          >‹</button>
          <img
            src={photos[lightbox].src}
            alt=""
            className={styles.lbImg}
            onClick={e => e.stopPropagation()}
          />
          <button
            className={`${styles.lbArrow} ${styles.lbNext}`}
            onClick={e => { e.stopPropagation(); setLightbox(i => (i + 1) % photos.length) }}
            aria-label="Next"
          >›</button>
          <div className={styles.lbDots}>
            {photos.map((_, i) => (
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
