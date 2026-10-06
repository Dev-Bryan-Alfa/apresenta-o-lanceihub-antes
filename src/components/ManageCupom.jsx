import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../axios/axiosBase'
import CreateCupomModal from './CreateCupomModal'
import Context from '../context/Context'
import DeactivateCupomModal from './DeactivateCupomModal'

function ManageCupom() {
    const nav = useNavigate()
    const { user } = useAuth()

    const [cupons, setCupons] = useState([])
    const [showModal, setShowModal] = useState(false)
    const { cupomId, setCupomId } = useContext(Context)
    const [showModalDeactivate, setShowModalDeactivate] = useState(false)
    const { isAdmin } = useContext(Context)


    async function getCupons() {
        try {
            const { data } = await api.get('/cupom')
            setCupons(data)
        } catch (err) {
            console.error('Erro ao buscar cupons:', err)
        }
    }

    useEffect(() => {
        if (!isAdmin) {
            nav('/')
            return
        }
        getCupons()
    }, [])

    async function closeModal() {
        setShowModal(false)
        await getCupons()
    }

    async function closeModalDeactivate() {
        setShowModalDeactivate(false)
        await getCupons()
    }

    async function deleteCupom(id) {
        try {
            await api.delete('/cupom/' + id)
            setCupons((prev) => prev.filter((e) => e.id != id))
        } catch (error) {
            alert('Erro ao deletar cupom')
            console.log(error)
        }
    }

    return (
        <div className=" min-h-screen bg-gradient-to-br from-[#00071E] to-[#001122] p-4 sm:p-6 sm:pt-20 relative">

            {/* MODAL */}
            {showModal && <CreateCupomModal close={closeModal} />}

            {showModalDeactivate && <DeactivateCupomModal close={closeModalDeactivate} />}

            {/* AÇÕES SUPERIORES */}
            <div className="flex justify-between items-center mb-8">
                <button
                    onClick={() => nav(-1)}
                    className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg shadow-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2 border border-purple-500/20"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Voltar
                </button>

                <button
                    onClick={getCupons}
                    className="bg-gradient-to-r from-[#5524E8] to-[#6024AF] text-white px-6 py-3 rounded-lg shadow-lg hover:from-[#6024AF] hover:to-[#310092] transition-all duration-300 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Atualizar
                </button>
            </div>

            {/* BOTÃO CRIAR CUPOM */}
            <div className="mb-6">
                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 rounded-lg bg-white/10 text-white backdrop-blur-md shadow-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                    Criar cupom
                </button>
            </div>

            {/* LISTAGEM */}
            <div className="text-white">
                {cupons.length === 0 ? (
                    <p className="opacity-60">Nenhum cupom registrado.</p>
                ) : (
                    // <div className="space-y-4">
                    //     {cupons.map((cupom) => (
                    //         <div
                    //             key={cupom?.id}
                    //             className="bg-white/5 p-4 rounded-lg border border-white/10 backdrop-blur-sm flex justify-between items-center"
                    //         >
                    //             <div>
                    //                 <p className="text-lg font-semibold">{cupom.codigo}</p>
                    //                 <p className="text-sm opacity-60">
                    //                     Status: {cupom?.active ? 'Ativo' : 'Desativado'}
                    //                 </p>

                    //                 <p className="text-sm opacity-60">
                    //                     Válido Até: {cupom?.valido_ate.split('T')[0].split('-').reverse().join('/')}
                    //                 </p>

                    //                 <p className="text-sm opacity-60">
                    //                     Duração: {cupom?.duracao_dias}
                    //                 </p>

                    //                 <p className="text-sm opacity-60">
                    //                     Quantidade de usos: {cupom?.quantidade_usos}
                    //                 </p>

                    //                 <p className="text-sm opacity-60">
                    //                     Limite de usos: {cupom?.quantidade_usos_og}
                    //                 </p>

                    //             </div>
                    //             <button onClick={() => {
                    //                 setCupomId(cupom.id)
                    //                 setShowModalDeactivate(true)
                    //             }} className='hover:font-semibold'>Desativar</button>

                    //             <button onClick={() => deleteCupom(cupom.id)} className='hover:font-semibold'>Excluir</button>
                    //         </div>
                    //     ))}
                    // </div>

                    <div className="space-y-4">
                        {cupons.map((cupom) => (
                            <div
                                key={cupom?.id}
                                className="
                p-5 rounded-2xl 
                bg-white/[0.07] 
                border border-white/10 
                backdrop-blur-md
                shadow-xl 
                flex justify-between items-center
                hover:bg-white/[0.12]
                transition-all duration-300
            "
                            >
                                {/* ESQUERDA — INFORMAÇÕES */}
                                <div className="flex flex-col gap-1">
                                    <p className="text-xl font-semibold text-white tracking-wide">
                                        {cupom.codigo}
                                    </p>

                                    <div className="h-[1px] w-16 bg-white/20 my-1"></div>

                                    <p className="text-sm text-white/70">
                                        <span className="font-medium text-white/80">Status: </span>
                                        {cupom?.active ? (
                                            <span className="text-green-400">Ativo</span>
                                        ) : (
                                            <span className="text-red-400">Desativado</span>
                                        )}
                                    </p>

                                    <p className="text-sm text-white/70">
                                        <span className="font-medium text-white/80">Válido até: </span>
                                        {cupom?.valido_ate.split('T')[0].split('-').reverse().join('/')}
                                    </p>

                                    <p className="text-sm text-white/70">
                                        <span className="font-medium text-white/80">Duração: </span>
                                        {cupom?.duracao_dias} dias
                                    </p>

                                    <p className="text-sm text-white/70">
                                        <span className="font-medium text-white/80">Usos atuais: </span>
                                        {cupom?.quantidade_usos}
                                    </p>

                                    <p className="text-sm text-white/70">
                                        <span className="font-medium text-white/80">Limite: </span>
                                        {cupom?.quantidade_usos_og}
                                    </p>
                                </div>

                                {/* DIREITA — BOTÕES */}
                                <div className="flex flex-col items-end gap-2">
                                    <button
                                        onClick={() => {
                                            setCupomId(cupom.id)
                                            setShowModalDeactivate(true)
                                        }}
                                        className="
                        text-white/60 hover:text-white 
                        px-3 py-1.5 rounded-lg
                        border border-white/10
                        hover:bg-white/10
                        transition-all duration-300
                        text-sm
                    "
                                    >
                                        Desativar
                                    </button>

                                    <button
                                        onClick={() => deleteCupom(cupom.id)}
                                        className="
                        text-red-300 hover:text-red-400
                        px-3 py-1.5 rounded-lg
                        border border-red-500/20 
                        hover:bg-red-500/10
                        transition-all duration-300
                        text-sm
                    "
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManageCupom
