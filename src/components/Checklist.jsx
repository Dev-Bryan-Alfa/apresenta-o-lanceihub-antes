import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import LoteHistoryButton from "./LoteHistoryButton";
import ChecklistCompletionModal from "./ChecklistCompletionModal";
import { useNavigate, useParams } from "react-router-dom";
import Context from "../context/Context";
import api from "../axios/axiosBase";
import { FaTrash } from "react-icons/fa";

const checklistItems = [
  {
    topic: "Tipo de Imóvel",
    description:
      "Verifique o tipo de imóvel (casa, apartamento, terreno, etc.)",
    type: "select",
    options: [
      "Urbano Residencial",
      "Urbano Comercial",
      "Rural Fazenda",
      "Rural Sítio",
      "Rural Chácara",
    ],
  },
  {
    topic: "Finalidade",
    description: "Veja se o imovel atende a finalidade desejada",
    type: "multi",
    options: ["Uso Próprio", "Revenda", "Locação"],
  },
  {
    topic: "Valor de Avaliação:",
    description:
      "Verifique se o valor de avaliação do imóvel está de acordo com o mercado",
    type: "text",
  },
  {
    topic: "Descrição do Imóvel:",
    description:
      "Verifique se a descrição do imóvel está de acordo com o que está procurando",
    type: "text",
  },
  {
    topic: "Analisou o edital do Leilão?",
    description:
      "Leia atentamente o edital de Leilão e verifique se a oportunidade atende ao que você deseja",
    type: "text",
  },
  {
    topic: "Objeto do Leilão:",
    description: "Qual o objeto do Leilão?",
    type: "select",
    options: ["Propriedade", "Direitos", "Nua Propriedade", "Fração Ideal"],
  },
  {
    topic: "Desconto:",
    description:
      "Verifique se o desconto está de acordo com o que está buscando",
    type: "text",
  },
  {
    topic: "Condições de Venda:",
    description:
      "Verifique as possiveis formas de pagamento (à vista e parcelado) e o prazo para pagamento",
    type: "text",
  },
  {
    topic: "Checar ônus/dívidas:",
    description:
      "Verifique se as dívidas do imovel serão sub-rogadas no valor de avaliação",
    type: "text",
  },
  {
    topic: "Visitação:",
    description: "Verifique se é possivel visitar o imovel",
    type: "text",
  },
  {
    topic: "Defina seu orçamento:",
    description:
      "Verifique os valores da arrematação e defina o valor limite para a sua participação no Leilão",
    type: "text",
  },
];

const checklistFields = [
  "tipo_imovel",
  "finalidade",
  "valor_avaliacao",
  "descricao_imovel",
  "analisou_edital",
  "objeto_leilao",
  "desconto",
  "condicoes_venda",
  "onus_dividas",
  "visitacao",
  "orcamento",
];

const statusFields = checklistFields.map((field) => `status_${field}`);

const statusOptions = [
  {
    value: "em_analise",
    label: "Em Análise",
    color: "bg-yellow-400 text-black",
    colorUnselected: "bg-yellow-600/30 text-black",
  },
  {
    value: "feito",
    label: "Feito",
    color: "bg-green-500 text-white",
    colorUnselected: "bg-green-600/30 text-black",
  },
];

const Checklist = () => {
  const [checklistLotes, setChecklistLotes] = useState([]);
  const [selectedChecklistLoteId, setSelectedChecklistLoteId] = useState(null);
  const [nomeLote, setNomeLote] = useState("");
  const [link, setLink] = useState("");
  const [data, setData] = useState(
    checklistFields.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
  );
  const [savedLembreteId, setSavedLembreteId] = useState(null);
  const [status, setStatus] = useState(
    checklistFields.reduce(
      (acc, field) => ({ ...acc, [`status_${field}`]: "pendente" }),
      {}
    )
  );
  const [loading, setLoading] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionModalShown, setCompletionModalShown] = useState(false);
  const [loteId, setLoteId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [savedChecklist, setSavedChecklist] = useState(null);

  const { id: checklistId } = useParams();
  const { user } = useContext(Context);

  const [stateLembrete, setStateLembrete] = useState({
    nome: `${nomeLote || ""}`,
    link: link,
    data_primeira_praca:
      savedChecklist?.calculadora?.["lance"]?.data_primeira_praca ||
      savedChecklist?.calculadora?.["proposta_compra"]?.data_primeira_praca ||
      "",
    data_segunda_praca:
      savedChecklist?.calculadora?.["lance"]?.data_segunda_praca ||
      savedChecklist?.calculadora?.["proposta_compra"]?.data_segunda_praca ||
      "",
    calculadoraId: savedChecklist?.calculadora?.id,
    checklistId: +checklistId,
  });

  useEffect(() => {
    setStateLembrete({ ...stateLembrete, link: link });
  }, [link]);

  useEffect(() => {
    setStateLembrete({ ...stateLembrete, nome: nomeLote });
  }, [nomeLote]);

  // const api = axios.create({
  //   baseURL: "http://localhost:3001/calculadora"
  // });

  // const getCalculadoraSalva = async () => {

  // }

  // const getLembreteSalvo = async () => {

  // }

  // useEffect(() => {
  //   getCalculadoraSalva()
  //   getLembreteSalvo()
  // }, [])

  const [savingEncerramento, setSavingEncerramento] = useState(false);
  const [savingCalculadora, setSavingCalculadora] = useState(false);

  const nav = useNavigate();

  async function getChecklistDetails() {
    // console.log('Pegando checklists ' + checklistId)
    if (checklistId) {
      const { data } = await api.get(`/calculadora/checklist/${checklistId}`);
      // console.log(data, 'checkilist encontrado')
      setNomeLote(data.nome || "");
      setLink(data.link || "");
      setSavedChecklist(data);
      if (data.checklist_lote.length > 0) {
        setLoteId(data.checklist_lote[0].id);
        const copyData = { ...data.checklist_lote[0] };
        delete copyData["id"];
        delete copyData["loteId"];
        delete copyData["checklistId"];
        delete copyData["nome"];
        delete copyData["userId"];

        // Clean mutually exclusive options on load
        const cleanedData = { ...copyData };
        if (cleanedData.status_objeto_leilao) {
          const current = cleanedData.status_objeto_leilao
            .split(",")
            .map((s) => s.trim());
          if (
            current.includes("Nua Propriedade") &&
            current.includes("Propriedade")
          ) {
            cleanedData.status_objeto_leilao = current
              .filter((item) => item !== "Propriedade")
              .join(",");
          }
        }
        setStatus(cleanedData);
      }
      console.log(data);
      return data;
    }
  }

  useEffect(() => {
    getChecklistDetails();
  }, []);

  useEffect(() => {
    if (loteId) fetchChecklistLotes(loteId);
  }, [loteId]);

  const fetchChecklistLotes = async (loteId) => {
    // console.log('getting', loteId)
    // vai ta aqui dentro esse loteId, deve ser so pegar o checklist e ver o lote id
    try {
      const response = await api.get(`/calculadora/checklist-lote`, {
        params: { userId: user.id, loteId },
      });
      setChecklistLotes(response.data.filter((item) => item.loteId === loteId));
    } catch (err) {
      console.error("Erro ao buscar checklist do lote:", err);
      alert("Erro ao carregar checklist. Por favor, tente novamente.");
    }
  };

  const selectChecklist = (lote) => {
    setSelectedChecklistLoteId(lote.id);
    setNomeLote(lote.nome);
    setStatus(
      checklistFields.reduce(
        (acc, field) => ({
          ...acc,
          [`status_${field}`]: lote[`status_${field}`] || "pendente",
        }),
        {}
      )
    );
  };

  const handleStatusChange = (field, value) => {
    setStatus((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChecklist = async () => {
    if (!checklistId) return alert("O checklist pai é obrigatório.");

    setLoading(true);

    console.log("=---=--=-=-=-=-=- ROI NÈ");

    try {
      const checklistData = {
        nome: nomeLote || "Checklist Sem Nome",
        userId: user.id,
        checklistId,
        loteId,
        ...status,
      };

      // console.log(savedChecklist)
      // return savedChecklist

      await api.put("/calculadora/checklist/" + checklistId, {
        nome: nomeLote,
        link: link,
      });

      if (savedChecklist && savedChecklist.checklist_lote.length > 0) {
        console.log("editando");
        const checklistLoteId = savedChecklist.checklist_lote[0]?.id;
        await api.put(
          `/calculadora/checklist-lote/${checklistLoteId}`,
          checklistData
        );
      } else {
        console.log("salvando");
        await api.post(`/calculadora/checklist-lote`, checklistData);
      }

      // Verificar se todos os itens foram concluídos
      const allCompleted = checklistFields.every((field, idx) =>
        isFieldCompleted(field, checklistItems[idx].type)
      );

      if (allCompleted) {
        setShowCompletionModal(true);
      } else {
        // alert("✅ Checklist salvo com sucesso!");
      }

      const checklistAtualizado = await getChecklistDetails();

      if (!checklistAtualizado.encerramento) {
        setSavingEncerramento(true);
      } else if (!checklistAtualizado.calculadora) {
        setSavingCalculadora(true);
      }

      // if (checklistAtualizado.calculadora) {

      // }
    } catch (err) {
      console.error("Erro ao salvar checklist:", err);
      alert("❌ Erro ao salvar checklist. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChecklist = async () => {
    if (!selectedChecklistLoteId) return;
    if (!window.confirm("Deseja realmente excluir este checklist?")) return;

    try {
      await api.delete(
        `/calculadora/checklist-lote/${selectedChecklistLoteId}`
      );
      alert("Checklist excluído!");
      fetchChecklistLotes(loteId);
      handleCancelChanges();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir checklist.");
    }
  };

  const handleDeleteChecklistMain = async () => {
    if (!checklistId) return;
    if (!window.confirm("Deseja realmente excluir este checklist principal?"))
      return;

    try {
      await api.delete(`/calculadora/checklist/${checklistId}`);
      alert("Checklist principal excluído!");
      nav("/dashboard"); // or wherever the dashboard is
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir checklist principal.");
    }
  };

  const handleCancelChanges = () => {
    setNomeLote("");
    setLink("");
    setSelectedChecklistLoteId(null);
    setStatus(
      checklistFields.reduce(
        (acc, field) => ({ ...acc, [`status_${field}`]: "pendente" }),
        {}
      )
    );
    setShowCompletionModal(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      pendente: "bg-yellow-200 text-yellow-800",
      em_analise: "bg-yellow-400 text-black",
      concluido: "bg-green-500 text-white",
      inviavel: "bg-pink-500 text-white",
    };
    return colors[status] || "bg-gray-200 text-gray-800";
  };

  const getProgress = () => {
    const filled = checklistFields.filter(
      (field) =>
        status[`status_${field}`] && status[`status_${field}`] !== "pendente"
    ).length;
    return (filled / checklistFields.length) * 100;
  };

  const renderInput = (item, field) => {
    const statusKey = `status_${field}`;
    switch (item.type) {
      case "select":
        return (
          <select
            value={status[statusKey] || ""}
            onChange={(e) => handleStatusChange(statusKey, e.target.value)}
            className="w-full p-2 rounded-lg border border-purple-500/60 bg-[#1B2238] text-white outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">Selecione</option>
            {item.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      case "multi":
        return (
          <div className="flex flex-wrap gap-2">
            {item.options.map((opt) => (
              <label key={opt} className="flex items-center gap-1">
                <input
                  key={`${opt}-${status[statusKey]}`}
                  type="checkbox"
                  checked={
                    status[statusKey]
                      ? status[statusKey]
                        .split(",")
                        .map((s) => s.trim())
                        .includes(opt)
                      : false
                  }
                  onChange={(e) => {
                    const current = status[statusKey]
                      ? status[statusKey].split(",").map((s) => s.trim())
                      : [];
                    let newCurrent = new Set(current);
                    if (e.target.checked) {
                      // Make "Propriedade" and "Nua Propriedade" mutually exclusive
                      if (opt === "Propriedade" || opt === "Nua Propriedade") {
                        newCurrent.delete("Propriedade");
                        newCurrent.delete("Nua Propriedade");
                      }
                      newCurrent.add(opt);
                    } else {
                      newCurrent.delete(opt);
                    }
                    handleStatusChange(
                      statusKey,
                      Array.from(newCurrent).join(",")
                    );
                  }}
                  className="w-4 h-4 rounded border-2 border-white bg-[#1B2238] focus:ring-2 focus:ring-purple-400"
                />
                <span className="text-gray-100">{opt}</span>
              </label>
            ))}
          </div>
        );
      case "text":
      default:
        return (
          <div className="flex flex-col items-start gap-2">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleStatusChange(statusKey, opt.value)}
                className={`px-4 py-2 rounded-lg cursor-pointer border-2 border-white transition-all duration-200 ${status[statusKey] === opt.value
                  ? `${opt.color} text-white font-bold shadow-lg scale-105`
                  : `${opt.colorUnselected} text-gray-300 hover:bg-gray-700`
                  }`}
              >
                {opt.value === "feito" ? "Feito!" : "Em análise"}
              </button>
            ))}
          </div>
        );
    }
  };

  const CheckboxGroup = () => (
    <div className="overflow-x-auto rounded-xl shadow-lg bg-[#0B1536]">
      <table className="w-full border-collapse text-sm sm:text-base min-w-[600px]">
        <thead>
          <tr className="bg-gradient-to-r from-[#5524E8] to-[#6024AF] text-[#010821] text-center">
            <th className="p-2 sm:p-3 font-montserrat font-semibold rounded-tl-xl text-gray-200">
              Tópicos
            </th>
            <th className="p-2 sm:p-3 font-bold text-gray-200 text-center">
              Descrição
            </th>
            <th className="p-2 sm:p-3 font-bold rounded-tr-xl text-gray-200 text-center">
              Resposta
            </th>
          </tr>
        </thead>
        <tbody>
          {checklistItems.map((item, idx) => {
            const field = checklistFields[idx];
            return (
              <tr
                key={field}
                className={idx % 2 === 0 ? "bg-[#101a36]" : "bg-[#14204a]"}
              >
                <td className="p-2 sm:p-3 font-semibold">
                  <span className="bg-white text-black rounded-full text-nowrap px-2 sm:px-3 py-1 text-xs sm:text-sm">
                    {item.topic}
                  </span>
                </td>
                <td className="p-2 sm:p-3 text-gray-100 text-sm sm:text-base">
                  {item.description}
                </td>
                <td className="p-2 sm:p-3 text-center">
                  {renderInput(item, field)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // Função para verificar se um campo está concluído baseado no tipo
  const isFieldCompleted = (field, type) => {
    const statusKey = `status_${field}`;
    if (type === "select" || type === "multi") {
      return status[statusKey] && status[statusKey].trim() !== "";
    } else {
      return status[statusKey] === "feito";
    }
  };

  // Verificar se todos os itens estão concluídos
  const allItemsCompleted = checklistFields.every((field, idx) =>
    isFieldCompleted(field, checklistItems[idx].type)
  );

  // Efeito para detectar quando o checklist é completado
  useEffect(() => {
    const checklistCompleted = checklistFields.every((field, idx) =>
      isFieldCompleted(field, checklistItems[idx].type)
    );

    // Mostrar modal apenas quando muda de não-completado para completado e não foi mostrado ainda
    if (checklistCompleted && !completionModalShown) {
      setShowCompletionModal(true);
      setCompletionModalShown(true);
    }
  }, [status, completionModalShown]);

  const saveEncerramento = async () => {
    const { data: encerramento } = await api.post(
      `/calculadora/encerramentos`,
      {
        ...stateLembrete,
        link,
      }
    );

    if (encerramento?.id) {
      setSavedLembreteId(encerramento.id);
    }

    setSavedChecklist((prev) => {
      const updated = { ...prev, encerramento };
      setSavingCalculadora(true);
      return updated;
    });

    setSavingEncerramento(false);
  };

  const saveCalculadora = async () => {
    const { data: novaCalculadora } = await api.post(`/calculadora/from/encerramento`, {
      nome: nomeLote,
      checklistId: +checklistId,
      dadosEncerramento: {
        data_primeira_praca: stateLembrete?.data_primeira_praca,
        data_segunda_praca: stateLembrete?.data_segunda_praca,
        link_leilao: link,
      },
      ...(savedLembreteId && { encerramentoId: +savedLembreteId }),
    });

    nav("/calculadora/" + novaCalculadora.id);
  };

  return (
    <div className="min-h-screen bg-[#00071E] p-4 sm:p-8 text-white">
      {/* Modal */}

      {savingEncerramento && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 backdrop-blur-md">
          <div className="bg-gradient-to-br from-[#0B1536] to-[#1B2238] relative rounded-2xl shadow-2xl max-w-lg w-full p-8 overflow-auto max-h-[80vh] border border-purple-500/50">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Criar Lembrete de Encerramento
              </h2>
              <p className="text-gray-300">
                Deseja criar um lembrete para este lote?
              </p>
            </div>

            <div className="flex flex-col gap-4 mb-6">
              <label className="flex flex-col gap-2 text-gray-100">
                <span className="font-semibold">Nome do Lembrete</span>
                <input
                  placeholder="Nome"
                  className="text-gray-100 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
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

              <label className="flex flex-col gap-2 text-gray-100">
                <span className="font-semibold">Link do Leilão</span>
                <input
                  placeholder="Link do Leilão"
                  className="text-gray-100 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
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

              <label className="flex flex-col gap-2 text-gray-100">
                <span className="font-semibold">Data da Primeira Praça</span>
                <input
                  placeholder="Data da Primeira Praça"
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
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

              <label className="flex flex-col gap-2 text-gray-100">
                <span className="font-semibold">Data da Segunda Praça</span>
                <input
                  placeholder="Data da Segunda Praça"
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
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

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setSavingEncerramento(false);
                  if (!savedChecklist?.calculadora) {
                    setSavingCalculadora(true);
                  }
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                Não
              </button>
              <button
                onClick={saveEncerramento}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                Criar Lembrete
              </button>
            </div>
          </div>
        </div>
      )}

      {savingCalculadora && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 backdrop-blur-md">
          <div className="bg-gradient-to-br from-[#0B1536] to-[#1B2238] relative rounded-2xl shadow-2xl max-w-lg w-full p-8 overflow-auto max-h-[80vh] border border-purple-500/50">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Criar Calculadora
              </h2>
              <p className="text-gray-300">
                Deseja criar uma calculadora para este lote?
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setSavingCalculadora(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                Não
              </button>
              <button
                onClick={saveCalculadora}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                Criar Calculadora
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-white drop-shadow-lg">
            Checklist da Arrematação
          </h1>
          <div className="ml-4 flex gap-2">
            {selectedChecklistLoteId && (
              <LoteHistoryButton loteId={selectedChecklistLoteId} />
            )}
            <button
              onClick={handleDeleteChecklistMain}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 flex items-center gap-2"
            >
              <FaTrash />
              Excluir Checklist Principal
            </button>
          </div>
        </div>

        {checklistLotes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-purple-400 mb-4">
              Minhas Alterações
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {checklistLotes.map((lote) => (
                <div
                  key={lote.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedChecklistLoteId === lote.id
                    ? "bg-purple-500/20 border border-purple-400"
                    : "bg-[#1B2238] border border-purple-500/60 hover:bg-purple-500/10"
                    }`}
                  onClick={() => selectChecklist(lote)}
                >
                  <h3 className="font-bold text-white">{lote.nome}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className=" backdrop-blur-lg rounded-3xl border border-purple-400/50 p-6 mb-6">
          <div className="mb-4">
            <label className="block text-lg font-bold text-purple-400 mb-2">
              Nome do Lote:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={nomeLote}
                onChange={(e) => setNomeLote(e.target.value)}
                placeholder="Digite o nome do lote"
                className="flex-1 p-3 rounded-lg border border-purple-500/60 bg-[#1B2238] text-white placeholder-purple-200 outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
              {selectedChecklistLoteId && (
                <div className="ml-2">
                  <LoteHistoryButton loteId={selectedChecklistLoteId} />
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-lg font-bold text-purple-400 mb-2">
              Link do Leilão
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Digite o link do Leilão"
              className="w-full p-3 rounded-lg border border-purple-500/60 bg-[#1B2238] text-white placeholder-purple-200 outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
          </div>

          {/* Barra de Progresso */}
          <div className="mt-6 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-purple-400">
                Progresso do Checklist
              </span>
              <span className="text-sm font-medium text-purple-400">
                {Math.round(getProgress())}%
              </span>
            </div>
            <div className="w-full bg-[#1B2238] rounded-full h-2 border border-purple-500/60">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
            {allItemsCompleted && (
              <p className="text-center text-purple-400 font-bold mt-2">
                🎉 Todos os itens concluídos!
              </p>
            )}
          </div>
        </div>

        <div className="backdrop-blur-lg rounded-3xl  p-6 mb-6">
          <CheckboxGroup />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleSaveChecklist}
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 disabled:opacity-50"
          >
            {loading
              ? "Salvando..."
              : selectedChecklistLoteId
                ? "Atualizar Checklist"
                : "Salvar Checklist"}
          </button>

          {selectedChecklistLoteId && (
            <button
              onClick={handleDeleteChecklist}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300"
            >
              Excluir
            </button>
          )}

          <button
            onClick={handleCancelChanges}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300"
          >
            Cancelar Alterações
          </button>
        </div>

        {/* Modal de Conclusão */}
        <ChecklistCompletionModal
          isOpen={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
          loteName={nomeLote}
        />
      </div>
    </div>
  );
};

export default Checklist;
