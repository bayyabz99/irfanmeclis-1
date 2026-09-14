'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Users, 
  Layers, 
  Calendar, 
  Award, 
  ArrowRight, 
  Play, 
  Scale, 
  GraduationCap, 
  QrCode,
  Landmark,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  MapPin,
  FileText,
  Clock,
  Globe,
  Shield,
  HeartPulse,
  Crosshair,
  Compass
} from 'lucide-react';
import CountdownTimer from '@/components/CountdownTimer';
import CommissionCard from '@/components/CommissionCard';
import SponsorsMarquee from '@/components/SponsorsMarquee';
import VideoModal from '@/components/VideoModal';
import { COMMISSIONS, PROGRAM_DAYS, FAQ_ITEMS } from '@/lib/data';
import { getStoredCMSData, CMSData, INITIAL_CMS_DATA } from '@/lib/cmsStorage';

const iconComponentMap: Record<string, any> = {
  Users,
  Landmark,
  GraduationCap,
  QrCode,
  Scale,
  Award,
  Calendar,
  Layers,
  Sparkles,
  Globe,
  Shield,
  HeartPulse,
  Crosshair,
  Compass
};

export default function HomePage() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [atmosphereIndex, setAtmosphereIndex] = useState(0);
  const [cmsData, setCmsData] = useState<CMSData>(INITIAL_CMS_DATA);

  useEffect(() => {
    setCmsData(getStoredCMSData());
    const handleUpdate = () => {
      setCmsData(getStoredCMSData());
    };
    window.addEventListener('igm_cms_updated', handleUpdate);
    return () => window.removeEventListener('igm_cms_updated', handleUpdate);
  }, []);

  const hp = cmsData.homepage || INITIAL_CMS_DATA.homepage;
  const settings = cmsData.siteSettings || INITIAL_CMS_DATA.siteSettings;

  // Stats dynamically read from CMS or fallback
  const rawStats = hp.stats && hp.stats.length > 0 ? hp.stats : INITIAL_CMS_DATA.homepage.stats;
  const stats = rawStats.map((s, idx) => ({
    ...s,
    icon: idx === 0 ? Users : idx === 1 ? Layers : idx === 2 ? Award : Calendar
  }));

  // Atmosphere photos from CMS
  const atmospherePhotos = hp.atmosphere?.photos && hp.atmosphere.photos.length > 0 
    ? hp.atmosphere.photos 
    : INITIAL_CMS_DATA.homepage.atmosphere.photos;

  const nextAtmosphere = () => {
    setAtmosphereIndex((prev) => (prev + 1) % atmospherePhotos.length);
  };

  const prevAtmosphere = () => {
    setAtmosphereIndex((prev) => (prev - 1 + atmospherePhotos.length) % atmospherePhotos.length);
  };

  const features = hp.features && hp.features.length > 0
    ? hp.features
    : INITIAL_CMS_DATA.homepage.features;

  const commissionsList = cmsData.commissions && cmsData.commissions.length > 0
    ? cmsData.commissions
    : COMMISSIONS;

  const programDays = cmsData.program && cmsData.program.length > 0
    ? cmsData.program
    : PROGRAM_DAYS;

  const currentAtmosphereSlice = atmospherePhotos.length <= 3 
    ? atmospherePhotos 
    : [
        atmospherePhotos[atmosphereIndex % atmospherePhotos.length],
        atmospherePhotos[(atmosphereIndex + 1) % atmospherePhotos.length],
        atmospherePhotos[(atmosphereIndex + 2) % atmospherePhotos.length]
      ];

  return (
    <div className="min-h-screen bg-[#061A33] text-white">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (BİREBİR REFERANS GÖRSEL TASARIMI)                        */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden flex items-center min-h-[660px] sm:min-h-[720px] md:min-h-[780px] lg:min-h-[calc(100vw*575/1024)]">
        
        {/* Background Image: Managed via CMS */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={hp.heroBgImage || "/images/anasayfa-arkaplan.png"}
            alt={settings.siteName || "İrfan Meclisi"}
            fill
            sizes="100vw"
            priority
            className="object-cover"
            style={{ objectPosition: 'center top' }}
          />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 w-full pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Title, Subtitle, Countdown, CTA */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Category label with official logo */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[#4DA3FF]/50 shadow-xl shadow-[#4DA3FF]/20 bg-[#061A33]">
                  <Image
                    src="/logo.png"
                    alt={settings.siteName || "İrfan Meclis Simülasyonu"}
                    fill
                    sizes="48px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#4DA3FF] uppercase">
                  <span>{settings.slogan ? settings.slogan.split(',')[0] || 'KÖKÜMÜZ İRFAN' : 'KÖKÜMÜZ İRFAN'}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4DA3FF]" />
                  <span>{settings.slogan ? settings.slogan.split(',')[1] || 'SÖZÜMÜZ İSTİKBAL' : 'SÖZÜMÜZ İSTİKBAL'}</span>
                </div>
              </div>

              {/* Main Title in Serif */}
              <h1 className="text-2xl sm:text-4xl lg:text-6xl font-serif font-black tracking-tight leading-[1.15] break-words">
                <span className="text-white block">{hp.heroPrefix || 'ÖNDER DERNEĞİ ÖNCÜLÜĞÜNDE'}</span>
                <span className="text-[#4DA3FF] block mt-1">{hp.heroTitle || 'İRFAN MECLİSİ'}</span>
              </h1>

              {/* Subheading */}
              <p className="text-sm sm:text-lg text-slate-200 font-sans max-w-xl leading-relaxed">
                {hp.heroDesc || "“Kökümüz İrfan, Sözümüz İstikbal” anlayışıyla; gençlerin fikir gücüyle, daha adil, daha güçlü ve daha yaşanabilir bir gelecek için buluşuyoruz."}
              </p>

              {/* Countdown Timer Component with CMS dynamic target date & text */}
              <div className="pt-2">
                <CountdownTimer 
                  targetDate={settings.targetDate || "2026-10-23T09:00:00+03:00"} 
                  countdownText={settings.countdownText}
                />
              </div>

              {/* Seljuk Cartouche CTA Buttons (matching reference design with softened curves) */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 w-full sm:w-auto">
                <Link
                  href="/basvuru"
                  className="group relative inline-flex items-center justify-center h-[52px] px-8 transition-all duration-300 transform hover:-translate-y-0.5 hover:brightness-105 cursor-pointer select-none"
                >
                  {/* Seljuk Turquoise Cartouche SVG Background */}
                  <svg 
                    className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-lg"
                    viewBox="0 0 230 52"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="goldBorderPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fae8be" />
                        <stop offset="25%" stopColor="#dfbe7a" />
                        <stop offset="60%" stopColor="#ab8438" />
                        <stop offset="85%" stopColor="#e2c17f" />
                        <stop offset="100%" stopColor="#fae8be" />
                      </linearGradient>
                      <linearGradient id="tealBtnBg" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#2cb2cf" />
                        <stop offset="45%" stopColor="#158ea9" />
                        <stop offset="100%" stopColor="#0b677d" />
                      </linearGradient>
                    </defs>

                    {/* Soft Cartouche Body */}
                    <path 
                      d="
                        M 24 7
                        C 40 5 60 4 105 4
                        C 111 3 113 2 115 2
                        C 117 2 119 3 125 4
                        C 170 4 190 5 206 7
                        C 207 13 212 17 218 18
                        C 221 21 223 24 224 22
                        C 225.5 24 226.5 25 226.5 26
                        C 226.5 27 225.5 28 224 30
                        C 223 28 221 31 218 34
                        C 212 35 207 39 206 45
                        C 190 47 170 48 125 48
                        C 119 49 117 50 115 50
                        C 113 50 111 49 105 48
                        C 60 48 40 47 24 45
                        C 23 39 18 35 12 34
                        C 9 31 7 28 6 30
                        C 4.5 28 3.5 27 3.5 26
                        C 3.5 25 4.5 24 6 22
                        C 7 24 9 21 12 18
                        C 18 17 23 13 24 7
                        Z
                      "
                      fill="url(#tealBtnBg)"
                      stroke="url(#goldBorderPrimary)"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Top enamel highlight */}
                    <path 
                      d="M 26 8 C 45 6 70 5.5 115 5.5 C 160 5.5 185 6 204 8"
                      stroke="#ffffff"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      opacity="0.4"
                    />

                    {/* Cardinal & Corner Soft Gold Pearls */}
                    <circle cx="115" cy="1.5" r="0.9" fill="#fae8be" />
                    <circle cx="115" cy="50.5" r="0.9" fill="#fae8be" />
                    <circle cx="2" cy="26" r="0.9" fill="#fae8be" />
                    <circle cx="228" cy="26" r="0.9" fill="#fae8be" />
                    <circle cx="16" cy="11" r="0.8" fill="#dfbe7a" opacity="0.75" />
                    <circle cx="214" cy="11" r="0.8" fill="#dfbe7a" opacity="0.75" />
                    <circle cx="214" cy="41" r="0.8" fill="#dfbe7a" opacity="0.75" />
                    <circle cx="16" cy="41" r="0.8" fill="#dfbe7a" opacity="0.75" />
                  </svg>

                  {/* Button Content */}
                  <span className="relative z-10 text-white font-serif font-medium text-sm sm:text-base tracking-wide flex items-center gap-2.5 drop-shadow-sm">
                    <span>Delege Başvuru Formu</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-white" />
                  </span>
                </Link>

                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="group relative inline-flex items-center justify-center h-[52px] px-8 transition-all duration-300 transform hover:-translate-y-0.5 hover:brightness-105 cursor-pointer select-none"
                >
                  {/* Seljuk Dark Navy Cartouche SVG Background */}
                  <svg 
                    className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-lg"
                    viewBox="0 0 180 52"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="goldBorderSecondary" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fae8be" />
                        <stop offset="25%" stopColor="#dfbe7a" />
                        <stop offset="60%" stopColor="#ab8438" />
                        <stop offset="85%" stopColor="#e2c17f" />
                        <stop offset="100%" stopColor="#fae8be" />
                      </linearGradient>
                      <radialGradient id="navyBtnBg" cx="50%" cy="50%" r="70%">
                        <stop offset="0%" stopColor="#0e2a44" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#051627" stopOpacity="0.95" />
                      </radialGradient>
                    </defs>

                    {/* Soft Cartouche Body */}
                    <path 
                      d="
                        M 24 7
                        C 38 5 55 4 80 4
                        C 86 3 88 2 90 2
                        C 92 2 94 3 100 4
                        C 125 4 142 5 156 7
                        C 157 13 162 17 168 18
                        C 171 21 173 24 174 22
                        C 175.5 24 176.5 25 176.5 26
                        C 176.5 27 175.5 28 174 30
                        C 173 28 171 31 168 34
                        C 162 35 157 39 156 45
                        C 142 47 125 48 100 48
                        C 94 49 92 50 90 50
                        C 88 50 86 49 80 48
                        C 55 48 38 47 24 45
                        C 23 39 18 35 12 34
                        C 9 31 7 28 6 30
                        C 4.5 28 3.5 27 3.5 26
                        C 3.5 25 4.5 24 6 22
                        C 7 24 9 21 12 18
                        C 18 17 23 13 24 7
                        Z
                      "
                      fill="url(#navyBtnBg)"
                      stroke="url(#goldBorderSecondary)"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Cardinal & Corner Soft Gold Pearls */}
                    <circle cx="90" cy="1.5" r="0.9" fill="#fae8be" />
                    <circle cx="90" cy="50.5" r="0.9" fill="#fae8be" />
                    <circle cx="2" cy="26" r="0.9" fill="#fae8be" />
                    <circle cx="178" cy="26" r="0.9" fill="#fae8be" />
                    <circle cx="16" cy="11" r="0.8" fill="#dfbe7a" opacity="0.75" />
                    <circle cx="164" cy="11" r="0.8" fill="#dfbe7a" opacity="0.75" />
                    <circle cx="164" cy="41" r="0.8" fill="#dfbe7a" opacity="0.75" />
                    <circle cx="16" cy="41" r="0.8" fill="#dfbe7a" opacity="0.75" />
                  </svg>

                  {/* Button Content */}
                  <span className="relative z-10 text-white font-serif font-medium text-sm sm:text-base tracking-wide flex items-center gap-2.5 drop-shadow-sm">
                    <Play className="w-4 h-4 fill-[#26c6da] text-[#26c6da] transition-transform group-hover:scale-110" />
                    <span>Tanıtım Filmi</span>
                  </span>
                </button>
              </div>

            </div>

            {/* Right Column: Editorial Quote Text Overlay (positioned further right per user request) */}
            <div className="hidden lg:flex lg:col-span-5 justify-end lg:pr-2 xl:pr-6 2xl:pr-10 lg:translate-x-6 xl:translate-x-12 2xl:translate-x-16">
              <div className="text-right space-y-2">
                <p className="font-serif italic text-4xl xl:text-5xl 2xl:text-6xl text-white/95 font-light leading-tight tracking-wide whitespace-pre-line drop-shadow-md">
                  {hp.editorialQuote || "Fikir\nÜreten\nGençlik\nMeclisi"}
                </p>
                <div className="w-20 h-1 bg-[#4DA3FF] ml-auto mt-4 rounded-full shadow-sm" />
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. LIGHT / EDITORIAL SECTION (BİREBİR REFERANS GÖRSEL TASARIMI)           */}
      {/* ========================================================================= */}
      <section className="bg-white text-[#061A33] py-20 lg:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading, description, and dual action buttons */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                {hp.aboutSummary?.tag || "— Neden İrfan Meclisi?"}
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#061A33] tracking-tight leading-tight">
                {hp.aboutSummary?.heading || "Sadece Dinleyen Değil, Geleceği Şekillendiren Gençlik"}
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
                {hp.aboutSummary?.paragraph || "ÖNDER İmam Hatipliler Derneği öncülüğünde gerçekleştirilen İrfan Meclisi; gençlerin Türkiye'nin temel meseleleri üzerinde derinlemesine düşünmelerini, analitik argüman geliştirmelerini ve uzlaşma kültürüyle kanun teklifleri hazırlamalarını sağlayan öncü bir meclis simülasyonudur."}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-2 w-full sm:w-auto">
                <Link
                  href="/hakkinda"
                  className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-full bg-[#061A33] hover:bg-[#0D3156] text-white text-xs sm:text-sm font-bold shadow-lg transition-all text-center cursor-pointer"
                >
                  <span>Vizyon ve Tarihçeyi Oku</span>
                  <ArrowRight className="w-4 h-4 text-[#4DA3FF]" />
                </Link>

                <Link
                  href="/basvuru"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border-2 border-slate-300 hover:border-[#061A33] text-[#061A33] text-xs sm:text-sm font-bold transition-all text-center cursor-pointer"
                >
                  <span>Delege Başvuru Formu</span>
                </Link>
              </div>

            </div>

            {/* Right Column: Split Image Card with Attached Dark Navy Quote Card */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-[#061A33] flex flex-col md:flex-row items-stretch">
                
                {/* Photo of delegate raising hand in assembly */}
                <div className="relative w-full md:w-3/5 h-64 sm:h-72 md:h-96">
                  <Image
                    src={hp.aboutSummary?.imageUrl || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80"}
                    alt="Genç Delege Söz Hakkı Alırken"
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#061A33]/80 md:block hidden" />
                </div>

                {/* Attached dark navy quote panel */}
                <div className="w-full md:w-2/5 bg-[#061A33] p-6 sm:p-8 flex flex-col justify-center text-white relative">
                  <p className="font-serif italic text-lg sm:text-xl text-white/95 leading-relaxed">
                    {hp.aboutSummary?.quote || "“Daha iyi bir gelecek, gençlerin fikirleriyle mümkün.”"}
                  </p>
                  <div className="w-12 h-0.5 bg-[#4DA3FF] mt-4" />
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FOUR-COLUMN FEATURE STRIP (BİREBİR REFERANS GÖRSEL TASARIMI)           */}
      {/* ========================================================================= */}
      <section className="bg-[#061A33] border-b border-blue-900/30 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            {features.map((feat, idx) => {
              const IconComponent = iconComponentMap[feat.iconName] || Users;
              return (
                <div 
                  key={idx} 
                  className={`pt-6 sm:pt-0 sm:px-6 flex flex-col items-center text-center space-y-3 ${
                    idx === 0 ? 'first:pl-0' : ''
                  } ${idx === features.length - 1 ? 'last:pr-0' : ''}`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#092746] border border-[#4DA3FF]/30 flex items-center justify-center text-[#4DA3FF] mb-1">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-200 leading-snug">
                    {feat.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. EVENT ATMOSPHERE SHOWCASE (BİREBİR REFERANS GÖRSEL TASARIMI)           */}
      {/* ========================================================================= */}
      <section className="bg-[#030D1A] py-20 border-b border-blue-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="space-y-3 max-w-xl">
              <div className="text-xs font-bold tracking-wider text-[#4DA3FF] uppercase">
                {hp.atmosphere?.tag || "— ETKİNLİKTE YAŞAMAK İÇİN"}
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-tight">
                {hp.atmosphere?.heading || "Geleceğin Liderleri Burada Buluşuyor"}
              </h2>
              <p className="text-sm text-slate-400 font-sans">
                {hp.atmosphere?.description || "İrfan Meclisi, fikirlerin gerçeğe dönüştüğü, gençliğin gücünün hissedildiği bir platformdur."}
              </p>
            </div>

            {/* Slider Navigation Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={prevAtmosphere}
                className="w-10 h-10 rounded-full border border-slate-700 bg-[#092746] hover:bg-[#0D3156] flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Önceki Fotoğraf"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextAtmosphere}
                className="w-10 h-10 rounded-full border border-slate-700 bg-[#092746] hover:bg-[#0D3156] flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Sonraki Fotoğraf"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 3 Photo Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentAtmosphereSlice.map((photo, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#092746] border border-white/10 shadow-xl transition-all duration-300 hover:border-[#4DA3FF]/50"
              >
                <Image
                  src={photo.url}
                  alt={photo.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030D1A] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[11px] text-[#4DA3FF] font-semibold block mb-0.5">
                    {photo.subtitle}
                  </span>
                  <h3 className="text-base font-serif font-bold text-white">
                    {photo.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PRESERVED: SAYILARLA İRFAN GENÇ MECLİSİ 2026                            */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#061A33] border-b border-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#0D3156] border border-[#4DA3FF]/30 text-[#4DA3FF] uppercase tracking-wider">
              Rakamlarla Meclis
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Sayılarla İrfan Meclisi 2026
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300">
              Konya Selçuklu Kongre Merkezi'nde gerçekleşecek tarihi buluşmanın organizasyon gücü ve delege kapasitesi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl p-6 bg-[#092746] border border-[#4DA3FF]/15 hover:border-[#4DA3FF]/40 transition-all flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#0D3156] border border-[#4DA3FF]/30 flex items-center justify-center text-[#4DA3FF] mb-4 shadow-md">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-mono font-bold text-white tracking-tight">
                        {item.value}
                      </span>
                      <span className="text-2xl font-bold text-[#4DA3FF]">
                        {item.suffix}
                      </span>
                    </div>
                    <h3 className="mt-2 text-base font-serif font-bold text-slate-100">
                      {item.label}
                    </h3>
                  </div>
                  <p className="mt-3 text-xs text-slate-400 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PRESERVED: 8 İHTİSAS MASASI (KOMİSYONLAR) ÖNİZLEME VİTRİNİ             */}
      {/* ========================================================================= */}
      <section className="py-24 bg-[#030D1A] border-b border-blue-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider text-[#4DA3FF] uppercase mb-2 block">
                {hp.commissionsSection?.tag || "— GELECEĞE YÖN VEREN MASALAR"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                {hp.commissionsSection?.heading || "8 İhtisas Komisyonu"}
              </h2>
              <p className="text-sm text-slate-400 mt-2 max-w-2xl">
                {hp.commissionsSection?.description || "Her komisyon, alanında uzman mentörler ve raportörler eşliğinde Türkiye'nin ve dünyanın stratejik meselelerini masaya yatırır."}
              </p>
            </div>

            <Link
              href="/komisyonlar"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#092746] hover:bg-[#0D3156] border border-[#4DA3FF]/30 text-white text-xs font-semibold transition-all shrink-0 cursor-pointer"
            >
              <span>Tüm Komisyonları İncele</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#4DA3FF]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {commissionsList.map((commission, idx) => (
              <CommissionCard
                key={commission.id}
                commission={commission}
                number={`0${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PRESERVED: 3 GÜNLÜK MECLİS ZİRVESİ PROGRAM ÖZETİ                       */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#061A33] border-b border-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#0D3156] border border-[#4DA3FF]/30 text-[#4DA3FF] uppercase tracking-wider">
              {hp.programSection?.tag || "Meclis Takvimi"}
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              {hp.programSection?.heading || "Üç Günlük Zirve Akışı"}
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              {hp.programSection?.description || "23-24-25 Ekim 2026 Selçuklu Kongre Merkezi'nde adım adım meclis heyecanı."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programDays.map((day) => (
              <div
                key={day.dayNumber}
                className="p-6 rounded-2xl bg-[#092746] border border-[#4DA3FF]/20 flex flex-col justify-between hover:border-[#4DA3FF]/50 transition-all shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#0D3156] text-[#4DA3FF] border border-[#4DA3FF]/30">
                      {day.dayNumber}. GÜN
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {day.date}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-white mb-2">
                    {day.title}
                  </h3>
                  <p className="text-xs text-[#4DA3FF] font-medium mb-4">
                    {day.theme}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-700/50 text-xs text-slate-300">
                    {day.sessions.slice(0, 3).map((sess) => (
                      <div key={sess.id} className="flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-mono text-slate-400 mr-1.5">{sess.time}</span>
                          <span className="text-slate-200">{sess.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href="/program"
                    className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-[#0D3156] hover:bg-[#258BF5] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Günün Detaylı Akışı</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. PRESERVED: SPONSORS & DESTEKÇİLER ŞERİDİ                                */}
      {/* ========================================================================= */}
      <SponsorsMarquee />

      {/* ========================================================================= */}
      {/* 9. PRESERVED: SIKÇA SORULAN SORULAR (FAQ)                                 */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#030D1A] border-b border-blue-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#0D3156] border border-[#4DA3FF]/30 text-[#4DA3FF] uppercase tracking-wider">
              Merak Edilenler
            </span>
            <h2 className="mt-3 text-3xl font-serif font-bold text-white tracking-tight">
              Sıkça Sorulan Sorular
            </h2>
          </div>

          <div className="space-y-4">
            {(hp.faq || FAQ_ITEMS).map((item: any, idx: number) => {
              const isOpen = activeFaq === idx;
              const question = item.question || item.q;
              const answer = item.answer || item.a;
              return (
                <div
                  key={item.id || idx}
                  className="rounded-xl bg-[#092746] border border-[#4DA3FF]/15 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 text-white font-serif font-semibold text-base hover:text-[#4DA3FF] transition-colors cursor-pointer"
                  >
                    <span>{question}</span>
                    <ChevronDown className={`w-4 h-4 text-[#4DA3FF] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-700/40">
                      {answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. PRESERVED: FİNAL DELEGE BAŞVURU ÇAĞRISI                               */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#061A33]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-12 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#092746] to-[#0D3156] border border-[#4DA3FF]/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 text-center md:text-left">
            <div className="space-y-2">
              <h3 className="text-xl sm:text-3xl font-serif font-bold text-white">
                {hp.finalCta?.heading || "Geleceğin Meclisinde Yerinizi Alın"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                {hp.finalCta?.description || "250 asil delege kontenjanı için başvurular devam etmektedir. Kişisel QR kodlu biletiniz başvuru sonrası anında oluşturulur."}
              </p>
            </div>
            <Link
              href="/basvuru"
              className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#258BF5] hover:bg-[#1e7bdc] text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-900/50 transition-all shrink-0 transform hover:-translate-y-0.5 w-full sm:w-auto cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{hp.finalCta?.buttonText || "Delege Başvuru Formuna Git"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Video Modal Trigger */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        title="İrfan Meclisi 2026 Tanıtım Filmi"
      />

    </div>
  );
}
