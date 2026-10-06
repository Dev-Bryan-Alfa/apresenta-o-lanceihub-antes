import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaWindowClose, FaEdit, FaTrash, FaCheck } from 'react-icons/fa'
import api from '../axios/axiosBase'
import { InputFieldChangeState } from './PropostaDeCompra';


export function formatarEmReais(valor) {
    const numero = Number(valor) || 0;
    return numero.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

export function formatarPercentual(valor) {
    const numero = Number(valor) || 0;
    return `${numero.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}%`;
}


function PropostaParcela() {
    const { id } = useParams()
    const [proposta, setProposta] = useState(null)
    const nav = useNavigate()
    const [showModal, setShowModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingParcela, setEditingParcela] = useState(null)
    const [novaParcela, setNovaParcela] = useState({
        parcelaPropostaId: id,
        numero: '',
        indice: '',
        valor: '',
        ultimaAtualizacao: ''
    })

    const [showModalArrematacao, setShowModalArrematacao] = useState(false)
    const [valorArrematacao, setValorArrematacao] = useState('')
    const [quantidadeParcelas, setQuantidadeParcelas] = useState('')
    const [porcentagemEntrada, setPorcentagemEntrada] = useState('')
    const [indice, setIndice] = useState('')
    const [dataAssinaturaAutoArrematacao, setDataAssinaturaAutoArrematacao] = useState('')
    const [nome, setNome] = useState('')

    async function getParcelasProposta() {
        // pegar parcelas
        const { data } = await api.get(`/calculadora/parcela-proposta/` + id)
        console.log(data)
        setProposta(data)
    }

    useEffect(() => {
        getParcelasProposta()
    }, [])

    useEffect(() => {
        setNome(proposta?.nome)
        setValorArrematacao(proposta?.valorArrematacao)
        setQuantidadeParcelas(proposta?.quantidadeParcelas)
        setPorcentagemEntrada(proposta?.porcentagemEntrada)
        setDataAssinaturaAutoArrematacao(proposta?.dataAssinaturaAutoArrematacao?.split('/')?.reverse().join('-'))
        setIndice(proposta?.indice)
    }, [proposta])

    const editarPropostaParcela = async (e) => {
        e.preventDefault()
        if (!indice) return alert('Selecione o índice.')

        try {
            const { data } = await api.put('/calculadora/parcela-proposta/' + proposta.id, {
                valorArrematacao,
                quantidadeParcelas,
                porcentagemEntrada,
                indice,
                dataAssinaturaAutoArrematacao: dataAssinaturaAutoArrematacao.split('-').reverse().join('/'),
                nome,
                calcularAutomaticamente: true
            })
            setShowModalArrematacao(false)
            // adiciona no topo do estado atual
            setProposta(data)
        } catch (error) {
            console.error('Erro ao criar parcela:', error)
            alert('Erro ao editar parcela.')
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

                        <form onSubmit={editarPropostaParcela} className="space-y-4">
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

    async function submitParcela(e) {
        e.preventDefault()
        try {
            const { data } = await api.post('/calculadora/parcela/manual', {
                parcelaPropostaId: +proposta.id,
                numero: +novaParcela.numero,
                indice: +novaParcela.indice,
                valor: +novaParcela.valor,
                ultimaAtualizacao: novaParcela.ultimaAtualizacao
            })
            setProposta((prev) => ({ ...prev, parcelas: [...prev.parcelas, data] }))

            console.log(data)
            setShowModal(false)
            setNovaParcela({
                parcelaPropostaId: id,
                numero: '',
                indice: '',
                valor: '',
                ultimaAtualizacao: ''
            })
        } catch (error) {
            console.error('Erro ao criar parcela:', error)
            alert('Erro ao criar parcela')
        }
    }

    async function submitEditParcela(e) {
        e.preventDefault()
        try {
            const { data } = await api.put(`/calculadora/parcela/${editingParcela.id}`, {
                numero: +editingParcela.numero,
                indice: +editingParcela.indice,
                valor: +editingParcela.valor,
                ultimaAtualizacao: editingParcela.ultimaAtualizacao
            })
            setProposta((prev) => ({
                ...prev,
                parcelas: prev.parcelas.map(p => p.id === editingParcela.id ? data : p)
            }))
            setShowEditModal(false)
            setEditingParcela(null)
        } catch (error) {
            console.error('Erro ao editar parcela:', error)
            alert('Erro ao editar parcela')
        }
    }

    async function togglePago(parcelaId) {
        try {
            const parcela = proposta.parcelas.find(p => p.id === parcelaId)
            const { data } = await api.put(`/calculadora/parcela/${parcelaId}`, {
                numero: parcela.numero,
                indice: parcela.indice,
                valor: parcela.valor,
                ultimaAtualizacao: parcela.ultimaAtualizacao,
                pago: !parcela.pago
            })
            setProposta((prev) => ({
                ...prev,
                parcelas: prev.parcelas.map(p => p.id === parcelaId ? data : p)
            }))
        } catch (error) {
            console.error('Erro ao alterar status de pagamento:', error)
            alert('Erro ao alterar status de pagamento')
        }
    }

    async function deleteParcela(parcelaId) {
        if (window.confirm('Tem certeza que deseja excluir esta parcela?')) {
            try {
                await api.delete(`/calculadora/parcela/${parcelaId}`)
                setProposta((prev) => ({
                    ...prev,
                    parcelas: prev.parcelas.filter(p => p.id !== parcelaId)
                }))
            } catch (error) {
                console.error('Erro ao excluir parcela:', error)
                alert('Erro ao excluir parcela')
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
            {showModalArrematacao && modalOpened()}

            <div className="max-w-4xl mx-auto">
                <div className='flex justify-between'>
                    <button
                        onClick={() => nav(-1)} // nav(-1) volta para anterior, -2 para duas anteriores
                        className="mb-6 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        ← Voltar
                    </button>

                    <button
                        onClick={() => setShowModalArrematacao(true)}
                        className="mb-6 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        Editar
                    </button>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                    <h2 className='text-2xl font-bold text-white mb-6 first-letter:capitalize'>{proposta?.nome || 'sem nome'}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className='text-gray-400 text-sm'>Valor Arrematação</p>
                            <p className='text-white font-medium'>{formatarEmReais(proposta?.valorArrematacao)}</p>
                        </div>

                        <div>
                            <p className='text-gray-400 text-sm'>Quantidade de Parcelas</p>
                            <p className='text-white font-medium'>{proposta?.quantidadeParcelas}</p>
                        </div>

                        <div>
                            <p className='text-gray-400 text-sm'>Valor de Entrada</p>
                            <p className='text-white font-medium'>{`${formatarEmReais((+proposta?.valorArrematacao * ((+proposta?.porcentagemEntrada) / 100)))} (${proposta?.porcentagemEntrada}%)`}</p>
                        </div>

                        <div>
                            <p className='text-gray-400 text-sm'>Índice</p>
                            <p className='text-white font-medium uppercase'>{proposta?.indice}</p>
                        </div>

                        <div>
                            <p className='text-gray-400 text-sm'>Data da assinatura do auto de arrematação</p>
                            <p className='text-white font-medium uppercase'>{proposta?.dataAssinaturaAutoArrematacao}</p>
                        </div>

                        <div>
                            <p className='text-gray-400 text-sm'>Parcela Base</p>
                            <p className='text-white font-medium uppercase'>{formatarEmReais(proposta?.parcelaBase)}</p>
                        </div>
                    </div>

                    {proposta?.calculadoraId != null && (
                        <div className="flex space-x-4">
                            <button onClick={() => {
                                nav('/calculadora/' + proposta?.calculadoraId)
                            }} className='bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-md transition-all duration-200 shadow-lg hover:shadow-xl flex-1 font-medium'>
                                Calculadora
                            </button>
                        </div>
                    )}

                    <div className='mt-10 relative'>
                        <h2 className='text-2xl font-bold text-white mb-6 first-letter:capitalize'>Parcelamento</h2>

                        <div className=''>
                            {proposta?.calcularAutomaticamente == false && (
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="mb-10 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    Criar Parcelas
                                </button>
                            )}
                        </div>

                        {/* <button className='text-white absolute right-0 top-6 mr-
                        6'>I</button> abre um modal explicando como funciona o parcelamento, semelhante ao da captação */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                            {proposta?.parcelas?.map((e) => (
                                <div className='bg-gray-700 rounded-lg p-4 text-white flex flex-col gap-2' key={e.id}>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-cyan-400 font-semibold'>Parcela N° {e.numero}</span>
                                        <div className='flex gap-2'>
                                            <button
                                                onClick={() => togglePago(e.id)}
                                                className={`transition-colors duration-200 ${e.pago ? 'text-green-400 hover:text-green-300' : 'text-gray-400 hover:text-gray-300'}`}
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingParcela(e)
                                                    setShowEditModal(true)
                                                }}
                                                className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => deleteParcela(e.id)}
                                                className="text-red-400 hover:text-red-300 transition-colors duration-200"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-yellow-400'>Índice: {Number(e.indice).toFixed(2)}%</span>
                                        <span className='text-lime-400 font-semibold'>{formatarEmReais(Number(e.valor))}</span>
                                    </div>
                                    <div className='text-gray-300 text-sm'>Data de Pagamento: {e.dataPagamento}</div>
                                    <div className='text-gray-300 text-sm'>Atualizado em: {e.ultimaAtualizacao}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md z-40 flex items-center justify-center px-4">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-cyan-500/30 relative overflow-hidden">
                        <div className="absolute inset-0 bg-cyan-500/5 rounded-2xl"></div>
                        <div className="relative z-10">

                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-white hover:text-cyan-400 transition-colors duration-200 text-2xl"
                            >
                                <FaWindowClose />
                            </button>
                            <h2 className="text-2xl font-bold mb-6 text-white text-center">
                                Criar Nova Parcela
                            </h2>

                            <form onSubmit={submitParcela} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-cyan-400">
                                        Número da Parcela
                                    </label>
                                    <input
                                        value={novaParcela.numero}
                                        onChange={(e) => setNovaParcela({ ...novaParcela, numero: e.target.value })}
                                        className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 placeholder-gray-400"
                                        type="number"
                                        placeholder="Digite o número"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-cyan-400">
                                        Índice (%)
                                    </label>
                                    <input
                                        value={novaParcela.indice}
                                        onChange={(e) => setNovaParcela({ ...novaParcela, indice: e.target.value })}
                                        className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 placeholder-gray-400"
                                        type="number"
                                        step="0.01"
                                        placeholder="Digite o índice"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-cyan-400">
                                        Valor (R$)
                                    </label>
                                    <input
                                        value={novaParcela.valor}
                                        onChange={(e) => setNovaParcela({ ...novaParcela, valor: e.target.value })}
                                        className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 placeholder-gray-400"
                                        type="number"
                                        step="0.01"
                                        placeholder="Digite o valor"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-cyan-400">
                                        Última Atualização
                                    </label>
                                    <input
                                        value={novaParcela.ultimaAtualizacao}
                                        onChange={(e) => setNovaParcela({ ...novaParcela, ultimaAtualizacao: e.target.value })}
                                        className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 placeholder-gray-400"
                                        type="text"
                                        placeholder="DD/MM/YYYY"
                                        required
                                    />
                                </div>

                                <button
                                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl mt-6"
                                    type="submit"
                                >
                                    Criar Parcela
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && editingParcela && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md z-40 flex items-center justify-center px-4">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-cyan-500/30 relative overflow-hidden">
                        <div className="absolute inset-0 bg-cyan-500/5 rounded-2xl"></div>
                        <div className="relative z-10">

                            <button
                                onClick={() => {
                                    setShowEditModal(false)
                                    setEditingParcela(null)
                                }}
                                className="absolute top-4 right-4 text-white hover:text-cyan-400 transition-colors duration-200 text-2xl"
                            >
                                <FaWindowClose />
                            </button>
                            <h2 className="text-2xl font-bold mb-6 text-white text-center">
                                Editar Parcela
                            </h2>

                            <form onSubmit={submitEditParcela} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-cyan-400">
                                        Número da Parcela
                                    </label>
                                    <input
                                        value={editingParcela.numero}
                                        onChange={(e) => setEditingParcela({ ...editingParcela, numero: e.target.value })}
                                        className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 placeholder-gray-400"
                                        type="number"
                                        placeholder="Digite o número"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-cyan-400">
                                        Índice (%)
                                    </label>
                                    <input
                                        value={editingParcela.indice}
                                        onChange={(e) => setEditingParcela({ ...editingParcela, indice: e.target.value })}
                                        className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 placeholder-gray-400"
                                        type="number"
                                        step="0.01"
                                        placeholder="Digite o índice"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-cyan-400">
                                        Valor (R$)
                                    </label>
                                    <input
                                        value={editingParcela.valor}
                                        onChange={(e) => setEditingParcela({ ...editingParcela, valor: e.target.value })}
                                        className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 placeholder-gray-400"
                                        type="number"
                                        step="0.01"
                                        placeholder="Digite o valor"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-cyan-400">
                                        Última Atualização
                                    </label>
                                    <input
                                        value={editingParcela.ultimaAtualizacao}
                                        onChange={(e) => setEditingParcela({ ...editingParcela, ultimaAtualizacao: e.target.value })}
                                        className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 placeholder-gray-400"
                                        type="text"
                                        placeholder="DD/MM/YYYY"
                                        required
                                    />
                                </div>

                                <button
                                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl mt-6"
                                    type="submit"
                                >
                                    Salvar Alterações
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PropostaParcela