import { motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";

export default function UpdatePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white px-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="flex flex-col items-center"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="mb-6"
                >
                    <RefreshCcw className="w-16 h-16 text-purple-300" />
                </motion.div>

                <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                    Estamos Atualizando
                </h1>
                <p className="text-lg md:text-xl text-purple-200 max-w-xl mb-8">
                    Nosso site está passando por algumas melhorias incríveis. Voltamos em breve com uma experiência ainda melhor para você!
                </p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="text-sm text-blue-200"
                >
                    © {new Date().getFullYear()} Lancei Hub — Todos os direitos reservados.
                </motion.div>
            </motion.div>

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-900/40 to-transparent blur-3xl"></div>
        </div>
    );
}