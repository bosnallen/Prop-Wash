"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState(null);

  async function load() {
    const res = await fetch("/api/weather");
    const json = await res.json();
    setData(json);
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 15 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="h1">Long Beach Dashboard</h1>
          <div className="sub">Fog • Wind • Rain (Auto-refresh)</div>
        </div>
      </div>

      <div className="grid">
        <div className="card col4">
          <div className="cardTitle">
            <strong>Fog Risk</strong>
            <span className="badge">{data?.fogRisk || "—"}</span>
          </div>
          <div className="kpiValue">{data?.fogRisk || "—"}</div>
        </div>

        <div className="card col4">
          <strong>Wind</strong>
          <div className="kpiValue">{data?.wind || "—"}</div>
        </div>

        <div className="card col4">
          <strong>Rain Chance</strong>
          <div className="kpiValue">
            {data?.rainChance != null ? `${data.rainChance}%` : "—"}
          </div>
        </div>

        <div className="card col6">
          <strong>Next Hours</strong>
          {data?.hourly?.map(h => (
            <div key={h.startTime} className="row">
              <div>{new Date(h.startTime).toLocaleTimeString()}</div>
              <div>{h.shortForecast}</div>
            </div>
          ))}
        </div>

        <div className="card col6">
          <strong>Next Days</strong>
          {data?.daily?.map(d => (
            <div key={d.name} className="row">
              <div>{d.name}</div>
              <div>{d.shortForecast}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
