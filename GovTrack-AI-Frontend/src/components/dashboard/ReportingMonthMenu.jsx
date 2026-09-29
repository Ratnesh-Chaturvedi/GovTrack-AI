import { useEffect, useId, useRef, useState } from 'react'
import { dashboardMonths } from '../../constants/dashboardData'
import { Icon } from '../common/Icon'

export function ReportingMonthMenu({ onChange, value }) {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const optionRefs = useRef([])
  const selectedIndex = Math.max(0, dashboardMonths.findIndex((month) => month.id === value))
  const selectedMonth = dashboardMonths[selectedIndex]

  useEffect(() => {
    if (!open) return undefined
    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  const focusOption = (index) => optionRefs.current[index]?.focus()
  const chooseMonth = (monthId) => {
    onChange(monthId)
    setOpen(false)
    triggerRef.current?.focus()
  }

  const handleTriggerKeyDown = (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    setOpen(true)
    requestAnimationFrame(() => focusOption(selectedIndex))
  }

  const handleOptionKeyDown = (event, index) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const next = (index + (event.key === 'ArrowDown' ? 1 : -1) + dashboardMonths.length) % dashboardMonths.length
      focusOption(next)
    }
    if (event.key === 'Home') { event.preventDefault(); focusOption(0) }
    if (event.key === 'End') { event.preventDefault(); focusOption(dashboardMonths.length - 1) }
  }

  return <div className="dashboard-month" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }} ref={rootRef}>
    <button aria-controls={menuId} aria-expanded={open} aria-haspopup="menu" aria-label={`Reporting month: ${selectedMonth.label}`} className="dashboard-month-trigger" onClick={() => setOpen((current) => !current)} onKeyDown={handleTriggerKeyDown} ref={triggerRef} type="button"><Icon name="calendar" size={16} /><span>{selectedMonth.label}</span><Icon className={open ? 'is-open' : ''} name="chevron" size={14} /></button>
    {open && <div aria-label="Reporting month" className="dashboard-month-menu" id={menuId} role="menu"><span className="dashboard-month-menu-title">Reporting month</span>{dashboardMonths.map((month, index) => <button aria-checked={value === month.id} className={value === month.id ? 'is-selected' : ''} key={month.id} onClick={() => chooseMonth(month.id)} onKeyDown={(event) => handleOptionKeyDown(event, index)} ref={(element) => { optionRefs.current[index] = element }} role="menuitemradio" type="button"><Icon name="calendar" size={15} /><span>{month.label.replace(' (Latest)', '')}</span>{index === 0 && <small>Latest</small>}{value === month.id && <Icon name="check" size={15} />}</button>)}</div>}
  </div>
}
