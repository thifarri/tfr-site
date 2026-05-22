import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const whatsappNumber = '5514998818169';
  const message = 'Olá! Gostaria de solicitar um orçamento.';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 animate-bounce"
      style={{ backgroundColor: '#25D366' }}
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle className="text-white" size={28} />
    </a>
  );
}
