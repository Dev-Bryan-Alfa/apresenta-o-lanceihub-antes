import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Clock, User, Edit3, Save, Trash2 } from 'lucide-react';
import axios from 'axios';
import api from '../axios/axiosBase';


const LoteHistoryButton = ({ loteId }) => {
  const [historico, setHistorico] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // const api = axios.create({
  //   baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001",
  //   headers: { "Content-Type": "application/json" },
  // });

  useEffect(() => {
    if (loteId) {
      fetchHistorico();
    }
  }, [loteId]);

  const fetchHistorico = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/calculadora/lote-historico/${loteId}`);
      setHistorico(response.data);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderAlteracoes = (alteracoes) => {
    if (!alteracoes || typeof alteracoes !== 'object') return null;

    return Object.entries(alteracoes).map(([campo, mudanca]) => (
      <div key={campo} className="flex justify-between text-sm py-1">
        <span className="text-gray-600">{campo}:</span>
        <div className="flex items-center gap-2">
          <span className="text-red-500 line-through">{mudanca.anterior || 'vazio'}</span>
          <span className="text-gray-400">→</span>
          <span className="text-green-600 font-medium">{mudanca.novo || 'vazio'}</span>
        </div>
      </div>
    ));
  };

  const getTipoIcon = (tipo) => {
    const icons = {
      'criacao': <Save size={16} className="text-green-500" />,
      'edicao': <Edit3 size={16} className="text-blue-500" />,
      'exclusao': <Trash2 size={16} className="text-red-500" />,
      'status': <Clock size={16} className="text-yellow-500" />,
    };
    return icons[tipo] || <Edit3 size={16} className="text-gray-500" />;
  };

  return (
    <div className="w-full max-w-2xl">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-sm bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all duration-200 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-blue-600" />
          <span className="font-medium text-blue-800">
            Histórico de Alterações ({historico.length})
          </span>
        </div>
        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : historico.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock size={32} className="mx-auto mb-2 opacity-50" />
              <p>Nenhuma alteração registrada para este lote</p>
            </div>
          ) : (
            historico.map((alteracao, index) => (
              <div
                key={alteracao.id}
                className="border-l-4 border-blue-500 bg-gray-50 rounded-r-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTipoIcon(alteracao.tipoAlteracao)}
                    <span className="font-semibold text-gray-800 capitalize">
                      {alteracao.tipoAlteracao.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatarData(alteracao.dataAlteracao)}
                  </span>
                </div>

                {alteracao.usuario && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <User size={14} />
                    <span>{alteracao.usuario}</span>
                  </div>
                )}

                <div className="space-y-1">
                  {renderAlteracoes(alteracao.alteracoes)}
                </div>

                {alteracao.observacao && (
                  <div className="mt-2 text-sm text-gray-600 italic border-t pt-2">
                    {alteracao.observacao}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LoteHistoryButton;
