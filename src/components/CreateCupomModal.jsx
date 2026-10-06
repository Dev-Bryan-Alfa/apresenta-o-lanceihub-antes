import React, { useState } from 'react'
import api from '../axios/axiosBase'

function CreateCupomModal({ close }) {
    const [codigo, setCodigo] = useState('')
    const [validoAte, setValidoAte] = useState('')
    const [duracaoDias, setDuracaoDias] = useState('')
    const [quantidadeUsos, setQuantidadeUsos] = useState('')

    // estado de validação
    const [errors, setErrors] = useState({})
    const [shake, setShake] = useState(false)

    function validate() {
        let newErrors = {}

        if (!codigo.trim()) newErrors.codigo = 'Informe o código do cupom.'
        if (!validoAte) newErrors.validoAte = 'Escolha uma data válida.'
        if (!duracaoDias || duracaoDias <= 0)
            newErrors.duracaoDias = 'Digite um número maior que zero.'
        if (!quantidadeUsos || quantidadeUsos <= 0)
            newErrors.quantidadeUsos = 'Digite um número maior que zero.'

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    async function createCupom(e) {
        e.preventDefault()

        if (!validate()) {
            setShake(true)
            setTimeout(() => setShake(false), 500)
            return
        }

        try {
            await api.post('/cupom', {
                codigo,
                valido_ate: new Date(validoAte).toISOString(),
                duracao_dias: Number(duracaoDias),
                quantidade_usos_og: Number(quantidadeUsos)
            })

            alert('Cupom criado com sucesso!')
            close()
        } catch (error) {
            console.log(error)
            alert('Falha ao criar o cupom.')
        }
    }

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xl flex justify-center items-center z-50 animate-fadeIn">
            <div
                className={`bg-white/80 backdrop-blur-2xl p-8 rounded-2xl shadow-2xl w-[360px] transition-all 
                    ${shake ? 'animate-shake' : 'animate-scaleIn'}
                `}
            >
                <div className="flex justify-end mb-4">
                    <button
                        onClick={close}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        ✕
                    </button>
                </div>

                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Criar Cupom
                </h2>

                <form onSubmit={createCupom} className="flex flex-col gap-5">

                    {/* Código */}
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700">Código do cupom</label>
                        <input
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            type="text"
                            className={`p-3 rounded-xl bg-white border 
                                ${errors.codigo ? 'border-red-500' : 'border-gray-300'}
                                focus:ring-2 focus:ring-blue-400 outline-none transition`}
                        />
                        {errors.codigo && (
                            <span className="text-red-500 text-sm mt-1">{errors.codigo}</span>
                        )}
                    </div>

                    {/* Data */}
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700">Válido até</label>
                        <input
                            value={validoAte}
                            onChange={(e) => setValidoAte(e.target.value)}
                            type="date"
                            className={`p-3 rounded-xl bg-white border 
                                ${errors.validoAte ? 'border-red-500' : 'border-gray-300'}
                                focus:ring-2 focus:ring-blue-400 outline-none transition !text-black`}
                        />
                        {errors.validoAte && (
                            <span className="text-red-500 text-sm mt-1">{errors.validoAte}</span>
                        )}
                    </div>

                    {/* Duração */}
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700">Duração (dias)</label>
                        <input
                            value={duracaoDias}
                            onChange={(e) => setDuracaoDias(e.target.value)}
                            type="number"
                            className={`p-3 rounded-xl bg-white border 
                                ${errors.duracaoDias ? 'border-red-500' : 'border-gray-300'}
                                focus:ring-2 focus:ring-blue-400 outline-none transition`}
                        />
                        {errors.duracaoDias && (
                            <span className="text-red-500 text-sm mt-1">{errors.duracaoDias}</span>
                        )}
                    </div>

                    {/* Quantidade usos */}
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700">Quantidade de usos</label>
                        <input
                            value={quantidadeUsos}
                            onChange={(e) => setQuantidadeUsos(e.target.value)}
                            type="number"
                            className={`p-3 rounded-xl bg-white border 
                                ${errors.quantidadeUsos ? 'border-red-500' : 'border-gray-300'}
                                focus:ring-2 focus:ring-blue-400 outline-none transition`}
                        />
                        {errors.quantidadeUsos && (
                            <span className="text-red-500 text-sm mt-1">{errors.quantidadeUsos}</span>
                        )}
                    </div>

                    {/* Botão */}
                    <button
                        type="submit"
                        className="mt-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition"
                    >
                        Criar cupom
                    </button>
                </form>
            </div>

            {/* animações Tailwind */}
            <style>
                {`
                .animate-fadeIn {
                    animation: fadeIn .3s ease-out;
                }

                .animate-scaleIn {
                    animation: scaleIn .25s ease-out;
                }

                .animate-shake {
                    animation: shake .35s ease-in-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0 }
                    to   { opacity: 1 }
                }

                @keyframes scaleIn {
                    from { transform: scale(.85); opacity: 0 }
                    to   { transform: scale(1);   opacity: 1 }
                }

                @keyframes shake {
                    0% { transform: translateX(0) }
                    25% { transform: translateX(-6px) }
                    50% { transform: translateX(6px) }
                    75% { transform: translateX(-6px) }
                    100% { transform: translateX(0) }
                }
                `}
            </style>
        </div>
    )
}

export default CreateCupomModal
