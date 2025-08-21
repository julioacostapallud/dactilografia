"use client";
import { useState, useRef, useEffect } from "react";
import React from "react";
import { FaCheckCircle, FaRegClock, FaRandom, FaUser } from "react-icons/fa";
import { useSession, signIn, signOut } from "next-auth/react";

const DURATION_SECONDS = 4 * 60; // 4 minutos

export default function Home() {
  const { data: session, status } = useSession();
  const [inputText, setInputText] = useState("");
  const [practiceText, setPracticeText] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [timer, setTimer] = useState(DURATION_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);

  // Función para cargar un texto aleatorio
  const loadRandomText = async () => {
    if (isLocked) return; // No cambiar texto durante la práctica
    
    setIsLoadingText(true);
    try {
      const randomNumber = Math.floor(Math.random() * 15) + 1;
      const response = await fetch(`/textos/texto${randomNumber}.txt`);
      if (response.ok) {
        const text = await response.text();
        setPracticeText(text.trim());
      } else {
        console.error('Error cargando texto:', response.status);
      }
    } catch (error) {
      console.error('Error cargando texto:', error);
    } finally {
      setIsLoadingText(false);
    }
  };

  // Cargar texto aleatorio al montar el componente
  useEffect(() => {
    loadRandomText();
  }, []);

  // Iniciar la práctica
  const startPractice = () => {
    if (!practiceText.trim()) return;
    setIsLocked(true);
    setIsRunning(true);
    setInputText("");
    setTimer(DURATION_SECONDS);
    setWpm(0);
    setCorrectWords(0);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100); // Espera breve para asegurar el render
  };

  // Cancelar la práctica
  const cancelPractice = () => {
    setIsLocked(false);
    setIsRunning(false);
    setInputText("");
    setTimer(DURATION_SECONDS);
    setWpm(0);
    setCorrectWords(0);
  };

  // Finalizar la práctica
  const finishPractice = () => {
    setIsLocked(false);
    setIsRunning(false);
  };

  // Temporizador
  useEffect(() => {
    if (isRunning && timer > 0) {
      intervalRef.current = setTimeout(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0 && isRunning) {
      finishPractice();
    }
    return () => clearTimeout(intervalRef.current!);
  }, [isRunning, timer]);

  // Algoritmo de comparación mejorado para errores de omisión/adición
  function getWordStates() {
    const inputWords = inputText.trim().split(/\s+/);
    const targetWords = practiceText.trim().split(/\s+/);
    const states: { word: string; status: "correct" | "error" | "pending" | "current" }[] = [];
    let i = 0, j = 0;
    while (i < targetWords.length) {
      const target = targetWords[i];
      const input = inputWords[j] ?? "";
      if (!input) {
        states.push({ word: target, status: "pending" });
        i++;
        continue;
      }
      if (i === j) {
        // Palabra actual
        if (j === inputWords.length - 1 && input !== target) {
          states.push({ word: target, status: "current" });
        } else if (input === target) {
          states.push({ word: target, status: "correct" });
        } else {
          states.push({ word: target, status: "error" });
        }
        i++;
        j++;
      } else if (input === target) {
        states.push({ word: target, status: "correct" });
        i++;
        j++;
      } else if (targetWords[i + 1] === input) {
        // Palabra omitida en input
        states.push({ word: target, status: "error" });
        i++;
      } else if (inputWords[j + 1] === target) {
        // Palabra extra en input
        j++;
      } else {
        // Error general
        if (j === inputWords.length - 1) {
          states.push({ word: target, status: "current" });
        } else {
          states.push({ word: target, status: "error" });
        }
        i++;
        j++;
      }
    }
    return states;
  }

  // Calcular correctas con la nueva lógica
  useEffect(() => {
    if (!isRunning) return;
    const states = getWordStates();
    setCorrectWords(states.filter((s) => s.status === "correct").length);
    const inputWords = inputText.trim().split(/\s+/);
    const minutes = (DURATION_SECONDS - timer) / 60;
    setWpm(minutes > 0 ? Math.round(inputWords.length / minutes) : 0);
  }, [inputText, isRunning, timer, practiceText]);

  // Auto-scroll para seguir el progreso del texto
  useEffect(() => {
    if (!isRunning || !textContainerRef.current) return;
    
    const states = getWordStates();
    const currentWordIndex = states.findIndex(s => s.status === "current");
    
    if (currentWordIndex === -1) return;
    
    const container = textContainerRef.current;
    const wordElements = container.querySelectorAll('span');
    
    if (wordElements[currentWordIndex]) {
      const currentWordElement = wordElements[currentWordIndex] as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      const wordRect = currentWordElement.getBoundingClientRect();
      
      // Calcular si la palabra actual está fuera de la vista
      const isWordAbove = wordRect.top < containerRect.top;
      const isWordBelow = wordRect.bottom > containerRect.bottom;
      
      if (isWordAbove || isWordBelow) {
        // Scroll suave hacia la palabra actual
        currentWordElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [inputText, isRunning, practiceText]);

  // Formatear tiempo mm:ss
  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // Renderizado del texto original con marcas y sin movimiento
  function RenderMarkedText() {
    const states = getWordStates();
    return (
      <div 
        ref={textContainerRef}
        className="w-full h-full p-3 border rounded bg-white text-black overflow-y-auto whitespace-normal text-sm leading-tight select-none"
      >
        {states.map((s, i) => (
          <span
            key={i}
            className={
              `inline-block align-baseline min-w-[1ch] px-[1px] py-0 font-normal text-base leading-relaxed transition-none ` +
              (s.status === "correct"
                ? "bg-green-100 text-green-800"
                : s.status === "error"
                ? "bg-red-200 text-red-800 underline decoration-red-500"
                : s.status === "current"
                ? "bg-blue-200 text-blue-800"
                : "")
            }
            style={{
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
              boxSizing: 'border-box',
              verticalAlign: 'baseline',
              margin: 0,
              whiteSpace: 'pre',
            }}
          >
            {s.word + (i < states.length - 1 ? ' ' : '')}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 via-green-500 via-orange-500 to-orange-600 shadow-md px-6 py-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-white">DACTILO</h1>
            {/* Icono: Teclado + Velocidad */}
            <svg width="40" height="20" viewBox="0 0 40 20" className="cursor-pointer hover:scale-110 transition-transform">
              <rect x="0" y="0" width="8" height="6" rx="1" fill="white" opacity="0.9"/>
              <rect x="9" y="0" width="8" height="6" rx="1" fill="white" opacity="0.7"/>
              <rect x="18" y="0" width="8" height="6" rx="1" fill="white" opacity="0.5"/>
              <rect x="27" y="0" width="8" height="6" rx="1" fill="white" opacity="0.3"/>
              <path d="M0 8 L35 8" stroke="white" stroke-width="1" opacity="0.6"/>
              <path d="M0 10 L30 10" stroke="white" stroke-width="1" opacity="0.4"/>
              <path d="M0 12 L25 12" stroke="white" stroke-width="1" opacity="0.2"/>
            </svg>
          </div>
                      <div className="flex items-center justify-center w-10 h-10 cursor-pointer hover:bg-white/20 rounded-full border-2 border-white transition-colors">
              {session ? (
                <div className="flex items-center gap-2">
                  {session.user?.image ? (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name || "Usuario"} 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <FaUser className="text-white text-lg" />
                  )}
                  <button 
                    onClick={() => signOut()}
                    className="text-white text-xs hover:underline"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => signIn('google')}
                  className="text-white text-xs hover:underline"
                >
                  Entrar
                </button>
              )}
            </div>
        </div>
      </header>
      
      {/* Contenido principal */}
      <div className="flex flex-col items-center p-2 pt-4 bg-gradient-to-br from-green-100/30 via-green-50/50 to-orange-100/30 flex-1 w-full">
      {/* Controles y métricas arriba */}
      <div className="flex w-full max-w-5xl gap-4 mb-4 items-center justify-between">
        <div className="flex gap-6 items-center">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
            onClick={startPractice}
            disabled={isLocked || !practiceText.trim()}
          >
            Iniciar
          </button>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded disabled:bg-gray-300"
            onClick={cancelPractice}
            disabled={!isLocked}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
            onClick={finishPractice}
            disabled={!isLocked}
          >
            Finalizar
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded disabled:bg-gray-400 flex items-center gap-2"
            onClick={loadRandomText}
            disabled={isLocked || isLoadingText}
          >
            <FaRandom className="text-sm" />
            {isLoadingText ? 'Cargando...' : 'Nuevo Texto'}
          </button>
        </div>
        <div className="flex flex-row items-center gap-8 min-w-[350px] justify-end">
          <div className="flex flex-col items-center">
            <span className="text-black text-base font-normal">WPM</span>
            <span className="font-mono text-3xl text-blue-600 font-bold">{wpm}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-black text-base font-normal">Tiempo</span>
            <span className="flex items-center gap-1 font-mono text-3xl text-red-600 font-bold">
              <FaRegClock className="text-red-500 text-2xl" /> {formatTime(timer)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex w-full h-[75vh] gap-4 justify-center px-4">
        {/* Sector de publicidad izquierdo */}
        <div className="w-64 bg-gray-100 border rounded flex items-center justify-center h-[75vh] flex-shrink-0">
          <div className="text-center text-gray-500">
            <div className="text-lg font-semibold mb-2">Publicidad</div>
            <div className="text-sm">Google Ads</div>
            {/* AdSense Ad Unit - Left Sidebar */}
            <ins 
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-3195662668662265"
              data-ad-slot="9852913988"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
            <script>
              (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="flex gap-4 max-w-5xl flex-1">
          {/* Lado izquierdo: texto a tipear */}
          <div className="flex-1 flex flex-col">
            <label className="font-semibold mb-2">Texto para practicar:</label>
            {isLocked ? (
              <RenderMarkedText />
            ) : (
              <textarea
                className="w-full h-full min-h-[350px] p-3 border rounded resize-none bg-white text-black disabled:bg-gray-200 text-sm leading-tight"
                value={practiceText}
                onChange={(e) => setPracticeText(e.target.value)}
                disabled={true}
                placeholder={isLoadingText ? "Cargando texto..." : "Usa 'Nuevo Texto' para cambiar el fragmento..."}
                style={{ fontSize: '0.875rem', lineHeight: '1.25rem' }}
              />
            )}
            <div className="mt-2 text-sm text-gray-600 flex items-center justify-between">
              <span className="font-semibold text-blue-600">Palabras en el texto: <span className="font-mono text-lg">{practiceText.trim() ? practiceText.trim().split(/\s+/).length : 0}</span></span>
              <span className="text-xs text-gray-500 italic">Los saltos de línea se eliminan para mejorar el conteo</span>
            </div>
          </div>
          {/* Lado derecho: input de tipeo */}
          <div className="flex-1 flex flex-col">
            <label className="font-semibold mb-2">Tipea aquí:</label>
            <textarea
              ref={inputRef}
              className="w-full h-full min-h-[350px] p-3 border rounded resize-none text-sm leading-tight bg-white text-black disabled:bg-gray-100"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onPaste={e => e.preventDefault()}
              disabled={!isLocked || !isRunning}
              placeholder={isLocked ? "Empieza a tipear..." : "Inicia la práctica para comenzar"}
              style={{ fontSize: '0.875rem', lineHeight: '1.25rem' }}
            />
            <div className="mt-2 text-sm text-gray-600 flex items-center justify-between">
              <span className="font-semibold text-green-600">Palabras correctas: <span className="font-mono text-lg">{correctWords}</span></span>
              <span className="text-xs text-gray-500 italic">Solo palabras completas</span>
            </div>
          </div>
        </div>
        
        {/* Sector de publicidad derecho */}
        <div className="w-64 bg-gray-100 border rounded flex items-center justify-center h-[75vh] flex-shrink-0">
          <div className="text-center text-gray-500">
            <div className="text-lg font-semibold mb-2">Publicidad</div>
            <div className="text-sm">Google Ads</div>
            {/* AdSense Ad Unit - Right Sidebar */}
            <ins 
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-3195662668662265"
              data-ad-slot="8179055454"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
            <script>
              (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
          </div>
        </div>
      </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-700 via-green-600 to-orange-600 text-white py-4">
        <div className="flex justify-between items-center px-6">
          <div className="text-sm text-white">
            © 2024 Julio Acosta - julioacostapallud@gmail.com
          </div>
          <div className="flex items-center gap-4 text-sm text-white">
            <span>Donaciones:</span>
            <button 
              onClick={() => window.open('https://buymeacoffee.com/julioacosta', '_blank')}
              className="hover:scale-110 transition-transform cursor-pointer bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded-lg text-white font-medium"
            >
              ☕ Invítame un café
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
