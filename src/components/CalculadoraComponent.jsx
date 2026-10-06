import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from "react";
import LanceTab from "./LanceTab";
import PropostaDeCompra from "./PropostaDeCompra";
import TransferenciaDocumentacao from "./TransferenciaDocumentacao";
import Provider from "../context/Provider";
import Context from "../context/Context";
import axiosBase from "../axios/axiosBase";
import { FaClosedCaptioning, FaWindowClose, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import api from "../axios/axiosBase";

const mapLanceInvertido = {
  link_leilao: "linkLeilao",
  objeto_penhora: "objetoPenhora",
  tipo_imovel: "tipoImovel",
  metragem: "metragem",
  valor_mercado: "valorMercado",
  lucro_almejado: "lucroAlmejado",

  valor_primeira_praca: "valor1Praca",
  valor_segunda_praca: "valor2Praca",
  desagio: "desagio",

  endereco: "endereco",
  zoneamento: "zoneamento",
  coeficiente_aproveitamento: "coeficienteAproveitamento",
  taxa_ocupacao: "taxaOcupacao",
  taxa_permeabilidade: "taxaPermeabilidade",
  gabarito_altura: "gabaritoAltura",
  ocupado: "ocupado",
  aceita_parcelamento: "aceitaParcelamento",
  valorizacao: "valorizacao",

  lucro_minimo_esperado: "lucroMinimo",
  sugestao: "sugestao",

  leiloeiro: "leiloeiro",
  titulo: "titulo",
  data_primeira_praca: "data1Praca",
  data_segunda_praca: "data2Praca",
  descricao_lote: "descricao_lote",

  valor_oferta: "valorOferta",
  comissao_leiloeiro: "comissaoLeiloeiro",
  honorarios_advocaticios_acessoria: "honorarios",
  quitacao_direitos: "quitacaoDireitos",
  outros_custos_arrematacao: "outrosCustos",

  meses_iptu: "iptuMeses",
  valor_mensal_iptu: "iptuValorMensal",

  meses_condominio: "condominioMeses",
  valor_mensal_condominio: "condominioValorMensal",

  meses_taxa_associativa: "taxaAssociativaMeses",
  valor_mensal_taxa_associativa: "taxaAssociativaValorMensal",

  meses_outros_custos: "outrosCustosVendaMeses",
  valor_mensal_outros_custos: "outrosCustosVendaValorMensal",

  meses_redutor_custos: "redutorCustosMeses",
  valor_mensal_redutor_custos: "redutorCustosValorMensal",

  itbi: "itbiPerc",
  registro_arrematacao: "registroArrematacao",
  custas_judiciais: "custasJudiciais",
  escritura_publica: "escrituraPublica",
  outros_custos_transferencia: "outrosCustosDoc",
  descricao_outros_custos_transferencia: "outrosCustosDocDescricao",

  data_primeira_praca: "data1Praca",
  data_segunda_praca: "data2Praca",
  data_terceira_praca: "data3Praca",
  tipoPracas: "tipoPracas",

  chaveiro: "chaveiro",
  caminhao_mudanca: "caminhaoMudanca",
  reforma: "reforma",
  outros_custos_imissao: "outrosCustosImissao",
  descricao_outros_custos_imissao: "outrosCustosImissaoDescricao",

  comissao_corretor: "comissaoCorretorPerc",
  lucro_imobiliario: "irLucroImobiliarioPerc",
  desconto_venda_rapida: "descontoVendaRapidaPerc",
  valor_terceira_praca: "valor3Praca",
  desagio_terceira_praca: "desagio3Praca",
  mostrarLanceNaoVantajoso: "mostrarLanceNaoVantajoso",
  lanceNaoVantajoso: "lanceNaoVantajoso",
};

const mapPropostaInvertido = {
  link_leilao: "linkLeilao",
  objeto_penhora: "objetoPenhora",
  tipo_imovel: "tipoImovel",
  descricao_lote: "descricao_lote",
  lucro_almejado: "lucroAlmejado",

  metragem: "metragem",
  valor_mercado: "valorMercado",

  valor_primeira_praca: "valor1Praca",
  valor_segunda_praca: "valor2Praca",
  desagio: "desagio",

  endereco: "endereco",
  zoneamento: "zoneamento",
  coeficiente_aproveitamento: "coeficienteAproveitamento",
  taxa_ocupacao: "taxaOcupacao",
  taxa_permeabilidade: "taxaPermeabilidade",
  gabarito_altura: "gabaritoAltura",
  ocupado: "ocupado",
  aceita_parcelamento: "aceitaParcelamento",
  valorizacao: "valorizacao",

  lucro_minimo_esperado: "lucroMinimo",
  sugestao: "sugestao",

  leiloeiro: "leiloeiro",
  titulo: "titulo",
  data_primeira_praca: "data1Praca",
  data_segunda_praca: "data2Praca",

  valor_oferta: "valorOferta",
  entrada: "entrada",
  parcelas: "parcelas",
  comissao_leiloeiro: "comissaoLeiloeiro",
  honorarios_advocaticios_assessoria: "honorarios",
  quitacao_direitos: "quitacaoDireitos",
  outros_custos_arrematacao: "outrosCustos",

  meses_iptu: "iptuMeses",
  valor_mensal_iptu: "iptuValorMensal",

  meses_condominio: "condominioMeses",
  valor_mensal_condominio: "condominioValorMensal",

  meses_taxa_associativa: "taxaAssociativaMeses",
  valor_mensal_taxa_associativa: "taxaAssociativaValorMensal",

  valor_mensal_parcelas: "valorMensalParcelas",
  meses_parcelas: "parcelasCustosMeses",

  data_primeira_praca: "data1Praca",
  data_segunda_praca: "data2Praca",
  data_terceira_praca: "data3Praca",
  tipoPracas: "tipoPracas",

  // "valor_mensal_parcelas": "taxaAssociativaValorMensal",

  meses_outros_custos: "outrosCustosVendaMeses",
  valor_mensal_outros_custos: "outrosCustosVendaValorMensal",

  meses_redutor_custos: "redutorCustosMeses",
  valor_mensal_redutor_custos: "redutorCustosValorMensal",

  itbi: "itbiPerc",
  registro_arrematacao: "registroArrematacao",
  custas_judiciais: "custasJudiciais",
  escritura_publica: "escrituraPublica",
  outros_custos_documentacao: "outrosCustosDoc",
  descricao_outros_custos_documentacao: "outrosCustosDocDescricao",

  chaveiro: "chaveiro",
  caminhao: "caminhaoMudanca",
  reforma: "reforma",
  outros_custos_imissao: "outrosCustosImissao",
  descricao_custos_imissao: "outrosCustosImissaoDescricao",

  comissao_corretor: "comissaoCorretorPerc",
  ir_lucro: "irLucroImobiliarioPerc",
  desconto_venda_rapida: "descontoVendaRapidaPerc",

  valor_venda: "valorVendaImovel",
  valor_terceira_praca: "valor3Praca",
  desagio_terceira_praca: "desagio3Praca",
};

const CalculadoraComponent = () => {
  const { activeTab, setActiveTab } = useContext(Context);
  const [stateChecklist, setStateChecklist] = useState({});
  const [stateLembrete, setStateLembrete] = useState({});
  const { id } = useParams();

  // const [savingChecklistAndLembrete, setSavingChecklistAndLembrete] =
  //   useState(false);
  const [savingChecklist, setSavingChecklist] = useState(false);
  const [savingLembrete, setSavingLembrete] = useState(false);
  const [isEditingNome, setIsEditingNome] = useState(false);
  const [tempNome, setTempNome] = useState('');
  const [updatingNome, setUpdatingNome] = useState(false);

  const handleEditNome = () => {
    setTempNome(calculadoraSalva.nome || '');
    setIsEditingNome(true);
  };

  const handleSaveNome = async () => {
    if (!tempNome.trim()) return;
    setUpdatingNome(true);
    try {
      await api.patch(`/calculadora/${id}/nome`, { nome: tempNome.trim() });
      setCalculadoraSalva(prev => ({ ...prev, nome: tempNome.trim() }));
      setIsEditingNome(false);
    } catch (error) {
      console.error('Erro ao atualizar nome:', error);
      alert('Erro ao atualizar nome. Tente novamente.');
    } finally {
      setUpdatingNome(false);
    }
  };

  const handleCancelEdit = () => {
    setTempNome(calculadoraSalva.nome || '');
    setIsEditingNome(false);
  };
  const nav = useNavigate()
  // quando fechar um abrir o outro checklist e lembrete

  const {
    setLanceGlobal,
    setPropostaGlobal,
    setTab,
    setCalculadoraId,
    checklists,
    setChecklists,
    setItensLengthChecklists,
    calculadoraSalva,
    setCalculadoraSalva,
  } = useContext(Context);

  const { user, formData, setFormData, modalCreateChecklistAndReminder, setModalCreateChecklistAndReminder } = useContext(Context);

  function addToStatePagination(state, setState, newData, setSize, setPage) {
    const keys = Object.keys(state);
    const itensLastPage = state[keys[keys.length - 1]].length; // quantos itens tem na pagina (2 por pagina padrão)
    const stateCopy = { ...state }; // state style = {'1': [{}, {}, ....]}
    if (itensLastPage == 1) {
      // adiciona na ultima pagina
      stateCopy[keys[keys.length - 1]] = [
        ...stateCopy[keys[keys.length - 1]],
        newData,
      ];
    } else {
      stateCopy[Number(keys[keys.length - 1]) + 1] = [newData];
      setPage(Number(keys[keys.length - 1]) + 1);
      // criar uma nova pagina
    }

    setState(stateCopy);
    setSize((prev) => (prev += 1));
  }

  const fake = (p) => {
    return;
  };

  useEffect(() => {
    setCalculadoraId(id);
  }, []);

  useEffect(() => {
    setTab(activeTab);
    console.log("setando novo");
    if (activeTab == "lance") {
      if (calculadoraSalva.lance) {
        const converted = Object.keys(calculadoraSalva.lance).reduce((a, c) => {
          a[mapLanceInvertido[c]] = calculadoraSalva.lance[c];
          return a;
        }, {});
        delete converted["undefined"];
        setFormData(converted);
      }
      //  else {
      //   setFormData({
      //     valorMercado: '',
      //     metragem: '',
      //     valor1Praca: '',
      //     valor2Praca: '',
      //     desagio: '15',
      //     lucroMinimo: '25',

      //     // Arrematação Parcelada
      //     apValorProposta: '',
      //     apEntrada: '',
      //     apParcelas: '',
      //     apComissaoPerc: '',
      //     apHonorarios: '',
      //     apQuitacao: '',
      //     apOutros: '',

      //     // Transferência e Documentação
      //     tdItbi: '',
      //     tdRegistro: '',
      //     tdCustas: '',
      //     tdEscritura: '',
      //     tdOutros: '',
      //   })
      // }
    } else if (activeTab == "proposta") {
      // talvez o ideal seja fazer essa conversão quando o user clicar na aba de proposta mesmo! pois assim se tiver lance e proposta do jeito atual que esta ele upa o lance, mesmo também tendo proposta!
      if (calculadoraSalva.proposta_compra) {
        const converted = Object.keys(calculadoraSalva.proposta_compra).reduce(
          (a, c) => {
            a[mapPropostaInvertido[c]] = calculadoraSalva.proposta_compra[c];
            return a;
          },
          {}
        );
        delete converted["undefined"];
        setFormData(converted);
      }
    }
  }, [activeTab]);

  useEffect(() => {
    getInfoCalculadora();
  }, []);

  useEffect(() => {
    if (calculadoraSalva.nome) {
      setTempNome(calculadoraSalva.nome);
    }
  }, [calculadoraSalva.nome]);
  // Estado único para todos os campos como strings

  async function getInfoCalculadora() {
    console.log("CARREGANDO INFORMAÇÕES");
    const { data } = await api.get("/calculadora/" + id);
    console.log(data, "data aqui (CALCULADORA SALVA)");
    setCalculadoraSalva(data);
    // setLanceGlobal(data.lance)
    // setPropostaGlobal(data.proposta_compra)
    console.log("setando form data para => ", data.lance);
    const converted = Object.keys(data?.lance || {}).reduce((a, c) => {
      a[mapLanceInvertido[c]] = data.lance[c];
      return a;
    }, {});
    delete converted["undefined"];
    setFormData(converted); // pois sempre quando a pagina carrega é lance
  }

  // useCallback para evitar recriações desnecessárias (performance)
  const handleChange = (field, value) => {
    // console.log("handle change chamada");
    // console.log("MUDANDO CAMPO " + field + " PARA ", value);
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [field]: value,
      };

      if (activeTab == "lance") {
        setLanceGlobal(newFormData);
      } else if (activeTab == "proposta") {
        setPropostaGlobal(newFormData);
      }
      return newFormData;
    });

    // console.log(formData);
  };

  async function saveChecklist() {
    // aqui pooooooo
    // requisição para checklist passando dados e a calculadoraId
    //...
    console.log("salvando checklist");
    const { data } = await api.post(`/calculadora/checklist`, {
      ...stateChecklist,
    });

    addToStatePagination(
      checklists,
      setChecklists,
      data,
      setItensLengthChecklists,
      fake
    );

    setSavingChecklist(false);

    await getInfoCalculadora();
    // depois de salvar o checklist abre o modal do lembrete se não existir
    if (!calculadoraSalva.encerramento) {
      setSavingLembrete(true);
    } else {
      setModalCreateChecklistAndReminder(false);
    }

    // requisição para o lembrete passando dados e a calculadoraId
    // ...

    // await api.post(`/calculadora/encerramentos`, {
    //   ...stateLembrete,
    // });

    // setModalCreateChecklistAndReminder(false);

    // // redirecionar para checklist criado
    // window.location.href = `/checklist/${data.id}`;

    // openModalCongratulations
  }

  async function saveLembrete() {
    try {
      await api.post(`/calculadora/encerramentos`, {
        ...stateLembrete,
      });

      await getInfoCalculadora();
    } catch (error) {
      console.error("Erro ao salvar lembrete:", error);
      // Optionally, show an error message to the user
      alert("Erro ao salvar lembrete. Tente novamente.");
    } finally {
      // Always close the modal and reset the state
      setModalCreateChecklistAndReminder(false);
      setSavingLembrete(false);
    }
  }

  useEffect(() => {
    console.log(calculadoraSalva[activeTab], "calculadora Salva aqui");
    if (modalCreateChecklistAndReminder) {
      setStateChecklist({
        nome: `Checklist do lote ${calculadoraSalva.nome}`,
        descricao: "",
        link: calculadoraSalva[activeTab]?.link_leilao,
        calculadoraId: calculadoraSalva.id,
      });
      setStateLembrete({
        nome: `Lembrete da calculadora ${calculadoraSalva.nome}`,
        link: calculadoraSalva[activeTab]?.link_leilao,
        data_primeira_praca: calculadoraSalva[activeTab]?.data_primeira_praca,
        data_segunda_praca: calculadoraSalva[activeTab]?.data_segunda_praca,
        calculadoraId: calculadoraSalva.id,
      });
    }
  }, [modalCreateChecklistAndReminder, calculadoraSalva]);

  function openModalDetails() {
    console.log("opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    // pegar informações do formData
    // opção de fechar o modal
    // passagem de dados do formData para os stateChecklist e para o stateLembrete

    console.log("opa", calculadoraSalva);

    if (!calculadoraSalva.checklist) {
      console.log("salvando checklist no modal");
      return (
        <>
          {/* Backdrop overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></div>

          {/* Modal container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div className="bg-[#00071E] relative rounded-lg shadow-lg max-w-lg w-full p-6 overflow-auto max-h-[80vh] border border-blue-900">
              {savingChecklist && (
                <button
                  onClick={() => {
                    setModalCreateChecklistAndReminder(false);
                    setSavingChecklist(false);
                  }}
                  className="text-gray-100 absolute right-0 mr-8 hover:text-blue-400 transition"
                >
                  <FaWindowClose />
                </button>
              )}
              {!savingChecklist && (
                <>
                  <h1 className="text-xl font-semibold mb-4 text-gray-100">
                    Deseja criar um checklist para esse Leilão?
                  </h1>

                  <div className="flex gap-4 justify-end">
                    <button
                      onClick={() => {
                        setModalCreateChecklistAndReminder(false);
                        setSavingChecklist(false);
                      }}
                      className="bg-gray-600 hover:bg-gray-500 text-gray-100 font-semibold px-4 py-2 rounded-md transition"
                    >
                      Não
                    </button>
                    <button
                      onClick={() => {
                        setSavingChecklist(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition"
                    >
                      Salvar Checklist
                    </button>
                  </div>
                </>
              )}

              {savingChecklist && (
                <div className="space-y-6">
                  <div>
                    <p className="text-lg font-semibold text-gray-100 mb-3">
                      Checklist
                    </p>
                    <div className="flex flex-col gap-4">
                      <label
                        className="flex flex-col gap-1 text-gray-100"
                        htmlFor=""
                      >
                        Nome
                        <input
                          placeholder="Nome"
                          className="text-gray-100 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={stateChecklist?.nome}
                          onChange={(e) => {
                            setStateChecklist((prev) => {
                              const copy = { ...prev };
                              copy["nome"] = e.target.value;
                              setStateChecklist(copy);
                            });
                          }}
                          type="text"
                        />
                      </label>

                      <label
                        className="flex flex-col gap-1 text-gray-100"
                        htmlFor=""
                      >
                        Descrição
                        <input
                          placeholder="Descrição"
                          className="text-gray-100 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={stateChecklist?.descricao}
                          onChange={(e) => {
                            setStateChecklist((prev) => {
                              const copy = { ...prev };
                              copy["descricao"] = e.target.value;
                              setStateChecklist(copy);
                            });
                          }}
                          type="text"
                        />
                      </label>

                      <label
                        className="flex flex-col gap-1 text-gray-100"
                        htmlFor=""
                      >
                        Link do Leilão
                        <input
                          placeholder="Descrição"
                          className="text-gray-100 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={stateChecklist?.link}
                          onChange={(e) => {
                            setStateChecklist((prev) => {
                              const copy = { ...prev };
                              copy["link"] = e.target.value;
                              setStateChecklist(copy);
                            });
                          }}
                          type="text"
                        />
                      </label>
                    </div>
                  </div>

                  {/* <div className="h-1 bg-blue-500 rounded-full"></div> */}

                  <button
                    onClick={saveChecklist}
                    className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded w-full transition"
                  >
                    CRIAR CHECKLIST
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      );
    }

    if (!calculadoraSalva.encerramento) {
      console.log("sem lembrete, vamos criar!");
      return (
        <>
          {/* Backdrop overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></div>

          {/* Modal container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div className="bg-[#00071E] relative rounded-lg shadow-lg max-w-lg w-full p-6 overflow-auto max-h-[80vh] border border-blue-900">
              {savingLembrete && (
                <button
                  onClick={() => {
                    setModalCreateChecklistAndReminder(false);
                    setSavingLembrete(false);
                  }}
                  className="text-gray-100 absolute right-0 mr-8 hover:text-blue-400 transition"
                >
                  <FaWindowClose />
                </button>
              )}
              {!savingLembrete && (
                <>
                  <h1 className="text-xl font-semibold mb-4 text-gray-100">
                    Deseja criar um encerramento para esse Leilão?
                  </h1>

                  <div className="flex gap-4 justify-end">
                    <button
                      onClick={() => {
                        setModalCreateChecklistAndReminder(false);
                        setSavingLembrete(false);
                      }}
                      className="bg-gray-600 hover:bg-gray-500 text-gray-100 font-semibold px-4 py-2 rounded-md transition"
                    >
                      Não
                    </button>
                    <button
                      onClick={() => {
                        setSavingLembrete(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition"
                    >
                      Criar Encerramento
                    </button>
                  </div>
                </>
              )}

              {savingLembrete && (
                <div className="space-y-6">
                  <div>
                    {/* <p className="text-lg font-semibold text-gray-100 mb-3">
                      Encerramento
                    </p> */}
                    {/* <div className="flex flex-col gap-4">
                      <label
                        className="flex flex-col gap-1 text-gray-100"
                        htmlFor=""
                      >
                        Nome
                        <input
                          placeholder="Nome"
                          className="text-gray-100 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={stateChecklist?.nome}
                          onChange={(e) => {
                            setStateChecklist((prev) => {
                              const copy = { ...prev };
                              copy["nome"] = e.target.value;
                              setStateChecklist(copy);
                            });
                          }}
                          type="text"
                        />
                      </label>

                      <label
                        className="flex flex-col gap-1 text-gray-100"
                        htmlFor=""
                      >
                        Descrição
                        <input
                          placeholder="Descrição"
                          className="text-gray-100 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={stateChecklist?.descricao}
                          onChange={(e) => {
                            setStateChecklist((prev) => {
                              const copy = { ...prev };
                              copy["descricao"] = e.target.value;
                              setStateChecklist(copy);
                            });
                          }}
                          type="text"
                        />
                      </label>

                      <label
                        className="flex flex-col gap-1 text-gray-100"
                        htmlFor=""
                      >
                        Link do Leilão
                        <input
                          placeholder="Descrição"
                          className="text-gray-100 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={stateChecklist?.link}
                          onChange={(e) => {
                            setStateChecklist((prev) => {
                              const copy = { ...prev };
                              copy["link"] = e.target.value;
                              setStateChecklist(copy);
                            });
                          }}
                          type="text"
                        />
                      </label>
                    </div> */}

                    <p className="text-lg font-semibold text-gray-100 mb-3">
                      Encerramento
                    </p>

                    <div className="flex flex-col gap-4">
                      <label
                        className="flex flex-col gap-1 text-gray-100"
                        htmlFor=""
                      >
                        Nome
                        <input
                          placeholder="Nome"
                          className="text-gray-100 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={stateLembrete?.nome}
                          onChange={(e) => {
                            setStateLembrete((prev) => {
                              const copy = { ...prev };
                              copy["nome"] = e.target.value;
                              setStateLembrete(copy);
                            });
                          }}
                          type="text"
                        />
                      </label>

                      <label
                        className="flex flex-col gap-1 text-gray-100"
                        htmlFor=""
                      >
                        Link do Leilão
                        <input
                          placeholder="Link do Leilão"
                          className="text-gray-100 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={stateLembrete?.link}
                          onChange={(e) => {
                            setStateLembrete((prev) => {
                              const copy = { ...prev };
                              copy["link"] = e.target.value;
                              setStateLembrete(copy);
                            });
                          }}
                          type="text"
                        />
                      </label>

                      <label
                        className="flex flex-col gap-1 text-gray-100"
                        htmlFor=""
                      >
                        Data da Primeira Praça
                        <input
                          placeholder="Data da Primeira Praça"
                          className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={stateLembrete?.data_primeira_praca}
                          onChange={(e) => {
                            setStateLembrete((prev) => {
                              const copy = { ...prev };
                              copy["data_primeira_praca"] = e.target.value;
                              setStateLembrete(copy);
                            });
                          }}
                          type="date"
                        />
                      </label>

                      <label
                        className="flex flex-col gap-1 text-gray-100"
                        htmlFor=""
                      >
                        Data da Segunda Praça
                        <input
                          placeholder="Data da Segunda Praça"
                          className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={stateLembrete?.data_segunda_praca}
                          onChange={(e) => {
                            setStateLembrete((prev) => {
                              const copy = { ...prev };
                              copy["data_segunda_praca"] = e.target.value;
                              setStateLembrete(copy);
                            });
                          }}
                          type="date"
                        />
                      </label>
                    </div>
                  </div>

                  {/* <div className="h-1 bg-blue-500 rounded-full"></div> */}

                  <button
                    onClick={saveLembrete}
                    className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded w-full transition"
                  >
                    SALVAR LEMBRETE
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      );
    }

    // if (calculadoraSalva.checklist && !calculadoraSalva.encerramento) {
    //   setSavingLembrete(true);
    // }

    // {savingLembrete && openModalDetailsLembrete()}
  }

  // const mainContainer = useRef(null)

  // function scrollTop() {
  //   console.log('clicked')
  //   if (mainContainer.current) {
  //     console.log('scrolling')
  //     mainContainer.current.scrollTo({
  //       top: 0,
  //       behavior: 'smooth'
  //     })
  //   }
  // }

  return (
    <div className="max-w-7xl mx-auto sm:p-6 p-4 bg-[#00071E] rounded-xl text-gray-100 relative min-h-screen ">
      {/* <button className='absolute bottom-0 mb-10 z-50 right-0 mr-10 bg-red-700'>oi né</button> */}
      <div className=" flex gap-2">
        {calculadoraSalva?.checklist?.id && (
          <button onClick={() => nav('/checklist/' + calculadoraSalva?.checklist?.id)} className="bg-purple-900/40 text-white px-4 py-2 rounded-lg hover:bg-[#0a5f8a] transition-colors">Checklist</button>
        )}
        {
          calculadoraSalva?.encerramento?.id && (
            <button onClick={() => nav('/checklist/' + calculadoraSalva?.encerramento?.id)} className="bg-purple-900/40 text-white px-4 py-2 rounded-lg hover:bg-[#0a5f8a] transition-colors">Encerramento</button>
          )
        }
      </div>
      <div className="flex justify-start mb-8 mt-5 items-center gap-4">
        {isEditingNome ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tempNome}
              onChange={(e) => setTempNome(e.target.value)}
              className="text-3xl first-letter:capitalize font-semibold text-white bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-300"
              disabled={updatingNome}
            />
            <button
              onClick={handleSaveNome}
              disabled={updatingNome}
              className="text-green-500 hover:text-green-400 disabled:opacity-50"
            >
              <FaCheck />
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={updatingNome}
              className="text-red-500 hover:text-red-400 disabled:opacity-50"
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <>
            <span className="text-center text-3xl first-letter:capitalize font-semibold text-white">
              {calculadoraSalva.nome}
            </span>
            <button
              onClick={handleEditNome}
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <FaEdit />
            </button>
          </>
        )}
      </div>
      <div className="flex justify-center">
        {modalCreateChecklistAndReminder && openModalDetails()}
      </div>


      <div className="flex justify-start gap-4 mb-10">
        {/* Botões com type="button" para evitar submit */}

        <button
          type="button"
          onClick={() => setActiveTab("lance")}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${activeTab === "lance"
            ? "bg-purple-900/40 text-white border border-purple-900/40"
            : "text-gray-300 hover:text-purple-900/40 border border-gray-600 hover:border-purple-900/40"
            }`}
        >
          À Vista
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("proposta")}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${activeTab === "proposta"
            ? "bg-purple-900/40 text-white border border-purple-900/40"
            : "text-gray-300 hover:text-purple-900/40 border border-gray-600 hover:border-purple-900/40"
            }`}
        >
          Parcelado
        </button>
      </div>

      {/* Renderização condicional das abas */}
      {activeTab === "lance" && (
        <LanceTab
          openModal={
            // Object.keys(calculadoraSalva.checklist || {}).length > 0 &&
            // Object.keys(calculadoraSalva.encerramento || {}).length > 0
            //   ? fake
            // :
            setModalCreateChecklistAndReminder
          }
          modalCl={modalCreateChecklistAndReminder}
          formData={formData}
          onChange={handleChange}
        />
      )}
      {activeTab === "proposta" && (
        <PropostaDeCompra
          openModal={
            // Object.keys(calculadoraSalva.checklist || {}).length > 0 &&
            // Object.keys(calculadoraSalva.encerramento || {}).length > 0
            //   ? fake
            //   :
            setModalCreateChecklistAndReminder

          }
          modalCl={modalCreateChecklistAndReminder}
          formData={formData}
          onChange={handleChange}
        />
      )}
      {activeTab === "valor" && (
        <TransferenciaDocumentacao
          formData={formData}
          onChange={handleChange}
        />
      )}
    </div>
  );
};

export default CalculadoraComponent;
