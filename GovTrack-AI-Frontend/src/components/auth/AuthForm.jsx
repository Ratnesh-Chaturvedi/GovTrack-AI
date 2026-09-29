import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '../common/Icon'

function AuthField({ autoComplete, icon, label, name, placeholder, reveal = false, type = 'text' }) {
  const [visible, setVisible] = useState(false)
  const inputType = reveal && visible ? 'text' : type

  return (
    <label className="auth-field">
      <span>{label}</span>
      <span className="auth-input-wrap">
        <Icon name={icon} size={16} />
        <input autoComplete={autoComplete} minLength={reveal ? 8 : undefined} name={name} placeholder={placeholder} required type={inputType} />
        {reveal && <button aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} aria-pressed={visible} className="auth-password-toggle" onClick={() => setVisible((current) => !current)} type="button"><Icon name={visible ? 'eyeOff' : 'eye'} size={17} /></button>}
      </span>
    </label>
  )
}

const copy = {
  login: { title: 'Welcome Back', subtitle: 'Sign in to continue to GovTrack AI', action: 'Sign In' },
  signup: { title: 'Create an Account', subtitle: 'Start tracking public projects with GovTrack AI', action: 'Create Account' },
  reset: { title: 'Reset Password', subtitle: 'Enter your email address to reset your password', action: 'Send Reset Link' },
}

export function AuthForm({ mode }) {
  const [feedback, setFeedback] = useState(null)
  const navigate = useNavigate()
  const isLogin = mode === 'login'
  const isSignup = mode === 'signup'

  const handleSubmit = (event) => {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    if (isSignup && values.get('password') !== values.get('confirmPassword')) {
      setFeedback({ error: true, message: 'Passwords do not match.' })
      return
    }
    if (isLogin) {
      const email = String(values.get('email') ?? '')
      const firstPart = email.split('@')[0].split(/[._-]/)[0]
      const name = firstPart ? firstPart.charAt(0).toUpperCase() + firstPart.slice(1) : 'Ratnesh'
      window.sessionStorage.setItem('govtrackDemoUser', JSON.stringify({ name, email }))
      navigate('/dashboard')
      return
    }
    const message = mode === 'reset'
      ? 'Password reset is not connected yet. No email was sent.'
      : 'This is a preview. Authentication is not connected yet.'
    setFeedback({ error: false, message })
    event.currentTarget.reset()
  }

  return (
    <section aria-labelledby="auth-form-title" className="auth-card">
      <div className="auth-card-heading">
        <h2 id="auth-form-title">{copy[mode].title}</h2>
        <p>{copy[mode].subtitle}</p>
      </div>

      <form onSubmit={handleSubmit}>
        {isSignup && <AuthField autoComplete="name" icon="user" label="Full Name" name="name" placeholder="Enter your full name" />}
        <AuthField autoComplete="email" icon="mail" label="Email Address" name="email" placeholder="Enter your email" type="email" />
        {mode !== 'reset' && <AuthField autoComplete={isSignup ? 'new-password' : 'current-password'} icon="lock" label="Password" name="password" placeholder="Enter your password" reveal type="password" />}
        {isSignup && <AuthField autoComplete="new-password" icon="lock" label="Confirm Password" name="confirmPassword" placeholder="Confirm your password" reveal type="password" />}
        {isLogin && <Link className="auth-forgot" to="/forgot-password">Forgot password?</Link>}
        <button className="auth-submit" type="submit">{copy[mode].action}<Icon name="arrowRight" size={19} /></button>
      </form>

      {feedback && <p className={`auth-feedback${feedback.error ? ' is-error' : ''}`} role={feedback.error ? 'alert' : 'status'}>{feedback.message}</p>}

      {mode !== 'reset' && <>
        <div aria-hidden="true" className="auth-divider"><span>OR</span></div>
        <button className="auth-google" onClick={() => setFeedback({ error: false, message: 'Google sign-in is not connected yet.' })} type="button"><span aria-hidden="true" className="auth-google-mark">G</span> Continue with Google</button>
      </>}

      <p className="auth-switch">
        {isLogin && <>Don&apos;t have an account? <Link to="/signup">Create an account</Link></>}
        {isSignup && <>Already have an account? <Link to="/login">Sign in</Link></>}
        {mode === 'reset' && <Link to="/login">Back to sign in</Link>}
      </p>
    </section>
  )
}
