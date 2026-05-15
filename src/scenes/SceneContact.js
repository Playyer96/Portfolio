import { useState, useEffect, useRef } from 'react';
import './SceneContact.css';
import GridBackground from '../ui/GridBackground';
import useConsoleLog from '../hooks/useConsoleLog';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { FiDownload, FiCopy, FiCheck } from 'react-icons/fi';
import { YEARS_MS, CAREER_START_FALLBACK, TIMEZONE_FALLBACK, COPY_RESET_MS } from '../constants';

const SOCIAL_ICONS = {
  GitHub:    { icon: <FaGithub />,    color: 'var(--pb-fg)' },
  LinkedIn:  { icon: <FaLinkedin />,  color: '#0a66c2' },
  Instagram: { icon: <FaInstagram />, color: '#e1306c' },
};

const SceneContact = ({ about = null }) => {
  const tz        = about?.timezone       || TIMEZONE_FALLBACK;
  const startDate = about?.careerStartDate || CAREER_START_FALLBACK;
  const email     = about?.email         || 'vanegasdanilo7@gmail.com';
  const cv        = about?.cv            || {};
  const yearsExp  = Math.floor((Date.now() - new Date(startDate).getTime()) / YEARS_MS);

  const [colTime, setColTime] = useState(() =>
    new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: tz })
  );
  useEffect(() => {
    const id = setInterval(() => {
      setColTime(new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: tz }));
    }, 1000);
    return () => clearInterval(id);
  }, [tz]);

  const [copied, setCopied] = useState(false);
  const emailRef = useRef(null);
  const { emit } = useConsoleLog();

  useEffect(() => {
    emit('info', '> Scene loaded: Contact');
  }, [emit]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      emit('ok', '✓ Email copied to clipboard');
      setTimeout(() => setCopied(false), COPY_RESET_MS);
    } catch {
      emit('error', '✗ Failed to copy email');
    }
  };

  const handleMagneticMove = (e) => {
    if (!emailRef.current) return;
    const rect    = emailRef.current.getBoundingClientRect();
    const dx      = (e.clientX - rect.left - rect.width  / 2) * 0.2;
    const dy      = (e.clientY - rect.top  - rect.height / 2) * 0.2;
    emailRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
  };
  const handleMagneticLeave = () => {
    if (emailRef.current) emailRef.current.style.transform = 'translate(0, 0)';
  };

  // Build socials list from DB, fallback to defaults
  const socials = about?.socials
    ? [
        ...about.socials.map(s => ({
          ...s,
          icon:  SOCIAL_ICONS[s.name]?.icon  || <FaGithub />,
          color: SOCIAL_ICONS[s.name]?.color || 'var(--pb-fg)',
        })),
        { name: 'CV', url: cv.path || '/CV-Danilo-Vanegas-2025.pdf', icon: <FiDownload />, color: 'var(--pb-accent)', download: true },
      ]
    : [
        { name: 'GitHub',    url: 'https://github.com/Playyer96',    ...SOCIAL_ICONS.GitHub },
        { name: 'LinkedIn',  url: 'https://linkedin.com/in/danisvs', ...SOCIAL_ICONS.LinkedIn },
        { name: 'Instagram', url: 'https://instagram.com/_dani.svs', ...SOCIAL_ICONS.Instagram },
        { name: 'CV',        url: '/CV-Danilo-Vanegas-2025.pdf',     icon: <FiDownload />,  color: 'var(--pb-accent)', download: true },
      ];

  return (
    <div className="scene-contact">
      <GridBackground />
      <div className="scene-content">
        <div className="contact-container">
          <h1 className="contact-heading">Get in Touch</h1>

          <div className="contact-card">
            <p className="contact-intro">
              {about?.contactIntro?.replace('{yearsExp}', yearsExp) || `${yearsExp}+ years across game dev, XR, and web. Looking for real problems to solve.`}
            </p>

            <div className="email-section">
              <p className="email-label">Email</p>
              <button
                ref={emailRef}
                className="email-button"
                onClick={handleCopyEmail}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
              >
                <span className="email-text">{email}</span>
                <span className="copy-inner">
                  {copied ? <FiCheck /> : <FiCopy />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </span>
              </button>
            </div>

            <div className="divider" />

            <div className="socials-section">
              <p className="socials-label">Find me on</p>
              <div className="socials-grid">
                {socials.map(social => (
                  <a
                    key={social.name}
                    href={social.url}
                    target={social.download ? undefined : '_blank'}
                    rel={social.download ? undefined : 'noopener noreferrer'}
                    download={social.download || undefined}
                    className="social-link"
                    style={{ '--social-color': social.color }}
                  >
                    <span className="social-icon">{social.icon}</span>
                    <span className="social-name">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="contact-footer">
            <p>Based in {about?.locationDisplay || 'Medellín, Antioquia - Colombia'}. Open to remote work and collaboration.</p>
            <p style={{ fontVariantNumeric: 'tabular-nums' }}>Local time: {colTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneContact;
