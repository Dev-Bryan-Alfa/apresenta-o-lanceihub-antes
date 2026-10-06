import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios/axiosBase';
import Context from '../context/Context';
import { FaPlus, FaEdit, FaTrash, FaWindowClose } from 'react-icons/fa';
import { NumericFormat } from 'react-number-format';
import { InputFieldChangeState } from './PropostaDeCompra';
const log = (...args) => console.log(...args);

const neonBlue = "#00FFFF";
const darkBackground = "#0a0a15";

const MinhasArrematacoes = () => {
  const [arrematacoes, setArrematacoes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nomeLote: '', tipo: '', valor: '' });
  const [showRedirectQuestion, setShowRedirectQuestion] = useState(false);
  const [showParcelaModal, setShowParcelaModal] = useState(false);
  const [parcelaData, setParcelaData] = useState({
    nome: '',
    dataAssinaturaAutoArrematacao: '',
    valorArrematacao: '',
    quantidadeParcelas: '',
    porcentagemEntrada: '',
    indice: '',
  });
  const [parcelaId, setParcelaId] = useState(null);
  const [editingArrematacao, setEditingArrematacao] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [arrematacaoToDelete, setArrematacaoToDelete] = useState(null);
  const navigate = useNavigate();
  const { userId, calculadoraId } = useContext(Context);

  useEffect(() => {
    fetchArrematacoes();
  }, []);

  const fetchArrematacoes = async () => {
    try {
      const { data } = await api.get('/arrematacao');
      setArrematacoes(data);
    } catch (error) {
      console.error('Erro ao buscar arrematações:', error);
    }
  };

  const handleCreate = async () => {
    if (formData.tipo === 'PROPOSTA') {
      setShowRedirectQuestion(true);
    } else {
      await createArrematacao(false);
    }
  };

  const createArrematacao = async (createProposta = false) => {
    try {
      const { data } = await api.post('/arrematacao', { ...formData, createProposta });
      fetchArrematacoes();
      setShowModal(false);
      setFormData({ nomeLote: '', tipo: '', valor: '' });
      setShowRedirectQuestion(false);
      if (createProposta && data.parcelaProposta) {
        setParcelaId(data.parcelaProposta.id);
        setShowParcelaModal(true);
      }
    } catch (error) {
      console.error('Erro ao criar arrematação:', error);
    }
  };

  const handleRedirectYes = () => {
    createArrematacao(true);
  };

  const handleRedirectNo = () => {
    createArrematacao(false);
  };

  const handleCreateParcela = async (e) => {
    log("Creating parcela...")
    e.preventDefault();
    if (!parcelaData.indice) return alert('Selecione o índice.');
    try {
      await api.patch(`/parcela-proposta/${parcelaId}`, {
        ...parcelaData,
        dataAssinaturaAutoArrematacao: parcelaData.dataAssinaturaAutoArrematacao.split('-').reverse().join('/'),
        finished: false,
      });
      setShowParcelaModal(false);
      setParcelaData({
        nome: '',
        dataAssinaturaAutoArrematacao: '',
        valorArrematacao: '',
        quantidadeParcelas: '',
        porcentagemEntrada: '',
        indice: '',
      });
      setParcelaId(null);
      navigate('/propostas-parcelas');
    } catch (error) {
      console.error('Erro ao atualizar parcela:', error);
    }
  };

  const handleEdit = (arrematacao) => {
    setEditingArrematacao(arrematacao);
    setFormData({
      nomeLote: arrematacao.nomeLote,
      tipo: arrematacao.tipo,
      valor: arrematacao.valor,
    });
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await api.patch(`/arrematacao/${editingArrematacao.id}`, formData);
      fetchArrematacoes();
      setShowModal(false);
      setFormData({ nomeLote: '', tipo: '', valor: '' });
      setEditingArrematacao(null);
    } catch (error) {
      console.error('Erro ao editar arrematação:', error);
    }
  };

  const handleDelete = (arrematacao) => {
    setArrematacaoToDelete(arrematacao);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/arrematacao/${arrematacaoToDelete.id}`);
      fetchArrematacoes();
      setShowDeleteConfirm(false);
      setArrematacaoToDelete(null);
    } catch (error) {
      console.error('Erro ao deletar arrematação:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 pl-20">
      <h1 className="text-3xl font-extrabold mb-8 text-white tracking-wide">Minhas Arrematações</h1>
      
      <button
        onClick={() => setShowModal(true)}
        className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-6 py-3 rounded-lg mb-6 flex items-center gap-2"
      >
        <FaPlus /> Nova Arrematação
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {arrematacoes.map((arrematacao) => (
          <div key={arrematacao.id} className="bg-gray-800 p-4 rounded-lg border border-cyan-500">
            <h3 className="text-xl font-bold text-cyan-400">{arrematacao.nomeLote}</h3>
            <p className="text-white">Tipo: {arrematacao.tipo}</p>
            <p className="text-white">Valor: R$ {arrematacao.valor}</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => handleEdit(arrematacao)} className="text-cyan-400 hover:text-cyan-300">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(arrematacao)} className="text-red-400 hover:text-red-300">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Parcela de Proposta */}
      {showParcelaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md z-40 flex items-center justify-center px-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-cyan-500/5 rounded-2xl"></div>
            <div className="relative z-10">
              <button
                onClick={() => setShowParcelaModal(false)}
                className="absolute top-4 right-4 text-white hover:text-cyan-400 transition-colors duration-200 text-2xl"
              >
                <FaWindowClose />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-white text-center">
                Preencha os dados da Parcela de Proposta
              </h2>

              <form onSubmit={handleCreateParcela} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-cyan-400">
                    Nome
                  </label>
                  <input
                    value={parcelaData.nome}
                    onChange={(e) => setParcelaData({ ...parcelaData, nome: e.target.value })}
                    className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 placeholder-gray-400"
                    type="text"
                    placeholder="Digite o nome"
                  />
                </div>

                <div>
                  <InputFieldChangeState
                    label="Data da assinatura do auto da arrematação"
                    value={parcelaData.dataAssinaturaAutoArrematacao}
                    onChange={(value) => setParcelaData({ ...parcelaData, dataAssinaturaAutoArrematacao: value })}
                    type="date"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-cyan-400">
                    Valor de arrematação
                  </label>
                  <input
                    value={parcelaData.valorArrematacao}
                    onChange={(e) => setParcelaData({ ...parcelaData, valorArrematacao: e.target.value })}
                    className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 placeholder-gray-400"
                    type="text"
                    placeholder="Digite o valor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-cyan-400">
                    Quantidade de parcelas
                  </label>
                  <input
                    value={parcelaData.quantidadeParcelas}
                    onChange={(e) => setParcelaData({ ...parcelaData, quantidadeParcelas: e.target.value })}
                    className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 placeholder-gray-400"
                    type="text"
                    placeholder="Digite a quantidade"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-cyan-400">
                    Porcentagem da entrada (%)
                  </label>
                  <input
                    value={parcelaData.porcentagemEntrada}
                    onChange={(e) => setParcelaData({ ...parcelaData, porcentagemEntrada: e.target.value })}
                    className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 placeholder-gray-400"
                    type="number"
                    placeholder="Digite a porcentagem"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-cyan-400">
                    Índice
                  </label>
                  <select
                    value={parcelaData.indice}
                    onChange={(e) => setParcelaData({ ...parcelaData, indice: e.target.value })}
                    className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                  >
                    <option value="" className="bg-gray-800">Selecione</option>
                    <option value="INPC" className="bg-gray-800">INPC</option>
                    <option value="IGP-M" className="bg-gray-800">IGP-M</option>
                    <option value="IGP-DI" className="bg-gray-800">IGP-DI</option>
                    <option value="IPCA" className="bg-gray-800">IPCA</option>
                    <option value="IPCA-E" className="bg-gray-800">IPCA-E</option>
                    <option value="MEDIA-INPC-IGP-DI" className="bg-gray-800">Média INPC e IGP-DI</option>
                    <option value="SELIC" className="bg-gray-800">Selic</option>
                    <option value="POUPANCA" className="bg-gray-800">Poupança</option>
                    <option value="IGP" className="bg-gray-800">IGP (Índice Geral de Preços)</option>
                    <option value="IPC-FIPE" className="bg-gray-800">IPC-FIPE</option>
                    <option value="IPC-BR" className="bg-gray-800">IPC-BR (FGV)</option>
                  </select>
                </div>

                <button
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl mt-6"
                  type="submit"
                >
                  Criar parcela da arrematação
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Nova Arrematação ou Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center px-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-cyan-500">
            <h2 className="text-2xl font-bold mb-6 text-white">
              {editingArrematacao ? 'Editar Arrematação' : 'Nova Arrematação'}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome do Lote"
                value={formData.nomeLote}
                onChange={(e) => setFormData({ ...formData, nomeLote: e.target.value })}
                className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Selecione o Tipo</option>
                <option value="LANCE">Lance</option>
                <option value="PROPOSTA">Proposta</option>
              </select>
              <NumericFormat
                value={formData.valor}
                onValueChange={(values) => setFormData({ ...formData, valor: values.value })}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                placeholder="Valor de Arrematação"
                className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={() => { setShowModal(false); setEditingArrematacao(null); setFormData({ nomeLote: '', tipo: '', valor: '' }); }} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg">Cancelar</button>
              <button onClick={editingArrematacao ? handleSaveEdit : handleCreate} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg">
                {editingArrematacao ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center px-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-cyan-500">
            <h2 className="text-2xl font-bold mb-6 text-white">Confirmar Exclusão</h2>
            <p className="text-white mb-6">Tem certeza de que deseja excluir a arrematação "{arrematacaoToDelete?.nomeLote}"?</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteConfirm(false)} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg">Cancelar</button>
              <button onClick={confirmDelete} className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg">Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pergunta para Redirecionamento */}
      {showRedirectQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center px-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-cyan-500">
            <h2 className="text-2xl font-bold mb-6 text-white">Deseja redirecionar para Minhas Propostas?</h2>
            <p className="text-white mb-6">Isso permitirá preencher os dados da parcela de proposta.</p>
            <div className="flex gap-4">
              <button onClick={handleRedirectNo} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg">Não</button>
              <button onClick={handleRedirectYes} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg">Sim</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinhasArrematacoes;