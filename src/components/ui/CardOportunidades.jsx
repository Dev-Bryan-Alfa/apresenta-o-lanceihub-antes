import React, { useEffect, useState } from 'react';
import {
    FaCalendarAlt,
    FaChevronLeft,
    FaChevronRight,
    FaExternalLinkAlt,
    FaMapMarkerAlt,
    FaTag,
    FaBuilding
} from 'react-icons/fa';

import api from '../../axios/axiosBase';
import { estadosCodigos } from '../estados';

export default function CardoOportunidade({ leilao, lotes }) {
    const [fotosPorLote, setFotosPorLote] = useState({});
    const [fotoAtual, setFotoAtual] = useState({});
    const tipoPorNumero = {
        37: "Comercial/Recidencial",
        35: "Apartamento",
        18: "Cobertura",
        19: "Casa",
        24: "Terreno",
        32: "Hoteis",
        20: "Sala/Escritorios",
        21: "Galpão",
        22: "Terreno/lote comercial",
        34: "Imóveis Comerciais",
        26: "Fazenda",
        27: "Chácara/Sítio",
        23: "glebas",
    };

    useEffect(() => {
        const carregarFotos = async () => {
            const novoFotos = {};
            const novoFotoAtual = {};

            for (const lote of lotes) {
                try {
                    const response = await api.get(`oportunidades/lote/fotos/${lote.id}`);
                    novoFotos[lote.id] = response.data || [];
                    novoFotoAtual[lote.id] = 0;
                } catch (error) {
                    console.error(`Erro ao carregar fotos do lote ${lote.id}:`, error);
                    novoFotos[lote.id] = [];
                    novoFotoAtual[lote.id] = 0;
                }
            }

            setFotosPorLote(novoFotos);
            setFotoAtual(novoFotoAtual);
        };

        if (lotes && lotes.length) {
            carregarFotos();
        }
    }, [lotes]);

    const proximaFoto = (loteId) => {
        const qtd = fotosPorLote[loteId]?.length || 0;
        if (qtd < 2) return; // não há próxima foto
        setFotoAtual((prev) => ({
            ...prev,
            [loteId]: (prev[loteId] + 1) % qtd,
        }));
    };

    const fotoAnterior = (loteId) => {
        const qtd = fotosPorLote[loteId]?.length || 0;
        if (qtd < 2) return; // não há foto anterior
        setFotoAtual((prev) => ({
            ...prev,
            [loteId]: (prev[loteId] - 1 + qtd) % qtd,
        }));
    };

    const desconto = leilao.desconto;
    const descontoEditado = desconto ? desconto.split("%")[0] : "";


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

    const titulo = leilao.nome
    const tituloEditado = titulo.includes("–")
        ? titulo.split("–")[1].trim()
        : titulo.includes("-")
            ? titulo.split("-")[1].trim()
            : titulo.trim();


    return (
        <div className="">
            {lotes.map((lote) => {
                const key = lote.num_processo ? lote.num_processo.slice(15, 21) : null;
                const fotos = fotosPorLote[lote.id] || [];
                const atual = fotoAtual[lote.id] ?? 0; // se undefined, pega 0
                const fotoExibida = fotos[atual]?.foto;

                return (
                    <div key={lote.id} className="hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-[#1B2238] rounded-lg shadow-md border border-[#42ACF0]/20">

                        {/* Carrossel de fotos */}
                        <div className="relative">
                            <img
                                src={fotoExibida || "/placeholder.png"}
                                alt={`Foto ${atual + 1} do lote ${lote.titulo}`}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />

                            <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                                -{descontoEditado}%
                            </div>

                            {fotos.length > 1 && (
                                <>
                                    <button
                                        onClick={() => fotoAnterior(lote.id)}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                                    >
                                        <FaChevronLeft />
                                    </button>
                                    <button
                                        onClick={() => proximaFoto(lote.id)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                                    >
                                        <FaChevronRight />
                                    </button>

                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                        {fotos.map((_, index) => (
                                            <span
                                                key={index}
                                                className={`w-2 h-2 rounded-full ${index === atual ? "bg-white" : "bg-gray-400"}`}
                                            ></span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Informações do lote */}
                        <div className="p-6 border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3> {lote.titulo}</h3>
                                    <p className="text-sm text-gray-400 mt-1">Alfa Leilões</p>
                                </div>
                                <img src={`logoAlfa.png`} alt="Alfa Leilões" className="w-10 h-10 rounded-full object-cover border border-gray-600" />
                            </div>
                        </div>

                        <div className="space-y-3 p-6">
                            <div className="flex items-center text-sm text-gray-300">
                                <FaMapMarkerAlt className="mr-2 text-[#42ACF0]" />
                                {key ? estadosCodigos[key]?.nome : 'Estado Não encontrado'} - {key ? estadosCodigos[key]?.sigla : 'Dados Vazio'}
                            </div>

                            <div className="flex items-center text-sm text-gray-300">
                                <FaCalendarAlt className="mr-2 text-[#42ACF0]" />
                                Leilão: {formatDate(leilao.data_inicial1)}
                            </div>

                            <div className="flex items-center text-sm text-gray-300">
                                <FaBuilding className="mr-2 text-[#42ACF0]" />
                                {tipoPorNumero[lote.subcategoria]}
                            </div>

                            <p className="text-sm text-gray-400 line-clamp-2">
                                {tituloEditado}
                            </p>

                            <div className="border-t border-gray-600 pt-3">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-gray-400">Lance inicial</p>
                                        <p className="text-lg font-bold text-[#42ACF0]">
                                            {formatCurrency(lote.valor_minimo)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">Valor mercado</p>
                                        <p className="text-sm text-gray-300 line-through">
                                            {formatCurrency(lote.avaliacao)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                className="w-full bg-gradient-to-r from-[#5524E8] to-[#42ACF0] text-white font-semibold py-2 px-4 rounded-lg hover:from-[#6024AF] hover:to-[#42ACF0] transition-colors flex items-center justify-center"
                                onClick={() => window.open(`https://alfaleiloes.com/lote/${lote.id}`, '_blank', 'noopener,noreferrer')}
                            >
                                Ver Detalhes
                                <FaExternalLinkAlt className="ml-2" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
