import { NextResponse } from "next/server";

const LAT = 33.7542;
const LON = -118.2165;

async function nws(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "LongBeachDashboard (contact@example.com)"
    }
  });
  if (!res.ok) throw new Error("NWS error");
  return res.json();
}

export async function GET() {
  try {
    const point = await nws(`https://api.weather.gov/points/${LAT},${LON}`);
    const hourlyUrl = point.properties.forecastHourly;
    const forecastUrl = point.properties.forecast;

    const [hourly, daily] = await Promise.all([
      nws(hourlyUrl),
      nws(forecastUrl)
    ]);

    const h0 = hourly.properties.periods[0];

    const fogWords = ["fog", "mist", "haze"];
    const fogRisk = fogWords.some(w =>
      h0.shortForecast.toLowerCase().includes(w)
    ) ? "MODERATE" : "LOW";

    return NextResponse.json({
      updated: new Date().toISOString(),
      fogRisk,
      wind: h0.windSpeed + " " + h0.windDirection,
      rainChance: h0.probabilityOfPrecipitation?.value,
      hourly: hourly.properties.periods.slice(0, 6),
      daily: daily.properties.periods.slice(0, 5)
    });
  } catch (e) {
    return NextResponse.json({ error: true }, { status: 500 });
  }
}
