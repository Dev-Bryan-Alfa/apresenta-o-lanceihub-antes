import React, { useState, useEffect, useContext } from 'react';
import { FaPlus, FaCalculator, FaTrash, FaClipboardList, FaBell, FaEnvelope, FaFileExport, FaWindowClose, FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight, FaSpinner } from 'react-icons/fa';
import CalculadoraComponent from './CalculadoraComponent';
import axios from 'axios';
import Context from '../context/Context';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import api from '../axios/axiosBase';
import { InputFieldChangeState } from './PropostaDeCompra';

const CalculadoraDashboard = () => {
  // const [calculadoras, setCalculadoras] = useState([]);
  const [novaCalculadora, setNovaCalculadora] = useState({ nome: '', historico: [] });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [calculadoraSelecionada, setCalculadoraSelecionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const nav = useNavigate()

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const [currentPage, setCurrentPage] = useLocalStorage('currentPage', 1)


  const { user, setCalculadoraId, calculadoras: itens, setCalculadoras: setItens, itensLengthCalculadoras: itensLength, setItensLengthCalculadoras: setItensLength } = useContext(Context)


  const [calculadoraArrematacao, setCalculadoraArrematacao] = useState(null)
  const [showModalArrematacao, setShowModalArrematacao] = useState(false)
  const [criandoParcelaProposta, setCriandoParcelaProposta] = useState(false)
  const [valorArrematacao, setValorArrematacao] = useState('')
  const [quantidadeParcelas, setQuantidadeParcelas] = useState('')
  const [porcentagemEntrada, setPorcentagemEntrada] = useState('')
  const [indice, setIndice] = useState('') // select
  const [dataAssinaturaAutoArrematacao, setDataAssinaturaAutoArrematacao] = useState('')
  const [checklistSelecionada, setChecklistSelecionada] = useState(null)

  // States para exportar relatório
  const [loadingRelatorio, setLoadingRelatorio] = useState(false)
  const [errorRelatorio, setErrorRelatorio] = useState('')

  // States para enviar por email
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [messageEmail, setMessageEmail] = useState('')
  const [errorEmail, setErrorEmail] = useState('')

  // Função para abrir a última calculadora



  // Configuração do axios com URL correta do backend
  // const api = axios.create({
  //   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/calculadora',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // });

  // Adicionar interceptor para debugging
  // api.interceptors.response.use(
  //   response => response,
  //   error => {
  //     console.error('API Error:', {
  //       status: error.response?.status,
  //       message: error.response?.data?.message || error.message,
  //       url: error.config?.url,
  //       method: error.config?.method
  //     });
  //     return Promise.reject(error);
  //   }
  // );

  // Buscar todas as calculadoras ao carregar

  // useEffect(() => {
  //   setItens({})
  //   setCurrentPage(1)
  // }, []) // tirar depois

  useEffect(() => {
    fetchCalculadoras();
  }, [currentPage]);


  async function getItensLength() {
    const { data } = await api.get('/calculadora/count')
    console.log(data)
    setItensLength(data || 0)
  }

  function addToStatePagination(state, setState, newData, setSize, setPage) {
    const keys = Object.keys(state)
    const itensLastPage = state[keys[keys.length - 1]].length || 0 // ou zero porque quando for a primeira pagina vai ser undefined logo a length é 0 pois não tem pagina anterior e se vier undefined vira zero // quantos itens tem na pagina (2 por pagina padrão)
    const stateCopy = { ...state } // state style = {'1': [{}, {}, ....]}
    if (itensLastPage <= 3) { // pode ser o primeiro item, e pode ser 0

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

  useEffect(() => {
    getItensLength()
  }, [])

  const fetchCalculadoras = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('fetching calculadoras')
      const response = await api.get('/calculadora', {
        params: {
          page: currentPage,
          limit: 3
        }
      });
      setItens((prev) => {
        const copy = { ...prev }
        copy[currentPage] = response.data
        return copy // len = copy[currentPage].length
      })
    } catch (error) {
      console.error('Erro ao buscar calculadoras:', error);
      setError('Erro ao carregar calculadoras. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const criarCalculadora = async () => {
    if (novaCalculadora.nome.trim()) {
      setLoading(true);
      try {
        const calculadoraData = {
          nome: novaCalculadora.nome,
          // user_id: +user.id, // Placeholder - deve vir do contexto de autenticação
          data: new Date(),
          // historico: [],
          // lances: [],
          // propostas: []
        };

        const { data } = await api.post('/calculadora', calculadoraData);
        addToStatePagination(itens, setItens, data, setItensLength, setCurrentPage)

        // setCalculadoras([...calculadoras, response.data]);



        setNovaCalculadora({ nome: '', historico: [] });
        setMostrarFormulario(false);
        nav('/calculadora/' + data.id)
      } catch (error) {
        console.error('Erro ao criar calculadora:', error);
        setError('Erro ao criar calculadora. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }
  };

  // const exportarRelatorio = async (calculadora) => {
  //   setLoadingRelatorio(true);
  //   setErrorRelatorio('');
  //   try {
  //     const response = await api.get(`/relatorio/${calculadora.id}`, { responseType: 'blob' });
  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', `${calculadora.nome}-relatorio.pdf`);
  //     document.body.appendChild(link);
  //     link.click();
  //   } catch (error) {
  //     console.error('Erro ao exportar relatório:', error);
  //     setErrorRelatorio('Erro ao exportar relatório. Tente novamente.');
  //   } finally {
  //     setLoadingRelatorio(false);
  //   }
  // };

  // const enviarPorEmail = async (calculadora) => {
  //   setLoadingEmail(true);
  //   setMessageEmail('');
  //   setErrorEmail('');
  //   try {
  //     await api.post(`/enviar-email/${calculadora.id}`);
  //     setMessageEmail('Relatório enviado por e-mail com sucesso!');
  //   } catch (error) {
  //     console.error('Erro ao enviar e-mail:', error);
  //     setErrorEmail('Erro ao enviar e-mail. Tente novamente.');
  //   } finally {
  //     setLoadingEmail(false);
  //   }
  // };


  const excluirCalculadora = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/calculadora/${id}`);
      // Remove from state
      const itensCopy = { ...itens };
      const currentPageItems = itensCopy[currentPage] || [];
      const filteredItems = currentPageItems.filter(calc => calc.id !== id);
      itensCopy[currentPage] = filteredItems;
      setItens(itensCopy);
      setItensLength(prev => prev - 1);
      // If page is empty and not the first page, go to previous page
      if (filteredItems.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error('Erro ao excluir calculadora:', error);
      setError('Erro ao excluir calculadora. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const selecionarCalculadora = (calculadora) => {
    setCalculadoraSelecionada(calculadora);
  };

  const voltarParaDashboard = () => {
    setCalculadoraSelecionada(null);
  };

  if (calculadoraSelecionada) {
    return (
      <div className="p-4 sm:p-6">
        <button
          onClick={voltarParaDashboard}
          className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          ← Voltar para Dashboard
        </button>
        <div className="bg-[#00071E] rounded-lg shadow-lg p-4 sm:p-6">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 text-center text-white">{calculadoraSelecionada.nome}</h2>
          <CalculadoraComponent
            id={calculadoraSelecionada.id}
            nome={calculadoraSelecionada.nome}
            api={api}
          />
        </div>
      </div>
    );
  }



  async function createParcelaProposta(e) {
    e.preventDefault()
    if (indice.length == 0) {
      return alert('Selecione o índice.')
    }
    const { data } = await api.post('/calculadora/parcela-proposta', {
      valorArrematacao,
      quantidadeParcelas,
      porcentagemEntrada,
      indice,
      dataAssinaturaAutoArrematacao: dataAssinaturaAutoArrematacao.split('-').reverse().join('/'),
      calculadoraId: calculadoraArrematacao?.id, // do loop,
      nome: `Parcelas de Proposta (Calculadora - ${calculadoraArrematacao?.nome})` // pegar calculadora loop
    })

    setCriandoParcelaProposta(false)
    setShowModalArrematacao(false)

    // go to itens find this item by page and id, and after put the data in parcelaProposta
    const itensInPage = itens[currentPage]
    const itensCopy = { ...itens }
    const indexToChange = itensInPage.findIndex((e) => e.id == calculadoraArrematacao.id)
    itensCopy[currentPage][indexToChange] = { ...itensCopy[currentPage][indexToChange], parcelaProposta: data }
    setItens(itensCopy)
    // mandar calculadoraId
    //salvar alterações
  }

  function modalOpened() {
    return (
      showModalArrematacao && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md z-40 flex items-center justify-center px-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-cyan-500/5 rounded-2xl"></div>
            <div className="relative z-10">
              {!criandoParcelaProposta ? (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-white text-center">
                    Deseja criar um parcelamento?
                  </h2>

                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => {
                        setShowModalArrematacao(false);
                        setCriandoParcelaProposta(false)
                      }}
                      className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Não
                    </button>
                    <button
                      onClick={() => {
                        setCriandoParcelaProposta(true)
                      }}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Sim
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowModalArrematacao(false)
                      setCriandoParcelaProposta(false)
                    }}
                    className="absolute top-4 right-4 text-white hover:text-cyan-400 transition-colors duration-200 text-2xl"
                  >
                    <FaWindowClose />
                  </button>
                  <h2 className="text-2xl font-bold mb-6 text-white text-center">
                    Preencha os dados
                  </h2>

                  <form onSubmit={createParcelaProposta} className="space-y-4">
                    <div>
                      {/* <label className="block text-sm font-semibold mb-2 text-cyan-400">
                        Data da assinatura do auto da arrematação
                      </label>
                      <input
                        required
                        value={dataAssinaturaAutoArrematacao}
                        onChange={(e) => setDataAssinaturaAutoArrematacao(e.target.value)}
                        className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 placeholder-gray-400"
                        type="text"
                        placeholder="00/00/0000"
                      /> */}

                      <InputFieldChangeState label="Data da assinatura do auto da arrematação" value={dataAssinaturaAutoArrematacao} onChange={setDataAssinaturaAutoArrematacao} type="date" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-cyan-400">
                        Valor de arrematação
                      </label>
                      <input
                        value={valorArrematacao}
                        onChange={(e) => setValorArrematacao(e.target.value)}
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
                        value={quantidadeParcelas}
                        onChange={(e) => setQuantidadeParcelas(e.target.value)}
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
                        value={porcentagemEntrada}
                        onChange={(e) => setPorcentagemEntrada(e.target.value)}
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
                        value={indice}
                        onChange={(e) => setIndice(e.target.value)}
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
                        {/* <option value=" " className="bg-gray-800">IGP-M (FGV - mensal)</option> */}
                      </select>
                    </div>

                    <button
                      className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl mt-6"
                      type="submit"
                    >
                      Criar parcela da arrematação
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      ))
  }

  function modalCriarCalculadora() {
    return (
      mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md z-40 flex items-center justify-center px-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-purple-500/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-purple-500/5 rounded-2xl"></div>
            <div className="relative z-10">
              <button
                onClick={() => {
                  setMostrarFormulario(false);
                  setNovaCalculadora({ nome: '', historico: [] });
                }}
                className="absolute top-4 right-4 text-white hover:text-purple-400 transition-colors duration-200 text-2xl"
              >
                <FaWindowClose />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-white text-center">
                Criar Nova Lote
              </h2>

              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Nome da calculadora"
                  value={novaCalculadora.nome}
                  onChange={(e) => setNovaCalculadora({ ...novaCalculadora, nome: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 placeholder-gray-400"
                />

                <button
                  onClick={criarCalculadora}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Criar
                </button>

                <button
                  onClick={() => {
                    setMostrarFormulario(false);
                    setNovaCalculadora({ nome: '', historico: [] });
                  }}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    );
  }

  return (
    <div className="min-h-screen bg-[#010821] p-4 sm:p-6 ml-10">
      {showModalArrematacao && modalOpened()}
      {modalCriarCalculadora()}
      <div className="flex flex-col items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-center drop-shadow-lg">Meus Lotes</h1>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white px-4 py-2 rounded-lg hover:from-[#7C3AED] hover:to-[#5B21B6] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-end border border-white/20 "
        >
          <FaPlus /> Novo Lote
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 !w-[100%]">
              {itens[currentPage]?.map((calculadora) => (
                <div key={calculadora.id} className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-40 backdrop-blur-md rounded-3xl shadow-2xl p-6  hover:scale-105 transition-all duration-500 flex flex-col justify-between border border-purple-400/40 overflow-hidden w-full max-w-sm min-h-[550px] group">
                  {/* Animated background glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-purple-600/10 rounded-3xl opacity-0 group-hover:opacity-80 transition-opacity duration-500"></div>

                  {/* Content */}
                  <div className="relative z-10 p-5 mb-2 flex-1 flex flex-col">
                    {/* Header with icon and trash */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-purple-500 to-purple-900 p-2 rounded-lg mr-3">
                          <FaCalculator className="text-white text-lg" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white leading-tight">{calculadora.nome}</h3>
                          <p className="text-xs text-purple-200 mt-1">Criada em: {formatDate(calculadora.data)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => excluirCalculadora(calculadora.id)}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white p-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg border border-white/30 hover:scale-110"
                        title="Excluir calculadora"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>

                    <div className='pb-10'>

                      <button
                        onClick={() => {
                          setCalculadoraId(calculadora.id)
                          nav(`/calculadora/${calculadora.id}`)
                        }}
                        className="relative z-10 w-full bg-gradient-to-r from-purple-600 to-purple-600 text-white py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-lg border border-white/30 hover:scale-105 "        >
                        🚀 Abrir Calculadora
                      </button>
                    </div>

                    {/* Action buttons in a nicer grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
                      <button
                        onClick={async () => {
                          if (!calculadora?.checklist?.id) {
                            const confirmar = window.confirm('Não existe um checklist para esta calculadora. Deseja criar?');
                            if (confirmar) {
                              try {
                                const { data } = await api.post('/calculadora/checklist', {
                                  nome: `Checklist da ${calculadora.nome}`,
                                  calculadoraId: calculadora.id,
                                  userId: user.id
                                });
                                // Atualizar o state local
                                const itensCopy = { ...itens };
                                const currentPageItems = itensCopy[currentPage] || [];
                                const index = currentPageItems.findIndex(calc => calc.id === calculadora.id);
                                if (index !== -1) {
                                  itensCopy[currentPage][index] = { ...itensCopy[currentPage][index], checklist: data };
                                  setItens(itensCopy);
                                }
                                nav("/checklist/" + data.id);
                              } catch (error) {
                                console.error('Erro ao criar checklist:', error);
                                alert('Erro ao criar checklist. Tente novamente.');
                              }
                            }
                            return;
                          }
                          nav("/checklist/" + calculadora?.checklist?.id)
                        }}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 text-sm sm:py-2 sm:px-3 sm:text-xs rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-1 border border-white/30 hover:scale-105 "
                      >
                        <FaClipboardList className="text-sm sm:text-lg" /> Checklist
                      </button>
                      <button
                        onClick={() => nav("/lembrete")}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 text-sm sm:py-2 sm:px-3 sm:text-xs rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-1 border border-white/30 hover:scale-105"
                      >
                        <FaBell className="text-sm sm:text-xs" /> Lembretes
                      </button>
                      <button
                        onClick={() => {
                          if (calculadora.parcelaProposta) {
                            nav('/proposta-parcela/' + calculadora?.parcelaProposta?.id)
                          } else {
                            setCalculadoraArrematacao(calculadora)
                            setShowModalArrematacao(true)
                          }
                        }}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 text-sm sm:py-2 sm:px-3 sm:text-xs rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-1 border border-white/30 hover:scale-105"
                      >
                        <FaBell className="text-sm sm:text-xs" /> {calculadora.parcelaProposta ? 'Parcelas' : 'Arrematação'}
                      </button>
                    </div>


                  </div>

                  {/* Stats section */}
                  <div className="relative z-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-4 mb-4 border border-gray-300/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-700 font-medium">
                          <span className="text-purple-600">📊</span> Histórico: {(calculadora.historico || '').length} ops
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Modificado: {calculadora.data || calculadora.modificacao}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Main action button */}

                </div>
              ))}
            </div>

            <div className='mt-10 flex gap-3 justify-center items-center'>
              <button
                className='disabled:opacity-40 disabled:cursor-not-allowed  bg-purple-500 text-white px-4 py-2 rounded-lg hover:from-[#05b37f] hover:to-[#2d6b42] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 border border-white/20'
                disabled={currentPage == 1}
                onClick={() => setCurrentPage(1)}
              >
                <FaAngleDoubleLeft /> Início
              </button>
              <button
                className='disabled:opacity-40 disabled:cursor-not-allowed  bg-purple-500 text-white px-4 py-2 rounded-lg hover:from-[#05b37f] hover:to-[#2d6b42] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 border border-white/20'
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage == 1}
              >
                <FaChevronLeft /> Anterior
              </button>
              <p className='text-white  bg-purple-500 bg-clip-text text-transparent font-bold text-lg px-4 py-2 rounded-lg border border-white/20'>
                Página {currentPage}
              </p>
              <button
                className='disabled:opacity-40 disabled:cursor-not-allowed  bg-purple-500 text-white px-4 py-2 rounded-lg hover:from-[#05b37f] hover:to-[#2d6b42] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 border border-white/20'
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage == Math.ceil(itensLength / 2)}
              >
                Próxima <FaChevronRight />
              </button>
              <button
                className='disabled:opacity-40 disabled:cursor-not-allowed  bg-purple-500 text-white px-4 py-2 rounded-lg hover:from-[#05b37f] hover:to-[#2d6b42] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 border border-white/20'
                disabled={currentPage == Math.ceil(itensLength / 2)}
                onClick={() => setCurrentPage(Math.ceil(itensLength / 2))}
              >
                Última <FaAngleDoubleRight />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CalculadoraDashboard;
