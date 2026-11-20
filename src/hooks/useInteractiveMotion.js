import { useEffect } from 'react';

/**
 * useInteractiveMotion
 * Implements:
 * - Enhancement 2: 3D Tilt & Radial Spotlight Bento Grid on existing cards
 * - Enhancement 4: Magnetic Buttons & Icons micro-interactions on curated CTAs
 *
 * Uses event delegation on document so dynamically rendered cards/buttons work
 * automatically with zero memory leaks and zero DOM restructuring.
 */
export function useInteractiveMotion() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    // Target selectors for 3D Tilt & Radial Spotlight Bento Cards
    const TILT_CARD_SELECTOR = [
      '.editorial-kpi-item',
      '.info-overview-editorial-card',
      '.ladang-pillar-card',
      '.gallery-card-item',
      '.insight-summary-card',
      '.food-bento-card',
      '.stunting-metric-card',
      '.pdam-metric-item',
      '.source-item-link',
      '.about-info-panel',
      '.about-contact-panel'
    ].join(', ');

    // Strict exclusion selector so maps, charts, tables, and modals are never tilted
    const EXCLUDED_CONTAINER_SELECTOR = [
      '.leaflet-container',
      '.map-main-panel',
      '.analysis-side-panel',
      '.chart-section-card',
      '.overview-kecamatan-card',
      '.toolbar-card',
      '.export-modal-box'
    ].join(', ');

    // Target selectors for Magnetic Buttons & Icons
    const MAGNETIC_BTN_SELECTOR = [
      '.nav-item-link',
      '.nav-login-btn',
      '.hero-edge-nav-btn',
      '.card-action-editorial-btn',
      '.btn-focus-map',
      '.btn-view-full-map',
      '.ladang-btn-export',
      '.sumber-data-link'
    ].join(', ');

    let activeTiltCard = null;
    let activeMagneticBtn = null;
    let tiltRafId = null;
    let magRafId = null;

    const resetTiltCard = (card) => {
      if (!card) return;
      card.classList.remove('is-tilting');
      card.style.setProperty('--tilt-rx', '0deg');
      card.style.setProperty('--tilt-ry', '0deg');
      card.style.setProperty('--tilt-shift-x', '0px');
      card.style.setProperty('--tilt-shift-y', '0px');
      card.style.setProperty('--tilt-shadow-x', '0px');
      card.style.setProperty('--tilt-shadow-y', '12px');
      card.style.setProperty('--spotlight-opacity', '0');
    };

    const resetMagneticBtn = (btn) => {
      if (!btn) return;
      btn.classList.remove('is-magnetic-active');
      btn.style.setProperty('--mag-x', '0px');
      btn.style.setProperty('--mag-y', '0px');
      btn.style.setProperty('--mag-icon-x', '0px');
      btn.style.setProperty('--mag-icon-y', '0px');
    };

    const handlePointerMove = (e) => {
      const vw = window.innerWidth;
      if (vw < 768) return;

      const isTablet = vw < 1024;
      const target = e.target;
      if (!target || typeof target.closest !== 'function') return;

      // --- 1. 3D TILT & RADIAL SPOTLIGHT BENTO GRID ---
      const candidateCard = target.closest(TILT_CARD_SELECTOR);
      const isExcluded = candidateCard && candidateCard.closest(EXCLUDED_CONTAINER_SELECTOR);
      const nextCard = candidateCard && !isExcluded ? candidateCard : null;

      if (activeTiltCard && activeTiltCard !== nextCard) {
        resetTiltCard(activeTiltCard);
        activeTiltCard = null;
      }

      if (nextCard) {
        activeTiltCard = nextCard;
        const clientX = e.clientX;
        const clientY = e.clientY;

        if (tiltRafId) window.cancelAnimationFrame(tiltRafId);
        tiltRafId = window.requestAnimationFrame(() => {
          if (!activeTiltCard) return;
          const rect = activeTiltCard.getBoundingClientRect();
          if (!rect.width || !rect.height) return;

          const relX = clientX - rect.left;
          const relY = clientY - rect.top;
          const normX = Math.max(-1, Math.min(1, (relX / rect.width - 0.5) * 2));
          const normY = Math.max(-1, Math.min(1, (relY / rect.height - 0.5) * 2));

          const isLargePanel =
            activeTiltCard.classList.contains('about-info-panel') ||
            activeTiltCard.classList.contains('about-contact-panel');
          const maxTilt = isLargePanel ? (isTablet ? 2.0 : 3.8) : isTablet ? 4.0 : 7.2;

          const rotateX = (-normY * maxTilt).toFixed(2);
          const rotateY = (normX * maxTilt).toFixed(2);
          const shiftX = (normX * 7).toFixed(2);
          const shiftY = (normY * 7).toFixed(2);
          const shadowX = (-normX * 12).toFixed(1);
          const shadowY = (16 + normY * 10).toFixed(1);

          activeTiltCard.classList.add('is-tilting');
          activeTiltCard.style.setProperty('--spotlight-x', `${relX.toFixed(1)}px`);
          activeTiltCard.style.setProperty('--spotlight-y', `${relY.toFixed(1)}px`);
          activeTiltCard.style.setProperty('--spotlight-opacity', '1');
          activeTiltCard.style.setProperty('--tilt-rx', `${rotateX}deg`);
          activeTiltCard.style.setProperty('--tilt-ry', `${rotateY}deg`);
          activeTiltCard.style.setProperty('--tilt-shift-x', `${shiftX}px`);
          activeTiltCard.style.setProperty('--tilt-shift-y', `${shiftY}px`);
          activeTiltCard.style.setProperty('--tilt-shadow-x', `${shadowX}px`);
          activeTiltCard.style.setProperty('--tilt-shadow-y', `${shadowY}px`);
        });
      }

      // --- 2. MAGNETIC BUTTONS & ICONS ---
      const nextBtn = target.closest(MAGNETIC_BTN_SELECTOR);

      if (activeMagneticBtn && activeMagneticBtn !== nextBtn) {
        resetMagneticBtn(activeMagneticBtn);
        activeMagneticBtn = null;
      }

      if (nextBtn && !isTablet) {
        activeMagneticBtn = nextBtn;
        const clientX = e.clientX;
        const clientY = e.clientY;

        if (magRafId) window.cancelAnimationFrame(magRafId);
        magRafId = window.requestAnimationFrame(() => {
          if (!activeMagneticBtn) return;
          const rect = activeMagneticBtn.getBoundingClientRect();
          if (!rect.width || !rect.height) return;

          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const deltaX = clientX - centerX;
          const deltaY = clientY - centerY;

          const pullFactor = 0.24;
          const iconFactor = 0.14;
          const magX = Math.max(-6, Math.min(6, deltaX * pullFactor));
          const magY = Math.max(-4, Math.min(4, deltaY * pullFactor));
          const iconX = Math.max(-3.5, Math.min(3.5, deltaX * iconFactor));
          const iconY = Math.max(-2.5, Math.min(2.5, deltaY * iconFactor));

          activeMagneticBtn.classList.add('is-magnetic-active');
          activeMagneticBtn.style.setProperty('--mag-x', `${magX.toFixed(2)}px`);
          activeMagneticBtn.style.setProperty('--mag-y', `${magY.toFixed(2)}px`);
          activeMagneticBtn.style.setProperty('--mag-icon-x', `${iconX.toFixed(2)}px`);
          activeMagneticBtn.style.setProperty('--mag-icon-y', `${iconY.toFixed(2)}px`);
        });
      }
    };

    const handleWindowBlur = () => {
      if (activeTiltCard) {
        resetTiltCard(activeTiltCard);
        activeTiltCard = null;
      }
      if (activeMagneticBtn) {
        resetMagneticBtn(activeMagneticBtn);
        activeMagneticBtn = null;
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('scroll', handleWindowBlur, { passive: true });

    return () => {
      if (tiltRafId) window.cancelAnimationFrame(tiltRafId);
      if (magRafId) window.cancelAnimationFrame(magRafId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('scroll', handleWindowBlur);
      handleWindowBlur();
    };
  }, []);
}
