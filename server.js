const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/weather', async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ error: 'Nie podano miasta' });
    }

    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=pl&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            return res.status(404).json({ error: 'Nie znaleziono takiego miasta' });
        }

        const { latitude, longitude, name } = geoData.results[0];

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3`;

        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        res.json({
            city: name,
            daily: weatherData.daily
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});