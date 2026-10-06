import React, { useContext, useState } from 'react'
import { IoMdCloseCircle } from "react-icons/io";
import Context from '../../../context/Context';
import axios from 'axios';

function CupomModal({ open }) {
    const [cupom, setCupom] = useState('')
    const { usuarioCadastroId } = useContext(Context)

    const validateCupom = async (e) => {
        // userId will come by param and the planMap is 3month
        try {
            e.preventDefault()

            const { data } = await axios.post(process.env.REACT_APP_API_URL + '/payments/cupom', {
                userId: +usuarioCadastroId,
                cupom
            })

            window.location.reload()

        } catch (error) {
            console.log(error)
            alert('Cupom Inválido')
        }
    }

    return (
        <div className="fixed inset-0 flex justify-center items-center backdrop-blur-md bg-black/50 z-50">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
                <div className='flex justify-end'>
                    <button className='text-white' onClick={() => open(false)}>
                        <IoMdCloseCircle size={20} />
                    </button>
                </div>
                <h2 className="text-2xl font-bold text-center mb-6 text-white">Aplicar Cupom</h2>
                <form className='flex flex-col gap-6'>
                    <input
                        type="text"
                        placeholder="Insira o cupom aqui"
                        value={cupom}
                        onChange={(e) => setCupom(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                    <button
                        onClick={validateCupom}
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
                    >
                        USAR CUPOM
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CupomModal