import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Context from '../context/Context'

function Admin() {
    const nav = useNavigate()
    const { user } = useAuth()
    const { isAdmin } = useContext(Context)

    useEffect(() => {
        if (!isAdmin) {
            nav('/')
            return
        }
    }, [])


    return (
        <div className="min-h-screen  bg-[#00071E] flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <h1 className="text-3xl font-extralight text-white text-center mb-16 tracking-wide">Painel Admin</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="bg-gradient-to-br from-[#00071E] to-[#360239] rounded-2xl p-10 border border-[#BAA9FF]/30 hover:border-[#BAA9FF]/60 hover:shadow-2xl hover:shadow-[#BAA9FF]/20 transition-all duration-500 transform hover:-translate-y-1">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-6 bg-[#BAA9FF]/20 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-[#BAA9FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-light text-white mb-8">Usuários</h2>
                            <button
                                onClick={() => nav('/admin/manage/users')}
                                className="w-full bg-transparent border-2 border-[#BAA9FF] text-[#BAA9FF] font-medium py-3 px-8 rounded-xl hover:bg-[#BAA9FF] hover:text-[#1B2238] transition-all duration-300 hover:shadow-lg hover:shadow-[#BAA9FF]/50"
                            >
                                Gerenciar
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#00071E] to-[#360239] rounded-2xl p-10 border border-[#BAA9FF]/30 hover:border-[#BAA9FF]/60 hover:shadow-2xl hover:shadow-[#BAA9FF]/20 transition-all duration-500 transform hover:-translate-y-1">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-6 bg-[#BAA9FF]/20 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-[#BAA9FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-light text-white mb-8">Cupons</h2>
                            <button
                                onClick={() => nav('/admin/cupom')}
                                className="w-full bg-transparent border-2 border-[#BAA9FF] text-[#BAA9FF] font-medium py-3 px-8 rounded-xl hover:bg-[#BAA9FF] hover:text-[#1B2238] transition-all duration-300 hover:shadow-lg hover:shadow-[#BAA9FF]/50"
                            >
                                Gerenciar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admin