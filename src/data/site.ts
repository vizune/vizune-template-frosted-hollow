// All of the page copy lives here so the template can be re-skinned
// without touching the components.

export const site = {
  name: 'Frosthollow',
  tagline: 'Worlds beyond silence',
  description:
    'An immersive fantasy realm of ruin, magic, and enduring legends. Explore a frozen world where ancient powers stir.',
};

export const nav = [
  { label: 'Home', href: '#top' },
  { label: 'Lore', href: '#lore' },
  { label: 'Artwork', href: '#gallery' },
  { label: 'News', href: '#news' },
  { label: 'Community', href: '#community' },
];

// Hero chapters: selecting one swaps the eyebrow and body text.
export const chapters = [
  {
    label: 'A World Awakes',
    eyebrow: 'A world sculpted by winter',
    body: 'Explore a frozen world where ancient powers stir, forgotten kingdoms rise, and the line between fate and freedom begins to fracture.',
  },
  {
    label: 'Ancient Powers',
    eyebrow: 'Where the old gates turn',
    body: 'Beneath the ice, a ring of runes still hums. Those who learn its rhythm may bend the frost to their will, or be swallowed by it.',
  },
  {
    label: 'Forgotten Kingdoms',
    eyebrow: 'Spires lost to the snow',
    body: 'Cities of glass and starlight once crowned these peaks. Their towers remain, silent and waiting for someone to remember their names.',
  },
];

// "Watch trailer" opens this YouTube video in a modal.
export const trailer = {
  youtubeId: 'gDGceKvZGFQ',
  title: 'QQ Xian Xia Zhuan Online | Game Trailer',
};

export const news = [
  {
    category: 'News',
    date: '2026-10-21',
    title: 'The Northern Expanse',
    excerpt: 'New zones, stories, and dangers await in the latest world update.',
    image: '/images/northern-expanse.webp',
    cta: 'Read more',
    href: '#',
  },
  {
    category: 'Lore',
    date: '2026-10-14',
    title: 'Echoes of the First Age',
    excerpt: 'Uncover the lost history of the Arcanum and the fall of the Frostborn.',
    image: '/images/first-age.webp',
    cta: 'Read more',
    href: '#',
  },
  {
    category: 'Artwork',
    date: '2026-10-06',
    title: 'Shadows in the Ice',
    excerpt: 'A new collection of concept art exploring the realms beyond the mountains.',
    image: '/images/shadows-ice.webp',
    cta: 'View gallery',
    href: '#gallery',
  },
];

export const features = [
  { icon: 'landscapes', label: 'Vast landscapes' },
  { icon: 'lore', label: 'Rich lore' },
  { icon: 'characters', label: 'Unique characters' },
  { icon: 'flux', label: 'A world in flux' },
] as const;

export const gallery = [
  { title: 'Frosthollow key art', src: '/images/banner.webp', alt: 'A hooded warrior in bone armour stands before frozen peaks and a glowing clockwork gate' },
  { title: 'Spires in the mist', src: '/images/ice-spires.webp', alt: 'Dark spires rising through blue mist above a snowfield' },
  { title: 'The broken rune ring', src: '/images/first-age.webp', alt: 'A broken rune ring hanging over a ruined city' },
  { title: 'The clockwork gate', src: '/images/clockwork-gate.webp', alt: 'Glowing clockwork sigils above a stone stairway' },
  { title: 'Moonrise over the peaks', src: '/images/moonlit-peaks.webp', alt: 'A full moon over snow-covered mountains' },
  { title: 'The great glacier', src: '/images/glacier.webp', alt: 'A wide glacier sweeping towards distant towers' },
];

// Page sections that show up in search and as quick links.
// `action: 'trailer'` opens the trailer modal instead of following the link.
export const sections = [
  { title: 'Latest from Frosthollow', text: 'News, lore and artwork updates from the realm.', href: '#news', quick: 'Latest news' },
  {
    title: 'A living, breathing world',
    text: 'Snow-choked peaks, forgotten ruins, ancient magic and untold stories.',
    href: '#lore',
    quick: 'Lore',
  },
  { title: 'Featured gallery', text: 'Concept art and scenes from across Frosthollow.', href: '#gallery', quick: 'Gallery' },
  { title: 'Join our community', text: 'Adventurers, artists and lore enthusiasts on Discord and beyond.', href: '#community', quick: 'Community' },
  { title: 'Watch the trailer', text: 'See the realm in motion.', href: '#top', action: 'trailer', quick: 'Watch trailer' },
];

export const socials = [
  { name: 'Discord', icon: 'discord', href: '#' },
  { name: 'X', icon: 'x', href: '#' },
  { name: 'YouTube', icon: 'youtube', href: '#' },
  { name: 'Instagram', icon: 'instagram', href: '#' },
  { name: 'Reddit', icon: 'reddit', href: '#' },
] as const;

// Template credit shown at the bottom of the footer.
export const credit = {
  label: 'Vizune',
  href: 'https://vizune.neocities.org',
};

export const legal = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Contact', href: '#' },
];
