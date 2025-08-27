'use client';

import { useRef, useEffect, useCallback } from 'react';

interface MarkedTextProps {
  text: string;
  inputText: string;
  isRunning: boolean;
}

export default function MarkedText({ text, inputText, isRunning }: MarkedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef<number>(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Función para calcular el estado de las palabras
  const getWordStates = useCallback(() => {
    const inputWords = inputText.trim().split(/\s+/);
    const targetWords = text.trim().split(/\s+/);
    const states: { word: string; status: "correct" | "error" | "pending" | "current" }[] = [];
    
    for (let i = 0; i < targetWords.length; i++) {
      const target = targetWords[i];
      const input = inputWords[i];
      
      if (i < inputWords.length - 1) {
        // Palabras ya completadas (no la última que se está escribiendo)
        if (input === target) {
          states.push({ word: target, status: "correct" });
        } else {
          states.push({ word: target, status: "error" });
        }
      } else if (i === inputWords.length - 1) {
        // La última palabra que el usuario está escribiendo o acaba de completar
        if (input === target) {
          states.push({ word: target, status: "correct" }); // Si es correcta, se marca como correcta
        } else {
          states.push({ word: target, status: "current" }); // Si es incorrecta, se marca como actual (azul)
        }
      } else {
        // Palabras pendientes
        states.push({ word: target, status: "pending" });
      }
    }
    
    return states;
  }, [inputText, text]);

  // Preservar posición del scroll y auto-scroll inteligente
  useEffect(() => {
    if (containerRef.current && lastScrollTop.current > 0) {
      containerRef.current.scrollTop = lastScrollTop.current;
    }
    
    // Auto-scroll inteligente con debounce
    if (isRunning && containerRef.current) {
      // Limpiar timeout anterior
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Debounce: esperar 100ms antes de hacer scroll
      scrollTimeoutRef.current = setTimeout(() => {
        console.log('🔄 Auto-scroll check:', { isRunning, inputTextLength: inputText.length });
        
        const states = getWordStates();
        const currentWordIndex = states.findIndex(s => s.status === "current");
        
        console.log('📍 Palabra actual:', currentWordIndex, 'de', states.length);
        
        if (currentWordIndex !== -1) {
          const wordElements = containerRef.current?.querySelectorAll('span');
          if (wordElements && wordElements[currentWordIndex]) {
            const currentWordElement = wordElements[currentWordIndex] as HTMLElement;
            const containerRect = containerRef.current?.getBoundingClientRect();
            const wordRect = currentWordElement.getBoundingClientRect();
            
            if (containerRect) {
              // Solo hacer scroll si la palabra actual está fuera de la vista
              const margin = 50; // Píxeles de margen
              const isWordAbove = wordRect.top < containerRect.top + margin;
              const isWordBelow = wordRect.bottom > containerRect.bottom - margin;
              
              console.log('👁️ Palabra visible:', !isWordAbove && !isWordBelow);
              
              if (isWordAbove || isWordBelow) {
                console.log('🎯 Haciendo auto-scroll a palabra:', currentWordIndex);
                currentWordElement.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center'
                });
              }
            }
          }
        }
      }, 100);
    }
    
    // Cleanup
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [text, inputText, isRunning, getWordStates]);

  // Guardar posición del scroll cuando cambie
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      lastScrollTop.current = container.scrollTop;
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const states = getWordStates();

  return (
    <div 
      ref={containerRef}
      className="w-full h-full p-3 border rounded bg-white text-black overflow-y-auto whitespace-normal text-sm leading-tight select-none"
    >
      {states.map((s, i) => (
        <span
          key={`${i}-${s.status}-${s.word}`}
          className={
            `inline-block align-baseline min-w-[1ch] px-[1px] py-0 font-normal text-base leading-relaxed ` +
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
