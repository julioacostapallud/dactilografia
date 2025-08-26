import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Enviar al backend para validar
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data.user);
    } else {
      return NextResponse.json(
        { error: data.error || 'Credenciales inválidas' },
        { status: response.status }
      );
    }

  } catch (error) {
    console.error('Error validating credentials:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
