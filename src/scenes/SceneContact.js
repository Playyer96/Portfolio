import { useState, useEffect, useRef } from 'react';
import './SceneContact.css';
import GridBackground from '../ui/GridBackground';
import useConsoleLog from '../hooks/useConsoleLog';

const SceneContact = () => {
  const [copied, setCopied] = useState(false);
  const emailRef = useRef(null);
  const { emit } = useConsoleLog();
  const email = 'vanegasdanilo7@gmail.com';

  useEffect(() => {
    emit('info', '> Scene loaded: Contact');
  }, [emit]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      emit('ok', '✓ Email copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      emit('error', '✗ Failed to copy email');
    }
  };

  const handleMagneticButton = (e) => {
    if (!emailRef.current) return;

    const rect = emailRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = (e.clientX - centerX) * 0.2;
    const dy = (e.clientY - centerY) * 0.2;

    emailRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  const handleMagneticLeave = () => {
    if (emailRef.current) {
      emailRef.current.style.transform = 'translate(0, 0)';
    }
  };

  const socials = [
    {
      name: 'GitHub',
      url: 'https://github.com/danivanegas',
      icon: '🐙',
      color: '#000',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/danilo-vanegas',
      icon: '💼',
      color: '#0a66c2',
    },
    {
      name: 'X / Twitter',
      url: 'https://x.com',
      icon: '𝕏',
      color: '#000',
    },
    {
      name: 'Download CV',
      url: '/CV-Danilo-Vanegas-2025.pdf',
      icon: '📄',
      color: '#f59e0b',
      download: true,
    },
  ];

  return (
    <div className="scene-contact">
      <GridBackground />
      <div className="scene-content">
        <div className="contact-container">
          <h1 className="contact-heading">Get in Touch</h1>

          <div className="contact-card">
            <p className="contact-intro">
              Building software that matters. Interested in collaboration or just want to chat?
            </p>

            <div className="email-section">
              <p className="email-label">Email</p>
              <button
                ref={emailRef}
                className="email-button"
                onClick={handleCopyEmail}
                onMouseMove={handleMagneticButton}
                onMouseLeave={handleMagneticLeave}
              >
                <span className="email-text">{email}</span>
                <span className="copy-indicator">
                  {copied ? '✓ Copied' : '📋 Copy'}
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
                    download={social.download ? 'CV-Danilo-Vanegas-2025.pdf' : undefined}
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
            <p>Based in Colombia, UTC-5. Open to remote work and collaboration.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneContact;
