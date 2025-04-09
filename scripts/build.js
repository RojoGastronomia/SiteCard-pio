const fs = require('fs-extra');
const path = require('path');

async function build() {
  try {
    // Criar diretório dist se não existir
    await fs.ensureDir('dist');

    // Copiar arquivos do frontend/public para dist
    await fs.copy('frontend/public', 'dist', {
      filter: (src) => {
        // Excluir arquivos desnecessários
        return !src.includes('node_modules') && 
               !src.includes('.git') && 
               !src.includes('.env');
      }
    });

    console.log('Build concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o build:', error);
    process.exit(1);
  }
}

build(); 