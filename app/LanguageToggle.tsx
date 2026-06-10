'use client'

import { useLanguage } from './LanguageContext'

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-0.5 rounded-full px-1 py-1"
      style={{ background: 'rgba(20,12,6,0.85)', border: '1px solid rgba(120,80,30,0.4)', backdropFilter: 'blur(8px)' }}
    >
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider transition-colors ${
          lang === 'en'
            ? 'bg-amber-700 text-amber-100'
            : 'text-stone-500 hover:text-stone-300'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('fr')}
        className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider transition-colors ${
          lang === 'fr'
            ? 'bg-amber-700 text-amber-100'
            : 'text-stone-500 hover:text-stone-300'
        }`}
      >
        FR
      </button>
    </div>
  )
}
