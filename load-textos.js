const fs = require('fs');
const path = require('path');

// Función para leer un archivo de texto
function readTextFile(filename) {
  const filePath = path.join(__dirname, 'public/textos', filename);
  return fs.readFileSync(filePath, 'utf8');
}

// Función para cargar un texto al backend
async function loadTextToBackend(texto, numero) {
  const url = 'https://dactilo-backend.vercel.app/api/textos-prueba';
  const data = {
    prueba_id: 1, // ID de la prueba del Poder Judicial del Chaco
    texto: texto
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Texto ${numero} cargado exitosamente`);
      return result;
    } else {
      console.error(`❌ Error cargando texto ${numero}:`, response.status);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error cargando texto ${numero}:`, error.message);
    return null;
  }
}

// Función principal
async function loadAllTexts() {
  console.log('🚀 Iniciando carga de textos...');
  
  const textos = [];
  
  // Leer todos los archivos de texto
  for (let i = 1; i <= 15; i++) {
    const filename = `texto${i}.txt`;
    try {
      const content = readTextFile(filename);
      textos.push({ numero: i, content: content });
      console.log(`📖 Leído: ${filename}`);
    } catch (error) {
      console.error(`❌ Error leyendo ${filename}:`, error.message);
    }
  }

  console.log(`\n📚 Total de textos leídos: ${textos.length}`);
  console.log('🔄 Cargando textos al backend...\n');

  // Cargar cada texto al backend
  for (const texto of textos) {
    await loadTextToBackend(texto.content, texto.numero);
    // Pequeña pausa para no sobrecargar el servidor
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n✅ Proceso completado!');
}

// Ejecutar el script
loadAllTexts().catch(console.error);


