const fs = require('fs-extra');
const path = require('path');
const pdfParse = require('pdf-parse');

async function extractAndProcessPDF() {
  try {
    console.log('📖 Extrayendo texto del PDF...');
    
    // Leer el archivo PDF
    const pdfPath = path.join(__dirname, 'public', 'CódigoProcesalCivilYComercialDeLaProvinciaDelChaco.pdf');
    const dataBuffer = await fs.readFile(pdfPath);
    
    // Extraer texto del PDF
    const data = await pdfParse(dataBuffer);
    const fullText = data.text;
    
    console.log('✅ Texto extraído exitosamente');
    console.log(`📊 Total de caracteres: ${fullText.length}`);
    
    // Dividir el texto en artículos
    const articles = splitIntoArticles(fullText);
    console.log(`📋 Encontrados ${articles.length} artículos`);
    
    // Crear fragmentos de práctica
    const practiceTexts = createPracticeTexts(articles);
    console.log(`✍️ Creados ${practiceTexts.length} textos de práctica`);
    
    // Guardar los archivos
    await savePracticeTexts(practiceTexts);
    
    console.log('🎉 Proceso completado exitosamente!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

function splitIntoArticles(text) {
  // Buscar todos los artículos que comiencen con "ARTÍCULO"
  const articleRegex = /ARTÍCULO\s+\d+[^\n]*/gi;
  const matches = [...text.matchAll(articleRegex)];
  
  const articles = [];
  
  for (let i = 0; i < matches.length; i++) {
    const startIndex = matches[i].index;
    const endIndex = i < matches.length - 1 ? matches[i + 1].index : text.length;
    
    const articleText = text.substring(startIndex, endIndex).trim();
    if (articleText.length > 50) { // Filtrar artículos muy cortos
      articles.push(articleText);
    }
  }
  
  return articles;
}

function createPracticeTexts(articles) {
  const practiceTexts = [];
  let currentText = '';
  let currentArticle = '';
  
  for (const article of articles) {
    // Si el artículo actual es muy largo, dividirlo
    if (article.length > 2000) {
      const sentences = article.split(/[.!?]+/).filter(s => s.trim().length > 10);
      let tempText = '';
      
      for (const sentence of sentences) {
        const testText = tempText + sentence + '. ';
        if (testText.length > 1500) {
          if (tempText.length > 200) {
            practiceTexts.push(tempText.trim());
          }
          tempText = sentence + '. ';
        } else {
          tempText = testText;
        }
      }
      
      if (tempText.length > 200) {
        practiceTexts.push(tempText.trim());
      }
    } else {
      // Combinar artículos hasta alcanzar ~300 palabras
      const testText = currentText + article + '\n\n';
      const wordCount = testText.split(/\s+/).length;
      
      if (wordCount > 400 && currentText.length > 200) {
        practiceTexts.push(currentText.trim());
        currentText = article + '\n\n';
      } else {
        currentText = testText;
      }
    }
  }
  
  // Agregar el último texto si tiene contenido
  if (currentText.length > 200) {
    practiceTexts.push(currentText.trim());
  }
  
  return practiceTexts.slice(0, 40); // Limitar a 40 textos
}

async function savePracticeTexts(practiceTexts) {
  const textosDir = path.join(__dirname, 'public', 'textos');
  
  // Limpiar directorio existente
  await fs.ensureDir(textosDir);
  const existingFiles = await fs.readdir(textosDir);
  for (const file of existingFiles) {
    if (file.endsWith('.txt')) {
      await fs.remove(path.join(textosDir, file));
    }
  }
  
  // Guardar nuevos archivos
  for (let i = 0; i < practiceTexts.length; i++) {
    const fileName = `texto${i + 1}.txt`;
    const filePath = path.join(textosDir, fileName);
    
    // Limpiar y formatear el texto
    let cleanText = practiceTexts[i]
      .replace(/\n+/g, '\n') // Normalizar saltos de línea
      .replace(/\s+/g, ' ') // Normalizar espacios
      .trim();
    
    await fs.writeFile(filePath, cleanText, 'utf8');
    console.log(`💾 Guardado: ${fileName} (${cleanText.split(/\s+/).length} palabras)`);
  }
}

// Ejecutar el script
extractAndProcessPDF();
