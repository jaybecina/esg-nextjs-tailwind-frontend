
import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "Home": "Home",
      "Company List": "Company List",
      "User List": "User List",
      "Material": "Material",
      "Form": "Form",
      "Report": "Report",
      "Dashboard": "Dashboard",
      "Unit": "Unit",
      "CMS": "CMS",
      "Message": "Message",
      "Help": "Help",
    }
  },
};


i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    resources,
    ns: ["translation"],
    // supportedLngs: ["en", "zh", "fil"],
    lng: "en",
    detection: {
      order: ['localStorage', 'htmlTag', 'path', 'subdomain'],
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;