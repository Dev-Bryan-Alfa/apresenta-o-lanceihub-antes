import React, { useState, useEffect, useContext } from "react";
import api from "../axios/axiosBase"; // Ajuste o caminho se necessário
import { useAuth } from "../context/AuthContext"; // Assumindo que você tem o hook useAuth para obter o usuário

const MinhasPropostas = () => {
  const { user } = useAuth(); // Obter o usuário logado
  const [propostas, setPropostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPropostas = async () => {
      try {
        // Assumindo que há um endpoint para buscar propostas do usuário
        // Ajuste conforme seu backend; por exemplo, se for /calculadoras ou /propostas
        const response = await api.get(`/calculadoras?userId=${user.id}`); // Exemplo de endpoint
        setPropostas(response.data);
      } catch (err) {
        setError("Erro ao carregar propostas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchPropostas();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#00071E] flex items-center justify-center text-white">
        <p>Carregando propostas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#00071E] flex items-center justify-center text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#00071E] p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-[#07D99D]">Minhas Propostas</h1>
      {propostas.length === 0 ? (
        <p className="text-gray-400">Nenhuma proposta encontrada.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-gray-800 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-2 text-left">Título</th>
                <th className="px-4 py-2 text-left">Valor da Oferta (R$)</th>
                <th className="px-4 py-2 text-left">Valor de Mercado (R$)</th>
                <th className="px-4 py-2 text-left">Endereço</th>
                <th className="px-4 py-2 text-left">Data de Criação</th>
                <th className="px-4 py-2 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {propostas.map((proposta) => (
                <tr key={proposta.id} className="border-b border-gray-600 hover:bg-gray-700">
                  <td className="px-4 py-2">{proposta.titulo || "N/A"}</td>
                  <td className="px-4 py-2">
                    {proposta.valorOferta ? `R$ ${parseFloat(proposta.valorOferta).toFixed(2)}` : "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {proposta.valorMercado ? `R$ ${parseFloat(proposta.valorMercado).toFixed(2)}` : "N/A"}
                  </td>
                  <td className="px-4 py-2">{proposta.endereco || "N/A"}</td>
                  <td className="px-4 py-2">
                    {proposta.createdAt ? new Date(proposta.createdAt).toLocaleDateString("pt-BR") : "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-[#07D99D] text-black px-3 py-1 rounded hover:bg-[#05b87d] transition"
                      onClick={() => {
                        // Lógica para visualizar/editar, por exemplo, navegar para /calculadora/:id
                        window.location.href = `/calculadora/${proposta.id}`;
                      }}
                    >
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MinhasPropostas;
