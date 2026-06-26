interface SocialIconProps {
  name: 'instagram' | 'linkedin' | 'facebook';
  size?: number;
}

export function SocialIcon({ name, size = 20 }: SocialIconProps) {
  const icons = {
    instagram: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
    linkedin: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="3" />
        <path d="M8 11v5M8 8v.01M12 16v-3c0-1.5 1-2.5 2.5-2.5S17 11.5 17 13v3" />
      </svg>
    ),
    facebook: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  };

  return icons[name];
}
