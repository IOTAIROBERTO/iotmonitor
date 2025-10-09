import React, { useState, useEffect, useRef } from 'react';
import { Activity, Wifi, WifiOff, AlertCircle, TrendingUp, Clock, Database, Zap } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// CONFIGURACIÓN - Cambia según tu entorno
const CONFIG = {
  USE_BACKEND_API: false, // Cambiar a true cuando tengas el backend configurado
  API_URL: 'https://TU-API-ID.execute-api.us-east-2.amazonaws.com/prod/sensor-data',
  UPDATE_INTERVAL: 16000, // 16 segundos (igual que tu código actual)
  MAX_DATA_POINTS: 20 // Puntos a mantener en gráficos
};

const IoTMonitorDashboard = () => {
  const [sensorData, setSensorData] = useState([]);
  const [stats, setStats] = useState({
    current: 0,
    min: Infinity,
    max: -Infinity,
    avg: 0,
    trend: 0
  });
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [updateCount, setUpdateCount] = useState(0);
  const intervalRef = useRef(null);

  // Función para conectar con tu DynamoDB actual (inseguro - temporal)
  const fetchFromDynamoDBDirect = async () => {
    try {
      // NOTA: Este método es TEMPORAL y debe reemplazarse con el backend
      // Actualmente no podemos hacer llamadas directas a DynamoDB desde el navegador
      // por políticas de CORS y seguridad
      
      // Simulación basada en tu estructura actual
      // En tu código actual esto funciona porque usas aws-sdk en tu build
      const mockData = generateMockDataBasedOnYourStructure();
      return mockData;
      
    } catch (err) {
      throw new Error(`Error DynamoDB: ${err.message}`);
    }
  };

  // Función para conectar con backend seguro (Lambda + API Gateway)
  const fetchFromBackendAPI = async () => {
    try {
      const response = await fetch(CONFIG.API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Parsear según tu estructura de DynamoDB
      // Items[0].record.N = timestamp en segundos
      // Items[0].distance.S = distancia como string
      const parsedData = result.Items.slice(0, 5).map(item => ({
        timestamp: new Date(parseInt(item.record.N) * 1000).toLocaleTimeString(),
        fullTimestamp: new Date(parseInt(item.record.N) * 1000).toLocaleString(),
        distance: parseFloat(item.distance.S),
        rawTimestamp: parseInt(item.record.N)
      })).reverse(); // Invertir para mostrar del más antiguo al más nuevo

      return parsedData;
      
    } catch (err) {
      throw new Error(`Error API: ${err.message}`);
    }
  };

  // Generar datos simulados basados en tu estructura actual
  const generateMockDataBasedOnYourStructure = () => {
    const now = Date.now();
    const data = [];
    
    for (let i = 4; i >= 0; i--) {
      const timestamp = now - (i * 3000); // 3 segundos de diferencia
      data.push({
        timestamp: new Date(timestamp).toLocaleTimeString(),
        fullTimestamp: new Date(timestamp).toLocaleString(),
        distance: parseFloat((Math.random() * 50 + 50).toFixed(2)), // 50-100 cm
        rawTimestamp: Math.floor(timestamp / 1000)
      });
    }
    
    return data;
  };

  // Función principal de obtención de datos
  const fetchSensorData = async () => {
    try {
      setConnectionStatus('fetching');
      
      let newDataPoints;
      
      if (CONFIG.USE_BACKEND_API) {
        // Usar backend seguro
        newDataPoints = await fetchFromBackendAPI();
      } else {
        // Usar método actual (temporal)
        newDataPoints = await fetchFromDynamoDBDirect();
      }

      // Actualizar el array de datos manteniendo solo los últimos N puntos
      setSensorData(prev => {
        const combined = [...prev, ...newDataPoints];
        // Eliminar duplicados por timestamp
        const unique = combined.filter((item, index, self) =>
          index === self.findIndex(t => t.timestamp === item.timestamp)
        );
        return unique.slice(-CONFIG.MAX_DATA_POINTS);
      });

      // Calcular estadísticas
      if (newDataPoints.length > 0) {
        const distances = newDataPoints.map(d => d.distance);
        const current = distances[distances.length - 1];
        const min = Math.min(...distances);
        const max = Math.max(...distances);
        const avg = distances.reduce((a, b) => a + b, 0) / distances.length;
        
        // Calcular tendencia comparando con el promedio anterior
        const trend = stats.avg > 0 ? ((avg - stats.avg) / stats.avg * 100) : 0;
        
        setStats({
          current: current.toFixed(2),
          min: min.toFixed(2),
          max: max.toFixed(2),
          avg: avg.toFixed(2),
          trend: trend.toFixed(1)
        });
      }

      setLastUpdate(new Date());
      setConnectionStatus('connected');
      setError(null);
      setUpdateCount(prev => prev + 1);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setConnectionStatus('error');
    }
  };

  // Iniciar monitoreo automático
  useEffect(() => {
    fetchSensorData(); // Primera carga inmediata
    
    intervalRef.current = setInterval(() => {
      fetchSensorData();
    }, CONFIG.UPDATE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Componente de tarjeta de estadística
  const StatCard = ({ title, value, unit, icon: Icon, subtitle, color, trend }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 transition-all hover:shadow-xl" 
         style={{ borderLeftColor: color }}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">
            {value}
            <span className="text-lg text-gray-500 ml-1">{unit}</span>
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
          )}
          {trend !== undefined && trend !== 0 && (
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp 
                className={`w-4 h-4 mr-1 ${trend >= 0 ? '' : 'transform rotate-180'}`}
                style={{ color: trend >= 0 ? color : '#ef4444' }} 
              />
              <span style={{ color: trend >= 0 ? color : '#ef4444' }}>
                {trend >= 0 ? '+' : ''}{trend}%
              </span>
              <span className="text-gray-500 ml-2">vs anterior</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );

  // Indicador de estado de conexión
  const StatusIndicator = () => {
    const statusConfig = {
      connecting: { color: 'bg-yellow-500', text: 'Conectando...', icon: Activity },
      fetching: { color: 'bg-blue-500', text: 'Actualizando...', icon: Activity },
      connected: { color: 'bg-green-500', text: CONFIG.USE_BACKEND_API ? 'API Conectada' : 'Simulación Activa', icon: Wifi },
      error: { color: 'bg-red-500', text: 'Error de conexión', icon: WifiOff }
    };

    const config = statusConfig[connectionStatus];
    const Icon = config.icon;

    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <div className={`w-3 h-3 ${config.color} rounded-full`}></div>
          {connectionStatus === 'connected' && (
            <div className={`absolute inset-0 ${config.color} rounded-full animate-ping opacity-75`}></div>
          )}
        </div>
        <span className="text-sm font-medium text-gray-700">{config.text}</span>
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Monitor IoT - Sensor de Distancia
              </h1>
              <p className="text-gray-600">
                Tabla: <code className="bg-gray-100 px-2 py-1 rounded text-sm">iotmonitor</code> • 
                ID: <code className="bg-gray-100 px-2 py-1 rounded text-sm ml-2">raspberry</code>
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <StatusIndicator />
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  {lastUpdate ? lastUpdate.toLocaleTimeString() : '--:--:--'}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Database className="w-4 h-4" />
                <span>{updateCount} actualizaciones</span>
              </div>
            </div>
          </div>
        </div>

        {/* Banner de modo */}
        {!CONFIG.USE_BACKEND_API && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 mb-6 flex items-start">
            <Zap className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-yellow-800 font-semibold">Modo Simulación</h3>
              <p className="text-yellow-700 text-sm mt-1">
                Actualmente usando datos simulados. Cambia <code className="bg-yellow-100 px-1 rounded">USE_BACKEND_API = true</code> cuando configures el backend.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-semibold">Error de conexión</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Tarjetas de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Distancia Actual"
            value={stats.current}
            unit="cm"
            icon={Activity}
            subtitle="Última lectura"
            color="#3b82f6"
            trend={parseFloat(stats.trend)}
          />
          <StatCard
            title="Mínima"
            value={stats.min === Infinity ? '--' : stats.min}
            unit="cm"
            icon={TrendingUp}
            subtitle="En esta sesión"
            color="#10b981"
          />
          <StatCard
            title="Máxima"
            value={stats.max === -Infinity ? '--' : stats.max}
            unit="cm"
            icon={TrendingUp}
            subtitle="En esta sesión"
            color="#ef4444"
          />
          <StatCard
            title="Promedio"
            value={stats.avg || '--'}
            unit="cm"
            icon={Activity}
            subtitle="En esta sesión"
            color="#8b5cf6"
          />
        </div>

        {/* Gráfico Principal - Línea */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Distancia en Tiempo Real
            </h2>
            <div className="text-sm text-gray-600">
              {sensorData.length} puntos de datos
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={sensorData}>
              <defs>
                <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                label={{ value: 'Distancia (cm)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`${value} cm`, 'Distancia']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="distance" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
                name="Distancia (cm)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráficos Secundarios */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* Gráfico de Área */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Vista de Área
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={sensorData}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${value} cm`, 'Distancia']}
                />
                <Area 
                  type="monotone" 
                  dataKey="distance" 
                  stroke="#8b5cf6" 
                  fillOpacity={1}
                  fill="url(#colorArea)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Barras */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Vista de Barras
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sensorData.slice(-10)}> {/* Últimas 10 lecturas */}
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${value} cm`, 'Distancia']}
                />
                <Bar 
                  dataKey="distance" 
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabla de Últimas Lecturas */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Últimas 10 Lecturas
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Hora</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Fecha Completa</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Distancia</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody>
                {sensorData.slice(-10).reverse().map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{item.timestamp}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.fullTimestamp}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right font-semibold">
                      {item.distance} cm
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        item.distance < 60 ? 'bg-red-100 text-red-700' :
                        item.distance < 80 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {item.distance < 60 ? 'Crítico' : item.distance < 80 ? 'Alerta' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instrucciones de Configuración */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
          <h3 className="text-lg font-bold mb-3">📋 Próximos Pasos</h3>
          <div className="text-sm space-y-2 opacity-90">
            <p><strong>1.</strong> Este dashboard está listo para conectarse a tu backend cuando lo configures</p>
            <p><strong>2.</strong> Sigue la guía de configuración de AWS Lambda + API Gateway (abajo)</p>
            <p><strong>3.</strong> Cambia <code className="bg-blue-700 px-2 py-1 rounded">USE_BACKEND_API = true</code> en la línea 8</p>
            <p><strong>4.</strong> Actualiza <code className="bg-blue-700 px-2 py-1 rounded">API_URL</code> con tu endpoint de API Gateway</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IoTMonitorDashboard;