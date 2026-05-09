import { useState, useRef, useEffect } from 'react'
import useReveal from '../hooks/useReveal'
import styles from './Booking.module.css'
import { PHONE_DISPLAY, WHATSAPP_URL } from '../constants'

const parsePrice = (str) => {
  const parts = str.replace('₪', '').trim().split('–').map(n => parseInt(n.trim()))
  return { min: parts[0], max: parts[parts.length - 1] }
}

const applyWeekendSurcharge = ({ min, max }) => {
  const aMin = Math.round(min * 1.3)
  const aMax = Math.round(max * 1.3)
  return aMin === aMax ? `₪ ${aMin}` : `₪ ${aMin}–${aMax}`
}

const generateSlots = (startH, startM, endH, endM) => {
  const slots = []
  let t = startH * 60 + startM
  const end = endH * 60 + endM
  while (t < end) {
    slots.push(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`)
    t += 30
  }
  return slots
}

// 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
const SLOTS_BY_DAY = [
  generateSlots(8, 0, 22, 0),   // Sun
  [],                             // Mon - closed
  generateSlots(10, 0, 17, 0),  // Tue - last slot 16:30, finish by 17:00
  [],                             // Wed - closed
  generateSlots(10, 0, 22, 0),  // Thu
  generateSlots(8, 0, 22, 0),   // Fri
  generateSlots(8, 0, 22, 0),   // Sat
]

const getDayOfWeek = (dateStr) => {
  if (!dateStr) return -1
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).getDay()
}

export default function Booking({ t }) {
  const infoRef = useReveal()
  const formRef = useReveal(150)
  const [submitted, setSubmitted] = useState(false)
  const [selectedServices, setSelectedServices] = useState([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [phoneError, setPhoneError] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')

  const today = new Date().toISOString().split('T')[0]
  const selectedDay = getDayOfWeek(selectedDate)
  const closedDay = selectedDay === 1 || selectedDay === 3
  const saturday = selectedDay === 6

  const slotsWithState = () => {
    if (selectedDay < 0) return []
    const slots = SLOTS_BY_DAY[selectedDay] || []
    if (selectedDate !== today) return slots.map(slot => ({ slot, past: false }))
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    return slots.map(slot => {
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
    if (closedDay) return
    const data = new FormData(e.target)
    const name  = data.get('name')
    const phone = data.get('phone')

    if (!isValidPhone(phone)) {
      setPhoneError(true)
      return
    }
    const date = data.get('date')
    const time = data.get('time')
    const note = data.get('note')

    const [y, m, d] = date.split('-')
    const formattedDate = `${d}/${m}/${y}`

    const pricedServices = selectedServices.map(svc => {
      const i = t.svcOptions.indexOf(svc)
      const base = i >= 0 ? parsePrice(t.svcPrices[i]) : null
      const priceStr = base ? (saturday ? applyWeekendSurcharge(base) : t.svcPrices[i]) : ''
      return `  • ${svc} — ${priceStr}`
    })

    const totals = selectedServices.map(svc => {
      const i = t.svcOptions.indexOf(svc)
      return i >= 0 ? parsePrice(t.svcPrices[i]) : null
    }).filter(Boolean)
    const multiplier = saturday ? 1.3 : 1
    const totalMin = Math.round(totals.reduce((s, p) => s + p.min, 0) * multiplier)
    const totalMax = Math.round(totals.reduce((s, p) => s + p.max, 0) * multiplier)
    const totalStr = totalMin === totalMax ? `₪ ${totalMin}` : `₪ ${totalMin}–${totalMax}`

    const lines = [
      '\u{1F44B} היי פולינה! אני רוצה לקבוע תור:',
      '',
      `\u{1F464} שם: ${name}`,
      `\u{1F4F1} טלפון: ${phone}`,
      `\u{1F4C5} תאריך: ${formattedDate}`,
      `\u{1F550} שעה: ${time}`,
      '',
      '\u{1F485} שירותים:',
      ...pricedServices,
      saturday ? '⚠️ שבת: תוספת 30%' : null,
      `\u{1F4B0} סה״כ: ${totalStr}`,
      note ? `\n\u{1F4DD} הערה: ${note}` : null,
    ]
    const msg = lines.filter(Boolean).join('\n')

    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(msg)}`, '_blank')

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
            <li>
              <span className={styles.icon}>✦</span>
              <div>
                <strong>{t.hoursLabel}</strong>
                {Array.isArray(t.hours)
                  ? t.hours.map((line, i) => <span key={i}>{line}</span>)
                  : t.hours}
              </div>
            </li>
            <li><span className={styles.icon}>✦</span><div><strong>{t.phoneLabel}</strong><a href={`tel:${PHONE_DISPLAY}`}>{PHONE_DISPLAY}</a></div></li>
          </ul>
          <a
            className={styles.wazeBtn}
            href="https://waze.com/ul?q=Trumpeldor+46+Haifa+Israel&navigate=yes"
            onClick={(e) => {
              e.preventDefault()
              const appUrl = 'waze://ul?q=Trumpeldor+46+Haifa+Israel&navigate=yes'
              const webUrl = 'https://waze.com/ul?q=Trumpeldor+46+Haifa+Israel&navigate=yes'
              const timer = setTimeout(() => { window.location.href = webUrl }, 1500)
              const onHide = () => {
                if (document.hidden) { clearTimeout(timer); document.removeEventListener('visibilitychange', onHide) }
              }
              document.addEventListener('visibilitychange', onHide)
              window.location.href = appUrl
            }}
          >
            <svg className={styles.wazeIcon} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="50" cy="50" r="50" fill="#33CCFF"/>
              <path fill="white" d="M50 13 C31 13 16 26 16 42 C16 57 27 68 41 71 L37 83 L50 73 C50.3 73 50.7 73 51 73 C69 73 84 58 84 42 C84 26 69 13 50 13Z"/>
              <circle cx="40" cy="39" r="5" fill="#1a1a1a"/>
              <circle cx="61" cy="39" r="5" fill="#1a1a1a"/>
              <path d="M37 53 Q50 65 63 53" stroke="#1a1a1a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
              <circle cx="37" cy="78" r="8" fill="#1a1a1a"/>
              <circle cx="62" cy="78" r="8" fill="#1a1a1a"/>
            </svg>
            {t.wazeNav}
          </a>
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
              const multiplier = saturday ? 1.3 : 1
              const totalMin = Math.round(totals.reduce((s, p) => s + p.min, 0) * multiplier)
              const totalMax = Math.round(totals.reduce((s, p) => s + p.max, 0) * multiplier)
              const totalStr = totalMin === totalMax ? `₪ ${totalMin}` : `₪ ${totalMin}–${totalMax}`
              return (
                <div className={styles.priceBreakdown}>
                  {selectedServices.map((svc, i) => {
                    const idx = t.svcOptions.indexOf(svc)
                    const base = idx >= 0 ? parsePrice(t.svcPrices[idx]) : null
                    const displayPrice = base
                      ? (saturday ? applyWeekendSurcharge(base) : t.svcPrices[idx])
                      : ''
                    return (
                      <div key={i} className={styles.priceRow}>
                        <span>{svc}</span>
                        <span>{displayPrice}</span>
                      </div>
                    )
                  })}
                  {saturday && (
                    <div className={styles.priceRow}>
                      <span>{t.saturdayFee}</span>
                      <span>+30%</span>
                    </div>
                  )}
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
                <select
                  className={styles.input}
                  name="time"
                  required={!closedDay}
                  disabled={closedDay}
                  defaultValue=""
                >
                  <option value="" disabled>--:--</option>
                  {slotsWithState().map(({ slot, past }) => (
                    <option key={slot} value={slot} disabled={past} style={past ? { color: '#666' } : {}}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {closedDay && selectedDate && (
              <div className={styles.closedMsg}>{t.closedMsg}</div>
            )}
            {saturday && selectedDate && (
              <div className={styles.saturdayMsg}>{t.saturdayMsg}</div>
            )}
            <div className={styles.group}>
              <label className={styles.fieldLabel}>{t.fNote}</label>
              <textarea className={styles.input} name="note" rows={3} placeholder={t.fNotePlaceholder} />
            </div>
            <button
              type="submit"
              disabled={closedDay}
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
