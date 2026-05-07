import { useState } from 'react'
import useReveal from '../hooks/useReveal'
import styles from './FAQ.module.css'

export default function FAQ({ t }) {
  const headerRef = useReveal()
  const [open, setOpen] = useState(null)

  const toggle = (i) => setOpen(o => o === i ? null : i)

  return (
    <section className={styles.section} id="faq">
      <div className={styles.header} ref={headerRef}>
        <span className={styles.label}>{t.faqLabel}</span>
        <h2 className={styles.title}>{t.faqTitle}</h2>
      </div>
      <div className={styles.list}>
        {t.faqs.map((item, i) => (
          <div key={i} className={`${styles.item} ${open === i ? styles.itemOpen : ''}`}>
            <button className={styles.question} onClick={() => toggle(i)}>
              <span>{item.q}</span>
              <span className={`${styles.icon} ${open === i ? styles.iconOpen : ''}`}>+</span>
            </button>
            <div className={styles.answer} style={{ maxHeight: open === i ? '300px' : '0' }}>
              <p>{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
