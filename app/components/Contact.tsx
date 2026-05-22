import { Mail, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

export function Contact() {
  return (
    <section className="py-20 lg:py-32" style={{ backgroundColor: '#050A30' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl lg:text-5xl mb-6 text-white">
              Entre em Contato
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Solicite um orçamento sem compromisso. Nossa equipe está pronta para atender suas necessidades.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Telefone</h3>
                  <p className="text-gray-300">(14) 9 9881-8169</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">E-mail</h3>
                  <p className="text-gray-300">contato@tfrprojetos.com.br</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2" style={{ color: '#050A30' }}>
                  Nome Completo
                </label>
                <Input 
                  id="name"
                  type="text" 
                  placeholder="Seu nome"
                  className="border-gray-300"
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-2" style={{ color: '#050A30' }}>
                  E-mail
                </label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="seu@email.com"
                  className="border-gray-300"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block mb-2" style={{ color: '#050A30' }}>
                  Telefone
                </label>
                <Input 
                  id="phone"
                  type="tel" 
                  placeholder="(00) 0 0000-0000"
                  className="border-gray-300"
                />
              </div>

              <div>
                <label htmlFor="message" className="block mb-2" style={{ color: '#050A30' }}>
                  Mensagem
                </label>
                <Textarea 
                  id="message"
                  placeholder="Descreva seu projeto..."
                  rows={4}
                  className="border-gray-300"
                />
              </div>

              <Button 
                type="submit"
                className="w-full hover:opacity-90"
                size="lg"
                style={{ backgroundColor: '#050A30' }}
              >
                Enviar Mensagem
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
