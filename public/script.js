async function getWeather() {
    const cityInput = document.getElementById('city-input');
    const resultDiv = document.getElementById('result');
    const city = cityInput.value.trim();

    if (!city) {
        alert("trzeba było uważać na geografii :/");
        return;
    }

    resultDiv.innerHTML = 'zaglądam do magicznej kuli';

    try {
        const response = await fetch(`/api/weather?city=${city}`);
        const data = await response.json();

        if (!response.ok) {
            resultDiv.innerHTML = `<p style="color:red">${data.error}</p>`;
            return;
        }

        let html = `<h3>Pogoda dla ${data.city}</h3>`;
        html += `<div class="forecast-list">`;

        for (let i = 0; i < data.daily.time.length; i++) {
            html += `
                <div class="day-card">
                    <strong>Data: ${data.daily.time[i]}</strong><br>
                    Maksymalnie: ${data.daily.temperature_2m_max[i]}°C<br>
                    Minimalnie: ${data.daily.temperature_2m_min[i]}°C
                </div>
            `;
        }
        html += `</div>`;

        resultDiv.innerHTML = html;

    } catch (error) {
        console.error(error);
        resultDiv.innerHTML = 'jakiś tam błąd spróbuj ponownie później';
    }
}