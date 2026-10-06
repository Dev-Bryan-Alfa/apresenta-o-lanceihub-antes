import React, { useContext } from "react";
import api from "../../../axios/axiosBase";
import { useAuth } from "../../../context/AuthContext";

export default function SubscribeButton({ userId, planMap }) {
  const { user } = useAuth();
  const handleSubscribe = async () => {
    try {
      const res = await api.post("/payments/checkout", { userId: +userId, planMap });
      const { init_point } = res.data;
      if (init_point) {
        // abre em nova aba
        window.open(init_point, "_blank");
      } else {
        alert("Não foi possível iniciar o checkout");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao criar assinatura");
    }
  };

  return (
    // <button
    //   className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300"
    //   onClick={handleSubscribe}
    // >
    //   Assinar Agora
    // </button>
    <img onClick={handleSubscribe} className='absolute bottom-7 min-w-52 max-md:w-[100px] transform transition duration-300 hover:scale-105 cursor-pointer z-50 left-1/2 -translate-x-1/2' src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764769340/Bot%C3%A3o_compraragora_jx8emp.svg" alt="Comprar Agora" />
  );
}
