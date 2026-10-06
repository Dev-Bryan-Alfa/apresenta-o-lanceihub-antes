import React, { useState, useEffect, useContext } from 'react';
import { FaPlus, FaClipboardList, FaTrash, FaCalculator, FaBell } from 'react-icons/fa';
import Checklist from './Checklist';
import axios from 'axios';
import Context from '../context/Context';
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage';
import api from '../axios/axiosBase';

const ChecklistDashboard = () => {
  const [checklists, setChecklists] = useState([]);
  const [novoChecklist, setNovoChecklist] = useState({ nome: '', descricao: '' });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [checklistSelecionado, setChecklistSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(Context)
  const nav = useNavigate()

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // const api = axios.create({
  //   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/calculadora',
  //   headers: { 'Content-Type': 'application/json' },
  // });

  const [currentPage, setCurrentPage] = useLocalStorage('currentPageChecklist', 1)
  // // const [itens, setItens] = useLocalStorage('calculadoraItensChecklist', {})
  // // const [itensLength, setItensLength] = useLocalStorage('itensLengthChecklist', 0)


  //  const [checklists, setChecklists] = useLocalStorage('calculadoraItensChecklist', {})
  //   const [itensLengthChecklists, setItensLengthChecklists] = useLocalStorage('itensLengthChecklist', 0)

  const { checklists: itens, setChecklists: setItens, itensLengthChecklists: itensLength, setItensLengthChecklists: setItensLength } = useContext(Context)




  async function getItensLength() {
    const { data } = await api.get('/calculadora/checklist/count')
    console.log(data)
    setItensLength(data || 0)
  }

  // useEffect(() => {
  //   setItens({})
  //   setCurrentPage(1)
  // }, [])

  useEffect(() => {
    getItensLength()
  }, [])

  useEffect(() => {
    fetchChecklists();
  }, [currentPage]);

  const fetchChecklists = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = +user.id; // pegar do login
      const response = await api.get('/calculadora/checklist', {
        params: {
          page: currentPage,
          limit: 3
        }
      },);
      // console.log(response.data)
      // setChecklists(response.data);
      setItens((prev) => {
        const copy = { ...prev }
        copy[currentPage] = response.data
        return copy // len = copy[currentPage].length
      })
    } catch (err) {
      console.error('Erro ao buscar checklists:', err);
      setError('Erro ao carregar checklists. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  function addToStatePagination(state, setState, newData, setSize, setPage) {
    const keys = Object.keys(state)
    const itensLastPage = state[keys[keys.length - 1]].length || 0 // quantos itens tem na pagina (2 por pagina padrão)
    const stateCopy = { ...state } // state style = {'1': [{}, {}, ....]}
    if (itensLastPage <= 3) {

      // adiciona na ultima pagina
      stateCopy[keys[keys.length - 1]] = [...stateCopy[keys[keys.length - 1]], newData]
    } else {
      stateCopy[(Number(keys[keys.length - 1]) + 1)] = [newData]
      setPage((Number(keys[keys.length - 1]) + 1))
      // criar uma nova pagina
    }

    setState(stateCopy)
    setSize((prev) => prev += 1)
  }

  const criarChecklist = async () => {
    if (!novoChecklist.nome.trim()) return;

    setLoading(true);
    try {
      const userId = +user.id; // pegar do login
      const checklistData = {
        nome: novoChecklist.nome,
        descricao: novoChecklist.descricao,
        data: new Date(),
      };
      const { data } = await api.post('/calculadora/checklist', checklistData);
      // setChecklists([...checklists, response.data]);
      addToStatePagination(itens, setItens, data, setItensLength, setCurrentPage)
      setNovoChecklist({ nome: '', descricao: '' });
      setMostrarFormulario(false);
      nav('/checklist/' + data.id)
    } catch (err) {
      console.error('Erro ao criar checklist:', err);
      setError('Erro ao criar checklist. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const excluirChecklist = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/calculadora/checklist/${id}`);
      // Update the paginated state
      const itensCopy = { ...itens };
      const currentPageItems = itensCopy[currentPage] || [];
      const updatedItems = currentPageItems.filter(c => c.id !== id);
      itensCopy[currentPage] = updatedItems;
      setItens(itensCopy);
      setItensLength(prev => prev - 1);
    } catch (err) {
      console.error('Erro ao excluir checklist:', err);
      setError('Erro ao excluir checklist. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // const selecionarChecklist = (checklist) => {
  //   // setChecklistSelecionado(checklist);
  //   if (checklistSelecionado) {
  //     nav('/checklist/' + checklistSelecionado.id)
  //   }
  // };

  const voltarParaDashboard = () => setChecklistSelecionado(null);

  // --- Render ---
  // if (checklistSelecionado) {
  // nav('/checklist/' + checklistSelecionado.id)
  // return (
  //   <div>
  //     <button
  //       onClick={voltarParaDashboard}
  //       className="mb-4 ml-5 mt-5 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
  //     >
  //       ← Voltar para Dashboard
  //     </button>
  //     <div>
  //       <h2 className="text-2xl sm:text-4xl font-bold mb-4 text-center text-white">{checklistSelecionado.nome}</h2>
  //       <Checklist
  //         checklistId={checklistSelecionado.id}
  //         userId={1} // pegar do login
  //         api={api}
  //       />
  //     </div>
  //   </div>
  // );
  // }

  return (
    <div className="p-4 pl-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center sm:text-left">Meus Checklists</h1>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 flex items-center gap-2 w-full sm:w-auto justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <FaPlus /> Novo Checklist
        </button>
      </div>

      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => { setMostrarFormulario(false); setNovoChecklist({ nome: '', descricao: '' }); }}>
          <div className="bg-[#0A0F1E] border border-purple-500/50 rounded-2xl shadow-[0_0_20px_rgba(147,51,234,0.3)] p-5 sm:p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-purple-400 drop-shadow-md">
              Criar Novo Checklist
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome do checklist"
                value={novoChecklist.nome}
                onChange={(e) => setNovoChecklist({ ...novoChecklist, nome: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-[#1B2238] border border-purple-500/60 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
              <input
                type="text"
                placeholder="Descrição (opcional)"
                value={novoChecklist.descricao}
                onChange={(e) => setNovoChecklist({ ...novoChecklist, descricao: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-[#1B2238] border border-purple-500/60 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
              <div className="flex gap-3 flex-col sm:flex-row justify-between">
                <button
                  onClick={() => { setMostrarFormulario(false); setNovoChecklist({ nome: '', descricao: '' }); }}
                  className="px-5 py-2 rounded-lg bg-[#FF4C4C] text-white font-semibold hover:bg-[#e04343] transition w-full sm:w-auto"
                >
                  Cancelar
                </button>
                <button onClick={criarChecklist} className="px-5 py-2 rounded-lg bg-[purple] text-black font-semibold hover:bg-[#05b37f] transition w-full sm:w-auto">
                  Criar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mx-auto max-w-7xl">
        {itens[currentPage]?.map((checklist) => (
          <div key={checklist.id} className="bg-gradient-to-r from-[#5524E8]/35 to-[#6024AF]/10 rounded-2xl shadow-lg shadow-purple-500/50 border border-purple-400 p-6 w-full max-w-md hover:shadow-2xl hover:shadow-purple-500/70 hover:scale-105 transition-all duration-300 flex flex-col justify-between min-h-[320px] backdrop-blur-sm">
            <div className="flex flex-col gap-4">
              {/* Informações do checklist */}
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{checklist.nome}</h3>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs sm:text-sm text-purple-200">Criado em: {formatDate(checklist.data)}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        nav('/checklist/' + checklist.id)
                      }}
                      className="bg-gradient-to-r from-[#5524E8] to-[#6024AF] text-white p-2 rounded-lg hover:brightness-110 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                      title="Abrir checklist"
                    >
                      <FaClipboardList size={16} />
                    </button>
                    <button
                      onClick={() => excluirChecklist(checklist.id)}
                      className="bg-gradient-to-r from-[#5524E8] to-[#6024AF] text-white p-2 rounded-lg hover:brightness-110 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                      title="Excluir checklist"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
                {checklist.descricao && (
                  <p className="text-sm text-gray-300 mt-3 leading-relaxed">{checklist.descricao}</p>
                )}
              </div>

              {/* Botões principais com texto */}
              <div className="flex flex-col gap-3 mb-4">
                <button onClick={() => {
                  nav('/checklist/' + checklist.id)
                }} className="w-full bg-gradient-to-r from-[#5524E8] to-[#6024AF] text-white py-3 rounded-xl hover:brightness-110 transition-all shadow-md hover:shadow-lg font-semibold">
                  Abrir Checklist
                </button>

                <button
                  onClick={async () => {
                    if (!checklist.calculadoraId) {
                      const confirmar = window.confirm('Não existe uma calculadora para este checklist. Deseja criar?');
                      if (confirmar) {
                        try {
                          const { data } = await api.post('/calculadora', {
                            nome: `Calculadora do ${checklist.nome}`,
                            user_id: user.id,
                            data: new Date(),
                            checklistId: checklist.id
                          });
                          // Atualizar o state local
                          const itensCopy = { ...itens };
                          const currentPageItems = itensCopy[currentPage] || [];
                          const index = currentPageItems.findIndex(chk => chk.id === checklist.id);
                          if (index !== -1) {
                            itensCopy[currentPage][index] = { ...itensCopy[currentPage][index], calculadoraId: data.id };
                            setItens(itensCopy);
                          }
                          nav("/calculadora/" + data.id);
                        } catch (error) {
                          console.error('Erro ao criar calculadora:', error);
                          alert('Erro ao criar calculadora. Tente novamente.');
                        }
                      }
                      return;
                    }
                    nav("/calculadora/" + checklist.calculadoraId)
                  }}
                  className="w-full bg-gradient-to-r from-[#5524E8] to-[#6024AF] text-white py-3 px-4 rounded-xl hover:brightness-110 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  <FaCalculator /> Calculadora
                </button>
                <button
                  onClick={() => nav("/lembrete")}
                  className="w-full bg-gradient-to-r from-[#5524E8] to-[#6024AF] text-white py-3 px-4 rounded-xl hover:brightness-110 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  <FaBell /> Encerramentos
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#5524E8]/20 to-[#6024AF]/20 rounded-xl p-4 mb-4 border border-purple-400/30">
              <p className="text-xs text-white">
                <span className="font-semibold text-purple-200">Itens:</span> {(checklist.itens || []).length}
              </p>
              <p className="text-xs text-white mt-1">
                Status: <span className="font-semibold text-purple-200">{checklist.status || 'ativo'}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-10 flex flex-wrap gap-2 justify-center items-center'>
        <button className='disabled:opacity-40 bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm' disabled={currentPage == 1} onClick={() => {
          setCurrentPage(1)
        }}>Início</button>
        <button className='disabled:opacity-40 bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm' onClick={() => {
          setCurrentPage((prev) => prev - 1)
        }} disabled={currentPage == 1}>Anterior</button>
        <p className='text-white text-sm mx-2'>Página <span>{currentPage}</span></p>
        <button className='disabled:opacity-40 bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm' onClick={() => {
          setCurrentPage((prev) => prev + 1)
        }} disabled={currentPage == Math.ceil(itensLength / 3)}>Próxima</button>
        <button className='disabled:opacity-40 bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm' disabled={currentPage == Math.ceil(itensLength / 3)} onClick={() => {
          setCurrentPage(Math.ceil(itensLength / 3))
        }}>Última</button>
      </div>
    </div>
  );
};

export default ChecklistDashboard;
