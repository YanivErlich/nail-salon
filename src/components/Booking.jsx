import { useState, useRef, useEffect } from 'react'
import useReveal from '../hooks/useReveal'
import styles from './Booking.module.css'

const parsePrice = (str) => {
  const parts = str.replace('₪', '').trim().split('–').map(n => parseInt(n.trim()))
  return { min: parts[0], max: parts[parts.length - 1] }
}

const TIME_SLOTS = Array.from({ length: 23 }, (_, i) => {
  const totalMinutes = 9 * 60 + i * 30
  const h = Math.floor(totalMinutes / 60).toString().padStart(2, '0')
  const m = (totalMinutes % 60).toString().padStart(2, '0')
  return `${h}:${m}`
})

export default function Booking({ t }) {
  const infoRef = useReveal()
  const formRef = useReveal(150)
  const [submitted, setSubmitted] = useState(false)
  const [selectedServices, setSelectedServices] = useState([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [phoneError, setPhoneError] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const slotsWithState = () => {
    if (selectedDate !== today) return TIME_SLOTS.map(slot => ({ slot, past: false }))
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    return TIME_SLOTS.map(slot => {
      const [h, m] = slot.split(':').map(Number)
      return { slot, past: h * 60 + m <= currentMinutes }
    })
  }
  const dropdownRef = useRef(null)

  const toggleService = (svc) =>
    setSelectedServices(prev =>
      prev.includes(svc) ? prev.filter(s => s !== svc) : [...prev, svc]
    )

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isValidPhone = (val) => /^(\+972|0)[0-9]{9}$/.test(val.replace(/[\s\-()]/g, ''))

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    const name  = data.get('name')
    const phone = data.get('phone')

    if (!isValidPhone(phone)) {
      setPhoneError(true)
      return
    }
    const date  = data.get('date')
    const time  = data.get('time')
    const note  = data.get('note')

    const [y, m, d] = date.split('-')
    const formattedDate = `${d}/${m}/${y}`

    const pricedServices = selectedServices.map(svc => {
      const i = t.svcOptions.indexOf(svc)
      return `  • ${svc} — ${i >= 0 ? t.svcPrices[i] : ''}`
    })

    const totals = selectedServices.map(svc => {
      const i = t.svcOptions.indexOf(svc)
      return i >= 0 ? parsePrice(t.svcPrices[i]) : null
    }).filter(Boolean)
    const totalMin = totals.reduce((s, p) => s + p.min, 0)
    const totalMax = totals.reduce((s, p) => s + p.max, 0)
    const totalStr = totalMin === totalMax ? `₪ ${totalMin}` : `₪ ${totalMin}–${totalMax}`

    const msg = [
      `Привет, Полина! 👋 Хочу записаться:`,
      ``,
      `👤 Имя: ${name}`,
      `📱 Телефон: ${phone}`,
      `📅 Дата: ${formattedDate}`,
      `🕐 Время: ${time}`,
      ``,
      `💅 Услуги:`,
      ...pricedServices,
      `💰 Итого: ${totalStr}`,
      note ? `\n📝 Примечание: ${note}` : null,
    ].filter(Boolean).join('\n')

    window.open(`https://wa.me/972543288188?text=${encodeURIComponent(msg)}`, '_blank')

    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); e.target.reset(); setSelectedServices([]) }, 4000)
  }

  return (
    <section className={styles.section} id="booking">
      <div className={styles.inner}>
        <div className={styles.info} ref={infoRef}>
          <span className={styles.label}>{t.bookLabel}</span>
          <h2 className={styles.title}>{t.bookTitle}</h2>
          <p>{t.bookSub}</p>
          <ul className={styles.contacts}>
            <li><span className={styles.icon}>✦</span><div><strong>{t.addrLabel}</strong>{t.address}</div></li>
            <li><span className={styles.icon}>✦</span><div><strong>{t.hoursLabel}</strong>{t.hours}</div></li>
            <li><span className={styles.icon}>✦</span><div><strong>{t.phoneLabel}</strong>0543288188</div></li>
          </ul>
          <div className={styles.map}>
            <iframe
              title="Salon location"
              src="https://maps.google.com/maps?q=Trumpeldor+Street+46+Haifa+Israel&output=embed&z=16"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div ref={formRef}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.group}>
                <label className={styles.fieldLabel}>{t.fName}</label>
                <input className={styles.input} type="text" name="name" required />
              </div>
              <div className={styles.group}>
                <label className={styles.fieldLabel}>{t.fPhone}</label>
                <input
                  className={`${styles.input} ${phoneError ? styles.inputError : ''}`}
                  type="tel"
                  name="phone"
                  required
                  onChange={() => setPhoneError(false)}
                />
                {phoneError && <span className={styles.errorMsg}>{t.fPhoneError}</span>}
              </div>
            </div>
            <div className={styles.group} ref={dropdownRef}>
              <label className={styles.fieldLabel}>{t.fService}</label>
              <button
                type="button"
                className={`${styles.input} ${styles.dropdownTrigger}`}
                onClick={() => setDropdownOpen(o => !o)}
              >
                <span>
                  {selectedServices.length === 0
                    ? t.fServiceOpt
                    : selectedServices.join(', ')}
                </span>
                <span className={`${styles.dropdownArrow} ${dropdownOpen ? styles.open : ''}`}>▾</span>
              </button>
              {dropdownOpen && (
                <div className={styles.dropdownPanel}>
                  {t.svcOptions.map((svc, i) => (
                    <label key={i} className={`${styles.dropdownItem} ${selectedServices.includes(svc) ? styles.checked : ''}`}>
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(svc)}
                        onChange={() => toggleService(svc)}
                      />
                      <span className={styles.checkMark} />
                      <span className={styles.dropdownItemText}>
                        <span>{svc}</span>
                        <span className={styles.dropdownItemPrice}>{t.svcPrices[i]}</span>
                      </span>
                    </label>
                  ))}
                  <div className={styles.dropdownActions}>
                    <button
                      type="button"
                      className={styles.dropdownAccept}
                      onClick={() => setDropdownOpen(false)}
                    >
                      {t.fAccept}
                    </button>
                    <button
                      type="button"
                      className={styles.dropdownClear}
                      onClick={() => { setSelectedServices([]); setDropdownOpen(false) }}
                    >
                      {t.fClear}
                    </button>
                  </div>
                </div>
              )}
            </div>
            {selectedServices.length > 0 && (() => {
              const totals = selectedServices.map(svc => {
                const i = t.svcOptions.indexOf(svc)
                return i >= 0 ? parsePrice(t.svcPrices[i]) : null
              }).filter(Boolean)
              const totalMin = totals.reduce((s, p) => s + p.min, 0)
              const totalMax = totals.reduce((s, p) => s + p.max, 0)
              const totalStr = totalMin === totalMax ? `₪ ${totalMin}` : `₪ ${totalMin}–${totalMax}`
              return (
                <div className={styles.priceBreakdown}>
                  {selectedServices.map((svc, i) => {
                    const idx = t.svcOptions.indexOf(svc)
                    return (
                      <div key={i} className={styles.priceRow}>
                        <span>{svc}</span>
                        <span>{idx >= 0 ? t.svcPrices[idx] : ''}</span>
                      </div>
                    )
                  })}
                  <div className={styles.priceTotal}>
                    <span>{t.fTotal}</span>
                    <span>{totalStr}</span>
                  </div>
                </div>
              )
            })()}
            <div className={styles.row}>
              <div className={styles.group}>
                <label className={styles.fieldLabel}>{t.fDate}</label>
                <input
                  className={styles.input}
                  type="date"
                  name="date"
                  required
                  min={today}
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                />
              </div>
              <div className={styles.group}>
                <label className={styles.fieldLabel}>{t.fTime}</label>
                <select className={styles.input} name="time" required defaultValue="">
                  <option value="" disabled>--:--</option>
                  {slotsWithState().map(({ slot, past }) => (
                    <option key={slot} value={slot} disabled={past} style={past ? { color: '#666' } : {}}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.group}>
              <label className={styles.fieldLabel}>{t.fNote}</label>
              <textarea className={styles.input} name="note" rows={3} placeholder={t.fNotePlaceholder} />
            </div>
            <button
              type="submit"
              className={`${styles.submit} ${submitted ? styles.success : ''}`}
            >
              {submitted ? t.successMsg : t.fSubmit}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
