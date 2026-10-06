import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Context from "../../../context/Context";
import axios from "axios";

function PaymentSucessPage() {

  const { usuarioCadastroId, setUsuarioCadastroId } = useContext(Context)
  const [usuarioSalvo, setUsuarioSalvo] = useState(null)
  const nav = useNavigate()

  // const getUserWithPayment = async () => {
  //   const { data } = await axios.get('/user/' + usuarioCadastroId)
  //   setUsuarioSalvo(data)
  //   if (data.payment) {
  //     if (data.payment.status == 'active') {
  //       nav('/pagamento/sucesso')
  //       setUsuarioCadastroId(null)
  //     } else {
  //       alert('Pagamento Pendente')
  //     }
  //   }
  // }

  // useEffect(() => {
  //   getUserWithPayment()
  // }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#010821] via-[#0a0f2c] to-[#1a1a3a] p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#5524E8]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#2143BE]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#42ACF0]/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10 text-center">
        {/* Success Card */}
        <div className="mb-12 relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur opacity-25 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-xl border border-green-400/30 rounded-3xl p-12 text-white shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl animate-bounce">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold font-montserrat text-transparent bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 bg-clip-text mb-4 tracking-tight">
              Pagamento Aprovado!
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Parabéns! Seu pagamento foi processado com sucesso. Agora você tem acesso completo à nossa plataforma.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            className="group relative px-12 py-6 bg-gradient-to-r from-[#5524E8] via-[#42ACF0] to-[#2143BE] hover:from-[#6024AF] hover:via-[#42ACF0] hover:to-[#190B70] text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 text-xl tracking-wide"
            onClick={() => nav("/login")}
          >
            <span className="flex items-center space-x-3">
              <span>🚀</span>
              <span>Faça seu login e começe já</span>
            </span>
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-16 h-16 border border-[#5524E8]/30 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-[#42ACF0]/20 rounded-lg rotate-45 animate-pulse"></div>
      </div>
    </div>
  );
}

export default PaymentSucessPage;
