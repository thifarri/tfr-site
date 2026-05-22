import { Instagram, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#050A30' }}>
              TFR Projetos
            </h3>
            <p className="text-gray-600 mb-4">
              Soluções completas em engenharia elétrica com excelência e segurança.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/eng.thiagofabbro"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                style={{ backgroundColor: '#050A30' }}
              >
                <Instagram className="text-white" size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#050A30' }}>
              Serviços
            </h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#servicos" className="hover:opacity-70 transition-opacity">Projetos Residenciais</a></li>
              <li><a href="#servicos" className="hover:opacity-70 transition-opacity">Subestação</a></li>
              <li><a href="#servicos" className="hover:opacity-70 transition-opacity">SPDA</a></li>
              <li><a href="#servicos" className="hover:opacity-70 transition-opacity">Automação e NR12</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#050A30' }}>
              Links Rápidos
            </h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#home" className="hover:opacity-70 transition-opacity">Início</a></li>
              <li><a href="#servicos" className="hover:opacity-70 transition-opacity">Serviços</a></li>
              <li><a href="#sobre" className="hover:opacity-70 transition-opacity">Sobre</a></li>
              <li><a href="#blog" className="hover:opacity-70 transition-opacity">Blog</a></li>
              <li><a href="#contato" className="hover:opacity-70 transition-opacity">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#050A30' }}>
              Contato
            </h4>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <Phone size={18} className="mt-1 flex-shrink-0" style={{ color: '#050A30' }} />
                <span>(14) 9 9881-8169</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={18} className="mt-1 flex-shrink-0" style={{ color: '#050A30' }} />
                <span>contato@tfrprojetos.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>&copy; 2026 TFR Projetos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
