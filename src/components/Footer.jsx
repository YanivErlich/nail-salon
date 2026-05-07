import styles from './Footer.module.css'

export default function Footer({ t }) {
  return (
    <>
      <div className={styles.dividerWrap}>
        <div className={styles.divider}>
          <div className={styles.diamond} />
        </div>
      </div>
      <footer className={styles.footer}>
        <span className={styles.logo}>{t.logoName}</span>
        <p className={styles.copy}>{t.footerCopy}</p>
        <ul className={styles.links}>
          <li><a href="#services">{t.navServices}</a></li>
          <li><a href="#about">{t.navAbout}</a></li>
          <li><a href="#booking">{t.navBook}</a></li>
        </ul>
        <div className={styles.socials}>
          <a
            href="https://www.instagram.com/polina_nails_israel?igsh=dmpuMWYyM2tpcDd5&utm_source=qr"
            target="_blank"
            rel="noreferrer noopener"
          >
            <span className={styles.socialIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 1.5A4 4 0 0 0 3.5 7.5v9A4 4 0 0 0 7.5 20.5h9a4 4 0 0 0 4-4v-9a4 4 0 0 0-4-4h-9zm4.5 2.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 1.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.5-.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
              </svg>
            </span>
            Instagram
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61550945281301"
            target="_blank"
            rel="noreferrer noopener"
          >
            <span className={styles.socialIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.99H7.898V12h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.772-1.63 1.562V12h2.773l-.443 2.888h-2.33v6.99C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </span>
            Facebook
          </a>
        </div>
      </footer>
    </>
  )
}
