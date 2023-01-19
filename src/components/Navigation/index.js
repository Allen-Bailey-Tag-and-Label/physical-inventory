const adminLinks = [
  { href: '/jde-import', innerHTML: 'JDE Import' },
  { href: '/settings', innerHTML: 'Settings' }
];
const defaultLinks = [
  { href: '/dashboard', innerHTML: 'Dashboard' },
  { href: '/enter-count', innerHTML: 'Enter Count' }
];
const protectedLinks = [...adminLinks, ...defaultLinks];

export { adminLinks, defaultLinks, protectedLinks };
