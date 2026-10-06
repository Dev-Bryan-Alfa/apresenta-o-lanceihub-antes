import React, { useEffect, useState } from 'react';
import { FaExternalLinkAlt, FaMapMarkerAlt, FaCalendarAlt, FaTag, FaBuilding, FaSearch, FaFilter } from 'react-icons/fa';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import axios from 'axios';
import api from '../axios/axiosBase';
import CardoOportunidade from './ui/CardOportunidades';

const FindOpportunities = () => {
  const [oportunidades, setOportunidades] = useState([]);
  const [leiloesImoveis, setLeiloesImoveis] = useState([]);
  const [categoriaImoveis, setCategoriaImoveis] = useState([
    35, 18, 19, 24, 32, 20, 21, 22, 34, 23, 26, 27
  ]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itensPorPagina = 6;

  const filteredLeiloes = leiloesImoveis.filter(oportunidade =>
    oportunidade.dados?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    oportunidade.dados?.lotes?.some(lote =>
      lote.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lote.num_processo?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPaginas = Math.ceil(filteredLeiloes.length / itensPorPagina);
  const indiceFinal = paginaAtual * itensPorPagina;
  const indiceInicial = indiceFinal - itensPorPagina;
  const leiloesPagina = filteredLeiloes.slice(indiceInicial, indiceFinal);


  useEffect(() => {
    const fetchOportunidades = async () => {
      try {
        const response = await api.get("oportunidades");
        const todasOportunidades = response.data.data;

        const leiloesFiltrados = todasOportunidades.filter(oportunidade =>
          oportunidade.dados?.lotes?.some(lote => categoriaImoveis.includes(lote.subcategoria))
        );

        setLeiloesImoveis(leiloesFiltrados);
      } catch (error) {
        console.error("Erro ao carregar dados de oportunidades:", error);
      }
    };

    fetchOportunidades();
  }, []);

  useEffect(() => {
    setPaginaAtual(1);
  }, [searchTerm]);

  // Mock auction opportunities data
  const auctionOpportunities = [
    {
      id: 1,
      title: "Apartamento 3 Quartos - Zona Sul SP",
      site: "Leilão de Verdade",
      siteUrl: "https://leilaodeverdade.com.br",
      location: "São Paulo, SP - Vila Mariana",
      description: "Apartamento de 120m² com 3 quartos, 2 vagas, varanda gourmet",
      startingBid: 450000,
      marketValue: 750000,
      discount: 40,
      auctionDate: "2024-02-15",
      propertyType: "Apartamento",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      title: "Casa Térrea - Condomínio Fechado",
      site: "Superbid",
      siteUrl: "https://www.superbid.com.br",
      location: "Campinas, SP - Jardim Paulista",
      description: "Casa térrea de 200m², 4 quartos, piscina, área gourmet",
      startingBid: 680000,
      marketValue: 1200000,
      discount: 43,
      auctionDate: "2024-02-20",
      propertyType: "Casa",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Galpão Comercial - Centro",
      site: "Mais Leilões",
      siteUrl: "https://www.maileiloes.com.br",
      location: "São Paulo, SP - Centro",
      description: "Galpão de 500m², pé direito 8m, docas para carga",
      startingBid: 850000,
      marketValue: 1500000,
      discount: 43,
      auctionDate: "2024-02-18",
      propertyType: "Comercial",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      title: "Apartamento 2 Quartos - Praia",
      site: "Bolsa de Leilões",
      siteUrl: "https://www.bolsadeleiloes.com.br",
      location: "Santos, SP - Gonzaga",
      description: "Apartamento de 75m², 2 quartos, vista mar, mobiliado",
      startingBid: 320000,
      marketValue: 550000,
      discount: 42,
      auctionDate: "2024-02-22",
      propertyType: "Apartamento",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop"
    },
    {
      id: 5,
      title: "Sobrado 4 Quartos - Zona Norte",
      site: "Leilão de Verdade",
      siteUrl: "https://leilaodeverdade.com.br",
      location: "São Paulo, SP - Tucuruvi",
      description: "Sobrado de 250m², 4 quartos, 3 vagas, quintal amplo",
      startingBid: 580000,
      marketValue: 980000,
      discount: 41,
      auctionDate: "2024-02-25",
      propertyType: "Casa",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop"
    },
    {
      id: 6,
      title: "Terreno Residencial - Condomínio",
      site: "Superbid",
      siteUrl: "https://www.superbid.com.br",
      location: "Alphaville, SP - Barueri",
      description: "Terreno de 600m², plano, pronto para construir",
      startingBid: 420000,
      marketValue: 720000,
      discount: 42,
      auctionDate: "2024-02-28",
      propertyType: "Terreno",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop"
    }
  ];

  const partnerSites = [
    {
      name: "Leilão de Verdade",
      url: "https://leilaodeverdade.com.br",
      description: "Leilões judiciais e extrajudiciais em todo Brasil",
      logo: "/logo3.png"
    },
    {
      name: "Superbid",
      url: "https://www.superbid.com.br",
      description: "Leilões online de imóveis, veículos e equipamentos",
      logo: "https://www.superbid.com.br/favicon.ico"
    },
    {
      name: "Mais Leilões",
      url: "https://www.maileiloes.com.br",
      description: "Portal de leilões com grande variedade de oportunidades",
      logo: "https://www.maileiloes.com.br/favicon.ico"
    },
    {
      name: "Bolsa de Leilões",
      url: "https://www.bolsadeleiloes.com.br",
      description: "Leilões judiciais e falências com foco em imóveis",
      logo: "https://www.bolsadeleiloes.com.br/favicon.ico"
    }
  ];

  const handlePartnerClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Função auxiliar para renderizar as páginas de forma limitada
  const renderizarBotoes = () => {
    const botoes = [];
    const maxBotoesVisiveis = 5;

    let inicio = Math.max(1, paginaAtual - Math.floor(maxBotoesVisiveis / 2));
    let fim = Math.min(totalPaginas, inicio + maxBotoesVisiveis - 1);

    // Corrige se estiver no final
    if (fim - inicio < maxBotoesVisiveis - 1) {
      inicio = Math.max(1, fim - maxBotoesVisiveis + 1);
    }

    // Primeira página (com reticências)
    if (inicio > 1) {
      botoes.push(
        <button
          key={1}
          onClick={() => setPaginaAtual(1)}
          className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-xs"
        >
          1
        </button>
      );
      if (inicio > 2) botoes.push(<span key="start-ellipsis">...</span>);
    }

    // Páginas centrais
    for (let i = inicio; i <= fim; i++) {
      botoes.push(
        <button
          key={i}
          onClick={() => setPaginaAtual(i)}
          className={`px-2 py-1 rounded text-xs ${paginaAtual === i
              ? 'bg-[#5524E8] text-white shadow-md'
              : 'bg-gray-200 hover:bg-gray-300'
            }`}
        >
          {i}
        </button>
      );
    }

    // Última página (com reticências)
    if (fim < totalPaginas) {
      if (fim < totalPaginas - 1) botoes.push(<span key="end-ellipsis">...</span>);
      botoes.push(
        <button
          key={totalPaginas}
          onClick={() => setPaginaAtual(totalPaginas)}
          className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-xs"
        >
          {totalPaginas}
        </button>
      );
    }

    return botoes;
  };

  return (
    <div className="min-h-screen bg-[#010821] text-white p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#5524E8]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#2143BE]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#42ACF0]/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#5524E8] to-[#310092] rounded-full flex items-center justify-center shadow-2xl animate-neonPulse">
              <FaSearch className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold font-montserrat text-transparent bg-gradient-to-r from-[#5524E8] via-[#42ACF0] to-[#8B5CF6] bg-clip-text mb-2 tracking-tight">
              Encontre Oportunidades
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Descubra as melhores oportunidades de Leilão disponíveis agora.
              <br />
              <span className="text-[#42ACF0] font-semibold">Economize até 50% em imóveis!</span>
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar oportunidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#42ACF0] focus:border-transparent transition-all duration-300"
              />
              <button className="absolute right-2 top-1.5 bg-gradient-to-r from-[#5524E8] to-[#42ACF0] hover:from-[#6024AF] hover:to-[#42ACF0] text-white px-4 py-1.5 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                <FaFilter className="inline mr-1" />
                Filtrar
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white mb-1">
              Leilões Disponíveis ({filteredLeiloes.length})
            </h2>
            <p className="text-gray-400 text-sm">
              Oportunidades atualizadas diariamente dos principais sites de Leilão
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {leiloesPagina.map((oportunidade) => (
              <CardoOportunidade
                key={oportunidade.id}
                leilao={oportunidade.dados}
                lotes={oportunidade.dados?.lotes}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaAtual === 1}
              className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 hover:border-[#42ACF0]/50 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20"
            >
              <span className="flex items-center space-x-1">
                <span>⬅️</span>
                <span>Anterior</span>
              </span>
            </button>

            <div className="flex items-center space-x-1">
              {renderizarBotoes()}
            </div>

            <button
              onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
              disabled={paginaAtual === totalPaginas}
              className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 hover:border-[#42ACF0]/50 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20"
            >
              <span className="flex items-center space-x-1">
                <span>Próximo</span>
                <span>➡️</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindOpportunities;
