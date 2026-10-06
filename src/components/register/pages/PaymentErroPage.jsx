import React, { useContext, useEffect, useState } from "react";
import Context from "../../../context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PaymentErroPage() {
  const { usuarioCadastroId, setUsuarioCadastroId } = useContext(Context)
  const [usuarioSalvo, setUsuarioSalvo] = useState(null)
  const nav = useNavigate()

  const getUserWithPayment = async () => {
    const dataAtual = new Date()
    const { data } = await axios.get('/user/' + usuarioCadastroId)
    setUsuarioSalvo(data)
    if (data.payment) {
      if (data.payment.status == 'active' && (data.payment.expiresIn > dataAtual)) {
        nav('/pagamento/sucesso')
        setUsuarioCadastroId(null)
      } else {
        alert('Pagamento Pendente')
      }
    }
  }

  useEffect(() => {
    getUserWithPayment()
  }, [])

  return (
    <div className="flex min-h-screen justify-center items-center">
      <p className="text-white text-2xl bg-red-500 p-5 px-10 rounded-lg">
        Erro no pagamento! Tente mais tarde novamente.
      </p>
    </div>
  );
}

export default PaymentErroPage;
