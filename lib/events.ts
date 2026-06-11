export interface ConcertEvent {
  id: string
  date: string
  dateFr: string
  isoDate: string
  artist: string
  genre: string | null
  genreFr: string | null
  price: number
  bgColor: string
  borderColor: string
  textColor: string
  badgeBg: string
}

export const EVENTS: ConcertEvent[] = [
  {
    id: 'rob-lutes-bobby-stagg',
    date: 'June 6',
    dateFr: '6 juin',
    isoDate: '2026-06-06',
    artist: 'Rob Lutes & Bobby Stagg',
    genre: 'Roots Music',
    genreFr: 'Musique roots',
    price: 25,
    bgColor: '#1a4731',
    borderColor: '#2d7a52',
    textColor: '#d4edda',
    badgeBg: '#0f3320',
  },
  {
    id: 'comedy-fest',
    date: 'June 13',
    dateFr: '13 juin',
    isoDate: '2026-06-10',
    artist: 'Dunany Comedy Fest',
    genre: 'Joey Elias Headliner',
    genreFr: "Joey Elias en tête d'affiche",
    price: 25,
    bgColor: '#5a0e0e',
    borderColor: '#9b2226',
    textColor: '#ffd6d6',
    badgeBg: '#3d0808',
  },
  {
    id: 'bokomaru',
    date: 'June 20',
    dateFr: '20 juin',
    isoDate: '2026-06-20',
    artist: 'Bokomaru',
    genre: 'Grateful Dead Tribute',
    genreFr: 'Hommage aux Grateful Dead',
    price: 25,
    bgColor: '#2e1065',
    borderColor: '#6d28d9',
    textColor: '#ede9fe',
    badgeBg: '#1e0a4a',
  },
  {
    id: 'blue-rodeo-tribute',
    date: 'July 11',
    dateFr: '11 juillet',
    isoDate: '2026-07-11',
    artist: 'Blue Rodeo Tribute Singers',
    genre: null,
    genreFr: null,
    price: 25,
    bgColor: '#0c2461',
    borderColor: '#1e6bbd',
    textColor: '#d0e8f8',
    badgeBg: '#081a47',
  },
  {
    id: 'nils-brown',
    date: 'Aug. 28',
    dateFr: '28 août',
    isoDate: '2026-08-28',
    artist: 'Nils Brown en Spectacle',
    genre: null,
    genreFr: null,
    price: 25,
    bgColor: '#5c2a00',
    borderColor: '#b35900',
    textColor: '#fff0d0',
    badgeBg: '#3d1c00',
  },
  {
    id: 'guy-belanger',
    date: 'Sept. 12',
    dateFr: '12 sept.',
    isoDate: '2026-09-12',
    artist: 'Guy Bélanger',
    genre: "Canada's Best Harmonica Player",
    genreFr: "Le meilleur joueur d'harmonica au Canada",
    price: 30,
    bgColor: '#4a3a00',
    borderColor: '#c9a227',
    textColor: '#fff8d0',
    badgeBg: '#332800',
  },
]

export function getEventById(id: string): ConcertEvent | undefined {
  return EVENTS.find((e) => e.id === id)
}

export function isPast(event: ConcertEvent): boolean {
  const today = new Date().toISOString().slice(0, 10)
  return event.isoDate < today
}
