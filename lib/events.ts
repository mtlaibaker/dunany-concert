export interface ConcertEvent {
  id: string
  date: string
  artist: string
  genre: string | null
  memberPrice: number
  guestPrice: number
  bgColor: string
  borderColor: string
  textColor: string
  badgeBg: string
}

export const EVENTS: ConcertEvent[] = [
  {
    id: 'rob-lutes-bobby-stagg',
    date: 'June 6',
    artist: 'Rob Lutes & Bobby Stagg',
    genre: 'Roots Music',
    memberPrice: 20,
    guestPrice: 25,
    bgColor: '#1a4731',
    borderColor: '#2d7a52',
    textColor: '#d4edda',
    badgeBg: '#0f3320',
  },
  {
    id: 'comedy-fest',
    date: 'June 13',
    artist: 'Dunany Comedy Fest',
    genre: 'Joey Elias Headliner',
    memberPrice: 20,
    guestPrice: 25,
    bgColor: '#5a0e0e',
    borderColor: '#9b2226',
    textColor: '#ffd6d6',
    badgeBg: '#3d0808',
  },
  {
    id: 'bokomaru',
    date: 'June 20',
    artist: 'Bokomaru',
    genre: 'Grateful Dead Tribute',
    memberPrice: 20,
    guestPrice: 25,
    bgColor: '#2e1065',
    borderColor: '#6d28d9',
    textColor: '#ede9fe',
    badgeBg: '#1e0a4a',
  },
  {
    id: 'blue-rodeo-tribute',
    date: 'July 11',
    artist: 'Blue Rodeo Tribute Singers',
    genre: null,
    memberPrice: 20,
    guestPrice: 25,
    bgColor: '#0c2461',
    borderColor: '#1e6bbd',
    textColor: '#d0e8f8',
    badgeBg: '#081a47',
  },
  {
    id: 'nils-brown',
    date: 'Aug. 28',
    artist: 'Nils Brown en Spectacle',
    genre: null,
    memberPrice: 20,
    guestPrice: 25,
    bgColor: '#5c2a00',
    borderColor: '#b35900',
    textColor: '#fff0d0',
    badgeBg: '#3d1c00',
  },
  {
    id: 'guy-belanger',
    date: 'Sept. 12',
    artist: 'Guy Bélanger',
    genre: "Canada's Best Harmonica Player",
    memberPrice: 25,
    guestPrice: 30,
    bgColor: '#4a3a00',
    borderColor: '#c9a227',
    textColor: '#fff8d0',
    badgeBg: '#332800',
  },
]

export function getEventById(id: string): ConcertEvent | undefined {
  return EVENTS.find((e) => e.id === id)
}
