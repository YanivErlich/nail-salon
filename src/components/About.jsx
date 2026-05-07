import useReveal from '../hooks/useReveal'
import styles from './About.module.css'
import storyImg from '../assets/gallery/gallery4.jpeg'

export default function About({ t }) {
  const imgRef = useReveal()
  const textRef = useReveal(150)

  return (
    <section className={styles.section} id="about">
      <div className={styles.wrap}>
        <div className={styles.imageWrap} ref={imgRef}>
          <img src={storyImg} alt="Polina Nail Salon" />
          <div className={styles.badge}>
            <span className={styles.badgeNum}>7+</span>
            <span className={styles.badgeText}>{t.badgeText}</span>
          </div>
        </div>
        <div className={styles.text} ref={textRef}>
          <span className={styles.label}>{t.aboutLabel}</span>
          <h2 className={styles.title}>{t.aboutTitle}</h2>
          <p>{t.aboutP1}</p>
          <p>{t.aboutP2}</p>
          <ul className={styles.features}>
            {[t.feat1, t.feat2, t.feat3, t.feat4].map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
