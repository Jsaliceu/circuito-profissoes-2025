document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // --- CONFIGURAÇÃO E ELEMENTOS GLOBAIS ---
    // =================================================================
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwjnGhV03oNT5t_nbjzCSudo-BO1xdeDEZi4LWbqACZaf6ZAKciRYAkrYTKPWXrbOQ/exec'; 
    const ADMIN_PASSWORD = 'adminsale25';

    const checkinSection = document.getElementById('checkin-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const mainFooter = document.getElementById('main-footer');
    
    // Elementos do Check-in (do seu código original)
    const unitSelectionDiv = document.getElementById('unit-selection');
    const nameInputSectionDiv = document.getElementById('name-input-section');
    const successMessageDiv = document.getElementById('success-message');
    const checkinForm = document.getElementById('access-form');
    const nameField = document.getElementById('name-field');
    const unitButtons = document.querySelectorAll('.unit-button');
    let selectedUnit = '';

    // Elementos do Dashboard
    let dashboardInitialized = false;
    let categoryChart;
    
    // =================================================================
    // --- LÓGICA DO CHECK-IN PÚBLICO (SEU CÓDIGO ORIGINAL) ---
    // =================================================================
    unitButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedUnit = button.textContent.trim();
            unitSelectionDiv.classList.remove('active');
            unitSelectionDiv.classList.add('hidden'); // Garante que suma
            nameInputSectionDiv.classList.add('active');
            nameInputSectionDiv.classList.remove('hidden');
        });
    });

    if (checkinForm) {
        checkinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(checkinForm);
            formData.append('unidade', selectedUnit);
            
            fetch(SCRIPT_URL, { method: 'POST', body: formData })
                .then(response => console.log('Success!', response))
                .catch(error => console.error('Error!', error.message));

            nameInputSectionDiv.classList.remove('active');
            nameInputSectionDiv.classList.add('hidden');
            successMessageDiv.classList.add('active');
            successMessageDiv.classList.remove('hidden');
        });
    }

    // =================================================================
    // --- LÓGICA DE LOGIN DO ADMIN ---
    // =================================================================
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const enteredPassword = prompt("Digite a senha de acesso:");
            
            if (enteredPassword === ADMIN_PASSWORD) {
                checkinSection.classList.add('hidden');
                dashboardSection.classList.remove('hidden');
                mainFooter.style.display = 'none';
                document.body.classList.add('dashboard-active');
                
                if (!dashboardInitialized) {
                    // Preenche o HTML do dashboard que estava vazio
                    document.getElementById('dashboard-section').innerHTML = `
                        <div class="container">
                            <header><h1>Dashboard em Tempo Real</h1><p>Circuito de Profissões 2025</p></header>
                            <main class="grid-container">
                                <div class="card total-card"><h2>Total de Participantes</h2><span id="total-participants-value">0</span></div>
                                <div class="card chart-card"><h2>Check-ins por Categoria</h2><canvas id="category-chart"></canvas></div>
                                <div class="card feed-card"><h2>Últimos Check-ins</h2><ul id="live-feed-list"></ul></div>
                            </main>
                        </div>`;
                    fetchDashboardData();
                    setInterval(fetchDashboardData, 30000);
                    dashboardInitialized = true;
                }
            } else if (enteredPassword) {
                alert("Senha incorreta.");
            }
        });
    }

    // =================================================================
    // --- LÓGICAS DO DASHBOARD ---
    // =================================================================
    async function fetchDashboardData() {
        const totalParticipantsEl = document.getElementById('total-participants-value');
        const liveFeedListEl = document.getElementById('live-feed-list');

        try {
            const response = await fetch(`${SCRIPT_URL}?t=${new Date().getTime()}`);
            const data = await response.json();
            if (data.error) throw new Error(data.error);

            totalParticipantsEl.textContent = data.totalParticipants;
            
            liveFeedListEl.innerHTML = '';
            data.latestCheckins.forEach(person => {
                const li = document.createElement('li');
                li.innerHTML = `<span class="feed-name">${person.name}</span><span class="feed-time">${person.timestamp}</span>`;
                liveFeedListEl.appendChild(li);
            });

            updateChart(data.categoryCounts);
        } catch (error) {
            console.error("Erro ao buscar dados do dashboard:", error);
        }
    }

    function updateChart(categoryData) {
        const chartCanvas = document.getElementById('category-chart');
        const labels = Object.keys(categoryData);
        const data = Object.values(categoryData);
        const chartColors = ['#0F7173', '#F05D5E', '#D9D9D9', '#663F46', '#2E294E'];

        if (categoryChart) {
            categoryChart.data.labels = labels;
            categoryChart.data.datasets[0].data = data;
            categoryChart.update();
        } else {
            categoryChart = new Chart(chartCanvas, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{ label: 'Check-ins', data: data, backgroundColor: chartColors, hoverOffset: 4 }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: 'top', labels: { color: '#e9e9f0' } } }
                }
            });
        }
    }
});
