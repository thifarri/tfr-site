import { CheckCircle2 } from 'lucide-react';

const benefits = [
  'Equipe técnica altamente qualificada',
  'Atendimento em todo território nacional',
  'Projetos conforme normas técnicas',
  'Tecnologia e inovação',
  'Prazos e orçamentos transparentes',
  'Suporte técnico especializado'
];

export function About() {
  return (
    <section id="sobre" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 rounded-full mb-4" style={{ backgroundColor: '#050A30', color: '#FFFFFF' }}>
              Sobre Nós
            </div>
          </div>
          <h2 className="text-3xl lg:text-5xl mb-6 text-center" style={{ color: '#050A30' }}>
            Excelência em Engenharia Elétrica
          </h2>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Somos uma empresa especializada em engenharia elétrica, comprometida em fornecer soluções inovadoras e seguras para projetos residenciais, comerciais e industriais em todo o Brasil.
          </p>
          <p className="text-lg text-gray-600 mb-10 text-center">
            Nossa equipe de engenheiros qualificados trabalha com as mais recentes tecnologias e normas técnicas para garantir a qualidade e eficiência em cada projeto.
          </p>

          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 style={{ color: '#050A30' }} size={24} className="flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
