import { useState } from 'react'
import Question from './question'
import Image from 'next/image'
import Logo from '../../public/logo.svg'
import { useRouter } from 'next/router'

interface Question {
  question: string
  options: string[]
  answer: string
  hint: string
}

const questions = [
  {
    question:
      'O chocolate é conhecido por ser um presente popular em qual feriado?',
    options: ['Páscoa', 'Carnaval', 'Ano Novo'],
    answer: 'Páscoa',
    hint: 'É um feriado onde ovos de chocolate são muito comuns.',
  },
  {
    question: 'De que planta vem o chocolate?',
    options: ['Café', 'Cacau', 'Baunilha'],
    answer: 'Cacau',
    hint: 'É a planta que dá origem ao cacau em pó.',
  },
  {
    question: 'Qual cor é associada ao chocolate ao leite?',
    options: ['Branco', 'Verde', 'Marrom'],
    answer: 'Marrom',
    hint: 'É a cor mais comum de chocolate.',
  },
  {
    question: 'O que é adicionado ao chocolate para torná-lo doce?',
    options: ['Sal', 'Açúcar', 'Farinha'],
    answer: 'Açúcar',
    hint: 'É um ingrediente comum em sobremesas e doces.',
  },
  {
    question: 'Qual é o principal ingrediente do chocolate branco?',
    options: ['Fermento', 'Arroz', 'Manteiga de cacau'],
    answer: 'Manteiga de cacau',
    hint: 'Este ingrediente é frequentemente usado em protetores labiais.',
  },
]

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean
    selectedOption: string | null
  }>({ isCorrect: false, selectedOption: null })
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [completionSoundPlayed, setCompletionSoundPlayed] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAnswer = (selectedOption: string) => {
    const isCorrect = questions[currentQuestion].answer === selectedOption
    setFeedback({ isCorrect, selectedOption })

    setTimeout(() => {
      if (isCorrect) {
        if (currentQuestion === questions.length - 1) {
          // Reproduzir o som de conclusão do quiz somente se ainda não tiver sido tocado
          if (!completionSoundPlayed) {
            const completionSound = new Audio('/completion.mp3')
            completionSound.play()
            setCompletionSoundPlayed(true)
          }
          setQuizCompleted(true)
        } else {
          // Reproduzir o som de resposta correta
          const correctSound = new Audio('/correct.mp3')
          correctSound.play()
          setCurrentQuestion(currentQuestion + 1)
        }
        setShowErrorModal(false)
      } else {
        const failSound = new Audio('/fail.mp3')
        failSound.play()
        setShowErrorModal(true)
      }
      setFeedback({ isCorrect: false, selectedOption: null })
    }, 1000)
  }

  const handleCloseErrorModal = () => {
    setShowErrorModal(false)
  }

  const handlePurchaseClick = () => {
    setLoading(true) // Inicia o estado de loading

    setTimeout(() => {
      router.push('/caixas-brancas') // Redireciona para a página de compra
    }, 2500) // Simula 3.5 segundos de carregamento
  }

  if (loading) {
    // Tela de loading
    return (
      <div className="w-full h-full flex flex-col gap-6 justify-center items-center">
        <Image
          alt="logo"
          src={Logo}
          quality={100}
          className="animate-pulse invert"
        />
        <h1 className="">Carregando estoque...</h1>
      </div>
    )
  }

  return (
    <div className="w-[95%] flex flex-col justify-center items-center text-center p-8 bg-white rounded-lg shadow-lg relative">
      <h1 className="text-2xl font-bold text-brown mb-6 underline uppercase">
        Desafio Cacau Show!
      </h1>
      {!quizCompleted && (
        <>
          {/* Texto de Progresso */}
          <div className="text-lg font-semibold mb-4">
            Pergunta {currentQuestion + 1} de {questions.length}
          </div>

          {/* Barra de Progresso */}
          <div className="w-full bg-gray-300 rounded-full h-2.5 mb-4">
            <div
              className="bg-brown h-2.5 rounded-full"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>
          <Question
            question={questions[currentQuestion].question}
            options={questions[currentQuestion].options}
            onAnswer={handleAnswer}
            feedback={feedback}
          />
          {showErrorModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div className="w-[90%] flex flex-col items-center gap-4 max-w-md bg-white rounded-lg shadow-lg p-6 text-center">
                <h2 className="text-3xl font-bold underline text-red-500">
                  VOCÊ ERROU!
                </h2>
                <p className="text-lg text-black">
                  <u>
                    <b>Dica:</b>
                  </u>{' '}
                  {questions[currentQuestion].hint}
                </p>
                <button
                  onClick={handleCloseErrorModal}
                  className="px-6 py-3 bg-brown text-white text-xl font-semibold rounded hover:bg-brown-dark transition-colors"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          )}
        </>
      )}
      {quizCompleted && (
        <div className="w-full flex flex-col gap-3 text-center">
          <h2 className="text-3xl font-bold text-brown">PARABÉNS!</h2>
          <p className="text-lg text-black">
            Você <u>completou o desafio</u> com sucesso e ganhou{' '}
            <b>acesso as caixas brancas!</b>
          </p>
          <p className="font-bold">Aproveite!</p>
          <button
            onClick={handlePurchaseClick}
            className="w-full px-6 py-3 bg-brown text-xl text-white text-center font-semibold rounded hover:bg-brown-dark transition-colors"
          >
            Ir para a Compra
          </button>
        </div>
      )}
    </div>
  )
}

export default Quiz
