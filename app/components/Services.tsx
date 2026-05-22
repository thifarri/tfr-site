import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

const services = [
  {
    image: 'https://images.unsplash.com/photo-1628012209120-d9db7abf7eab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXNpZGVudGlhbCUyMGhvdXNlJTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzc5NDcwMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Projetos Elétricos Residenciais',
    description: 'Dimensionamento e planejamento completo de instalações elétricas residenciais com segurança e eficiência energética.'
  },
  {
    image: 'https://images.unsplash.com/photo-1776251896448-a5eb8ae25e35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2FsJTIwc3Vic3RhdGlvbiUyMGVxdWlwbWVudCUyMHBvd2VyfGVufDF8fHx8MTc3OTQ2NTY2NHww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Projetos Elétricos de Subestação',
    description: 'Desenvolvimento de projetos de subestações de energia com análise de carga e especificação de equipamentos.'
  },
  {
    image: 'https://images.unsplash.com/photo-1447829172150-e5deb8972256?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWdodG5pbmclMjBwcm90ZWN0aW9uJTIwc3lzdGVtJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzc5NDY1NjY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Projetos de SPDA',
    description: 'Sistema de Proteção contra Descargas Atmosféricas conforme normas técnicas para máxima segurança.'
  },
  {
    image: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwYXV0b21hdGlvbiUyMGNvbnRyb2wlMjBwYW5lbHxlbnwxfHx8fDE3Nzk0NjU2NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Automação e NR12',
    description: 'Projetos elétricos de automação industrial em conformidade com a Norma Regulamentadora NR12 de segurança.'
  }
];

export function Services() {
  return (
    <section id="servicos" className="py-20 lg:py-32" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full mb-4" style={{ backgroundColor: '#050A30', color: '#FFFFFF' }}>
            Nossos Serviços
          </div>
          <h2 className="text-3xl lg:text-5xl mb-4" style={{ color: '#050A30' }}>
            Soluções Completas em Engenharia Elétrica
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Oferecemos uma gama completa de serviços especializados para atender todas as suas necessidades em projetos elétricos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => {
            return (
              <Card
                key={index}
                className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white overflow-hidden"
              >
                <div className="h-48 overflow-hidden">
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle style={{ color: '#050A30' }}>
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
