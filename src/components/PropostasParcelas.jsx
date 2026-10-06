import React, { useEffect, useState } from 'react'
import api from '../axios/axiosBase'
import { useNavigate } from 'react-router-dom'
import { formatarEmReais } from './PropostaParcela'
import { InputFieldChangeState } from './PropostaDeCompra'
import { FaWindowClose, FaTrashAlt } from 'react-icons/fa'

function PropostasParcelas() {
    const [parcelaProposta, setParcelaProposta] = useState([])
    const [showModalArrematacao, setShowModalArrematacao] = useState(false)
    const [valorArrematacao, setValorArrematacao] = useState('')
    const [quantidadeParcelas, setQuantidadeParcelas] = useState('')
    const [porcentagemEntrada, setPorcentagemEntrada] = useState('')
    const [indice, setIndice] = useState('')
    const [dataAssinaturaAutoArrematacao, setDataAssinaturaAutoArrematacao] = useState('')
    const [nome, setNome] = useState('')

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const perPage = 10
    const nav = useNavigate()

    // Busca parcelas com paginação (assume que backend aceita skip & take e retorna array)
    async function getParcelasProposta() {
        try {
            const { data } = await api.get(`/calculadora/parcela-proposta`, {
                params: { skip: (page - 1) * perPage, take: perPage }
            })

            // se o backend retorna { items, total } adapte aqui
            if (Array.isArray(data)) {
                setParcelaProposta(data)
                setTotalPages(Math.max(1, Math.ceil(data.length / perPage))) // fallback
            } else if (data.items) {
                setParcelaProposta(data.items)
                setTotalPages(Math.max(1, Math.ceil(data.total / perPage)))
            } else {
                setParcelaProposta([])
                setTotalPages(1)
            }
        } catch (error) {
            console.error('Erro ao carregar propostas:', error)
        }
    }

    useEffect(() => {
        getParcelasProposta()
    }, [page])

    async function createParcelaProposta(e) {
        e.preventDefault()
        if (!indice) return alert('Selecione o índice.')

        try {
            const { data } = await api.post('/calculadora/parcela-proposta', {
                valorArrematacao,
                quantidadeParcelas,
                porcentagemEntrada,
                indice,
                dataAssinaturaAutoArrematacao: dataAssinaturaAutoArrematacao ? dataAssinaturaAutoArrematacao.split('-').reverse().join('/') : '',
                nome,
                calcularAutomaticamente: true
            })
            setShowModalArrematacao(false)
            // adiciona no topo do estado atual
            setParcelaProposta((prev) => [data, ...prev])
            console.log('redirecionando para - ' + data.id)
            nav('/proposta-parcela/' + data.id)
        } catch (error) {
            console.error('Erro ao criar parcela:', error)
            alert('Erro ao criar parcela.')
        }
    }

    // 🗑️ Função para excluir parcela proposta
    async function handleDeleteParcelaProposta(id) {
        const confirmed = window.confirm('Tem certeza que deseja excluir esta proposta?')
        if (!confirmed) return

        try {
            await api.delete(`/parcela-proposta/${id}`)

            // remove localmente
            const filtered = parcelaProposta.filter((p) => p.id !== id)

            // Se não restarem registros nesta página, e a página > 1, volta uma página e recarrega
            if (filtered.length === 0 && page > 1) {
                setPage((prev) => prev - 1)
                // getParcelasProposta será chamado pelo useEffect que observa `page`
            } else {
                setParcelaProposta(filtered)
            }
        } catch (error) {
            console.error('Erro ao excluir proposta:', error)
            // tenta fornecer mensagem amigável
            const message = error?.response?.data?.message || error?.message || 'Erro ao excluir a proposta.'
            alert(message)
        }
    }

    function modalOpened() {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md z-40 flex items-center justify-center px-4">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-cyan-500/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-cyan-500/5 rounded-2xl"></div>
                    <div className="relative z-10">
                        <button
                            onClick={() => setShowModalArrematacao(false)}
                            className="absolute top-4 right-4 text-white hover:text-cyan-400 transition-colors duration-200 text-2xl"
                        >
                            <FaWindowClose />
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-white text-center">
                            Preencha os dados
                        </h2>

                        <form onSubmit={createParcelaProposta} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-cyan-400">Nome</label>
                                <input
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500/50 focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                                    type="text"
                                    placeholder="Digite o nome"
                                />
                            </div>

                            <InputFieldChangeState
                                label="Data da assinatura do auto da arrematação"
                                value={dataAssinaturaAutoArrematacao}
                                onChange={setDataAssinaturaAutoArrematacao}
                                type="date"
                            />

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-cyan-400">Valor de arrematação</label>
                                <input
                                    value={valorArrematacao}
                                    onChange={(e) => setValorArrematacao(e.target.value)}
                                    className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500/50 focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                                    type="text"
                                    placeholder="Digite o valor"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-cyan-400">Quantidade de parcelas</label>
                                <input
                                    value={quantidadeParcelas}
                                    onChange={(e) => setQuantidadeParcelas(e.target.value)}
                                    className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500/50 focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                                    type="text"
                                    placeholder="Digite a quantidade"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-cyan-400">Porcentagem da entrada (%)</label>
                                <input
                                    value={porcentagemEntrada}
                                    onChange={(e) => setPorcentagemEntrada(e.target.value)}
                                    className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500/50 focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                                    type="number"
                                    placeholder="Digite a porcentagem"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-cyan-400">Índice</label>
                                <select
                                    value={indice}
                                    onChange={(e) => setIndice(e.target.value)}
                                    className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500/50 focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                                >
                                    <option value="">Selecione</option>
                                    <option value="INPC">INPC</option>
                                    <option value="IGP-M">IGP-M</option>
                                    <option value="IGP-DI">IGP-DI</option>
                                    <option value="IPCA">IPCA</option>
                                    <option value="IPCA-E">IPCA-E</option>
                                    <option value="MEDIA-INPC-IGP-DI">Média INPC e IGP-DI</option>
                                    <option value="SELIC">Selic</option>
                                    <option value="POUPANCA">Poupança</option>
                                    <option value="IGP">IGP</option>
                                    <option value="IPC-FIPE">IPC-FIPE</option>
                                    <option value="IPC-BR">IPC-BR</option>
                                </select>
                            </div>

                            <button
                                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg mt-6"
                                type="submit"
                            >
                                Criar parcela da arrematação
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

    const primaryColor = "#5524E8";
    const secondaryColor = "#2143BE";
    const accentColor = "#42ACF0";

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 p-8 relative flex flex-col items-center">

            {/* Se não houver registros, mostra botão central */}
            {parcelaProposta.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[70vh]">
                    <p className="text-gray-400 mb-6 text-lg">Nenhuma proposta cadastrada ainda.</p>
                    <button
                        onClick={() => {
                            console.log('clickedd')
                            setShowModalArrematacao(true)
                        }}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white rounded px-3 py-2 font-medium transition-all duration-200 "
                    >
                        Novo Parcelamento +
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex justify-end w-full mb-6">
                        <button
                            onClick={() => setShowModalArrematacao(true)}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white rounded px-3 py-2 font-medium transition-all duration-200 "
                        >
                            Novo Parcelamento +
                        </button>
                    </div>
                </>
            )}

            {showModalArrematacao && modalOpened()}

            <h2 className="text-2xl font-bold text-white mb-8 text-center select-none drop-shadow-md">Todas Propostas e suas Parcelas</h2>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full">
                {parcelaProposta.map((proposta) => (
                    <div key={proposta.id} className="bg-gray-800 rounded-3xl shadow-lg p-6 hover:shadow-[0_8px_20px_rgba(0,255,255,0.5)] transition-shadow duration-400 border-2 border-cyan-700 overflow-x-auto scrollbar-custom scrollbar-no-buttons mt-5">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-semibold text-white first-letter:capitalize select-none drop-shadow-md">
                                {proposta.nome || 'sem nome'}
                            </h2>

                            {/* botão excluir */}
                            <button
                                onClick={() => handleDeleteParcelaProposta(proposta.id)}
                                className="text-red-400 hover:text-red-300 transition-colors ml-3"
                                title="Excluir proposta"
                            >
                                <FaTrashAlt />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-cyan-400 text-sm select-none">Valor Arrematação</p>
                                <p className="text-white font-medium font-mono">{formatarEmReais(proposta.valorArrematacao)}</p>
                            </div>

                            <div>
                                <p className="text-cyan-400 text-sm select-none">Quantidade de Parcelas</p>
                                <p className="text-white font-medium font-mono">{proposta.quantidadeParcelas}</p>
                            </div>

                            <div>
                                <p className="text-cyan-400 text-sm select-none">Valor de Entrada</p>
                                <p className="text-white font-medium font-mono">
                                    {`${formatarEmReais((+proposta.valorArrematacao * (+proposta.porcentagemEntrada / 100)))} (${proposta.porcentagemEntrada}%)`}
                                </p>
                            </div>

                            <div>
                                <p className="text-cyan-400 text-sm select-none">Índice</p>
                                <p className="text-white font-medium uppercase font-mono">{proposta.indice}</p>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => nav('/proposta-parcela/' + proposta.id)}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md transition duration-200 flex-1 "
                            >
                                + Mais detalhes
                            </button>

                            {proposta.calculadoraId != null && (
                                <button
                                    onClick={() => nav('/calculadora/' + proposta.calculadoraId)}
                                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md transition duration-200 flex-1 "
                                >
                                    Calculadora
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Paginação */}
            {parcelaProposta.length > 0 && (
                <div className="flex justify-center gap-10 mt-10 items-center w-full">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="px-3 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50  transition-all duration-200"
                    >
                        Anterior
                    </button>

                    <p className="text-white font-semibold select-none drop-shadow-md">Página {page}</p>

                    <button
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={page >= totalPages}
                        className="px-3 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50  transition-all duration-200"
                    >
                        Próximo
                    </button>
                </div>
            )}
        </div>
    )
}

export default PropostasParcelas