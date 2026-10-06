import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../axios/axiosBase';

const LoteHistory = ({ loteId, userId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // const api = axios.create({
  //   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/calculadora',
  //   headers: { "Content-Type": "application/json" },
  // });

  useEffect(() => {
    if (loteId) fetchHistory();
  }, [loteId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/calculadora/lote-historico/${loteId}`, { params: { userId } });
      setHistory(response.data);
    } catch (err) {
      console.error("Erro ao buscar histórico:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (historyItem) => {
    setSelectedHistory(historyItem);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getStatusColor = (tipoAlteracao) => {
    const colors = {
      'creation': 'bg-green-500 text-white',
      'status_change': 'bg-blue-500 text-white',
      'field_update': 'bg-yellow-500 text-black',
      'deletion': 'bg-red-500 text-white'
    };
    return colors[tipoAlteracao] || 'bg-gray-500 text-white';
  };

  if (loading) return <div className="text-center py-4">Carregando histórico...</div>;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Histórico de Alterações</h3>

      {history.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Nenhuma alteração registrada</p>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-lg cursor-pointer hover:shadow-md transition ${getStatusColor(item.tipoAlteracao)}`}
              onClick={() => handleHistoryClick(item)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.descricao}</p>
                  <p className="text-sm opacity-75">{formatDate(item.data)}</p>
                </div>
                <div className="text-sm">
                  {item.valorAnterior && item.valorNovo && (
                    <span>{item.valorAnterior} → {item.valorNovo}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h4 className="text-lg font-bold mb-4">Detalhes da Alteração</h4>
            <p><strong>Descrição:</strong> {selectedHistory.descricao}</p>
            <p><strong>Data:</strong> {formatDate(selectedHistory.data)}</p>
            {selectedHistory.valorAnterior && (
              <p><strong>Valor Anterior:</strong> {selectedHistory.valorAnterior}</p>
            )}
            {selectedHistory.valorNovo && (
              <p><strong>Valor Novo:</strong> {selectedHistory.valorNovo}</p>
            )}
            <p><strong>Tipo:</strong> {selectedHistory.tipoAlteracao}</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoteHistory;
