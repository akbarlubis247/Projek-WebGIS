import React, { useEffect, useRef, useState } from 'react';

/**
 * CustomCursorFollower
 * Enhancement 1: Smooth dual-element cursor follower (dot + lagged ring) for desktop devices
 * with fine pointer capability. Respects prefers-reduced-motion and automatically hides
 * over WebGIS Leaflet map canvases and native form controls so GIS interaction stays unobstructed.
 */
export default function CustomCursorFollower() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const finePointerMq = window.matchMedia('(pointer: fine) and (hover: hover)');
    const reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateCapability = () => {
      const canUse = finePointerMq.matches && !reducedMotionMq.matches && window.innerWidth >= 900;
      setEnabled(canUse);
    };

    updateCapability();
    finePointerMq.addEventListener?.('change', updateCapability);
    reducedMotionMq.addEventListener?.('change', updateCapability);
    window.addEventListener('resize', updateCapability, { passive: true });

    return () => {
      finePointerMq.removeEventListener?.('change', updateCapability);
      reducedMotionMq.removeEventListener?.('change', updateCapability);
      window.removeEventListener('resize', updateCapability);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;
    let isVisible = false;
    let isSuppressed = false;
    let rafId = null;

    const SUPPRESSED_SELECTOR =
      '.leaflet-container, .leaflet-control, input, textarea, select, [data-cursor-suppress="true"]';
    const BUTTON_SELECTOR =
      'button, [role="button"].btn-view-full-map, .ladang-btn-export, .nav-login-btn, .hero-edge-nav-btn, .btn-focus-map, .card-action-editorial-btn';
    const LINK_SELECTOR =
      'a, .nav-item-link, .nav-brand, .source-item-link, .sumber-data-link';
    const CARD_SELECTOR =
      '.info-overview-editorial-card, .ladang-pillar-card, .editorial-kpi-item, .gallery-card-item, .insight-summary-card, .food-bento-card, .stunting-metric-card';

    const setCursorState = (stateName) => {
      ring.dataset.state = stateName;
      dot.dataset.state = stateName;
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        dotX = mouseX;
        dotY = mouseY;
        ringX = mouseX;
        ringY = mouseY;
        dot.classList.add('is-visible');
        ring.classList.add('is-visible');
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || typeof target.closest !== 'function') return;

      if (target.closest(SUPPRESSED_SELECTOR)) {
        isSuppressed = true;
        dot.classList.add('is-suppressed');
        ring.classList.add('is-suppressed');
        return;
      }

      if (isSuppressed) {
        isSuppressed = false;
        dot.classList.remove('is-suppressed');
        ring.classList.remove('is-suppressed');
      }

      if (target.closest(BUTTON_SELECTOR)) {
        setCursorState('button');
      } else if (target.closest(LINK_SELECTOR)) {
        setCursorState('link');
      } else if (target.closest(CARD_SELECTOR)) {
        setCursorState('card');
      } else {
        setCursorState('default');
      }
    };

    const handleMouseDown = () => {
      dot.classList.add('is-pressed');
      ring.classList.add('is-pressed');
    };

    const handleMouseUp = () => {
      dot.classList.remove('is-pressed');
      ring.classList.remove('is-pressed');
    };

    const handleMouseLeaveWindow = () => {
      isVisible = false;
      dot.classList.remove('is-visible');
      ring.classList.remove('is-visible');
    };

    const renderLoop = () => {
      dotX += (mouseX - dotX) * 0.34;
      dotY += (mouseY - dotY) * 0.34;
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      dot.style.transform = `translate3d(${dotX.toFixed(2)}px, ${dotY.toFixed(2)}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0) translate(-50%, -50%)`;

      rafId = window.requestAnimationFrame(renderLoop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeaveWindow, { passive: true });
    rafId = window.requestAnimationFrame(renderLoop);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeaveWindow);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="nutrimap-cursor-layer" aria-hidden="true">
      <div ref={ringRef} className="nutrimap-cursor-ring" data-state="default" />
      <div ref={dotRef} className="nutrimap-cursor-dot" data-state="default" />
    </div>
  );
}
