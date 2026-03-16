export const themeConfig = {

  // ─── MARCA ────────────────────────────────────────────────
  brand: {
    name: "Silvina Salvatori",
    nameHighlight: "Salvatori", // parte del nombre en color primario
    tagline: "Excelencia Inmobiliaria",
    logo: null, // ruta a imagen si hay, null usa el nombre en texto
  },

  // ─── COLORES ──────────────────────────────────────────────
  colors: {
    primary: "#D81B60",      // magenta — color principal de marca
    dark: "#1A1A1A",         // fondo oscuro, textos fuertes
    gray: "#F5F5F5",         // fondo claro de secciones
    lightGray: "#E5E5E5",    // bordes y separadores
  },

  // ─── TIPOGRAFÍA ───────────────────────────────────────────
  fonts: {
    display: "Montserrat",   // títulos y headings
    body: "Inter",           // textos y párrafos
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Inter:wght@300;400;500;700&display=swap",
  },

  // ─── CONTACTO ─────────────────────────────────────────────
  contact: {
    whatsapp: "+5493489497532",
    whatsappMessage: "Hola Silvina, estuve viendo tu sitio web y quería realizar una consulta.",
    email: "inmobiliariasalvatori@gmail.com",
    emailSubject: "Consulta desde Sitio Web",
    address: 'Bertolini 385 "B"',
    city: "Campana, Buenos Aires",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Silvina+Salvatori+Inmobiliaria+Campana",
    instagram: "https://www.instagram.com/inmosilvinasalvatori",
    facebook: "https://www.facebook.com/SilvinaSalvatoriInmobiliaria",
  },

  // ─── SEO ──────────────────────────────────────────────────
  seo: {
    title: "Silvina Salvatori | Servicios Inmobiliarios y Asesoría Legal",
    description: "Venta y alquiler de propiedades en Campana y alrededores. Gestión inmobiliaria integral con asesoramiento legal especializado.",
    url: "https://inmosilvinasalvatori.vercel.app",
    ogImage: "https://inmosilvinasalvatori.vercel.app/og-image.png",
    keywords: "inmobiliaria Campana, Silvina Salvatori, alquileres Campana, venta casas Campana",
  },

  // ─── HERO ─────────────────────────────────────────────────
  hero: {
    badge: "Excelencia en Campana",
    headline: "Tu próxima",
    headlineHighlight: "inversión",
    headlineSuffix: "empieza aquí",
    subheadline: "Encuentra propiedades exclusivas con el respaldo y la trayectoria de",
    searchPlaceholder: "¿Qué estás buscando? (Zona, ciudad...)",
    backgroundImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop",
  },

  // ─── SECCIONES VISIBLES ───────────────────────────────────
  features: {
    showMap: true,           // toggle vista mapa en listado
    showFilters: true,       // filtro venta/alquiler
    showFeaturedBadge: true, // badge "Destacada" en propiedades
    showPropertyShare: true, // botón compartir en detalle
    showPropertyMap: true,   // mapa en detalle de propiedad
    showAboutSection: false, // sección "Sobre nosotros" (pendiente)
    showTestimonials: false, // sección testimonios (pendiente)
  },

  // ─── TEXTOS DEL FOOTER ────────────────────────────────────
  footer: {
    tagline: "Transformando sueños en hogares con profesionalismo y calidez humana en la zona de Campana y alrededores.",
    developerName: "Sansol Stack",
    developerWhatsapp: "5492216760935",
    developerMessage: "Hola Lucas! Te contacto por SanSol Stack.",
    copyright: "Silvina Salvatori. Todos los derechos reservados.",
  },

} as const;

export type ThemeConfig = typeof themeConfig;