import useReveal from '../hooks/useReveal'
import styles from './Testimonials.module.css'

export default function Testimonials({ t }) {
  const headerRef = useReveal()
  const cards = [
    { text: t.test1Text, name: t.test1Name, delay: 0 },
    { text: t.test2Text, name: t.test2Name, delay: 120 },
    { text: t.test3Text, name: t.test3Name, delay: 240 },
  ]

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header} ref={headerRef}>
          <span className={styles.label}>{t.testLabel}</span>
          <h2 className={styles.title}>{t.testTitle}</h2>
        </div>
        <div className={styles.grid}>
          {cards.map((c, i) => <TestCard key={i} card={c} />)}
        </div>
      </div>
    </section>
  )
}

function TestCard({ card }) {
  const ref = useReveal(card.delay)
  return (
    <div className={styles.card} ref={ref}>
      <span className={styles.quote}>"</span>
      <div className={styles.stars}>★★★★★</div>
      <p className={styles.text}>{card.text}</p>
      <div className={styles.name}>{card.name}</div>
    </div>
  )
}
