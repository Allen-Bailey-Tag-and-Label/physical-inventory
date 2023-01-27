const adminLinks = [
  { href: '/analyses', innerHTML: 'Analyses' },
  { href: '/jde-import', innerHTML: 'JDE Import' },
  { href: '/missing-items', innerHTML: 'Missing Items' },
  { href: '/settings', innerHTML: 'Settings' },
  { href: '/ticket-list', innerHTML: 'Ticket List' }
];
const defaultLinks = [
  { href: '/dashboard', innerHTML: 'Dashboard' },
  { href: '/common-item-entry', innerHTML: 'Common Item Entry' },
  { href: '/enter-count', innerHTML: 'Enter Count' }
];
const protectedLinks = [...adminLinks, ...defaultLinks];

export { adminLinks, defaultLinks, protectedLinks };
