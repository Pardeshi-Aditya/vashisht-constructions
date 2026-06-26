import { MessageCircle } from 'lucide-react';
import { company } from '@/constants/company';

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${company.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-5 bottom-20 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-sm transition-transform hover:scale-105 md:bottom-8"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={22} strokeWidth={1.5} />
    </a>
  );
}
