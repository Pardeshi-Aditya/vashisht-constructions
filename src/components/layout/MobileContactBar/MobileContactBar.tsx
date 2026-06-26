import { Phone } from 'lucide-react';
import { company } from '@/constants/company';

export function MobileContactBar() {
  return (
    <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-stone bg-off-white/95 backdrop-blur-sm md:hidden">
      <div className="grid grid-cols-2">
        <a
          href={`tel:${company.phone}`}
          className="flex items-center justify-center gap-2 py-4 text-xs font-medium tracking-widest text-charcoal uppercase"
          aria-label={`Call ${company.phoneDisplay}`}
        >
          <Phone size={16} strokeWidth={1.5} />
          Call
        </a>
        <a
          href="/contact"
          className="flex items-center justify-center gap-2 border-l border-stone bg-accent py-4 text-xs font-medium tracking-widest text-white uppercase"
        >
          Enquire
        </a>
      </div>
    </div>
  );
}
