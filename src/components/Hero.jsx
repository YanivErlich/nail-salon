import styles from './Hero.module.css'
import heroImg from '../assets/gallery/gallery4.jpeg'

export default function Hero({ t }) {
  return (
    <section className={styles.hero} id="home">
      <div
        className={styles.heroBg}
        style={{
          backgroundImage: `linear-gradient(rgba(18,10,13,0.55), rgba(18,10,13,0.55)), linear-gradient(to top, rgba(18,10,13,0.8) 0%, transparent 60%), url(${heroImg})`,
        }}
      />
      <div className={styles.content}>
        <p className={styles.eyebrow}>{t.heroEyebrow}</p>
        <h1 className={styles.title}>
          {t.heroTitle1} <em>{t.heroTitle2}</em>
        </h1>
        <p className={styles.sub}>{t.heroSub}</p>
        <a href="#booking" className={styles.cta}>
          <span>{t.heroCta}</span>
          <span className={styles.arrow}>→</span>
        </a>
      </div>
      <div className={styles.scrollHint}>
        <div className={styles.scrollLine} />
        <span>{t.heroScroll}</span>
      </div>
    </section>
  )
}
