import React, { useContext, useState } from 'react'
import api from '../axios/axiosBase'
import Context from '../context/Context'

function DeactivateCupomModal({ close }) {
    // estado de validação
    const { cupomId, setCupomId } = useContext(Context)
    const [shake, setShake] = useState(false)

    async function deactivateCupom() {
        try {
            await api.put('/cupom/deactivate/' + cupomId)
            close()
        } catch (error) {
            alert('Erro ao desativar cupom')
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
                    Deseja desativar este cupom?
                </h2>

                <div className='flex gap-2 justify-center'>
                    <button
                        type="button"
                        className="mt-3 bg-gradient-to-r w-[40%] from-blue-600 to-blue-700 text-white p-3 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition"
                        onClick={close}
                    >
                        Não
                    </button>

                    <button
                        onClick={deactivateCupom}
                        type="button"
                        className="mt-3 bg-gradient-to-r w-[40%] from-red-600 to-red-700 text-white p-3 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition"
                    >
                        Sim
                    </button>
                </div>

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

export default DeactivateCupomModal
