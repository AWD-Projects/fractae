export type Locale = 'es' | 'en' | 'fr';

export interface Funcionalidad {
  id: string;
  icon: string;
}

export interface Beneficio {
  id: string;
  icon: string;
  destacado: boolean;
}

export type ContactCanal = 'whatsapp' | 'email';

export interface ContactFormData {
  nombre: string;
  canal: ContactCanal;
  contacto: string;
}
