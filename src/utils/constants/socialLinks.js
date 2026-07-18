import GitHubIcon from '../assets/icons/github.svg';
import LinkedInIcon from '../assets/icons/linkedin.svg';

export const SOCIAL_LINKS = [
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com/darwin-mont',
    icon: GitHubIcon,
    ariaLabel: 'Follow us on Instagram',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'www.linkedin.com/in/darwin-montaleza-b93b9b9a',
    icon: LinkedInIcon,
    ariaLabel: 'Connect with us on LinkedIn',
  },
  {},
];

export const FOOTER_LINKS = {
  company: [
    { label: 'About Us', path: '/about' },
    { label: 'Careers', path: '/careers' },
    { label: 'Blog', path: '/blog' },
    { label: 'Press', path: '/press' },
  ],
  product: [
    { label: 'Features', path: '/features' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Integrations', path: '/integrations' },
    { label: 'Roadmap', path: '/roadmap' },
  ],
  support: [
    { label: 'Help Center', path: '/help' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Community', path: '/community' },
  ],
  legal: [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Cookie Policy', path: '/cookies' },
    { label: 'Security', path: '/security' },
  ],
};
