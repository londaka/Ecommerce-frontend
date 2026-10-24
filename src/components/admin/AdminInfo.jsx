import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Bar, BarChart, CartesianGrid, Cell, Label, Pie, PieChart, XAxis, YAxis } from 'recharts'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart'
import Loading from '../Loading'
import { server } from '../../main'

const paymentChartConfig = {
  orders: { label: 'Orders' },
  online: { label: 'Online', color: '#03bafc' },
  cod: { label: 'Cash on delivery', color: '#8c1251' }
}

const salesChartConfig = {
  sold: { label: 'Units sold', color: 'var(--color-chart-1)' }
}

const AdminInfo = () => {
  const [stats, setStats] = useState({ cod: 0, online: 0, data: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchStats = useCallback(async () => {
    setError('')
    try {
      const { data } = await axios.get(`${server}/api/order/stats`, {
        headers: { token: Cookies.get('token') }
      })
      setStats({
        cod: Number(data.cod) || 0,
        online: Number(data.online) || 0,
        data: Array.isArray(data.data) ? data.data : []
      })
    } catch (requestError) {
      console.error('Failed to load admin statistics:', requestError)
      setError(requestError.response?.data?.message || 'Could not load statistics. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  if (loading) return <Loading />

  if (error) {
    return (
      <div className='flex flex-col items-center gap-3 py-10 text-center'>
        <p className='text-sm text-destructive'>{error}</p>
        <Button onClick={() => {
          setLoading(true)
          fetchStats()
        }}>
          Try again
        </Button>
      </div>
    )
  }

  const totalOrders = stats.online + stats.cod
  const paymentData = [
    { method: 'online', orders: stats.online, fill: paymentChartConfig.online.color },
    { method: 'cod', orders: stats.cod, fill: paymentChartConfig.cod.color }
  ].map((payment) => ({
    ...payment,
    percentage: totalOrders ? (payment.orders / totalOrders) * 100 : 0
  }))
  const salesData = stats.data.filter((product) => product && typeof product.name === 'string')

  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
      <Card>
        <CardHeader className='items-center pb-0'>
          <CardTitle>Payment methods</CardTitle>
          <CardDescription>Breakdown of confirmed orders by payment method</CardDescription>
        </CardHeader>
        <CardContent className='flex-1 pb-4'>
          {totalOrders === 0 ? (
            <p className='py-16 text-center text-sm text-muted-foreground'>No order payment data yet.</p>
          ) : (
            <ChartContainer config={paymentChartConfig} className='mx-auto aspect-square max-h-[280px]'>
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={paymentData}
                  dataKey='orders'
                  nameKey='method'
                  innerRadius={60}
                  strokeWidth={5}
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, payload }) => {
                    if (!payload.orders) return null
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.55
                    const angle = -midAngle * (Math.PI / 180)
                    const x = cx + radius * Math.cos(angle)
                    const y = cy + radius * Math.sin(angle)
                    return (
                      <text
                        x={x}
                        y={y}
                        fill='white'
                        textAnchor='middle'
                        dominantBaseline='central'
                        className='text-xs font-semibold'
                      >
                        {payload.percentage.toFixed(1)}%
                      </text>
                    )
                  }}
                >
                  {paymentData.map((entry) => (
                    <Cell key={entry.method} fill={entry.fill} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (!viewBox || !('cx' in viewBox) || !('cy' in viewBox)) return null
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                          <tspan x={viewBox.cx} y={viewBox.cy} className='fill-foreground text-2xl font-bold'>
                            {totalOrders}
                          </tspan>
                          <tspan x={viewBox.cx} y={Number(viewBox.cy) + 22} className='fill-muted-foreground text-xs'>
                            Orders
                          </tspan>
                        </text>
                      )
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          )}
          <div className='flex justify-center gap-6 text-sm'>
            {paymentData.map((entry) => (
              <div key={entry.method} className='flex items-center gap-2'>
                <span className='size-3 rounded-sm' style={{ backgroundColor: entry.fill }} />
                <span>
                  {paymentChartConfig[entry.method].label}: {entry.orders} ({entry.percentage.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product sales</CardTitle>
          <CardDescription>Units sold by product</CardDescription>
        </CardHeader>
        <CardContent>
          {salesData.length === 0 ? (
            <p className='py-16 text-center text-sm text-muted-foreground'>No product sales data yet.</p>
          ) : (
            <ChartContainer config={salesChartConfig} className='min-h-[280px] w-full'>
              <BarChart accessibilityLayer data={salesData} margin={{ left: 8, right: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey='name' tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis allowDecimals={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey='sold' fill={salesChartConfig.sold.color} radius={4} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
        <CardFooter className='flex-col gap-2 text-sm'>
            <div className='leading-none text-muted-foreground'>Showing total units sold for each product</div>
        </CardFooter>
      </Card>

      
    </div>
  )
}

export default AdminInfo
