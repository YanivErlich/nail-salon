import { useState, useEffect, useRef } from 'react'
import styles from './Accessibility.module.css'

const DEFAULT = {
  fontSize: 0,
  contrast: false,
  grayscale: false,
  underline: false,
  readableFont: false,
  pauseMotion: false,
}

export default function Accessibility({ t }) {
  const [open, setOpen] = useState(false)
  const [opts, setOpts] = useState(DEFAULT)
  const panelRef = useRef(null)

  useEffect(() => {
    const html = document.documentElement
    html.style.setProperty('--a11y-font-scale', opts.fontSize !== 0 ? `${100 + opts.fontSize * 10}%` : '')
    html.classList.toggle('a11y-contrast', opts.contrast)
    html.classList.toggle('a11y-grayscale', opts.grayscale)
    html.classList.toggle('a11y-underline', opts.underline)
    html.classList.toggle('a11y-font', opts.readableFont)
    html.classList.toggle('a11y-motion', opts.pauseMotion)
  }, [opts])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const toggle = (key) => setOpts(o => ({ ...o, [key]: !o[key] }))
  const changeFont = (delta) => setOpts(o => ({ ...o, fontSize: Math.max(-2, Math.min(4, o.fontSize + delta)) }))
  const reset = () => { setOpts(DEFAULT); document.documentElement.style.removeProperty('--a11y-font-scale') }

  const isDefault = JSON.stringify(opts) === JSON.stringify(DEFAULT)

  return (
    <div className={styles.widget} aria-label={t.a11yTitle}>
      <button
        className={styles.trigger}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label={t.a11yTitle}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="4" r="2"/>
          <path d="M19 9h-5V7h-4v2H5a1 1 0 000 2h2.09l1.42 6.53A2 2 0 0010.46 21h3.08a2 2 0 001.95-1.47L16.91 11H19a1 1 0 000-2z"/>
        </svg>
      </button>

      {open && (
        <div className={styles.panel} ref={panelRef} role="dialog" aria-label={t.a11yTitle}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>{t.a11yTitle}</span>
            {!isDefault && (
              <button className={styles.resetBtn} onClick={reset}>{t.a11yReset}</button>
            )}
          </div>

          <div className={styles.fontRow}>
            <span className={styles.optLabel}>{t.a11yFontSize}</span>
            <div className={styles.fontControls}>
              <button className={styles.fontBtn} onClick={() => changeFont(-1)} disabled={opts.fontSize <= -2}>A−</button>
              <span className={styles.fontLevel}>{opts.fontSize > 0 ? `+${opts.fontSize}` : opts.fontSize}</span>
              <button className={styles.fontBtn} onClick={() => changeFont(1)} disabled={opts.fontSize >= 4}>A+</button>
            </div>
          </div>

          {[
            { key: 'contrast',    label: t.a11yContrast },
            { key: 'grayscale',   label: t.a11yGrayscale },
            { key: 'underline',   label: t.a11yUnderline },
            { key: 'readableFont',label: t.a11yFont },
            { key: 'pauseMotion', label: t.a11yMotion },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`${styles.optRow} ${opts[key] ? styles.active : ''}`}
              onClick={() => toggle(key)}
            >
              <span className={styles.optLabel}>{label}</span>
              <span className={styles.optToggle}>{opts[key] ? t.a11yOn : t.a11yOff}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
