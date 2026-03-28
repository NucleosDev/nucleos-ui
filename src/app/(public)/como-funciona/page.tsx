import React from "react";

export default function ComoFunciona() {
  return (
    <section
      id="como-funciona"
      className="bg-gradient-to-r from-[#4D7CFF]/10 via-transparent to-[#00C9A7]/10 py-20 px-6 md:px-12"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-6 text-gray-900 dark:text-gray-100">
          Como funciona
        </h2>
        <p className="max-w-3xl mx-auto mb-16 text-lg text-gray-700 dark:text-gray-300">
          Entenda de forma simples e rápida como nossa plataforma pode ajudar você
          a criar, organizar e compartilhar seus nucleos e templates.
        </p>

        <div className="grid gap-12 md:grid-cols-3">
          
          <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow">
            <div className="mb-6 p-5 bg-[#4D7CFF] rounded-full inline-flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17v-4h6v4m2 4H7a2 2 0 01-2-2v-5a2 2 0 012-2h10a2 2 0 012 2v5a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Crie seu núcleo
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Comece organizando seus projetos e ideias em nucleos personalizados,
              com blocos modulares e fáceis de usar.
            </p>
          </div>

          
          <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow">
            <div className="mb-6 p-5 bg-[#00C9A7] rounded-full inline-flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Personalize e organize
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Adicione blocos, configure estilos, e organize seus nucleos da forma
              que preferir para otimizar sua produtividade.
            </p>
          </div>

          
          <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow">
            <div className="mb-6 p-5 bg-[#FFD700] rounded-full inline-flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Compartilhe e colabore
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Compartilhe seus nucleos com a comunidade ou equipe, colaborando em
              tempo real e aumentando seu impacto.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}