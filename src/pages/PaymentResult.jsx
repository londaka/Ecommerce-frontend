import React, { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import { server } from '../main'
import { Button } from '../components/ui/button'
import { CartData } from '../context/CartContext'

const PaymentResult = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const { fetchCart } = CartData()
  const [result, setResult] = useState({ loading: true, paid: false, demo: false, message: '' })

  const verifyPayment = useCallback(async () => {
    if (!orderId) {
      setResult({ loading: false, paid: false, demo: false, message: 'Payment order was not found.' })
      return
    }

    setResult({ loading: true, paid: false, demo: false, message: '' })
    try {
      const { data } = await axios.post(`${server}/api/order/esewa/verify`, {
        orderId
      }, {
        headers: {
          token: Cookies.get('token')
        }
      })
      if (data.paid) await fetchCart()
      setResult({ loading: false, paid: data.paid, demo: Boolean(data.demo), message: data.message })
    } catch (error) {
      setResult({
        loading: false,
        paid: false,
        demo: false,
        message: error.response?.data?.message || 'Could not verify payment. Please try again.'
      })
    }
  }, [fetchCart, orderId])

  useEffect(() => {
    verifyPayment()
  }, [verifyPayment])

  return (
    <main className='container mx-auto px-4 py-10 max-w-xl text-center'>
      <h1 className='text-3xl font-bold mb-4'>
        {result.loading
          ? 'Verifying payment...'
          : result.paid && result.demo
            ? 'Demo order complete'
            : result.paid
              ? 'Payment successful'
              : 'Payment not confirmed'}
      </h1>
      <p className='mb-6'>{result.message}</p>
      {!result.loading && !result.paid && (
        <Button onClick={verifyPayment} className='mb-4'>Check payment again</Button>
      )}
      <div>
        <Link to={result.paid ? '/products' : '/checkout'}>
          <Button variant='outline'>{result.paid ? 'Continue shopping' : 'Back to checkout'}</Button>
        </Link>
      </div>
    </main>
  )
}

export default PaymentResult
