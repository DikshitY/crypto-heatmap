import axios from "axios";
import { useEffect, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [coinData, setCoinData] = useState([])

  useEffect(() => {
    fetchData();
  },[])

  const fetchData = async () => {
    const response = await axios.get('https://www.cryptowaves.app/api/rsi')
    setCoinData(response.data)
  }

  const data = coinData.map(coin => {
    return { x: coin.rank, y: coin.rsi, label: coin.coin,additionalData: {
      name: coin.name,
      rsi_1d: coin.rsi_1d,
      price: coin.current_price.toFixed(4),
      change_1h: coin.change_1h.toFixed(2),
      change_24h: coin.change_24h.toFixed(2),
      change_7d: coin.change_7d.toFixed(2),
      change_30d: coin.change_30d.toFixed(2)
    } }
  })

  const yTicks = [20,30,40,50,60,70,80,90]
  const xTicks = [0,20,40,60,80,100,120,140,160]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p><span className="bold">{dataPoint.label}</span> - {`${dataPoint.additionalData.name} (#${dataPoint.x})`}</p>
          <p><span className="bold">RSI (4h):</span> {dataPoint.y.toFixed(2)}, <span className="bold">RSI (1D):</span> {dataPoint.additionalData.rsi_1d}</p>
          <p><span className="bold">Price:</span> ${dataPoint.additionalData.price}</p>
          <p><span className="bold">1h, 24h, 7d, 30h:</span> {dataPoint.additionalData.change_1h}%, {dataPoint.additionalData.change_24h}%, {dataPoint.additionalData.change_7d}%, {dataPoint.additionalData.change_30d}%</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="main">
    <h2>Crypto Market RSI (4h) Heatmap</h2>
    <ResponsiveContainer width="90%" height={800} >
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
        cursor="crosshair"
      >
        <CartesianGrid />
        <XAxis type="number" dataKey="x" name="coin rank" domain={[0, 160]} ticks={xTicks} label={{ value: 'Coin Rank', position: 'insideBottom', offset: -10 }}/>
        <YAxis type="number" dataKey="y" name="rsi(4h)" domain={[20,90]} ticks={yTicks} label={{ value: 'RSI (4h)', angle: -90, position: 'insideLeft', offset: -10 }}/>
        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
        <Scatter name="A school" data={data} fill="#8884d8">
          <LabelList dataKey="label" position="top"/>
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
    </div>
  );
}

export default App;
