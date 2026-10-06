import React, { useState, useEffect, useContext } from "react";
import { FaPlus, FaTrash, FaBell, FaExclamationTriangle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosBase from "../axios/axiosBase";
import Context from "../context/Context";
import { useNavigate } from "react-router-dom";
import api from "../axios/axiosBase";
import { PiClockCountdownFill } from "react-icons/pi";

// Funções utilitárias sem libs externas
const formatDate = (dateStr) => {
    if (!dateStr) return "-";

    const clean = dateStr.split("T")[0]; // remove o horário (se houver)

    const [ano, mes, dia] = clean.split("-").map(Number);

    const parsed = new Date(ano, mes - 1, dia);

    if (isNaN(parsed)) return "-";

    return parsed.toLocaleDateString("pt-BR"); // dd/mm/yyyy
};

const differenceInDays = (date1, date2) => {
    const diffTime = date1.getTime() - date2.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// opção de filtro por 1 praça mais proxima e por segunda praça mais proxima no frontend
// altera vai para duas tanto prmeira quanto segunda se faltar um dia ou for o dia 

function parseDate(dateStr) {
    if (!dateStr) return null;
    const [ano, mes, dia] = dateStr.split("-").map(Number);
    return new Date(ano, mes - 1, dia); // mês é 0-based
}

function diferencaEmDias(data1, data2) {
    if (!data1 || !data2) return 0;

    const inicio = new Date(data1);
    const fim = new Date(data2);

    if (isNaN(inicio) || isNaN(fim)) return 0;

    const umDiaMs = 1000 * 60 * 60 * 24;

    return Math.round((fim.setHours(0, 0, 0, 0) - inicio.setHours(0, 0, 0, 0)) / umDiaMs);
}

function sortByDate(encerramentos, praca = "1P") {
    const today = new Date();
    const key = praca === "1P" ? "data_primeira_praca" : "data_segunda_praca";

    encerramentos.sort((a, b) => {
        const diffDataA = diferencaEmDias(today, a?.[key]);
        const diffDataB = diferencaEmDias(today, b?.[key]);

        if (diffDataA === diffDataB) {
            return 0;
        }

        if (diffDataA >= 0 && diffDataB >= 0) {
            return diffDataA < diffDataB ? -1 : 1;
        }

        if (diffDataA < 0 && diffDataB < 0) {
            return diffDataA > diffDataB ? -1 : 1;
        }

        if (diffDataA > 0 && diffDataB < 0) {
            return -1;
        }

        if (diffDataA < 0 && diffDataB > 0) {
            return 1;
        }

        return 0;
    });

    return encerramentos;
}

const LembreteEncerramentos = () => {
    const [lembretes, setLembretes] = useState([]);
    const [novo, setNovo] = useState({ nome: "", link: "", data_primeira_praca: "", data_segunda_praca: "" });
    const [avisos, setAvisos] = useState([]);
    const [actualPraca, setActualPraca] = useState('')
    const { user } = useContext(Context)
    const nav = useNavigate()

    // Verifica lembretes próximos e dispara toast
    useEffect(() => {
        const hoje = new Date();
        const proximos = lembretes.flatMap((l) => {
            const hoje = new Date();
            const alerts = [];
            if (l.data_primeira_praca) {
                const d1 = new Date(l.data_primeira_praca);
                const diff1 = differenceInDays(d1, hoje);
                if (diff1 >= 0 && diff1 <= 3) alerts.push({ ...l, alertaPraça: "1ª Praça" });
            }
            if (l.data_segunda_praca) {
                const d2 = new Date(l.data_segunda_praca);
                const diff2 = differenceInDays(d2, hoje);
                if (diff2 >= 0 && diff2 <= 3) alerts.push({ ...l, alertaPraça: "2ª Praça" });
            }
            return alerts;
        });



        setAvisos(proximos);

        proximos.forEach((a) => {
            toast.warning(`⚠️ Leilão próximo: ${a.link}`, {
                position: "bottom-right",
                autoClose: 6000,
            });
        });
    }, [lembretes]);

    const adicionarLembrete = async () => {
        const { data } = await api.post('/calculadora/encerramentos', novo)

        setLembretes([data, ...lembretes])
        setNovo({ nome: "", link: "", data_primeira_praca: "", data_segunda_praca: "" })
    };

    const getLembretes = async () => {
        const { data } = await api.get('/calculadora/encerramentos')

        if (data) {
            setLembretes(data)
        }
    }

    useEffect(() => {
        getLembretes()
    }, [])

    const excluirLembrete = (id) => {
        setLembretes(lembretes.filter((l) => l.id !== id));
    };

    return (
        <div className="min-h-screen p-8 bg-[#00071E]">
            <div className="bg-gradient-to-r from-[#5524E8]/35 to-[#6024AF]/10 backdrop-blur-lg rounded-3xl  shadow-purple-500/50 max-w-5xl mx-auto p-10 border border-purple-400/50">
                {/* Título */}
                <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-3 text-white tracking-wide">
                    <PiClockCountdownFill size={29} className="text-purple-400 text-2xl" /> Lembrete de Encerramentos
                </h2>
                {/* Campo Nome do Lembrete */}
                <form action="
                "
                    onSubmit={(e) => {
                        e.preventDefault();
                        adicionarLembrete();
                    }}
                >

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-white uppercase text-sm tracking-wide">Nome do Lembrete</label>
                        <input
                            type="text"
                            placeholder="Ex: Leilão do imóvel X"
                            required
                            value={novo.nome}
                            onChange={(e) => setNovo({ ...novo, nome: e.target.value })}
                            className="bg-[#1B2238] border border-purple-500/60 text-white placeholder-purple-300 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none shadow-sm transition"
                        />
                    </div>

                    {/* Formulário */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 mt-8">
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-white uppercase text-sm tracking-wide">Link</label>
                            <input
                                type="text"
                                required
                                placeholder="https://..."
                                value={novo.link}
                                onChange={(e) => setNovo({ ...novo, link: e.target.value })}
                                className="bg-[#1B2238] border border-purple-500/60 text-white placeholder-purple-300 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none shadow-sm transition"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-white uppercase text-sm tracking-wide">Primeira Praça</label>
                            <input
                                type="datetime-local"
                                value={novo.data_primeira_praca}
                                onChange={(e) => setNovo({ ...novo, data_primeira_praca: e.target.value })}
                                className="bg-[#1B2238] border border-purple-500/60 text-white placeholder-purple-300 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none shadow-sm transition"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-white uppercase text-sm tracking-wide">Segunda Praça</label>
                            <input
                                type="datetime-local"
                                value={novo.data_segunda_praca}
                                onChange={(e) => setNovo({ ...novo, data_segunda_praca: e.target.value })}
                                className="bg-[#1B2238] border border-purple-500/60 text-white placeholder-purple-300 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none shadow-sm transition"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="w-full bg-purple-500 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold hover:bg-purple-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.03]"
                            >
                                <FaPlus /> Adicionar
                            </button>
                        </div>
                    </div>

                </form>




                {lembretes.length > 0 && (
                    <div className="flex items-center justify-center flex-col mb-10 gap-5">
                        <h2 className="text-xl text-white">Filtrar por datas</h2>
                        <div className="flex gap-5">
                            <button style={{ background: actualPraca === '1P' ? '#9333ea' : '#1B2238' }} onClick={() => {
                                setActualPraca('1P')
                                setLembretes((prev) => {
                                    return sortByDate(prev)
                                })
                            }} className="bg-[#1B2238] border border-purple-500/60 px-4 py-2 rounded-lg text-white hover:bg-purple-500 transition-colors">Primeira praça mais próxima</button>
                            <button style={{ background: actualPraca === '2P' ? '#9333ea' : '#1B2238' }} onClick={() => {
                                setActualPraca('2P')
                                setLembretes((prev) => {
                                    return sortByDate(prev, '2P')
                                })

                            }} className="bg-[#1B2238] border border-purple-500/60 px-4 py-2 rounded-lg text-white hover:bg-purple-500 transition-colors">Segunda praça mais próxima</button>
                        </div>
                    </div>
                )}

                {/* Lista de lembretes */}
                {lembretes.length === 0 ? (
                    <p className="text-white text-center py-6 italic">Nenhum lembrete cadastrado.</p>
                ) : (
                    <ul className="space-y-4">
                        {lembretes.map((l) => {
                            const hoje = new Date();
                            const d1 = l.data_primeira_praca ? new Date(l.data_primeira_praca) : null;
                            const d2 = l.data_segunda_praca ? new Date(l.data_segunda_praca) : null;

                            const data_primeira_pracaPassou = d1 && differenceInDays(d1, hoje) < 0;
                            const segundaPassou = d2 && differenceInDays(d2, hoje) < 0;

                            let alerta = null

                            if (actualPraca != '') {
                                if (actualPraca == '1P') {
                                    if (l.data_primeira_praca === new Date().toISOString().split('T')[0]) {
                                        alerta = 'Hoje'
                                    }
                                    // colocar amanhã futuramente (Modificar função de sortByDate, para retornar quantos dias faltam e a da para mostrar sempre! tipo faltam 80 dias, faltam 10 dias, falta 1 dia...)
                                } else {
                                    if (l.data_segunda_praca === new Date().toISOString().split('T')[0]) {
                                        alerta = 'Hoje'
                                    }
                                }
                            }

                            return (
                                <li
                                    key={l.id}
                                    className="flex justify-between items-center bg-gradient-to-r from-[#5524E8]/20 to-[#6024AF]/10 p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-purple-400/30"
                                >
                                    <div>
                                        {l.nome && (
                                            <p className="text-lg font-semibold text-white mb-1">{l.nome}<span className="text-red-400"> {alerta && `(Encerrando ${alerta})`}</span></p>
                                        )}

                                        <a
                                            href={l.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-300 underline font-medium break-all hover:text-purple-200 transition-colors"
                                        >
                                            {l.link}
                                        </a>
                                        <p className="text-sm text-purple-200 mt-1">
                                            📅 1ª Praça:{" "}
                                            <span className={data_primeira_pracaPassou ? "line-through text-gray-400" : ""}>
                                                {formatDate(l.data_primeira_praca)}
                                            </span>{" "}
                                            | 2ª Praça:{" "}
                                            <span className={segundaPassou ? "line-through text-gray-400" : ""}>
                                                {formatDate(l.data_segunda_praca)}
                                            </span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => excluirLembrete(l.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors text-lg"
                                    >
                                        <FaTrash />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                )}

                {/* Avisos em destaque */}
                {avisos.length > 0 && (
                    <div className="mt-10 bg-gradient-to-r from-[#5524E8]/20 to-[#6024AF]/10 border border-purple-400/50 p-6 rounded-2xl shadow-md shadow-purple-500/30">
                        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                            <FaExclamationTriangle className="text-purple-400" /> ⚠️ Atenção!
                        </h3>
                        <ul className="text-sm text-purple-200 space-y-2">
                            {avisos.map((a) => (
                                <li key={a.id}>
                                    O Leilão{" "}
                                    <a
                                        href={a.link}
                                        className="underline text-purple-300 font-medium hover:text-purple-200 transition-colors"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {a.link}
                                    </a>{" "}
                                    está próximo da data de encerramento! ({a.alertaPraça})
                                </li>
                            ))}
                        </ul>

                        <div className="flex gap-2 mt-8">
                            <button
                                onClick={() => nav("/calculadora/dashboard")}
                                className="flex-1 bg-purple-500 text-white py-3 rounded-2xl hover:bg-purple-600 transition-colors"
                            >
                                Ir para Calculadora
                            </button>
                            <button
                                onClick={() => nav("/checklist")}
                                className="flex-1 bg-purple-500 text-white py-3 rounded-2xl hover:bg-purple-600 transition-colors"
                            >
                                Ir para Checklist
                            </button>
                        </div>

                    </div>
                )}

            </div>


            {/* Toast container */}
            <ToastContainer />
        </div>
    );
};

export default LembreteEncerramentos;
