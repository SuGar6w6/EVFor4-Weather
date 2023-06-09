import { LoadingButton } from "@mui/lab";
import { Box, Card, CardContent, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";

const API_KEY = "708d158800f5430e9ff31301233005";
const API_WEATHER = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&aqi=no`;

export default function App() {
  const [city, setCity] = useState("");
  const [error, setError] = useState({
    error: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temperature: 0,
    condition: "",
    conditionText: "",
    icon: "",
  });

  const [searchHistory, setSearchHistory] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError({ error: false, message: "" });
    setLoading(true);

    try {
      if (!city.trim()) throw { message: "Escribe una ciudad" };

      const res = await fetch(`${API_WEATHER}&q=${encodeURIComponent(city)}`);
      const data = await res.json();

      if (data.error) {
        throw { message: data.error.message };
      }

      console.log(data);

      const newWeather = {
        city: data.location.name,
        country: data.location.country,
        temperature: data.current.temp_c,
        condition: data.current.condition.code,
        conditionText: data.current.condition.text,
        icon: data.current.condition.icon,
      };

      setWeather(newWeather);
      setSearchHistory([...searchHistory, newWeather]);
    } catch (error) {
      console.log(error);
      setError({ error: true, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
        color: "#333333",
      }}
    >
      <Container maxWidth="xs">
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          App del Clima
        </Typography>
        <Box
          sx={{ display: "grid", gap: 2 }}
          component="form"
          autoComplete="off"
          onSubmit={onSubmit}
        >
          <TextField
            id="city"
            label="Ciudad"
            variant="outlined"
            size="small"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            error={error.error}
            helperText={error.message}
          />

          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
            loadingIndicator="Buscando..."
          >
            Buscar
          </LoadingButton>
        </Box>

        {weather.city && (
          <Box sx={{ mt: 2 }}>
            <Card>
              <CardContent>
                <Typography variant="h4" component="h2">
                  {weather.city}, {weather.country}
                </Typography>
                <Box
                  component="img"
                  alt={weather.conditionText}
                  src={weather.icon}
                  sx={{ margin: "0 auto" }}
                />
                <Typography variant="h5" component="h3">
                  {weather.temperature} °C
                </Typography>
                <Typography variant="h6" component="h4">
                  {weather.conditionText}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}

        {searchHistory.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h4" component="h2">
              Historial de búsquedas
            </Typography>
            <Box sx={{ mt: 2 }}>
              {searchHistory.map((weatherData, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 2,
                    backgroundColor: "#444444",
                    color: "#dddddd",
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" component="h3">
                      {weatherData.city}, {weatherData.country}
                    </Typography>
                    <Box
                      component="img"
                      alt={weatherData.conditionText}
                      src={weatherData.icon}
                      sx={{ margin: "0 auto", marginTop: "10px" }}
                    />
                    <Typography variant="body1" component="p">
                      {weatherData.temperature} °C
                    </Typography>
                    <Typography variant="body2" component="p">
                      {weatherData.conditionText}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        <Typography textAlign="center" sx={{ mt: 2, fontSize: "10px" }}>
          {/* Otros elementos */}
        </Typography>
      </Container>
    </Box>
  );
}
