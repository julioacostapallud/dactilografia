import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acerca de DACTILO - Mejorando la velocidad de tipeo',
  description: 'DACTILO es una plataforma gratuita para mejorar tu velocidad de tipeo con textos legales reales. Practica dactilografía y optimiza tu productividad.',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


