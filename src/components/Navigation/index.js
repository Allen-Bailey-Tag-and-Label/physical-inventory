const adminLinks = [
  { href: '/analyses', innerHTML: 'Analyses' },
  { href: '/jde-import', innerHTML: 'JDE Import' },
  { href: '/settings', innerHTML: 'Settings' },
  { href: '/ticket-list', innerHTML: 'Ticket List' }
];
const defaultLinks = [
  { href: '/dashboard', innerHTML: 'Dashboard' },
  { href: '/enter-count', innerHTML: 'Enter Count' }
];
const protectedLinks = [...adminLinks, ...defaultLinks];

export { adminLinks, defaultLinks, protectedLinks };
