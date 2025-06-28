import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Cpu, Thermometer, Zap, HardDrive } from 'lucide-react'
import { motion } from 'framer-motion'

const GpuMonitor = () => {
  const [gpuData, setGpuData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchGpuData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/gpu/utilization')
      const data = await response.json()
      
      if (data.success) {
        setGpuData(data.data[0])
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch GPU data')
      }
    } catch (err) {
      setError('無法連接到 GPU 監控服務')
      console.error('GPU monitoring error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGpuData()
    const interval = setInterval(fetchGpuData, 2000)
    return () => clearInterval(interval)
  }, [])

  const getUtilizationColor = (percent) => {
    if (percent < 30) return 'bg-green-500'
    if (percent < 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getTemperatureColor = (temp) => {
    if (temp < 60) return 'text-green-500'
    if (temp < 80) return 'text-yellow-500'
    return 'text-red-500'
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 left-4 z-50"
      >
        <Card className="w-80 bg-black/80 backdrop-blur-sm border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              GPU 監控
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-400 text-sm">載入中...</div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 left-4 z-50"
      >
        <Card className="w-80 bg-black/80 backdrop-blur-sm border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              GPU 監控
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-red-400 text-sm">{error}</div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-4 z-50"
    >
      <Card className="w-80 bg-black/80 backdrop-blur-sm border-gray-700 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            GPU 監控
            <Badge variant="outline" className="ml-auto text-xs">
              即時
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs text-gray-300 truncate">
            {gpuData?.name || 'Unknown GPU'}
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-300 flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                GPU 使用率
              </span>
              <span className="text-xs font-mono">{gpuData?.gpu_percent || 0}%</span>
            </div>
            <Progress 
              value={gpuData?.gpu_percent || 0} 
              className="h-2"
              indicatorClassName={getUtilizationColor(gpuData?.gpu_percent || 0)}
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-300 flex items-center gap-1">
                <HardDrive className="w-3 h-3" />
                記憶體
              </span>
              <span className="text-xs font-mono">{gpuData?.memory_percent || 0}%</span>
            </div>
            <Progress 
              value={gpuData?.memory_percent || 0} 
              className="h-2"
              indicatorClassName={getUtilizationColor(gpuData?.memory_percent || 0)}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Thermometer className="w-3 h-3" />
              <span className="text-xs text-gray-300">溫度</span>
              <span className={`text-xs font-mono ${getTemperatureColor(gpuData?.temperature || 0)}`}>
                {gpuData?.temperature || 0}°C
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span className="text-xs text-gray-300">功耗</span>
              <span className="text-xs font-mono text-blue-400">
                {gpuData?.power_percent || 0}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default GpuMonitor
