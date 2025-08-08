document.addEventListener('DOMContentLoaded', () => {
    // URL do seu App Script (obtida na Frente 1, passo 3)
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwjnGhV03oNT5t_nbjzCSudo-BO1xdeDEZi4LWbqACZaf6ZAKciRYAkrYTKPWXrbOQ/exec'; // Lembre-se de manter sua URL aqui
    const PASSWORD = 'admin'; // Defina uma senha simples

    // Elementos do DOM
    const totalParticipantsEl = document.getElementById('total-participants-value');
    const liveFeedListEl = document.getElementById('live-feed-list');
    const chartCanvas = document.getElementById('category-chart');
    let categoryChart; // Variável para guardar a instância do gráfico

    function init() {
        const enteredPassword = prompt("Por favor, digite a senha de acesso:");
        if (enteredPassword !== PASSWORD) {
            alert("Senha incorreta. Acesso negado.");
            document.body.innerHTML = '<h1>Acesso Negado</h1>';
            return;
        }
        
        // Carrega os dados imediatamente e depois a cada 30 segundos
        fetchDashboardData();
        setInterval(fetchDashboardData, 30000);
    }

    async function fetchDashboardData() {
        try {
            const response = await fetch(SCRIPT_URL);
            const data = await response.json();

            // Atualiza o total de participantes
            totalParticipantsEl.textContent = data.totalParticipants;

            // Atualiza o feed de check-ins
            liveFeedListEl.innerHTML = ''; // Limpa a lista antiga
            data.latestCheckins.forEach(person => {
                const li = document.createElement('li');
                li.innerHTML = `<span class="feed-name">${person.name}</span><span class="feed-time">${person.timestamp}</span>`;
                liveFeedListEl.appendChild(li);
            });

            // Atualiza o gráfico de pizza
            updateChart(data.categoryCounts);

        } catch (error) {
            console.error("Erro ao buscar dados do dashboard:", error);
        }
    }

    function updateChart(categoryData) {
        const labels = Object.keys(categoryData);
        const data = Object.values(categoryData);

        if (categoryChart) {
            // Se o gráfico já existe, apenas atualiza os dados
            categoryChart.data.labels = labels;
            categoryChart.data.datasets[0].data = data;
            categoryChart.update();
        } else {
            // Se não existe, cria o gráfico pela primeira vez
            categoryChart = new Chart(chartCanvas, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Check-ins',
                        data: data,
                        backgroundColor: ['#0F7173', '#F05D5E', '#D9D9D9', '#663F46', '#2E294E'],
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                // --- CORREÇÃO APLICADA AQUI ---
                                color: '#e9e9f0' // Usamos o valor hexadecimal diretamente
                            }
                        }
                    }
                }
            });
        }
    }

    init(); // Inicia o processo
});