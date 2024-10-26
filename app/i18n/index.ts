import { en } from './en';
import { tr } from './tr';

export const i18n = {
    en,
    tr
};

let currentLanguage = 'tr'; // Varsayılan dil Türkçe

export function setLanguage(lang: 'en' | 'tr') {
    currentLanguage = lang;
}

export function t(key: string): string {
    const keys = key.split('.');
    let value = i18n[currentLanguage];
    
    for (const k of keys) {
        if (value[k] === undefined) {
            return key;
        }
        value = value[k];
    }
    
    return value;
}