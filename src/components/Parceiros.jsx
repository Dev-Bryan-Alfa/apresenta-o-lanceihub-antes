import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink, Users, Mail } from 'lucide-react';
import ContactModal from './ContactModal';

const Parceiros = () => {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState('');

  // Fixed data for partners
  const parceiros = [
    {
      nome: "Capital Ideal",
      // link: "https://exemplo1.com",
      descricao: "A Capital Ideal é uma empresa do ramo imobiliário que oferece uma solução completa para seus clientes, trabalhando com três frentes principais:\n\n- Assessoria pré e pós Leilão\n\n- Intermediação na Compra, Venda e Locação\n\n- Gestão de bens e trâmites legais",
      foto: "teste20.svg" // Using existing logo as placeholder
    },
  ];

  const handleVisitLink = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleContactClick = (partnerName) => {
    setSelectedPartner(partnerName);
    setContactModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#010821] via-[#0A0F1E] to-[#010821] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold font-montserrat text-white mb-4 flex items-center justify-center">
            <Users className="mr-4 text-[#5524E8]" size={48} />
            Parceiros
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Conheça nossos parceiros estratégicos que complementam nossos serviços
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {parceiros.map((parceiro, index) => (
            <Card key={index} className="bg-gradient-to-br from-white/5 to-white/10 border border-[#5524E8]/30 hover:border-[#5524E8]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#5524E8]/30 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className=" ">
                    <img
                      src={parceiro.foto}
                      alt={parceiro.nome}
                      className="w-36 h-36 rounded-full object-contain border-2 border-[#5524E8]/50 bg-white/10 p-3"
                    />

                  </div>

                </div>
                <CardTitle className="text-white text-xl">{parceiro.nome}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-center mb-6 leading-relaxed whitespace-pre-line">
                  {parceiro.descricao}
                </p>
                <div className="flex gap-2">
                  {/* <Button
                    onClick={() => handleVisitLink(parceiro.link)}
                    className="flex-1 bg-gradient-to-r from-[#5524E8] to-[#310092] hover:brightness-110 text-white font-semibold transition-colors duration-200"
                  >
                    <ExternalLink className="mr-2" size={16} />
                    Visitar Site
                  </Button> */}
                  <Button
                    onClick={() => handleContactClick(parceiro.nome)}
                    className="flex-1 bg-gradient-to-r from-[#5524E8] to-[#6024AF] hover:brightness-110 text-white font-semibold transition-colors duration-200"
                  >
                    <Mail className="mr-2" size={16} />
                    Entrar em Contato
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <ContactModal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          partnerName={selectedPartner}
        />
      </div>
    </div>
  );
};

export default Parceiros;
