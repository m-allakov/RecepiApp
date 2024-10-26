import { useState, useCallback } from 'react';
import { en } from '../i18n/en';
import { tr } from '../i18n/tr';

const translations = { en, tr };
type Language = 'en' | 'tr';

export function useTranslation(initialLanguage: Language = 'en') {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(initialLanguage);

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];
    
    for (const k of keys) {
      if (value[k] === undefined) {
        return key;
      }
      value = value[k];
    }
    
    return value;
  }, [currentLanguage]);

  const toggleLanguage = useCallback(() => {
    setCurrentLanguage(prev => prev === 'en' ? 'tr' : 'en');
  }, []);

  return { t, toggleLanguage, currentLanguage };
}