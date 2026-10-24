// Carga el repertorio inicial (docs/repertorio-antiguas-vanguardias-3.pdf + Michael Jackson).
// Solo agrega las canciones que falten, así que se puede correr de nuevo sin duplicar nada.
//   npm run db:seed            -> solo repertorio
//   npm run db:seed -- --demo  -> además, conciertos de ejemplo (solo para probar en local)
import { config } from "dotenv";

config({ path: ".env.local" });

type Entry = [category: string, section: string | null, work: string, artist: string | null, titles: string[]];

const ART = "Artistas";
const FILM = "Películas / Anime";
const OTHER = "Otras películas";
const GHIBLI = "Studio Ghibli";
const GAMES = "Videojuegos";
const HZ = "Hans Zimmer";
const JH = "Joe Hisaishi";

const repertoire: Entry[] = [
  [ART, null, "ABBA", "ABBA", ["Angeleyes", "Chiquitita", "Dancing Queen", "Fernando", "Gimme Gimme Gimme", "Knowing Me Knowing You", "Lay All Your Love On Me", "Mamma Mia", "Money, Money, Money", "SOS", "Super Trouper", "Thank You for the Music", "The Winner Takes All", "Voulez-Vous"]],
  [ART, null, "Adele", "Adele", ["All I Ask", "Chasing Pavements", "Easy On Me", "Hello", "Make You Feel My Love", "Oh My God", "Rolling in the Deep", "Rumour Has It", "Send My Love to Your New Lover", "Set Fire to the Rain", "Skyfall", "Someone Like You", "Water Under the Bridge", "When We Were Young"]],
  [ART, null, "Bee Gees", "Bee Gees", ["Stayin' Alive"]],
  [ART, null, "Coldplay", "Coldplay", ["Adventure of a Lifetime", "Clocks", "Feels Like I'm Falling in Love", "Fix You", "Hymn for the Weekend", "My Universe", "Paradise", "Shiver", "Sky Full of Stars", "Something Just Like This", "Speed of Sound", "The Scientist", "Trouble", "Viva La Vida", "Yellow"]],
  [ART, null, "Ed Sheeran", "Ed Sheeran", ["Bad Habits", "Give Me Love", "Perfect", "Photograph", "Shape of You", "Shivers"]],
  [ART, null, "Michael Jackson", "Michael Jackson", ["Bad", "Beat It", "Billie Jean", "Black or White", "Don't Stop 'Til You Get Enough", "Human Nature", "Man in the Mirror", "Medley (Earth Song/Heal the World/They Don't Really Care About Us)", "Remember the Time", "Rock With You", "Say Say Say", "Smooth Criminal", "The Way You Make Me Feel", "Thriller", "We Are the World"]],
  [ART, null, "Miley Cyrus", "Miley Cyrus", ["Wrecking Ball"]],
  [ART, null, "Queen", "Queen", ["Another One Bites The Dust", "Bicycle Race", "Bohemian Rhapsody", "Crazy Little Thing Called Love", "Don't Stop Me Now", "Fat Bottomed Girls", "Good Old-Fashioned Lover Boy", "I Want It All", "I Want to Break Free", "Killer Queen", "Love Of My Life", "Radio Gaga", "Save Me", "Somebody to Love", "Thank God It's Christmas", "The Show Must Go On", "Under Pressure", "We Will Rock You", "We are the Champions", "Who Wants To Live Forever", "You are my Best Friend"]],
  [ART, null, "Soda Stereo", "Gustavo Cerati", ["Adiós", "Crimen", "Cuando Pase El Temblor", "De Música Ligera", "Ella Usó Mi Cabeza Como un Revólver", "En la Ciudad de la Furia", "Entre Caníbales", "Nada Personal", "Persiana Americana", "Prófugos", "Trátame suavemente", "Té Para 3"]],
  [ART, null, "The Beatles", "The Beatles", ["A Day In The Life", "Blackbird", "Come Together", "Eleanor Rigby", "Help!", "Here Comes The Sun", "Hey Jude", "I Want To Hold Your Hand", "Let it Be", "Michelle", "Penny Lane", "Strawberry Fields Forever", "While My Guitar Gently Weeps", "With a Little Help From My Friends", "Yesterday"]],

  [FILM, OTHER, "Dune", HZ, ["Suite"]],
  [FILM, OTHER, "El Rey León", "Elton John", ["Can You Feel The Love Tonight"]],
  [FILM, OTHER, "El Rey León", HZ, ["This Land"]],
  [FILM, OTHER, "El Último Samurai", HZ, ["Red Warrior"]],
  [FILM, OTHER, "Gladiator", HZ, ["Now We Are Free", "Suite"]],
  [FILM, OTHER, "Inception", HZ, ["Time"]],
  [FILM, OTHER, "Interstellar", HZ, ["Interstellar Medley (short)"]],
  [FILM, OTHER, "Madagascar", HZ, ["Zooster's Breakout"]],
  [FILM, OTHER, "Man of Steel", HZ, ["Flight"]],
  [FILM, OTHER, "Piratas del Caribe", HZ, ["He's a Pirate", "Suite"]],
  [FILM, OTHER, "Sherlock Holmes", HZ, ["Discombobulate"]],
  [FILM, OTHER, "The Dark Knight", HZ, ["A Dark Knight"]],
  [FILM, OTHER, "The Pacific", HZ, ["Honor"]],
  [FILM, OTHER, "Top Gun", HZ, ["Main Theme"]],
  [FILM, OTHER, "Wonder Woman", HZ, ["Main Theme"]],

  [FILM, GHIBLI, "Castillo Ambulante", JH, ["Merry Go Round Life (人生のメリーゴーランド)", "The Promise of the World (世界の約束)"]],
  [FILM, GHIBLI, "Castillo en el Cielo", JH, ["Carrying You (君をのせて)"]],
  [FILM, GHIBLI, "El Viaje de Chihiro", JH, ["Always with Me (いつも何度でも)", "One Summer's Day (あの夏へ)", "Reprise (ふたたび)"]],
  [FILM, GHIBLI, "Kiki Entregas a Domicilio", JH, ["A Town with an Ocean View (海の見える街)", "Mother's Broom"]],
  [FILM, GHIBLI, "Mi Vecino Totoro", JH, ["Main Theme (となりのトトロ)", "Stroll (さんぽ)", "The Path of the Wind (風のとおり道)"]],
  [FILM, GHIBLI, "Nausicaa", JH, ["The Bird Man (鳥の人)"]],
  [FILM, GHIBLI, "Ponyo", JH, ["Main Theme (崖の上のポニョ)"]],
  [FILM, GHIBLI, "Princesa Mononoke", JH, ["Legend of Ashitaka (アシタカせっ記)", "Main Theme (もののけ姫)"]],

  ["Televisión", null, "31 Minutos", "31 Minutos", ["Mi equilibrio espiritual"]],

  [GAMES, null, "Chrono Trigger", "Yasunori Mitsuda", ["Main Theme"]],
  [GAMES, null, "Clair Obscur: Expedition 33", "Lorien Testard", ["Medley (Alicia/Lumière/Lost Voice)"]],
  [GAMES, null, "Elden Ring", "Tsukasa Saito", ["Main Theme"]],
  [GAMES, null, "Final Fantasy VII", "Nobuo Uematsu", ["One-Winged Angel"]],
  [GAMES, null, "Hollow Knight", "Christopher Larkin", ["Medley (Hollow Knight/Mantis Lords/Cogwork Dancers)"]],
  [GAMES, null, "NieR", "Keiichi Okabe", ["Medley (Shadowlord/Grandma/Fleeting World)"]],
  [GAMES, null, "Shadow of the Colossus", "Kow Otani", ["Medley (Violent/Opened Way)"]],
  [GAMES, null, "Super Mario", "Koji Kondo", ["Medley (Super Mario Bros/2/3/World/Galaxy)"]],
  [GAMES, null, "The Legend of Zelda", "Koji Kondo", ["Medley (Main Theme/Dungeon/Hyrule Field/Palace/Zelda's Lullaby)"]],
  [GAMES, null, "Undertale", "Toby Fox", ["Megalovania"]],
];

function inDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

async function main() {
  // Import dinámico: el cliente de la base debe crearse después de cargar .env.local.
  const { db } = await import("../src/db");
  const { concerts, songs } = await import("../src/db/schema");

  const key = (work: string, title: string) => `${work}\u0000${title}`.toLowerCase();
  const existing = new Set(
    (await db.select({ work: songs.work, title: songs.title }).from(songs)).map((s) => key(s.work, s.title)),
  );
  const missing = repertoire
    .flatMap(([category, section, work, artist, titles]) =>
      titles.map((title) => ({ category, section, work, artist, title })),
    )
    .filter((s) => !existing.has(key(s.work, s.title)));

  if (missing.length > 0) await db.insert(songs).values(missing);
  console.log(`Canciones agregadas: ${missing.length} (ya había ${existing.size}).`);

  if (process.argv.includes("--demo")) {
    await db.insert(concerts).values([
      { title: "Tributo a Coldplay", organizer: "Candlelight", date: inDays(9), time: "19:00", venue: "Teatro Biobío", city: "Concepción", ticketUrl: "https://feverup.com/", isPublic: true },
      { title: "Tributo a Queen", organizer: "Candlelight", date: inDays(16), time: "20:30", venue: "Teatro Municipal de Chillán", city: "Chillán", ticketUrl: "https://feverup.com/", isPublic: true },
      { title: "Lo mejor de Studio Ghibli", organizer: "Candlelight", date: inDays(23), time: "21:00", venue: "Teatro Diego Rivera", city: "Puerto Montt", ticketUrl: "https://feverup.com/", isPublic: true },
      { title: "Matrimonio Pérez–Soto", date: inDays(30), time: "17:00", venue: "Casona Las Tranqueras", city: "Concepción", isPublic: false, notes: "Llegar 16:00. Entrada: Canon. Salida: Viva La Vida." },
      { title: "Michael Jackson para cuerdas", date: inDays(44), time: "19:30", venue: "Teatro UdeC", city: "Concepción", ticketUrl: "https://www.ticketplus.cl/", isPublic: true },
      { title: "Tributo a Soda Stereo", organizer: "Candlelight", date: inDays(-12), time: "20:00", venue: "Teatro Biobío", city: "Concepción", isPublic: true },
    ]);
    console.log("Conciertos de ejemplo agregados.");
  }
}

main().then(() => process.exit(0));
