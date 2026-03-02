// Elementos do DOM
const cepInput = document.getElementById('cep');
const btnBuscar = document.getElementById('btnBuscar');
const resultadoDiv = document.getElementById('resultado');
const loader = document.getElementById('loader');

// Formatação automática do CEP
cepInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    
    e.target.value = value;
});

// Buscar CEP ao clicar no botão
btnBuscar.addEventListener('click', buscarCEP);

// Buscar CEP ao pressionar Enter
cepInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buscarCEP();
    }
});

// Função principal de busca
async function buscarCEP() {
    const cep = cepInput.value.replace(/\D/g, '');
    
    // Validação do CEP
    if (cep.length !== 8) {
        mostrarErro('CEP inválido! Digite 8 números.');
        return;
    }
    
    // Mostra loader e limpa resultado anterior
    loader.style.display = 'block';
    resultadoDiv.innerHTML = '';
    
    try {
        // Consulta à API ViaCEP
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        // Esconde loader
        loader.style.display = 'none';
        
        // Verifica se o CEP foi encontrado
        if (data.erro) {
            mostrarErro('CEP não encontrado!');
            return;
        }
        
        // Exibe o resultado
        mostrarResultado(data);
        
    } catch (error) {
        loader.style.display = 'none';
        mostrarErro('Erro ao buscar CEP. Tente novamente.');
        console.error('Erro:', error);
    }
}

// Função para mostrar o resultado
function mostrarResultado(endereco) {
    const html = `
        <div class="address-card">
            <div class="address-item">
                <label>📮 CEP:</label>
                <span>${formatarCEP(endereco.cep)}</span>
            </div>
            <div class="address-item">
                <label>🏠 Logradouro:</label>
                <span>${endereco.logradouro || 'Não informado'}</span>
            </div>
            <div class="address-item">
                <label>📍 Bairro:</label>
                <span>${endereco.bairro || 'Não informado'}</span>
            </div>
            <div class="address-item">
                <label>🏙️ Cidade:</label>
                <span>${endereco.localidade || 'Não informado'}</span>
            </div>
            <div class="address-item">
                <label>🗺️ Estado:</label>
                <span>${endereco.uf || 'Não informado'}</span>
            </div>
        </div>
    `;
    
    resultadoDiv.innerHTML = html;
}

// Função para mostrar erro
function mostrarErro(mensagem) {
    resultadoDiv.innerHTML = `<p class="error-message">❌ ${mensagem}</p>`;
}

// Função para formatar CEP
function formatarCEP(cep) {
    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
}

// Exemplo de CEP para teste (opcional)
setTimeout(() => {
    cepInput.value = '01001-000';
}, 1000);
