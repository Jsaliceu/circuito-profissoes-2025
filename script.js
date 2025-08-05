// Referências aos elementos da página
const unitSelectionDiv = document.getElementById('unit-selection');
const nameInputSectionDiv = document.getElementById('name-input-section');
const successMessageDiv = document.getElementById('success-message');
const form = document.getElementById('access-form');
const unitButtons = document.querySelectorAll('.unit-button');

let selectedUnit = '';

// Adiciona evento de clique aos botões de unidade
unitButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedUnit = button.textContent; // "Liceu" ou "Dom Bosco"
        
        // Transição entre os passos
        unitSelectionDiv.classList.remove('active');
        nameInputSectionDiv.classList.add('active');
    });
});

// Adiciona evento de envio ao formulário
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede o recarregamento da página

    const nameField = document.getElementById('name-field');
    const formData = new FormData(form);
    formData.append('unidade', selectedUnit);
    
    // Simula envio e mostra mensagem de sucesso
    // A integração real com o Google Sheets virá a seguir
    sendDataToSpreadsheet(formData);

    nameInputSectionDiv.classList.remove('active');
    successMessageDiv.classList.add('active');
});

// Função para enviar os dados (será conectada ao Google Apps Script)
function sendDataToSpreadsheet(formData) {
    // URL do Web App do Google Apps Script (a ser preenchida)
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwjnGhV03oNT5t_nbjzCSudo-BO1xdeDEZi4LWbqACZaf6ZAKciRYAkrYTKPWXrbOQ/exec';

    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => console.log('Success!', response))
        .catch(error => console.error('Error!', error.message));
}