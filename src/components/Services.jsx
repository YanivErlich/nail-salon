import { useState, useRef, useEffect } from 'react'
import useReveal from '../hooks/useReveal'
import styles from './Services.module.css'

const cards = [
  { num: '01', name: 'svc1Name', desc: 'svc1Desc', price: 'svc1Price' },
  { num: '02', name: 'svc2Name', desc: 'svc2Desc', price: 'svc2Price' },
  { num: '03', name: 'svc3Name', desc: 'svc3Desc', price: 'svc3Price' },
  { num: '04', name: 'svc4Name', desc: 'svc4Desc', price: 'svc4Price' },
  { num: '05', name: 'svc5Name', desc: 'svc5Desc', price: 'svc5Price' },
  { num: '06', name: 'svc6Name', desc: 'svc6Desc', price: 'svc6Price' },
  { num: '07', name: 'svc7Name', desc: 'svc7Desc', price: 'svc7Price' },
  { num: '08', name: 'svc8Name', desc: 'svc8Desc', price: 'svc8Price' },
  { num: '09', name: 'svc9Name', desc: 'svc9Desc', price: 'svc9Price' },
]

const DESKTOP_VISIBLE = 3
const DOT_MAX = cards.length - DESKTOP_VISIBLE

export default function Services({ t }) {
  const headerRef = useReveal()
  const windowRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [slideMax, setSlideMax] = useState(DOT_MAX)

  const getCardWidth = () =>
    windowRef.current ? windowRef.current.scrollWidth / cards.length : 0

  const getMax = () => {
    if (!windowRef.current) return DOT_MAX
    const cw = getCardWidth()
    if (!cw) return DOT_MAX
    const visible = Math.max(1, Math.round(windowRef.current.offsetWidth / cw))
    return cards.length - visible
  }

  useEffect(() => {
    const update = () => setSlideMax(getMax())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const scrollTo = (i) => {
    const m = getMax()
    const clamped = Math.max(0, Math.min(m, i))
    setIndex(clamped)
    windowRef.current?.scrollTo({ left: clamped * getCardWidth(), behavior: 'smooth' })
  }

  const handleScroll = () => {
    const cw = getCardWidth()
    if (!cw || !windowRef.current) return
    const m = getMax()
    const i = Math.round(windowRef.current.scrollLeft / cw)
    const clamped = Math.min(m, Math.max(0, i))
    setIndex(clamped)
    setSlideMax(m)
  }

  return (
    <section className={styles.section} id="services">
      <div className={styles.header} ref={headerRef}>
        <span className={styles.label}>{t.servicesLabel}</span>
        <h2 className={styles.title}>{t.servicesTitle}</h2>
        <p className={styles.sub}>{t.servicesSub}</p>
      </div>

      <div className={styles.carousel}>
        <button
          className={`${styles.arrow} ${styles.arrowPrev}`}
          onClick={() => scrollTo(index - 1)}
          disabled={index === 0}
          aria-label="Previous"
        >‹</button>

        <div className={styles.window} ref={windowRef} onScroll={handleScroll}>
          <div className={styles.track}>
            {cards.map(card => (
              <div key={card.num} className={styles.card}>
                <div className={styles.num}>{card.num}</div>
                <div className={styles.name}>{t[card.name]}</div>
                <p className={styles.desc}>{t[card.desc]}</p>
                <div className={styles.price}>{t[card.price]}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          className={`${styles.arrow} ${styles.arrowNext}`}
          onClick={() => scrollTo(index + 1)}
          disabled={index >= slideMax}
          aria-label="Next"
        >›</button>
      </div>

      <div className={styles.dots}>
        {Array.from({ length: DOT_MAX + 1 }).map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
