import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './CustomCursor.css';

const INTERACTIVE = 'a, button, [role="button"], label, select, summary, [tabindex]:not([tabindex="-1"])';
const TEXT = 'input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="number"], input[type="url"], textarea, [contenteditable]';

const CustomCursor = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let state = 'default';

    const set = (next) => {
      if (state === next) return;
      state = next;
      el.dataset.state = next;
    };

    const onMove = (e) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    };

    const onOver = (e) => {
      const t = e.target;
      if (t.closest(TEXT)) { set('text'); return; }
      if (t.closest(INTERACTIVE)) { set('hover'); return; }
      const comp = window.getComputedStyle(t).cursor;
      if (comp === 'text') { set('text'); return; }
      if (comp === 'pointer') { set('hover'); return; }
      if (comp === 'wait' || comp === 'progress') { set('loading'); return; }
      set('default');
    };

    const onDown = () => set(state === 'hover' ? 'click-hover' : 'click');

    const onUp = (e) => {
      const t = e.target;
      if (t.closest(TEXT)) { set('text'); return; }
      if (t.closest(INTERACTIVE)) { set('hover'); return; }
      set('default');
    };

    const hide = () => { el.style.opacity = '0'; };
    const show = () => { el.style.opacity = '1'; };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', hide);
    document.documentElement.addEventListener('mouseenter', show);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', hide);
      document.documentElement.removeEventListener('mouseenter', show);
    };
  }, []);

  return ReactDOM.createPortal(
    <div ref={ref} className="cc" data-state="default" />,
    document.body
  );
};

export default CustomCursor;
