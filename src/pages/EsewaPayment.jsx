import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import { server } from '../main'
import { CartData } from '../context/CartContext'
import { Button } from '../components/ui/button'

const EsewaPayment = () => {
  const { addressId } = useParams()
  const navigate = useNavigate()
  const { totalItem, subTotal } = CartData()
  const [loading, setLoading] = useState(false)

  const startDemoPayment = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(`${server}/api/order/demo/complete`, {
        addressId
      }, {
        headers: {
          token: Cookies.get('token')
        }
      })
      navigate(`/payment/result?orderId=${data.orderId}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not complete the demo order')
      setLoading(false)
    }
  }

  const startPayment = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(`${server}/api/order/esewa/initiate`, {
        addressId
      }, {
        headers: {
          token: Cookies.get('token')
        }
      })

      const form = document.createElement('form')
      form.method = 'POST'
      form.action = data.gatewayUrl
      Object.entries(data.fields).forEach(([name, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = name
        input.value = value
        form.appendChild(input)
      })
      document.body.appendChild(form)
      form.submit()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not start eSewa payment')
      setLoading(false)
    }
  }

  return (
    <main className='container mx-auto px-4 py-10 max-w-xl'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Complete your order</h1>
      <div className='border rounded-lg shadow-sm p-6 space-y-4'>
        <p>Items in your order: {totalItem}</p>
        <p className='text-xl font-semibold'>Total: ₨ {subTotal}</p>
        {import.meta.env.DEV && (
          <div className='rounded-lg border border-amber-500/40 bg-amber-500/5 p-4'>
            <p className='text-sm font-medium'>Demo mode</p>
            <p className='mt-1 text-sm text-muted-foreground'>
              Complete a simulated order without signing in to eSewa. No real payment will be taken.
            </p>
            <Button
              onClick={startDemoPayment}
              disabled={loading || totalItem === 0}
              className='mt-4 w-full'
            >
              {loading ? 'Completing demo order...' : 'Complete demo order'}
            </Button>
          </div>
        )}
        <div className='space-y-3'>
          <p className='text-sm text-muted-foreground'>
            {import.meta.env.DEV
              ? 'Or continue to the eSewa UAT gateway if you have valid test credentials.'
              : 'You will be redirected to eSewa to securely complete your payment.'}
          </p>
          <Button onClick={startPayment} disabled={loading || totalItem === 0} variant='outline' className='w-full'>
            {loading ? 'Connecting to eSewa...' : import.meta.env.DEV ? 'Continue to eSewa UAT' : 'Continue to eSewa'}
          </Button>
        </div>
      </div>
    </main>
  )
}

export default EsewaPayment
