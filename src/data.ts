// Everything your friend will want to edit lives in this one file.
// Placeholders are marked TODO. Swap them before going live.

export const contact = {
  name: 'Anusha Events',
  phone: '+91 98000 00000', // TODO: real number (shown on site)
  whatsapp: '919800000000', // TODO: same number, digits only with country code (for wa.me links)
  instagram: 'https://instagram.com/', // TODO
  email: 'anusha.events@gmail.com', // optional, leave empty to hide
}

export const waLink = (text: string) =>
  `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`

export const telLink = `tel:${contact.phone.replace(/\s/g, '')}`

// TODO: real numbers. Keep them honest, people do ask.
export const stats = [
  { value: 60, suffix: '+', label: 'melas hosted' },
  { value: 35, suffix: '', label: 'housing societies' },
  { value: 40, suffix: '+', label: 'stalls at a big one' },
  { value: 12, suffix: 'k', label: 'happy footfall' },
]

export type MelaEvent = {
  date: string // YYYY-MM-DD
  title: string
  society: string
  area: string
  time: string
  tags: string[]
  tone: Tone
}

export type Tone = 'marigold' | 'rani' | 'peacock' | 'sindoor'

// TODO: real events. Past dates hide themselves automatically.
export const events: MelaEvent[] = [
  { date: '2026-10-31', title: 'Diwali Mela', society: 'Sunrise Heights CGHS', area: 'Sector 6, Dwarka', time: '4 PM – 10 PM', tags: ['Games', 'Food', 'Shopping', 'DJ'], tone: 'marigold' },
  { date: '2026-11-01', title: 'Deepotsav Bazaar', society: 'Neelkanth Apartments', area: 'Sector 10, Dwarka', time: '5 PM – 10 PM', tags: ['Diyas & decor', 'Food', 'Mehendi'], tone: 'sindoor' },
  { date: '2026-11-07', title: 'Diwali Night Mela', society: 'Green Meadows Society', area: 'Sector 22, Dwarka', time: '4 PM – 11 PM', tags: ['Games', 'Tambola', 'Food'], tone: 'rani' },
  { date: '2026-11-14', title: 'Bal Mela', society: 'Gulmohar Residency', area: 'Sector 12, Dwarka', time: '11 AM – 6 PM', tags: ['Kids games', 'Magic show', 'Face painting'], tone: 'peacock' },
  { date: '2026-12-13', title: 'Winter Carnival', society: 'Palm Grove Apartments', area: 'Sector 19, Dwarka', time: '12 PM – 9 PM', tags: ['Games', 'Food', 'Live music'], tone: 'marigold' },
  { date: '2026-12-27', title: 'Christmas & New Year Fair', society: 'Ashoka Enclave', area: 'Sector 23, Dwarka', time: '3 PM – 10 PM', tags: ['Santa', 'Bakery', 'Shopping'], tone: 'rani' },
  { date: '2027-01-13', title: 'Lohri Di Raat', society: 'Shanti Kunj CGHS', area: 'Sector 7, Dwarka', time: '6 PM – 11 PM', tags: ['Bonfire', 'Dhol', 'Gajak & rewri'], tone: 'sindoor' },
  { date: '2027-03-21', title: 'Holi Milan Mela', society: 'Orchid Gardens', area: 'Sector 18B, Dwarka', time: '10 AM – 4 PM', tags: ['Organic colours', 'Thandai', 'DJ'], tone: 'peacock' },
]

export const areas = [
  'Dwarka Sec 1–29', 'Dwarka Mor', 'Palam', 'Uttam Nagar', 'Janakpuri', 'Vikaspuri',
  'Najafgarh', 'Bijwasan', 'Kakrola', 'Mahavir Enclave', 'Sagarpur', 'Dwarka Expressway',
]

export const stalls = [
  {
    key: 'games', hindi: 'खेल', title: 'Game stalls',
    blurb: 'Ring toss, balloon shooting, tambola, bouncy castles and a mini train. Kids queue up, adults pretend they’re only watching.',
    items: ['Ring toss', 'Balloon shooting', 'Tambola', 'Bouncy castle', 'Mini train', 'Dart board'],
    tone: 'rani' as Tone,
  },
  {
    key: 'food', hindi: 'खाना', title: 'Food stalls',
    blurb: 'Golgappe, aloo tikki, momos, kulfi, hot jalebi and buddhi ke baal, with vetted vendors and clean counters.',
    items: ['Chaat & golgappe', 'Momos', 'Kulfi', 'Jalebi', 'Cotton candy', 'Chhole bhature'],
    tone: 'marigold' as Tone,
  },
  {
    key: 'shopping', hindi: 'बाज़ार', title: 'Shopping lanes',
    blurb: 'Bangles, junk jewellery, kurtis, diyas, home decor and toys. Local sellers and home brands, a few steps from your lift.',
    items: ['Bangles', 'Jewellery', 'Kurtis', 'Home decor', 'Diyas', 'Toys'],
    tone: 'peacock' as Tone,
  },
  {
    key: 'stage', hindi: 'मस्ती', title: 'Stage & music',
    blurb: 'DJ, dhol, karaoke, talent hunts and a lucky draw at the end that nobody leaves before.',
    items: ['DJ & dhol', 'Karaoke', 'Talent show', 'Lucky draw', 'Magic show', 'Anchoring'],
    tone: 'sindoor' as Tone,
  },
]
