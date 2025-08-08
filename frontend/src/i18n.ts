import i18next from 'i18next';

void i18next.init({
  lng: 'en',
  resources: {
    en: { translation: { signup: 'Volunteer Signup', admin: 'NGO Admin', analytics: 'Analytics' } },
    ar: { translation: { signup: 'تطوع', admin: 'إدارة الجمعية', analytics: 'تحليلات' } },
  },
});

export default i18next;