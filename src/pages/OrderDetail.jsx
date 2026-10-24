import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Cookies from 'js-cookie'
import { Printer } from 'lucide-react'
import Loading from '../components/Loading'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { server } from '../main'
import { UserData } from '../context/UserContext'

const formatDateTime = (date) => {
  if (!date) return 'Not available'

  const parsedDate = new Date(date)
  return Number.isNaN(parsedDate.getTime())
    ? 'Not available'
    : parsedDate.toLocaleString()
}

const OrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  

  const fetchOrder = useCallback(async () => {
    try {
      const { data } = await axios.get(`${server}/api/order/${id}`, {
        headers: { token: Cookies.get('token') }
      })
      setOrder(data.order)
    } catch (requestError) {
      console.error('Failed to load order:', requestError)
      setError(requestError.response?.data?.message || 'Could not load this order. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  const retryFetchOrder = () => {
    setLoading(true)
    setError('')
    fetchOrder()
  }

  if (loading) return <Loading />

  if (error || !order) {
    return (
      <main className='container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center'>
        <h1 className='text-2xl font-bold'>Couldn’t load this order</h1>
        <p className='mt-2 text-muted-foreground'>{error || 'Order not found.'}</p>
        <div className='mt-5 flex gap-3'>
          <Button variant='outline' onClick={() => navigate('/orders')}>Back to orders</Button>
          {error && <Button onClick={retryFetchOrder}>Try again</Button>}
        </div>
      </main>
    )
  }

  return (
    <main className='container mx-auto min-h-[70vh] max-w-3xl px-4 py-8 print:min-h-0 print:py-0'>
      <div className='mb-6 flex items-center justify-between print:hidden'>
        <Link to='/orders' className='text-sm text-muted-foreground hover:text-foreground'>
          ← Back to orders
        </Link>
        <Button onClick={() => window.print()}>
          <Printer className='mr-2 size-4' />
          Print order
        </Button>
      </div>
      <Card className='print:border-0 print:shadow-none'>
        <CardHeader>
          <CardTitle>Order details</CardTitle>
        </CardHeader>
        <CardContent className='space-y-5'>
          <section className='grid gap-3 rounded-lg bg-muted/50 p-4 text-sm sm:grid-cols-2'>
            <p className='break-all'><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Order status:</strong> {order.status || 'Pending'}</p>
            <p><strong>Placed at:</strong> {formatDateTime(order.createdAt)}</p>
            <p><strong>Paid at:</strong> {order.paidAt ? formatDateTime(order.paidAt) : 'Not paid yet'}</p>
            <p>
              <strong>Payment method:</strong> {order.method === 'demo' ? 'Demo payment' : order.method}
              {order.paymentStatus ? ` · ${order.paymentStatus}` : ''}
            </p>
            {order.paymentInfo && <p><strong>Payment reference:</strong> {order.paymentInfo}</p>}
          </section>

          <section className='border-t pt-4'>
            <h2 className='mb-3 font-semibold'>Shipping details</h2>
            <div className='space-y-1 text-sm'>
              <p><strong>Delivery address:</strong> {order.address || 'Not provided'}</p>
              <p><strong>Phone:</strong> {order.phone || 'Not provided'}</p>
            </div>
          </section>

          <section className='border-t pt-4'>
            <h2 className='mb-3 font-semibold'>Products</h2>
            <ul className='space-y-4'>
              {order.items.map((item) => {
                const product = item.product
                const imageUrl = product?.images?.[0]?.url
                const price = product?.price || 0

                return (
                  <li key={item._id} className='flex items-center gap-4'>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product?.title || 'Ordered product'}
                        className='size-20 shrink-0 rounded-md border object-cover'
                      />
                    ) : (
                      <div className='flex size-20 shrink-0 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground'>
                        No image
                      </div>
                    )}
                    <div className='min-w-0 flex-1'>
                      <p className='font-medium'>{product?.title || 'Product unavailable'}</p>
                      <p className='text-sm text-muted-foreground'>
                        ₨ {price} × {item.quantity}
                      </p>
                    </div>
                    <p className='shrink-0 text-sm font-medium'>₨ {price * item.quantity}</p>
                  </li>
                )
              })}
            </ul>
          </section>

          <div className='space-y-2 border-t pt-4 text-sm'>
            <p className='flex justify-between'>
              <span>Subtotal</span>
              <span>₨ {order.subTotal}</span>
            </p>
            <p className='flex justify-between'>
              <span>Delivery</span>
              <span>Free</span>
            </p>
            <p className='flex justify-between border-t pt-3 text-base font-semibold'>
              <span>Total</span>
              <span>₨ {order.subTotal}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default OrderDetail
