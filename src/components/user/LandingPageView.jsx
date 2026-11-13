import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  MapPin,
  Utensils,
  Droplets,
  HeartPulse,
  Calendar,
  Layers,
  Search,
  Filter,
  FileSpreadsheet,
  CheckCircle2,
  Building2,
  Users,
  ChevronRight,
  Mail,
  Phone,
  BarChart3,
  Sparkles,
  Sprout,
  ShieldCheck,
  Award,
  ExternalLink,
  Info,
  Store,
  FileEdit,
  Clock
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import MapView from '../common/MapView';
import {
  KOTA_BOGOR_STATS,
  KECAMATAN_KOTA_BOGOR,
  FOOD_SECURITY_CATEGORIES
} from '../../data/bogorData';
import { LAYER_DEFINITIONS, getIndicatorClassification } from '../../data/indicatorStandards';
import { useNutriMapData } from '../../hooks/useNutriMapData';
import heroBg from '../../assets/hero-banner.png';
import HeroSlider from './HeroSlider';
import NutriMapOverviewCards from './NutriMapOverviewCards';
import pdamFacilityImg from '../../assets/pdam-facility.jpg';
import stuntingImg from '../../assets/stunting-prevention.jpg';
import foodInspectionImg from '../../assets/food-inspection.jpg';
import { CountUp } from 'countup.js';
import { getPublicContent } from '../../data/defaultPublicContent';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function LandingPageView({ onOpenLogin, onSelectKecamatan, currentUser, onNavigate }) {
  const { areasGeoJson, kelurahanList, facilitiesGeoJson } = useNutriMapData();
  const [content, setContent] = useState(getPublicContent());
  const [selectedKec, setSelectedKec] = useState(null);
  const [selectedKel, setSelectedKel] = useState(null);
  const [activeMapLayer, setActiveMapLayer] = useState('stunting');
  const [panelKecTab, setPanelKecTab] = useState('Semua');
  const [panelKelSearch, setPanelKelSearch] = useState('');
  const [searchTable, setSearchTable] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [activeChartMetric, setActiveChartMetric] = useState('panganSkor');
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleContentUpdate = () => {
      setContent(getPublicContent());
    };
    window.addEventListener('nutrimap_content_updated', handleContentUpdate);
    return () => window.removeEventListener('nutrimap_content_updated', handleContentUpdate);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GSAP Root Container Ref
  const landingRef = useRef(null);

  // CountUp Refs: 4 Pilar Cards
  const ikpCountRef = useRef(null);
  const airBersihCountRef = useRef(null);
  const stuntingCountRef = useRef(null);
  // CountUp Refs: PDAM Spotlight
  const pdamAirCountRef = useRef(null);
  const pdamDebitCountRef = useRef(null);
  const pdamSRCountRef = useRef(null);
  // CountUp Refs: Stunting Spotlight
  const stuntingSpotCountRef = useRef(null);
  const posyanduCountRef = useRef(null);
  // CountUp Refs: Food Spotlight
  const foodAuditCountRef = useRef(null);
  const foodLolosCountRef = useRef(null);
  const foodPasarCountRef = useRef(null);
  // CountUp Refs: Analysis Side Panel (re-animates on kecamatan change)
  const sideIkpRef = useRef(null);
  const sideAirRef = useRef(null);
  const sideStuntingRef = useRef(null);
  const sidePendudukRef = useRef(null);
  const countUpAnimatedRef = useRef(false);

  // Filtered Table Data for Data Indikator Section
  const filteredData = KECAMATAN_KOTA_BOGOR.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchTable.toLowerCase()) ||
      item.pusat.toLowerCase().includes(searchTable.toLowerCase());
    const matchStatus = filterStatus === 'Semua Status' || item.panganStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  // GSAP Smooth Modern Entrance & Scroll Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Entrance Timeline (Loads when page opens)
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      heroTl.fromTo(
        '.hero-slider-section',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
      );

      // 2. Manifesto ScrollTrigger Reveal (Staggered Soft Fade-Up)
      const manifestoBox = document.querySelector('.ladang-manifesto-inner');
      if (manifestoBox) {
        const manifestoItems = manifestoBox.querySelectorAll('.ladang-pill-badge, .ladang-manifesto-title, .ladang-manifesto-text');
        const mTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.ladang-manifesto-section',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
        mTl.fromTo(
          manifestoItems,
          { y: 24, opacity: 0, filter: 'blur(4px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.85,
            stagger: 0.12,
            ease: 'power2.out'
          }
        );
      }

      // 3. Section Headers Reveal Animation (Smooth Staggered Soft Fade-Up)
      const sectionHeads = gsap.utils.toArray('.ladang-section-head');
      sectionHeads.forEach((head) => {
        const textElements = head.querySelectorAll('h2, p');

        const sTl = gsap.timeline({
          scrollTrigger: {
            trigger: head,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        });

        sTl.fromTo(
          textElements,
          { y: 22, opacity: 0, filter: 'blur(4px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.12,
            ease: 'power2.out'
          }
        );
      });

      // 4. 4 Pillars Staggered Reveal
      gsap.fromTo(
        '.ladang-pillar-card',
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.ladang-pillars-grid',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // 4a. CountUp.js for ALL KPI stats on this page
      //     Pilar cards triggered by pillars-grid, spotlights by their own boxes
      const startCountUp = (ref, endVal, opts) => {
        if (!ref.current) return;
        const cu = new CountUp(ref.current, endVal, { startVal: 0, useEasing: true, duration: 1.3, ...opts });
        if (!cu.error) cu.start();
      };

      // -- Pilar Cards --
      ScrollTrigger.create({
        trigger: '.ladang-pillars-grid',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          if (countUpAnimatedRef.current) return;
          countUpAnimatedRef.current = true;

          // Pilar 1: IKP score
          startCountUp(ikpCountRef, KOTA_BOGOR_STATS.skorIKP, { decimalPlaces: 1, duration: 1.4 });

          // Pilar 2: Air Bersih %
          const targetAir = parseFloat(KOTA_BOGOR_STATS.aksesAirBersih) || 89.6;
          startCountUp(airBersihCountRef, targetAir, {
            decimalPlaces: 1, suffix: '%', duration: 1.3,
            formattingFn: (n) => (n <= 0.05 ? '0%' : n.toFixed(1) + '%')
          });

          // Pilar 3: Stunting %
          const targetStunting = parseFloat(KOTA_BOGOR_STATS.prevalensiStunting) || 15.4;
          startCountUp(stuntingCountRef, targetStunting, {
            decimalPlaces: 1, suffix: '%', duration: 1.3,
            formattingFn: (n) => (n <= 0.05 ? '0%' : n.toFixed(1) + '%')
          });
        }
      });

      // -- PDAM Spotlight --
      ScrollTrigger.create({
        trigger: '.gsap-pdam-box',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          startCountUp(pdamAirCountRef, 89.6, {
            decimalPlaces: 1, suffix: '%', duration: 1.3,
            formattingFn: (n) => (n <= 0.05 ? '0%' : n.toFixed(1) + '%')
          });
          // "2.400 L/s" → animate 0 → 2400 formatted as id-ID
          startCountUp(pdamDebitCountRef, 2400, {
            duration: 1.3,
            formattingFn: (n) => Math.round(n).toLocaleString('id-ID') + ' L/s'
          });
          startCountUp(pdamSRCountRef, 170000, {
            separator: '.', duration: 1.4, suffix: '+',
            formattingFn: (n) => Math.round(n).toLocaleString('id-ID') + '+'
          });
        }
      });

      // -- Stunting Spotlight --
      ScrollTrigger.create({
        trigger: '.gsap-stunting-box',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const tStunt = parseFloat(KOTA_BOGOR_STATS.prevalensiStunting) || 15.4;
          startCountUp(stuntingSpotCountRef, tStunt, {
            decimalPlaces: 1, suffix: '%', duration: 1.3,
            formattingFn: (n) => (n <= 0.05 ? '0%' : n.toFixed(1) + '%')
          });
          startCountUp(posyanduCountRef, 863, {
            duration: 1.3, suffix: '+'
          });
        }
      });

      // -- Food Spotlight --
      ScrollTrigger.create({
        trigger: '.gsap-food-box',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          startCountUp(foodAuditCountRef, 48, { duration: 1.2, suffix: ' Lokasi' });
          startCountUp(foodLolosCountRef, 96, { duration: 1.2, suffix: '% Lolos' });
          startCountUp(foodPasarCountRef, 4, { duration: 1.0, suffix: ' Pasar' });
        }
      });

      // 4. Comparison Table Card Reveal
      gsap.fromTo(
        '.gsap-table-box',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.gsap-table-box',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // -- Matriks Table: CountUp on all numeric cells --
      ScrollTrigger.create({
        trigger: '.gsap-table-box',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          // IKP skor (data-val, class kec-ikp-num)
          document.querySelectorAll('.kec-ikp-num').forEach((el) => {
            const val = parseFloat(el.dataset.val);
            if (isNaN(val)) return;
            const cu = new CountUp(el, val, { startVal: 0, decimalPlaces: 1, duration: 1.2, useEasing: true });
            if (!cu.error) cu.start();
          });
          // Air Bersih % (class kec-air-num)
          document.querySelectorAll('.kec-air-num').forEach((el) => {
            const val = parseFloat(el.dataset.val);
            if (isNaN(val)) return;
            const cu = new CountUp(el, val, {
              startVal: 0, decimalPlaces: 1, duration: 1.2, useEasing: true,
              formattingFn: (n) => n.toFixed(1) + '%'
            });
            if (!cu.error) cu.start();
          });
          // Stunting % (class kec-stunting-num)
          document.querySelectorAll('.kec-stunting-num').forEach((el) => {
            const val = parseFloat(el.dataset.val);
            if (isNaN(val)) return;
            const cu = new CountUp(el, val, {
              startVal: 0, decimalPlaces: 1, duration: 1.2, useEasing: true,
              formattingFn: (n) => n.toFixed(1) + '%'
            });
            if (!cu.error) cu.start();
          });
        }
      });

      // 4b. PDAM Spotlight Card Reveal
      gsap.fromTo(
        '.gsap-pdam-box',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.gsap-pdam-box',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // 4c. Stunting Spotlight Card Reveal
      gsap.fromTo(
        '.gsap-stunting-box',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.gsap-stunting-box',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // 4d. Food Safety Spotlight Card Reveal
      gsap.fromTo(
        '.gsap-food-box',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.gsap-food-box',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // 5. Spatial Map & Side Panel Reveal
      gsap.fromTo(
        '.map-main-panel',
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#peta-spasial',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo(
        '.analysis-side-panel',
        { x: 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#peta-spasial',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // 6. Data Indicator Toolbar & Chart Section Reveal
      gsap.fromTo(
        '.gsap-data-section',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#data-indikator',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // 7. About Section Reveal
      gsap.fromTo(
        '.about-split-grid > div',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.16,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#tentang-nutrimap',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }, landingRef);

    return () => ctx.revert();
  }, []);

  // Side Panel CountUp: re-animate whenever user selects a different kecamatan or views all
  useEffect(() => {
    const animSidePanel = (ref, val, opts = {}) => {
      if (!ref.current) return;
      const cu = new CountUp(ref.current, val, { startVal: 0, useEasing: true, duration: 1.1, ...opts });
      if (!cu.error) cu.start();
    };
    if (selectedKec) {
      animSidePanel(sideIkpRef, selectedKec.panganSkor, { decimalPlaces: 1 });
      animSidePanel(sideAirRef, selectedKec.airBersih, {
        decimalPlaces: 1,
        formattingFn: (n) => n.toFixed(1) + '%'
      });
      animSidePanel(sideStuntingRef, selectedKec.stunting, {
        decimalPlaces: 1,
        formattingFn: (n) => n.toFixed(1) + '%'
      });
      animSidePanel(sidePendudukRef, selectedKec.penduduk, {
        formattingFn: (n) => Math.round(n).toLocaleString('id-ID') + ' jiwa'
      });
    } else {
      animSidePanel(sideIkpRef, KOTA_BOGOR_STATS.skorIKP || 88.2, { decimalPlaces: 1 });
      animSidePanel(sideAirRef, parseFloat(KOTA_BOGOR_STATS.aksesAirBersih) || 89.6, {
        decimalPlaces: 1,
        formattingFn: (n) => n.toFixed(1) + '%'
      });
      animSidePanel(sideStuntingRef, parseFloat(KOTA_BOGOR_STATS.prevalensiStunting) || 15.4, {
        decimalPlaces: 1,
        formattingFn: (n) => n.toFixed(1) + '%'
      });
      animSidePanel(sidePendudukRef, 1092800, {
        formattingFn: (n) => Math.round(n).toLocaleString('id-ID') + ' jiwa'
      });
    }
  }, [selectedKec]);

  const handleScrollToMap = (targetKec = null) => {
    if (targetKec) {
      setSelectedKec(targetKec);
      setSelectedKel(null);
    }
    const el = document.getElementById('peta-spasial');
    if (el) {
      const headerOffset = 96;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleScrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const headerOffset = 96;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,ID,Nama Kecamatan,Pusat,Penduduk,Status Pangan,Skor IKP,Air Bersih (%),Stunting (%),Kemiskinan,Faskes\n";
    filteredData.forEach(row => {
      csvContent += `${row.id},"${row.nama}","${row.pusat}",${row.penduduk},"${row.panganStatus}",${row.panganSkor},${row.airBersih},${row.stunting},"${row.tingkatKemiskinan}",${row.faskes}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NutriMap_Kota_Bogor_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="landing-single-page" ref={landingRef}>
      {/* SECTION 1: HERO BANNER CAROUSEL SLIDER */}
      <section id="beranda" className="hero-slider-section">
        <HeroSlider
          onActionClick={(layer) => {
            if (layer) setActiveMapLayer(layer);
            handleScrollToMap();
          }}
        />
      </section>

      {/* SECTION 1B: JELAJAHI INFORMASI NUTRIMAP (3 CARDS) */}
      <NutriMapOverviewCards
        onSelectCategory={(layer) => {
          if (layer) setActiveMapLayer(layer);
          handleScrollToMap();
        }}
      />

      {/* SECTION 2: EDITORIAL MANIFESTO STRIP (WARM LINEN STYLE) */}
      <section className="ladang-manifesto-section">
        <div className="ladang-manifesto-inner gsap-manifesto">
          <h2 className="ladang-manifesto-title">
            {content.manifesto.title}
          </h2>
          <p className="ladang-manifesto-text">
            {content.manifesto.text}
          </p>
        </div>
      </section>

      {/* SECTION 3: 4 PILAR INDIKATOR UTAMA (ORGANIC METRIC CARDS) */}
      <section className="ladang-pillars-section">
        <div className="ladang-section-head">
          <h2>
            {content.pillars.sectionTitle}
          </h2>
          <p>{content.pillars.sectionSubtitle}</p>
        </div>

        <div className="ladang-pillars-grid">
          {/* Pilar 1: IKP */}
          <div className="ladang-pillar-card p-green">
            <div className="pillar-top">
              <div className="pillar-icon-box">
                <Utensils size={20} />
              </div>
              <span className="pillar-badge badge-green">{content.pillars.ikp.badge}</span>
            </div>
            <div className="pillar-main">
              <span className="pillar-label">{content.pillars.ikp.label}</span>
              <div className="pillar-val-row">
                <span className="pillar-val" ref={ikpCountRef}>{content.pillars.ikp.value}</span>
                <span className="pillar-unit">{content.pillars.ikp.unit}</span>
              </div>
              <div className="pillar-track">
                <div className="pillar-fill fill-green" style={{ width: `${parseFloat(content.pillars.ikp.value) || 88.2}%` }} />
              </div>
            </div>
          </div>

          {/* Pilar 2: Air Bersih */}
          <div className="ladang-pillar-card p-teal">
            <div className="pillar-top">
              <div className="pillar-icon-box">
                <Droplets size={20} />
              </div>
              <span className="pillar-badge badge-teal">{content.pillars.air.badge}</span>
            </div>
            <div className="pillar-main">
              <span className="pillar-label">{content.pillars.air.label}</span>
              <div className="pillar-val-row">
                <span className="pillar-val" ref={airBersihCountRef}>
                  {countUpAnimatedRef.current ? content.pillars.air.value : '0%'}
                </span>
              </div>
              <div className="pillar-track">
                <div className="pillar-fill fill-teal" style={{ width: `${parseFloat(content.pillars.air.value) || 89.6}%` }} />
              </div>
            </div>
          </div>

          {/* Pilar 3: Stunting */}
          <div className="ladang-pillar-card p-terracotta">
            <div className="pillar-top">
              <div className="pillar-icon-box">
                <HeartPulse size={20} />
              </div>
              <span className="pillar-badge badge-terracotta">{content.pillars.stunting.badge}</span>
            </div>
            <div className="pillar-main">
              <span className="pillar-label">{content.pillars.stunting.label}</span>
              <div className="pillar-val-row">
                <span className="pillar-val" ref={stuntingCountRef}>
                  {countUpAnimatedRef.current ? content.pillars.stunting.value : '0%'}
                </span>
              </div>
              <div className="pillar-track">
                <div className="pillar-fill fill-terracotta" style={{ width: `${parseFloat(content.pillars.stunting.value) || 15.4}%` }} />
              </div>
            </div>
          </div>

          {/* Pilar 4: Fasilitas & Pasar */}
          <div className="ladang-pillar-card p-earth">
            <div className="pillar-top">
              <div className="pillar-icon-box">
                <Building2 size={20} />
              </div>
              <span className="pillar-badge badge-earth">{content.pillars.pasar.badge}</span>
            </div>
            <div className="pillar-main">
              <span className="pillar-label">{content.pillars.pasar.label}</span>
              <div className="pillar-val-row">
                <span className="pillar-val">{content.pillars.pasar.value}</span>
                <span className="pillar-unit" style={{ fontSize: 13, marginLeft: 4 }}>{content.pillars.pasar.unit}</span>
              </div>
              <div className="pillar-track">
                <div className="pillar-fill fill-earth" style={{ width: `${parseFloat(content.pillars.pasar.value) || 96}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* SPOTLIGHT INFRASTRUKTUR AIR BERSIH (PDAM TIRTA PAKUAN) */}
        <div className="ladang-card-box pdam-spotlight-card gsap-pdam-box">
          <div className="pdam-spotlight-grid">
            <div className="pdam-media-column">
              <div className="pdam-media-frame">
                <img
                  src={content.images?.pdamFacility || pdamFacilityImg}
                  alt="Instalasi Pengolahan Air Bersih PDAM Tirta Pakuan Kota Bogor"
                  className="pdam-media-img"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="pdam-content-column">
              <h3 className="pdam-headline">
                {content.spotlightPdam.headline}
              </h3>

              <p className="pdam-description">
                {content.spotlightPdam.description}
              </p>

              <div className="pdam-key-metrics">
                <div className="pdam-metric-item">
                  <span className="pmi-val" ref={pdamAirCountRef}>{content.spotlightPdam.metric1Val}</span>
                  <span className="pmi-lbl">{content.spotlightPdam.metric1Lbl}</span>
                </div>
                <div className="pdam-metric-separator" />
                <div className="pdam-metric-item">
                  <span className="pmi-val" ref={pdamDebitCountRef}>{content.spotlightPdam.metric2Val}</span>
                  <span className="pmi-lbl">{content.spotlightPdam.metric2Lbl}</span>
                </div>
                <div className="pdam-metric-separator" />
                <div className="pdam-metric-item">
                  <span className="pmi-val" ref={pdamSRCountRef}>{content.spotlightPdam.metric3Val}</span>
                  <span className="pmi-lbl">{content.spotlightPdam.metric3Lbl}</span>
                </div>
              </div>

              <div className="pdam-footer-row">
                <button
                  type="button"
                  className="btn-pdam-explore"
                  onClick={() => handleScrollToMap()}
                >
                  <MapPin size={15} />
                  <span>{content.spotlightPdam.buttonText}</span>
                </button>
                <span className="pdam-source-text">{content.spotlightPdam.sourceText}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SPOTLIGHT SOSIALISASI PENCEGAHAN STUNTING KOTA BOGOR (REVERSED LAYOUT) */}
        <div className="ladang-card-box stunting-spotlight-card gsap-stunting-box">
          <div className="stunting-spotlight-grid">
            <div className="stunting-content-column">
              <h3 className="stunting-headline">
                {content.spotlightStunting.headline}
              </h3>

              <p className="stunting-description">
                {content.spotlightStunting.description}
              </p>

              <div className="stunting-split-metrics">
                <div className="stunting-metric-card">
                  <div className="smc-header">
                    <span className="smc-val" ref={stuntingSpotCountRef}>{content.spotlightStunting.targetVal}</span>
                    <span className="smc-badge-pill">{content.spotlightStunting.targetLbl}</span>
                  </div>
                  <span className="smc-lbl">{content.spotlightStunting.subTargetLbl}</span>
                </div>
                <div className="stunting-metric-card">
                  <div className="smc-header">
                    <span className="smc-val" ref={posyanduCountRef}>{content.spotlightStunting.posyanduVal}</span>
                    <span className="smc-badge-pill">{content.spotlightStunting.posyanduLbl}</span>
                  </div>
                  <span className="smc-lbl">{content.spotlightStunting.subPosyanduLbl}</span>
                </div>
              </div>


              <div className="stunting-footer-row">
                <button
                  type="button"
                  className="btn-stunting-explore"
                  onClick={() => {
                    setActiveChartMetric('stunting');
                    handleScrollToSection('data-indikator');
                  }}
                >
                  <HeartPulse size={15} />
                  <span>{content.spotlightStunting.buttonText}</span>
                </button>
                <span className="stunting-source-text">{content.spotlightStunting.sourceText}</span>
              </div>
            </div>

            <div className="stunting-media-column">
              <div className="stunting-media-frame">
                <img
                  src={content.images?.stuntingPrevention || stuntingImg}
                  alt="Sosialisasi Pencegahan Stunting Kota Bogor di Posyandu"
                  className="stunting-media-img"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SPOTLIGHT INSPEKSI KEAMANAN PANGAN PASAR TRADISIONAL (BENTO MATRIX LAYOUT) */}
        <div className="ladang-card-box food-spotlight-card gsap-food-box">
          <div className="food-spotlight-grid">
            <div className="food-media-column">
              <div className="food-media-frame">
                <img
                  src={content.images?.foodInspection || foodInspectionImg}
                  alt="Inspeksi Pangan Terpadu di Pasar Tradisional Kota Bogor"
                  className="food-media-img"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="food-content-column">
              <h3 className="food-headline">
                {content.spotlightFood.headline}
              </h3>

              <p className="food-description">
                {content.spotlightFood.description}
              </p>

              <div className="food-bento-metrics">
                <div className="food-bento-card">
                  <div className="fbc-icon-box"><ShieldCheck size={16} /></div>
                  <div className="fbc-text">
                    <span className="fbc-val" ref={foodAuditCountRef}>{content.spotlightFood.auditVal}</span>
                    <span className="fbc-lbl">{content.spotlightFood.auditLbl}</span>
                  </div>
                </div>
                <div className="food-bento-card">
                  <div className="fbc-icon-box"><CheckCircle2 size={16} /></div>
                  <div className="fbc-text">
                    <span className="fbc-val" ref={foodLolosCountRef}>{content.spotlightFood.passRateVal}</span>
                    <span className="fbc-lbl">{content.spotlightFood.passRateLbl}</span>
                  </div>
                </div>
                <div className="food-bento-card">
                  <div className="fbc-icon-box"><Building2 size={16} /></div>
                  <div className="fbc-text">
                    <span className="fbc-val" ref={foodPasarCountRef}>{content.spotlightFood.marketCountVal}</span>
                    <span className="fbc-lbl">{content.spotlightFood.marketCountLbl}</span>
                  </div>
                </div>
              </div>

              <div className="food-market-chips">
                <span className="fmc-label">Fokus Pantauan:</span>
                {content.spotlightFood.marketChips.map((chip, idx) => (
                  <span key={idx} className="fmc-chip">{chip}</span>
                ))}
              </div>

              <div className="food-footer-row">
                <button
                  type="button"
                  className="btn-food-explore"
                  onClick={() => handleScrollToMap()}
                >
                  <Store size={15} />
                  <span>Lihat Sebaran Pasar di Peta Spasial</span>
                </button>
                <span className="food-source-text">{content.spotlightFood.sourceText}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: FIELD DOCUMENTATION GALLERY (GALERI FOTO DOKUMENTASI LAPANGAN) */}
        {content.gallery && content.gallery.length > 0 && (
          <div className="ladang-card-box gallery-spotlight-box gsap-gallery-box" style={{ marginTop: 24, marginBottom: 24 }}>
            <div className="ladang-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <span className="editorial-pill" style={{ marginBottom: 6, display: 'inline-block' }}>Dokumentasi Terpadu</span>
                <h3 className="ladang-card-title" style={{ fontSize: 20, fontWeight: 800 }}>
                  Galeri Dokumentasi Lapangan Pemkot Bogor
                </h3>
                <p className="ladang-card-desc" style={{ marginTop: 4 }}>
                  Potret kegiatan riil pemantauan ketahanan pangan, instalasi PDAM Tirta Pakuan, serta penanganan gizi balita di 6 kecamatan.
                </p>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#0f766e', background: '#f0fdfa', padding: '5px 12px', borderRadius: 9999, border: '1px solid #ccfbf1' }}>
                {content.gallery.length} Dokumentasi Terpantau
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18, marginTop: 16 }}>
              {content.gallery.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="gallery-card-item"
                  style={{
                    background: '#ffffff',
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                >
                  <div style={{ position: 'relative', height: 180, background: '#0f172a', overflow: 'hidden' }}>
                    <img
                      src={item.url}
                      alt={item.title}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {item.category && (
                      <span
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          background: 'rgba(15, 23, 42, 0.75)',
                          color: '#ffffff',
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 4,
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 800, color: '#0f172a', lineHeight: 1.4 }}>
                        {item.title}
                      </h4>
                      <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overview 6 Kecamatan (Clean Editorial Table) */}
        <div className="ladang-card-box overview-kecamatan-card gsap-table-box">
          <div className="ladang-card-header">
            <div>
              <h3 className="ladang-card-title">
                Matriks Komparasi 6 Kecamatan Kota Bogor
              </h3>
              <p className="ladang-card-desc">
                Pilih kecamatan untuk fokus ke titik koordinat peta atau meninjau detail demografi dan fasilitas.
              </p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="ladang-table">
              <thead>
                <tr>
                  <th style={{ width: '24%' }}>Kecamatan</th>
                  <th style={{ width: '18%' }}>Status Ketahanan</th>
                  <th style={{ width: '16%' }}>Skor IKP</th>
                  <th style={{ width: '16%' }}>Akses Air Bersih</th>
                  <th style={{ width: '14%' }}>Prevalensi Stunting</th>
                  <th style={{ width: '12%', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {KECAMATAN_KOTA_BOGOR.map((kec) => {
                  const isSelected = selectedKec?.id === kec.id;
                  const statusClass = kec.panganStatus.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <tr
                      key={kec.id}
                      className={`ladang-row ${isSelected ? 'row-selected' : ''}`}
                      onClick={() => {
                        setSelectedKec(kec);
                        setSelectedKel(null);
                      }}
                    >
                      <td>
                        <div className="kec-name-cell">
                          <span className="kec-title">Kec. {kec.nama}</span>
                          <span className="kec-pusat-sub">{kec.pusat}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge status-${statusClass}`}>
                          {kec.panganStatus}
                        </span>
                      </td>
                      <td>
                        <div className="val-with-bar">
                          <span className="val-text"><b className="kec-ikp-num" data-val={kec.panganSkor}>{kec.panganSkor}</b> <small>/ 100</small></span>
                          <div className="mini-bar-track">
                            <div className="mini-bar-fill bg-green" style={{ width: `${kec.panganSkor}%` }} />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="val-with-bar">
                          <span className="val-text"><b className="kec-air-num" data-val={kec.airBersih}>{kec.airBersih}%</b></span>
                          <div className="mini-bar-track">
                            <div className="mini-bar-fill bg-teal" style={{ width: `${kec.airBersih}%` }} />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`stunting-val ${kec.stunting > 15 ? 'val-danger' : 'val-normal'}`}>
                          <span className="kec-stunting-num" data-val={kec.stunting}>{kec.stunting}%</span>
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className={`btn-focus-map ${isSelected ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScrollToMap(kec);
                          }}
                        >
                          <MapPin size={13} />
                          <span>Fokus Peta</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 4: PETA SPASIAL KETAHANAN PANGAN */}
      <section id="peta-spasial" className="single-page-section">
        <div className="ladang-section-head">
          <h2>
            {content.spatialSection.title}
          </h2>
          <p>
            {content.spatialSection.subtitle}
          </p>
        </div>

        {/* 70% Map : 30% Analysis Sidebar Grid */}
        <div className="spatial-workspace-grid">
          {/* Main Map Canvas (70-75% Area) */}
          <div className="ladang-card-box map-main-panel">
            <MapView
              geoJsonData={areasGeoJson}
              kelurahanList={kelurahanList}
              facilitiesData={facilitiesGeoJson}
              selectedKecamatan={selectedKec}
              selectedKelurahan={selectedKel}
              activeLayerFilter={activeMapLayer}
              onActiveLayerChange={(newLayer) => setActiveMapLayer(newLayer)}
              onSelectKecamatan={(kec) => {
                setSelectedKec(kec);
                setSelectedKel(null);
              }}
              onSelectKelurahan={(kel) => {
                setSelectedKel(kel);
                if (kel) {
                  const parent = KECAMATAN_KOTA_BOGOR.find(
                    (k) => k.nama.toLowerCase() === (kel.kecamatan || '').toLowerCase()
                  );
                  if (parent) setSelectedKec(parent);
                }
              }}
              height={isMobile ? '450px' : '100%'}
            />
          </div>

          {/* Analysis Sidebar (25-30% Area) */}
          <div className="ladang-card-box analysis-side-panel">
            {selectedKel ? (
              /* MODE DETAIL KELURAHAN TERPILIH */
              (() => {
                const kelActiveVal = selectedKel[LAYER_DEFINITIONS[activeMapLayer]?.propKey || 'stunting'];
                const kelActiveClass = getIndicatorClassification(activeMapLayer, kelActiveVal);

                const classStunt = getIndicatorClassification('stunting', selectedKel.stunting);
                const classKemiskinan = getIndicatorClassification('kemiskinan', selectedKel.kemiskinan);
                const classPangan = getIndicatorClassification('pangan', selectedKel.kerentananPangan);
                const classAir = getIndicatorClassification('air', selectedKel.airBersih);

                return (
                  <div className="kelurahan-detail-view animate-fade-in">
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedKel(null)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          color: '#0369a1',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        <span>←</span> {selectedKec ? `Kembali ke Kec. ${selectedKec.nama}` : 'Kembali ke Seluruh Wilayah'}
                      </button>

                      {selectedKec && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedKel(null);
                            setSelectedKec(null);
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#475569',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          <span>🌐</span> Seluruh Wilayah
                        </button>
                      )}
                    </div>

                    <div className="analysis-header">
                      <div className="ah-meta">
                        <span className="ah-id-code">{selectedKel.id}</span>
                        <span
                          className="status-badge"
                          style={{
                            background: kelActiveClass.bg,
                            color: kelActiveClass.textBadge,
                            border: `1.5px solid ${kelActiveClass.border}`,
                            fontWeight: 800
                          }}
                        >
                          {LAYER_DEFINITIONS[activeMapLayer].shortLabel}: {kelActiveClass.status}
                        </span>
                      </div>
                      <h3 className="ah-title">Kelurahan {selectedKel.nama}</h3>
                      <p className="ah-sub">Kecamatan {selectedKel.kecamatan} • Kota Bogor</p>
                    </div>

                    <div className="analysis-divider" />

                    <p className="analysis-description">
                      Data geospasial mikro tingkat kelurahan. Memetakan indikator prevalensi stunting balita, kemiskinan warga, kerentanan pasokan pangan, dan sanitasi air bersih PDAM.
                    </p>

                    <div className="analysis-divider" />

                    {/* 4 Pilar Indikator Mikro Kelurahan */}
                    <div className="indicator-group-list">
                      <span className="group-title">INDIKATOR MIKRO KELURAHAN</span>

                      {/* Stunting */}
                      <div
                        className="indicator-row"
                        style={{
                          background: activeMapLayer === 'stunting' ? classStunt.bg : 'transparent',
                          borderRadius: 6,
                          padding: activeMapLayer === 'stunting' ? '6px 8px' : '4px 0',
                          border: activeMapLayer === 'stunting' ? `1px solid ${classStunt.border}` : 'none'
                        }}
                      >
                        <div className="ir-label">
                          <HeartPulse size={14} style={{ color: classStunt.color }} />
                          <span>Prevalensi Balita Stunting</span>
                        </div>
                        <span className="ir-val" style={{ color: classStunt.textBadge }}>
                          <b>{selectedKel.stunting}%</b> <small>({classStunt.shortTier})</small>
                        </span>
                        <div className="ir-progress-track">
                          <div
                            className="ir-progress-fill"
                            style={{ width: `${Math.min((selectedKel.stunting / 25) * 100, 100)}%`, background: classStunt.color }}
                          />
                        </div>
                      </div>

                      {/* Kemiskinan */}
                      <div
                        className="indicator-row"
                        style={{
                          background: activeMapLayer === 'kemiskinan' ? classKemiskinan.bg : 'transparent',
                          borderRadius: 6,
                          padding: activeMapLayer === 'kemiskinan' ? '6px 8px' : '4px 0',
                          border: activeMapLayer === 'kemiskinan' ? `1px solid ${classKemiskinan.border}` : 'none'
                        }}
                      >
                        <div className="ir-label">
                          <Users size={14} style={{ color: classKemiskinan.color }} />
                          <span>Tingkat Kemiskinan / DTKS</span>
                        </div>
                        <span className="ir-val" style={{ color: classKemiskinan.textBadge }}>
                          <b>{selectedKel.kemiskinan}%</b> <small>({classKemiskinan.shortTier})</small>
                        </span>
                        <div className="ir-progress-track">
                          <div
                            className="ir-progress-fill"
                            style={{ width: `${Math.min((selectedKel.kemiskinan / 15) * 100, 100)}%`, background: classKemiskinan.color }}
                          />
                        </div>
                      </div>

                      {/* Kerentanan Pangan */}
                      <div
                        className="indicator-row"
                        style={{
                          background: activeMapLayer === 'pangan' ? classPangan.bg : 'transparent',
                          borderRadius: 6,
                          padding: activeMapLayer === 'pangan' ? '6px 8px' : '4px 0',
                          border: activeMapLayer === 'pangan' ? `1px solid ${classPangan.border}` : 'none'
                        }}
                      >
                        <div className="ir-label">
                          <Utensils size={14} style={{ color: classPangan.color }} />
                          <span>Skor Kerentanan Pangan</span>
                        </div>
                        <span className="ir-val" style={{ color: classPangan.textBadge }}>
                          <b>{selectedKel.kerentananPangan}</b> / 100 <small>({classPangan.shortTier})</small>
                        </span>
                        <div className="ir-progress-track">
                          <div
                            className="ir-progress-fill"
                            style={{ width: `${Math.min(selectedKel.kerentananPangan, 100)}%`, background: classPangan.color }}
                          />
                        </div>
                      </div>

                      {/* Air Bersih */}
                      <div
                        className="indicator-row"
                        style={{
                          background: activeMapLayer === 'air' ? classAir.bg : 'transparent',
                          borderRadius: 6,
                          padding: activeMapLayer === 'air' ? '6px 8px' : '4px 0',
                          border: activeMapLayer === 'air' ? `1px solid ${classAir.border}` : 'none'
                        }}
                      >
                        <div className="ir-label">
                          <Droplets size={14} style={{ color: classAir.color }} />
                          <span>Akses Air Bersih Layak</span>
                        </div>
                        <span className="ir-val" style={{ color: classAir.textBadge }}>
                          <b>{selectedKel.airBersih}%</b> <small>({classAir.shortTier})</small>
                        </span>
                        <div className="ir-progress-track">
                          <div
                            className="ir-progress-fill"
                            style={{ width: `${Math.min(selectedKel.airBersih, 100)}%`, background: classAir.color }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="analysis-divider" />

                    {/* Profil Geospasial & Komparasi */}
                    <div className="meta-stats-section">
                      <span className="group-title">KOMPARASI WILAYAH</span>

                      <div className="meta-data-row">
                        <span className="md-label">Kecamatan Induk</span>
                        <span className="md-value">Kec. {selectedKel.kecamatan}</span>
                      </div>

                      {(() => {
                        const parentKec = KECAMATAN_KOTA_BOGOR.find(
                          (k) => k.nama.toLowerCase() === (selectedKel.kecamatan || '').toLowerCase()
                        );
                        const kecAvgStunting = parentKec ? parentKec.stunting : 14.5;
                        const diff = selectedKel.stunting - kecAvgStunting;
                        return (
                          <div className="meta-data-row">
                            <span className="md-label">Stunting vs Rata-rata Kec.</span>
                            <span className="md-value" style={{ fontWeight: 700, color: diff > 0 ? '#dc2626' : '#16a34a' }}>
                              {diff > 0
                                ? `+${diff.toFixed(1)}% (Di atas rata-rata)`
                                : `${diff.toFixed(1)}% (Lebih baik)`}
                            </span>
                          </div>
                        );
                      })()}

                      <div className="meta-data-row">
                        <span className="md-label">Rekomendasi Intervensi</span>
                        <span className="md-value" style={{ fontWeight: 600 }}>
                          {selectedKel.stunting >= 18 ? 'PMT Rutin, Jamban Sehat, & Air PDAM' : (selectedKel.stunting >= 14 ? 'Pendampingan Gizi Balita Posyandu' : 'Pemantauan Berkala Terpadu')}
                        </span>
                      </div>
                    </div>

                    <div className="analysis-footer">
                      <span className="af-coord">Lat: {selectedKel.lat}, Lng: {selectedKel.lng}</span>
                    </div>
                  </div>
                );
              })()
            ) : selectedKec ? (
              /* MODE RINGKASAN KECAMATAN TERPILIH */
              <div className="kecamatan-detail-view animate-fade-in">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedKec(null);
                    setSelectedKel(null);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '5px 11px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    color: '#0284c7',
                    cursor: 'pointer',
                    marginBottom: '12px',
                    transition: 'all 0.15s'
                  }}
                >
                  <span>←</span> Tampilkan Ringkasan Seluruh Kota Bogor
                </button>

                <div className="analysis-header">
                  <div className="ah-meta">
                    <span className="ah-id-code">{selectedKec.id}</span>
                    <span className={`status-badge status-${selectedKec.panganStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                      {selectedKec.panganStatus}
                    </span>
                  </div>
                  <h3 className="ah-title">Kecamatan {selectedKec.nama}</h3>
                  <p className="ah-sub">Pusat Wilayah: {selectedKec.pusat}</p>
                </div>

                <div className="analysis-divider" />

                <p className="analysis-description">
                  {selectedKec.deskripsi}
                </p>

                <div className="analysis-divider" />

                {/* Core Spatial Indicators */}
                <div className="indicator-group-list">
                  <span className="group-title">INDIKATOR UTAMA</span>

                  <div className="indicator-row">
                    <div className="ir-label">
                      <Utensils size={14} className="text-primary-green" />
                      <span>Indeks Ketahanan Pangan (IKP)</span>
                    </div>
                    <span className="ir-val"><b ref={sideIkpRef}>{selectedKec.panganSkor}</b> / 100</span>
                    <div className="ir-progress-track">
                      <div className="ir-progress-fill bg-green" style={{ width: `${selectedKec.panganSkor}%` }} />
                    </div>
                  </div>

                  <div className="indicator-row">
                    <div className="ir-label">
                      <Droplets size={14} className="text-water-cyan" />
                      <span>Akses Air Bersih Layak</span>
                    </div>
                    <span className="ir-val"><b ref={sideAirRef}>{selectedKec.airBersih}%</b></span>
                    <div className="ir-progress-track">
                      <div className="ir-progress-fill bg-cyan" style={{ width: `${selectedKec.airBersih}%` }} />
                    </div>
                  </div>

                  <div className="indicator-row">
                    <div className="ir-label">
                      <HeartPulse size={14} className="text-danger" />
                      <span>Prevalensi Stunting</span>
                    </div>
                    <span className={`ir-val ${selectedKec.stunting > 15 ? 'text-danger fw-bold' : ''}`}>
                      <b ref={sideStuntingRef}>{selectedKec.stunting}%</b>
                    </span>
                    <div className="ir-progress-track">
                      <div
                        className="ir-progress-fill bg-danger"
                        style={{ width: `${Math.min((selectedKec.stunting / 25) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="analysis-divider" />

                {/* Demographic & Infrastructure Metadata */}
                <div className="meta-stats-section">
                  <span className="group-title">PROFIL & FASILITAS</span>

                  <div className="meta-data-row">
                    <span className="md-label">Jumlah Penduduk</span>
                    <span className="md-value" ref={sidePendudukRef}>{selectedKec.penduduk.toLocaleString('id-ID')} jiwa</span>
                  </div>

                  <div className="meta-data-row">
                    <span className="md-label">Fasilitas Kesehatan & Pasar</span>
                    <span className="md-value">{selectedKec.faskes} Faskes • {selectedKec.pasarTradisional} Pasar</span>
                  </div>

                  <div className="meta-data-row">
                    <span className="md-label">Tingkat Kemiskinan</span>
                    <span className="md-value">{selectedKec.tingkatKemiskinan}</span>
                  </div>

                  <div className="meta-data-row">
                    <span className="md-label">Sumber Air Dominan</span>
                    <span className="md-value">{selectedKec.sumberAirDominan}</span>
                  </div>
                </div>

                <div className="analysis-divider" />

                {/* Daftar Kelurahan Cepat (Interactive Chips Sesuai Layer Aktif) */}
                <div className="meta-stats-section">
                  <span className="group-title">
                    KELURAHAN DI KEC. {selectedKec.nama.toUpperCase()} ({kelurahanList.filter(k => k.kecamatan === selectedKec.nama).length})
                  </span>
                  <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', lineHeight: 1.4 }}>
                    Menampilkan nilai <strong>{LAYER_DEFINITIONS[activeMapLayer]?.label}</strong>. Klik kelurahan untuk fokus di peta:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {kelurahanList.filter(k => k.kecamatan === selectedKec.nama).map((k) => {
                      const kVal = k[LAYER_DEFINITIONS[activeMapLayer]?.propKey || 'stunting'];
                      const kClass = getIndicatorClassification(activeMapLayer, kVal);
                      return (
                        <button
                          key={k.id}
                          type="button"
                          onClick={() => setSelectedKel(k)}
                          style={{
                            padding: '4px 7px',
                            fontSize: '11px',
                            fontWeight: 600,
                            borderRadius: '5px',
                            border: `1px solid ${kClass.border}`,
                            background: '#ffffff',
                            color: '#1e293b',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = kClass.color;
                            e.currentTarget.style.background = kClass.bg;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = kClass.border;
                            e.currentTarget.style.background = '#ffffff';
                          }}
                        >
                          <span>📍 {k.nama}</span>
                          <span style={{
                            fontSize: '9.5px',
                            fontWeight: 800,
                            padding: '1px 5px',
                            borderRadius: '3px',
                            background: kClass.bg,
                            color: kClass.textBadge,
                            border: `1px solid ${kClass.border}`
                          }}>
                            {kVal}{LAYER_DEFINITIONS[activeMapLayer]?.unit || ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="analysis-footer">
                  <span className="af-coord">Lat: {selectedKec.lat}, Lng: {selectedKec.lng}</span>
                </div>
              </div>
            ) : (
              /* MODE RINGKASAN SELURUH KOTA BOGOR (ALL 68 KELURAHAN) */
              <div className="kota-bogor-detail-view animate-fade-in">
                <div className="analysis-header">
                  <div className="ah-meta">
                    <span className="ah-id-code" style={{ background: '#fef3c7', color: '#b45309' }}>KOTA-BOGOR</span>
                    {(() => {
                      let cityVal = 15.4;
                      if (activeMapLayer === 'stunting') cityVal = 15.4;
                      else if (activeMapLayer === 'kemiskinan') cityVal = 5.8;
                      else if (activeMapLayer === 'pangan') cityVal = 32.5;
                      else if (activeMapLayer === 'air') cityVal = 89.6;
                      const cityClass = getIndicatorClassification(activeMapLayer, cityVal);
                      return (
                        <span
                          className="status-badge"
                          style={{
                            background: cityClass.bg,
                            color: cityClass.textBadge,
                            border: `1.5px solid ${cityClass.border}`,
                            fontWeight: 800
                          }}
                        >
                          {LAYER_DEFINITIONS[activeMapLayer].shortLabel}: {cityClass.status}
                        </span>
                      );
                    })()}
                  </div>
                  <h3 className="ah-title">Kota Bogor (Seluruh Wilayah)</h3>
                  <p className="ah-sub">Pusat Pemerintahan: Balai Kota • 6 Kecamatan • 68 Kelurahan</p>
                </div>

                <div className="analysis-divider" />

                <p className="analysis-description">
                  Data geospasial agregat Kota Bogor. Menampilkan sebaran komprehensif 68 kelurahan pada 6 kecamatan dalam pemantauan ketahanan pangan, penanganan stunting balita, dan sanitasi air bersih PDAM.
                </p>

                <div className="analysis-divider" />

                {/* Core Spatial Indicators Kota */}
                <div className="indicator-group-list">
                  <span className="group-title">INDIKATOR AGREGAT KOTA</span>

                  <div
                    className="indicator-row"
                    style={{
                      background: activeMapLayer === 'pangan' ? '#f0fdf4' : 'transparent',
                      borderRadius: 6,
                      padding: activeMapLayer === 'pangan' ? '6px 8px' : '4px 0',
                      border: activeMapLayer === 'pangan' ? '1px solid #bbf7d0' : 'none'
                    }}
                  >
                    <div className="ir-label">
                      <Utensils size={14} className="text-primary-green" />
                      <span>Indeks Ketahanan Pangan (IKP)</span>
                    </div>
                    <span className="ir-val"><b ref={sideIkpRef}>88.2</b> / 100 <small style={{ color: '#16a34a', fontWeight: 700 }}>(Sangat Tahan)</small></span>
                    <div className="ir-progress-track">
                      <div className="ir-progress-fill bg-green" style={{ width: '88.2%' }} />
                    </div>
                  </div>

                  <div
                    className="indicator-row"
                    style={{
                      background: activeMapLayer === 'air' ? '#f0fdf4' : 'transparent',
                      borderRadius: 6,
                      padding: activeMapLayer === 'air' ? '6px 8px' : '4px 0',
                      border: activeMapLayer === 'air' ? '1px solid #bbf7d0' : 'none'
                    }}
                  >
                    <div className="ir-label">
                      <Droplets size={14} className="text-water-cyan" />
                      <span>Akses Air Bersih Layak</span>
                    </div>
                    <span className="ir-val"><b ref={sideAirRef}>89.6%</b> <small style={{ color: '#0284c7', fontWeight: 700 }}>(Layak Terpadu)</small></span>
                    <div className="ir-progress-track">
                      <div className="ir-progress-fill bg-cyan" style={{ width: '89.6%' }} />
                    </div>
                  </div>

                  <div
                    className="indicator-row"
                    style={{
                      background: activeMapLayer === 'stunting' ? '#fefce8' : 'transparent',
                      borderRadius: 6,
                      padding: activeMapLayer === 'stunting' ? '6px 8px' : '4px 0',
                      border: activeMapLayer === 'stunting' ? '1px solid #fef08a' : 'none'
                    }}
                  >
                    <div className="ir-label">
                      <HeartPulse size={14} className="text-danger" />
                      <span>Prevalensi Stunting Kota</span>
                    </div>
                    <span className="ir-val">
                      <b ref={sideStuntingRef}>15.4%</b> <small style={{ color: '#ca8a04', fontWeight: 700 }}>(Target &lt;14%)</small>
                    </span>
                    <div className="ir-progress-track">
                      <div
                        className="ir-progress-fill bg-danger"
                        style={{ width: `${Math.min((15.4 / 25) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="analysis-divider" />

                {/* Profil & Fasilitas Agregat */}
                <div className="meta-stats-section">
                  <span className="group-title">PROFIL & FASILITAS KOTA</span>

                  <div className="meta-data-row">
                    <span className="md-label">Total Penduduk</span>
                    <span className="md-value" ref={sidePendudukRef}>1.092.800 jiwa</span>
                  </div>

                  <div className="meta-data-row">
                    <span className="md-label">Wilayah Administrasi</span>
                    <span className="md-value">6 Kecamatan • 68 Kelurahan</span>
                  </div>

                  <div className="meta-data-row">
                    <span className="md-label">Fasilitas Publik</span>
                    <span className="md-value">64 Faskes • 17 Pasar Tradisional</span>
                  </div>

                  <div className="meta-data-row">
                    <span className="md-label">Sumber Air Dominan</span>
                    <span className="md-value">PDAM Tirta Pakuan Kota Bogor</span>
                  </div>
                </div>

                <div className="analysis-divider" />

                {/* DAFTAR SEMUA 68 KELURAHAN SE-KOTA BOGOR */}
                <div className="meta-stats-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="group-title" style={{ margin: 0 }}>
                      KELURAHAN SE-KOTA BOGOR (68)
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                      {(() => {
                        const totalMatch = kelurahanList.filter((k) => {
                          const matchKec = panelKecTab === 'Semua' || k.kecamatan === panelKecTab;
                          const matchSearch =
                            !panelKelSearch ||
                            k.nama.toLowerCase().includes(panelKelSearch.toLowerCase()) ||
                            k.kecamatan.toLowerCase().includes(panelKelSearch.toLowerCase());
                          return matchKec && matchSearch;
                        }).length;
                        return `${totalMatch} ditampilkan`;
                      })()}
                    </span>
                  </div>

                  <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', lineHeight: 1.4 }}>
                    Menampilkan nilai <strong>{LAYER_DEFINITIONS[activeMapLayer]?.label}</strong>. Klik kelurahan untuk fokus di peta & membuka detail:
                  </p>

                  {/* Filter Tab Kecamatan */}
                  <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '6px' }}>
                    {['Semua', 'Bogor Tengah', 'Bogor Utara', 'Bogor Selatan', 'Bogor Timur', 'Bogor Barat', 'Tanah Sareal'].map((tab) => {
                      const isActive = panelKecTab === tab;
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setPanelKecTab(tab)}
                          style={{
                            padding: '3px 7px',
                            fontSize: '10.5px',
                            fontWeight: isActive ? 700 : 500,
                            borderRadius: '4px',
                            border: isActive ? '1px solid #0284c7' : '1px solid #e2e8f0',
                            background: isActive ? '#f0f9ff' : '#ffffff',
                            color: isActive ? '#0369a1' : '#64748b',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.15s'
                          }}
                        >
                          {tab === 'Semua' ? 'Semua (68)' : tab.replace('Bogor ', 'B. ')}
                        </button>
                      );
                    })}
                  </div>

                  {/* Pencarian Kelurahan Cepat */}
                  <div style={{ marginBottom: '8px' }}>
                    <input
                      type="text"
                      placeholder="🔍 Cari nama kelurahan..."
                      value={panelKelSearch}
                      onChange={(e) => setPanelKelSearch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '5px 10px',
                        fontSize: '11.5px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        outline: 'none',
                        background: '#f8fafc',
                        color: '#0f172a'
                      }}
                    />
                  </div>

                  {/* Scrollable Chips List 68 Kelurahan */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '5px',
                      maxHeight: '260px',
                      overflowY: 'auto',
                      paddingRight: '3px'
                    }}
                  >
                    {kelurahanList
                      .filter((k) => {
                        const matchKec = panelKecTab === 'Semua' || k.kecamatan === panelKecTab;
                        const matchSearch =
                          !panelKelSearch ||
                          k.nama.toLowerCase().includes(panelKelSearch.toLowerCase()) ||
                          k.kecamatan.toLowerCase().includes(panelKelSearch.toLowerCase());
                        return matchKec && matchSearch;
                      })
                      .map((k) => {
                        const kVal = k[LAYER_DEFINITIONS[activeMapLayer]?.propKey || 'stunting'];
                        const kClass = getIndicatorClassification(activeMapLayer, kVal);
                        return (
                          <button
                            key={k.id}
                            type="button"
                            onClick={() => {
                              setSelectedKel(k);
                              const parent = KECAMATAN_KOTA_BOGOR.find(
                                (item) => item.nama.toLowerCase() === (k.kecamatan || '').toLowerCase()
                              );
                              if (parent) setSelectedKec(parent);
                            }}
                            style={{
                              padding: '4px 7px',
                              fontSize: '11px',
                              fontWeight: 600,
                              borderRadius: '5px',
                              border: `1px solid ${kClass.border}`,
                              background: '#ffffff',
                              color: '#1e293b',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'all 0.15s',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = kClass.color;
                              e.currentTarget.style.background = kClass.bg;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = kClass.border;
                              e.currentTarget.style.background = '#ffffff';
                            }}
                          >
                            <span>📍 {k.nama}</span>
                            {panelKecTab === 'Semua' && (
                              <small style={{ color: '#94a3b8', fontSize: '9px', fontWeight: 500 }}>
                                ({k.kecamatan.replace('Bogor ', 'B.')})
                              </small>
                            )}
                            <span
                              style={{
                                fontSize: '9.5px',
                                fontWeight: 800,
                                padding: '1px 5px',
                                borderRadius: '3px',
                                background: kClass.bg,
                                color: kClass.textBadge,
                                border: `1px solid ${kClass.border}`
                              }}
                            >
                              {kVal}{LAYER_DEFINITIONS[activeMapLayer]?.unit || ''}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>

                <div className="analysis-footer">
                  <span className="af-coord">Koordinat Pusat: Lat: -6.5971, Lng: 106.7949 (Balai Kota)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 5: DATA INDIKATOR KOTA & VISUAL CHART */}
      <section id="data-indikator" className="single-page-section">
        <div className="ladang-section-head">
          <h2>
            {content.indicatorSection.title}
          </h2>
          <p>{content.indicatorSection.subtitle}</p>
        </div>

        {/* Data Filter & Search Toolbar */}
        <div className="ladang-card-box toolbar-card gsap-data-section">
          <div className="filter-controls-row">
            {/* Search Input */}
            <div className="search-input-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Cari kecamatan atau pusat administrasi..."
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
              />
            </div>

            {/* Status Select */}
            <div className="filter-select-box">
              <Filter size={14} className="filter-icon" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option>Semua Status</option>
                {FOOD_SECURITY_CATEGORIES.map((c) => (
                  <option key={c.label} value={c.label}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Export CSV Button */}
            <button className="ladang-btn-export" onClick={handleExportCSV}>
              <FileSpreadsheet size={15} />
              <span>Ekspor Data CSV</span>
            </button>
          </div>
        </div>

        {/* Chart Visualization Section */}
        <div className="ladang-card-box chart-section-card gsap-data-section">
          <div className="chart-header-row">
            <div>
              <h3 className="chart-title">
                {activeChartMetric === 'panganSkor' && 'Peringkat Indeks Ketahanan Pangan (IKP) per Kecamatan'}
                {activeChartMetric === 'airBersih' && 'Akses Air Bersih Layak (%) per Kecamatan'}
                {activeChartMetric === 'stunting' && 'Prevalensi Stunting Balita (%) per Kecamatan'}
              </h3>
              <p className="chart-subtitle">
                Grafik perbandingan skor indikator pada seluruh kecamatan di Kota Bogor.
              </p>
            </div>

            {/* Chart Metric Switcher Tabs */}
            <div className="chart-tab-group">
              <button
                className={`chart-tab ${activeChartMetric === 'panganSkor' ? 'active' : ''}`}
                onClick={() => setActiveChartMetric('panganSkor')}
              >
                <Utensils size={13} />
                <span>Skor IKP</span>
              </button>
              <button
                className={`chart-tab ${activeChartMetric === 'airBersih' ? 'active' : ''}`}
                onClick={() => setActiveChartMetric('airBersih')}
              >
                <Droplets size={13} />
                <span>Air Bersih</span>
              </button>
              <button
                className={`chart-tab ${activeChartMetric === 'stunting' ? 'active' : ''}`}
                onClick={() => setActiveChartMetric('stunting')}
              >
                <HeartPulse size={13} />
                <span>Stunting</span>
              </button>
            </div>
          </div>

          <div style={{ width: '100%', height: isMobile ? 310 : 380, marginTop: 20 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={KECAMATAN_KOTA_BOGOR}
                margin={isMobile ? { top: 28, right: 8, left: -22, bottom: 25 } : { top: 28, right: 25, left: -5, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="barGradientIKP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2D6A4F" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1B4332" stopOpacity={0.92} />
                  </linearGradient>
                  <linearGradient id="barGradientAir" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2A9D8F" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1D6F65" stopOpacity={0.92} />
                  </linearGradient>
                  <linearGradient id="barGradientStunting" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E76F51" stopOpacity={1} />
                    <stop offset="100%" stopColor="#C86446" stopOpacity={0.92} />
                  </linearGradient>
                  <linearGradient id="barGradientStuntingHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E63946" stopOpacity={1} />
                    <stop offset="100%" stopColor="#A8201A" stopOpacity={0.92} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBE5DC" />
                <XAxis
                  dataKey="nama"
                  tick={{ fontSize: isMobile ? 10 : 13, fill: '#3E3431', fontWeight: 700 }}
                  tickLine={false}
                  axisLine={{ stroke: '#E8E2D8' }}
                  dy={isMobile ? 2 : 6}
                  interval={0}
                  angle={isMobile ? -25 : 0}
                  textAnchor={isMobile ? 'end' : 'middle'}
                  height={isMobile ? 45 : 30}
                />
                <YAxis
                  tick={{ fontSize: isMobile ? 10 : 12, fill: '#8C827A', fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, activeChartMetric === 'stunting' ? 28 : 115]}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(45, 90, 60, 0.05)', radius: 10 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      let label = 'Skor IKP';
                      let val = data.panganSkor + ' / 100';
                      if (activeChartMetric === 'airBersih') {
                        label = 'Akses Air Bersih';
                        val = data.airBersih + '%';
                      } else if (activeChartMetric === 'stunting') {
                        label = 'Prevalensi Stunting';
                        val = data.stunting + '%';
                      }
                      return (
                        <div className="ladang-chart-tooltip">
                          <span className="tt-kec">Kecamatan {data.nama}</span>
                          <span className="tt-val">{label}: <b>{val}</b></span>
                          <span className="tt-sub">Pusat: {data.pusat}</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey={activeChartMetric}
                  radius={[isMobile ? 8 : 12, isMobile ? 8 : 12, 0, 0]}
                  barSize={isMobile ? 32 : 68}
                  maxBarSize={isMobile ? 42 : 80}
                >
                  <LabelList
                    dataKey={activeChartMetric}
                    position="top"
                    formatter={(val) => {
                      if (activeChartMetric === 'panganSkor') return `${val}`;
                      return `${val}%`;
                    }}
                    style={{ fill: '#241D1B', fontSize: isMobile ? 10 : 13, fontWeight: 800 }}
                    offset={isMobile ? 6 : 10}
                  />
                  {KECAMATAN_KOTA_BOGOR.map((entry, index) => {
                    let fill = 'url(#barGradientIKP)';
                    if (activeChartMetric === 'airBersih') fill = 'url(#barGradientAir)';
                    if (activeChartMetric === 'stunting') {
                      fill = entry.stunting > 15 ? 'url(#barGradientStuntingHigh)' : 'url(#barGradientStunting)';
                    }
                    return <Cell key={`cell-${index}`} fill={fill} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* SECTION 6: TENTANG NUTRIMAP & MITRA RESMI */}
      <section id="tentang-nutrimap" className="single-page-section">
        <div className="ladang-section-head">
          <h2>
            {content.aboutSection.title}
          </h2>
          <p>{content.aboutSection.subtitle}</p>
        </div>

        <div className="about-split-grid">
          <div className="ladang-card-box about-info-panel">
            <div className="about-brand-header">
              <div className="about-logo-box">
                <Sprout size={24} className="text-forest" />
              </div>
              <div>
                <h3>NutriMap Kota Bogor</h3>
                <p>Platform SIG Spasial Kota Bogor, Jawa Barat</p>
              </div>
            </div>

            <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.65, marginTop: 14 }}>
              {content.aboutSection.description}
            </p>

            <h4 className="about-subhead">Sasaran & Cakupan Sistem:</h4>
            <ul className="about-bullet-list">
              {content.aboutSection.objectives.map((obj, idx) => (
                <li key={idx}>
                  <CheckCircle2 size={16} className="bullet-icon text-forest" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>

            <div className="about-partners-wrap">
              <span className="partners-label">Sumber Data:</span>
              <a
                href={content.aboutSection.sourceLinkUrl || "https://satupeta.kotabogor.go.id/maps"}
                target="_blank"
                rel="noreferrer"
                className="sumber-data-link"
              >
                <ExternalLink size={14} />
                <span>{content.aboutSection.sourceLinkTitle || "Peta | Satu Peta Kota Bogor"}</span>
              </a>
            </div>
          </div>

          <div className="ladang-card-box about-contact-panel">
            <h3 className="contact-title">Kontak & Layanan Portal SIG</h3>

            <div className="contact-entry">
              <Building2 size={18} className="contact-icon text-forest" />
              <div>
                <b>Alamat Kantor Balai Kota:</b>
                <p>{content.aboutSection.address}</p>
              </div>
            </div>

            <div className="contact-entry">
              <Mail size={18} className="contact-icon text-forest" />
              <div>
                <b>Email Resmi Pelaporan GIS:</b>
                <p>{content.aboutSection.email}</p>
              </div>
            </div>

            <div className="contact-entry">
              <Phone size={18} className="contact-icon text-forest" />
              <div>
                <b>Layanan Hotline / WhatsApp:</b>
                <p>{content.aboutSection.phone}</p>
              </div>
            </div>

            <div className="contact-entry">
              <Clock size={18} className="contact-icon text-forest" />
              <div>
                <b>Jam Pelayanan:</b>
                <p>{content.aboutSection.officeHours || "Senin - Jumat: 08.00 - 16.00 WIB"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFICIAL INSTITUTIONAL FOOTER (EARTHY COCOA THEME) */}
      <footer className="ladang-portal-footer">
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <div className="footer-logo-box">
                <Sprout size={20} className="text-white" />
              </div>
              <div>
                <div className="fb-title">NutriMap Kota Bogor</div>
                <div className="fb-sub">{content.footer?.tagline || "Sistem Informasi Geografis Ketahanan Pangan & Kesejahteraan"}</div>
              </div>
            </div>
            <p className="footer-brand-desc">
              Inisiatif geospasial Pemerintah Kota Bogor untuk transparansi data ketersediaan pangan pokok, akses air bersih, dan pemantauan kesehatan gizi masyarakat secara berkelanjutan.
            </p>
          </div>
        </div>

        <div className="footer-bottom-row">
          <span>{content.footer?.copyright || "© 2026 Pemerintah Kota Bogor - Bappeda & Dinas Ketahanan Pangan. Hak Cipta Dilindungi."}</span>
        </div>
      </footer>

      {/* FLOATING QUICK-EDIT CMS BUTTON FOR LOGGED-IN ADMINS */}
      {currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
        <aside
          aria-label="Admin CMS Quick Edit"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999
          }}
        >
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('content-mgmt')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#0f172a',
              color: '#ffffff',
              border: '2px solid #38bdf8',
              borderRadius: 9999,
              padding: '12px 20px',
              fontSize: 13.5,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.35)',
              transition: 'transform 0.15s ease, background 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
              e.currentTarget.style.background = '#1e293b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1.0)';
              e.currentTarget.style.background = '#0f172a';
            }}
            title="Buka panel editor CMS untuk mengedit teks halaman umum ini langsung"
          >
            <FileEdit size={17} color="#38bdf8" />
            <span>Kelola Konten Halaman Ini (CMS)</span>
          </button>
        </aside>
      )}
    </div>
  );
}
