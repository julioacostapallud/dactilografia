const fs = require('fs-extra');
const path = require('path');
const pdfParse = require('pdf-parse');

async function testPDF() {
  try {
    console.log('🔍 Probando extracción del PDF...');
    
    const pdfPath = path.join(__dirname, 'public', 'CódigoProcesalCivilYComercialDeLaProvinciaDelChaco.pdf');
    console.log('📁 Ruta del PDF:', pdfPath);
    
    const dataBuffer = await fs.readFile(pdfPath);
    console.log('📊 Tamaño del buffer:', dataBuffer.length, 'bytes');
    
    const data = await pdfParse(dataBuffer);
    console.log('📄 Información del PDF:');
    console.log('- Páginas:', data.numpages);
    console.log('- Tamaño del texto:', data.text.length, 'caracteres');
    console.log('- Versión:', data.version);
    
    console.log('\n📝 Primeros 500 caracteres del texto:');
    console.log('---');
    console.log(data.text.substring(0, 500));
    console.log('---');
    
    // Buscar patrones específicos
    const patterns = [
      /ARTÍCULO/gi,
      /artículo/gi,
      /CAPÍTULO/gi,
      /capítulo/gi,
      /SECCIÓN/gi,
      /sección/gi
    ];
    
    console.log('\n🔍 Buscando patrones:');
    patterns.forEach(pattern => {
      const matches = data.text.match(pattern);
      console.log(`${pattern.source}: ${matches ? matches.length : 0} coincidencias`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testPDF();
