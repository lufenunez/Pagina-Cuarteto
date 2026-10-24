// Datos públicos del cuarteto. Cambia aquí el correo, redes, fotos e integrantes.
// Las fotos web están en /public/fotos (versiones livianas de las originales).
export const site = {
  name: "Antiguas Vanguardias",
  description:
    "Cuarteto de cuerdas de Concepción, Chile. Pop, rock, cine, anime y videojuegos arreglados para dos violines, viola y violonchelo.",
  city: "Concepción, Chile",
  // Cuando tengan el correo, ponerlo aquí ("contacto@..."): aparece solo en contacto, pie de página y PDF.
  email: null as string | null,
  instagram: "https://www.instagram.com/antiguasvanguardias",
  instagramHandle: "@antiguasvanguardias",
  photos: {
    hero: "/fotos/cuarteto-portada.jpg",
    contact: "/fotos/cuarteto-contacto.jpg",
  },
  // Ciudades donde tocan: se muestran en la portada y como sugerencias en el admin.
  cities: ["Concepción", "Chillán", "Puerto Montt"],
  // Tipos de evento de la sección "También en tu evento".
  services: [
    { title: "Matrimonios", text: "Ceremonia, cóctel y entrada de los novios, con las canciones que ustedes elijan." },
    { title: "Eventos de empresa", text: "Lanzamientos, aniversarios, cenas y premiaciones." },
    { title: "Celebraciones privadas", text: "Cumpleaños, aniversarios y sorpresas, en tu casa o en el lugar que elijas." },
    { title: "Conciertos", text: "Teatros, salas y ciclos como Candlelight, con programas temáticos." },
  ],
  // Nombres destacados en la sección "Repertorio" de la portada, en este orden.
  featured: [
    "Queen",
    "Michael Jackson",
    "Coldplay",
    "The Beatles",
    "Soda Stereo",
    "ABBA",
    "Adele",
    "Ed Sheeran",
    "Hans Zimmer",
    "Studio Ghibli",
    "31 Minutos",
    "The Legend of Zelda",
  ],
  // Los dos violines van sin "I"/"II": se turnan según el concierto.
  members: [
    { name: "Abigail", instrument: "Violín", photo: "/fotos/abigail.jpg" },
    { name: "Jesús", instrument: "Violín", photo: "/fotos/jesus.jpg" },
    { name: "Flavio", instrument: "Viola", photo: "/fotos/flavio.jpg" },
    { name: "Luis", instrument: "Violonchelo", photo: "/fotos/luis.jpg" },
  ],
};
