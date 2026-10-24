import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Loading from '../components/Loading'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { server } from '../main'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await axios.get(`${server}/api/order/all`, {
        headers: {
          token: Cookies.get('token')
        }
      })
      setOrders(Array.isArray(data.orders) ? data.orders : [])
    } catch (requestError) {
      console.error('Failed to load orders:', requestError)
      setError(requestError.response?.data?.message || 'Could not load your orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  if (loading) return <Loading />

  if (error) {
    return (
      <main className='container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center'>
        <h1 className='text-2xl font-bold'>Couldn’t load your orders</h1>
        <p className='mt-2 text-muted-foreground'>{error}</p>
        <Button className='mt-5' onClick={fetchOrders}>Try again</Button>
      </main>
    )
  }

  if (orders.length === 0) {
    return (
      <main className='container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center'>
        <h1 className='text-2xl font-bold'>No orders yet</h1>
        <p className='mt-2 text-muted-foreground'>Your completed orders will show up here.</p>
        <Button className='mt-5' onClick={() => navigate('/products')}>Shop now</Button>
      </main>
    )
  }

  return (
    <main className='container mx-auto min-h-[70vh] px-4 py-8'>
      <h1 className='mb-6 text-center text-3xl font-bold'>Your orders</h1>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {orders.map((order) => (
          <Card key={order._id} className='shadow-sm'>
            <CardHeader>
              <CardTitle className='text-base font-semibold'>
                Order #{order._id.slice(-8).toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <p className='flex justify-between gap-3 text-sm'>
                <strong>Order status</strong>
                <span>{order.status || 'Pending'}</span>
              </p>
              <p className='flex justify-between gap-3 text-sm'>
                <strong>Payment</strong>
                <span>
                  {order.method === 'demo' ? 'Demo payment' : order.method}
                  {order.paymentStatus ? ` · ${order.paymentStatus}` : ''}
                </span>
              </p>
              <div className='border-t pt-3'>
                <p className='mb-2 text-sm font-semibold'>
                  Items ({order.items.reduce((quantity, item) => quantity + item.quantity, 0)})
                </p>
                <ul className='space-y-1 text-sm text-muted-foreground'>
                  {order.items.map((item) => (
                    <li key={item._id || item.product?._id}>
                      {item.product?.title || 'Product'} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <p className='flex justify-between gap-3 border-t pt-3 text-sm'>
                <strong>Total</strong>
                <span>₨ {order.subTotal}</span>
              </p>
              <p className='text-xs text-muted-foreground'>
                Placed {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <Button className='mt-4' onClick={() => navigate(`/order/${order._id}`)}>
                View Detail
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}

export default Orders
