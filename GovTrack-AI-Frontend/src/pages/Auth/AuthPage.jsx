import { assistantBackground } from '../../assets'
import { AuthForm } from '../../components/auth/AuthForm'
import { Logo } from '../../components/layout/SiteHeader'
import './AuthPage.css'

export function AuthPage({ mode = 'login' }) {
  return (
    <main className="auth-page" style={{ '--auth-background': `url(${assistantBackground})` }}>
      <div className="auth-layout">
        <section aria-label="About GovTrack AI" className="auth-intro">
          <div className="auth-brand"><Logo government href="/" /><p>Transparent Projects. Stronger India.</p></div>
          <h1>Tracking Today<br />for a <span>Stronger Tomorrow</span></h1>
          <p className="auth-description">AI-powered insights for transparent, accountable and efficient infrastructure development across India.</p>
        </section>
        <AuthForm key={mode} mode={mode} />
      </div>
    </main>
  )
}
