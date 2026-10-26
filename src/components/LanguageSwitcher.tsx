import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { switchLanguage, type SupportedLanguage } from '../i18n';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const currentLang = (i18n.language.startsWith('ml') ? 'ml' : 'en') as SupportedLanguage;

  return (
    <div
      role="group"
      aria-label={t('language')}
      className="inline-flex items-center p-1 bg-slate-800/90 border border-slate-700/80 rounded-xl shadow-sm"
    >
      <div className="pl-2 pr-1 text-slate-400 flex items-center" aria-hidden="true">
        <Languages className="w-4 h-4 text-emerald-400" />
      </div>

      <button
        type="button"
        onClick={() => switchLanguage('en')}
        aria-pressed={currentLang === 'en'}
        className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
          currentLang === 'en'
            ? 'bg-emerald-600 text-white shadow-md'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
        }`}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => switchLanguage('ml')}
        aria-pressed={currentLang === 'ml'}
        className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans ${
          currentLang === 'ml'
            ? 'bg-emerald-600 text-white shadow-md'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
        }`}
      >
        മലയാളം
      </button>
    </div>
  );
}
