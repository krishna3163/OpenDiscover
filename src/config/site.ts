/**
 * Site-level configuration (identity, links, external endpoints).
 * Change these in one place instead of hunting through components.
 */
import { CONTACT_EMAIL, SUBMISSION_FORM_URL } from '../lib/routes';

export const SITE = {
  name: 'OpenDiscover',
  tagline: 'Discover the code that powers the future.',
  description:
    'A curated directory of open-source apps, AI models and privacy tools. Verified licences, transparent Trust Scores, official sources only.',
  contactEmail: CONTACT_EMAIL,
  submissionFormUrl: SUBMISSION_FORM_URL,
  /** Path of the generated public dataset (see `npm run export:data`). */
  dataEndpoint: `${import.meta.env.BASE_URL ?? '/'}data/projects.json`.replace(/\/{2,}/g, '/'),
};

export const MAINTAINER = {
  name: 'Krishna',
  role: 'Full-stack developer & open-source enthusiast',
  initial: 'K',
  quote:
    'Building the future of open-source discovery — tools that help people find software they can actually audit, trust and keep.',
  links: [
    { label: 'Email', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, icon: '📧' },
    { label: 'GitHub', value: 'krishna3163', href: 'https://github.com/krishna3163', icon: '💻' },
    { label: 'LinkedIn', value: 'krishna0858', href: 'https://linkedin.com/in/krishna0858', icon: '💼' },
    { label: 'Instagram', value: 'krishna.0858', href: 'https://instagram.com/krishna.0858', icon: '📸' },
  ],
};

export default SITE;
