import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, LockKeyhole, MapPin, Plus, ShieldCheck, ShoppingBag, Trash, Truck } from 'lucide-react'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import { server } from '../main'
import Loading from '../components/Loading'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { CartData } from '../context/CartContext'

const Checkout = () => {
  const { cart, totalItem, subTotal, loading: cartLoading } = CartData()
  const navigate = useNavigate()
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [loading, setLoading] = useState(true)
  const [addressError, setAddressError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [savingAddress, setSavingAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({ address: '', phone: '' })

  async function fetchAddress() {
    setAddressError('')
    try {
      const { data } = await axios.get(`${server}/api/address/all`, {
        headers: { token: Cookies.get('token') }
      })
      const allAddresses = data.allAddress || []
      setAddresses(allAddresses)
      setSelectedAddressId((currentId) =>
        allAddresses.some((address) => address._id === currentId)
          ? currentId
          : allAddresses[0]?._id || ''
      )
    } catch (error) {
      console.error('Failed to load delivery addresses:', error)
      setAddressError(error.response?.data?.message || 'Could not load your saved addresses.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAddress()
  }, [])

  const handleAddAddress = async (event) => {
    event.preventDefault()
    const address = newAddress.address.trim()
    const phone = newAddress.phone.trim()

    if (!address || !phone) {
      toast.error('Enter both a delivery address and phone number.')
      return
    }

    setSavingAddress(true)
    try {
      const { data } = await axios.post(
        `${server}/api/address/new`,
        { address, phone },
        {
          headers: {
            token: Cookies.get('token'),
            'Cache-Control': 'no-cache'
          }
        }
      )
      toast.success(data.message || 'Address saved')
      setNewAddress({ address: '', phone: '' })
      setModalOpen(false)
      await fetchAddress()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save this address.')
    } finally {
      setSavingAddress(false)
    }
  }

  const deleteHandler = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return

    try {
      const { data } = await axios.delete(`${server}/api/address/${id}`, {
        headers: {
          token: Cookies.get('token'),
          'Cache-Control': 'no-cache'
        }
      })
      toast.success(data.message || 'Address deleted')
      await fetchAddress()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete address.')
    }
  }

  if (cartLoading || loading) return <Loading />

  if (cart.length === 0) {
    return (
      <main className='mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center'>
        <div className='mb-5 flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground'>
          <ShoppingBag className='size-7' />
        </div>
        <h1 className='text-2xl font-semibold tracking-tight'>Your bag is waiting</h1>
        <p className='mt-2 max-w-sm text-sm text-muted-foreground'>
          Add something you love before heading to checkout.
        </p>
        <Button className='mt-6' onClick={() => navigate('/products')}>Explore products</Button>
      </main>
    )
  }

  const selectedAddress = addresses.find((address) => address._id === selectedAddressId)

  return (
    <main className='mx-auto min-h-[70vh] max-w-6xl px-4 py-8 sm:px-6 lg:py-12'>
      <Link
        to='/cart'
        className='mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'
      >
        <ArrowLeft className='size-4' />
        Back to bag
      </Link>

      <div className='mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='mb-2 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground'>QuickCart</p>
          <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>Checkout</h1>
          <p className='mt-2 text-muted-foreground'>One last step. Where should we send your order?</p>
        </div>
        <div className='flex items-center gap-3 text-sm text-muted-foreground'>
          <span className='flex items-center gap-2 font-medium text-foreground'>
            <span className='flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground'>
              <Check className='size-4' />
            </span>
            Bag
          </span>
          <span className='h-px w-8 bg-border' />
          <span className='flex items-center gap-2 font-medium text-foreground'>
            <span className='flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground'>2</span>
            Delivery
          </span>
          <span className='h-px w-8 bg-border' />
          <span className='flex items-center gap-2'>
            <span className='flex size-7 items-center justify-center rounded-full border border-border'>3</span>
            Payment
          </span>
        </div>
      </div>

      <div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]'>
        <section className='space-y-6'>
          <div className='rounded-2xl border bg-card p-5 shadow-sm sm:p-7'>
            <div className='mb-6 flex flex-wrap items-start justify-between gap-4'>
              <div className='flex items-start gap-3'>
                <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted'>
                  <MapPin className='size-5' />
                </div>
                <div>
                  <h2 className='text-lg font-semibold'>Delivery address</h2>
                  <p className='mt-1 text-sm text-muted-foreground'>Choose where you’d like your order delivered.</p>
                </div>
              </div>
              <Button variant='outline' onClick={() => setModalOpen(true)}>
                <Plus className='size-4' />
                Add address
              </Button>
            </div>

            {addressError ? (
              <div className='rounded-xl border border-destructive/30 bg-destructive/5 p-4'>
                <p className='text-sm text-destructive'>{addressError}</p>
                <Button variant='outline' size='sm' className='mt-3' onClick={fetchAddress}>Try again</Button>
              </div>
            ) : addresses.length === 0 ? (
              <div className='rounded-xl border border-dashed p-8 text-center'>
                <MapPin className='mx-auto size-6 text-muted-foreground' />
                <p className='mt-3 font-medium'>No saved addresses yet</p>
                <p className='mt-1 text-sm text-muted-foreground'>Add a delivery address to continue.</p>
                <Button className='mt-4' variant='outline' onClick={() => setModalOpen(true)}>
                  <Plus className='size-4' />
                  Add your first address
                </Button>
              </div>
            ) : (
              <div className='grid gap-3 sm:grid-cols-2'>
                {addresses.map((address) => {
                  const selected = address._id === selectedAddressId
                  return (
                    <div
                      key={address._id}
                      className={`relative rounded-xl border p-4 transition-colors ${
                        selected ? 'border-primary bg-primary/[0.03] ring-1 ring-primary' : 'hover:border-foreground/30'
                      }`}
                    >
                      <label className='flex cursor-pointer items-start gap-3 pr-8'>
                        <input
                          type='radio'
                          name='delivery-address'
                          value={address._id}
                          checked={selected}
                          onChange={() => setSelectedAddressId(address._id)}
                          className='mt-1 size-4 accent-primary'
                        />
                        <span className='min-w-0'>
                          <span className='block text-sm font-semibold'>Delivery address</span>
                          <span className='mt-2 block break-words text-sm leading-relaxed text-muted-foreground'>{address.address}</span>
                          <span className='mt-3 block text-sm font-medium'>{address.phone}</span>
                        </span>
                      </label>
                      <button
                        type='button'
                        onClick={() => deleteHandler(address._id)}
                        aria-label='Delete this address'
                        className='absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive'
                      >
                        <Trash className='size-4' />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className='rounded-2xl border bg-card p-5 shadow-sm sm:p-7'>
            <div className='mb-5 flex items-start gap-3'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted'>
                <LockKeyhole className='size-5' />
              </div>
              <div>
                <h2 className='text-lg font-semibold'>Payment</h2>
                <p className='mt-1 text-sm text-muted-foreground'>Secure online payment with eSewa.</p>
              </div>
            </div>
            <div className='flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/[0.03] p-4'>
              <span className='flex size-5 items-center justify-center rounded-full border-2 border-primary'>
                <span className='size-2.5 rounded-full bg-primary' />
              </span>
              <div className='flex-1'>
                <p className='text-sm font-semibold'>eSewa</p>
                <p className='mt-0.5 text-xs text-muted-foreground'>You’ll complete payment on eSewa’s secure page.</p>
              </div>
              <ShieldCheck className='size-5 text-muted-foreground' />
            </div>
          </div>
        </section>

        <aside className='h-fit rounded-2xl border bg-card p-5 shadow-sm lg:sticky lg:top-24 sm:p-6'>
          <h2 className='text-lg font-semibold'>Order summary</h2>
          <p className='mt-1 text-sm text-muted-foreground'>{totalItem} {totalItem === 1 ? 'item' : 'items'} in your bag</p>

          <div className='mt-5 max-h-64 space-y-4 overflow-y-auto pr-1'>
            {cart.map((item) => (
              <div key={item._id} className='flex gap-3'>
                <div className='relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted'>
                  <img
                    src={item.product.images?.[0]?.url}
                    alt={item.product.title}
                    className='size-full object-cover'
                  />
                  <span className='absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-xs font-medium text-background'>
                    {item.quantity}
                  </span>
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='line-clamp-2 text-sm font-medium'>{item.product.title}</p>
                  <p className='mt-1 text-xs text-muted-foreground'>₨ {item.product.price} each</p>
                </div>
                <p className='shrink-0 text-sm font-medium'>₨ {item.product.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className='my-5 border-t' />
          <div className='space-y-3 text-sm'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Subtotal</span>
              <span>₨ {subTotal}</span>
            </div>
            <div className='flex justify-between'>
              <span className='flex items-center gap-1.5 text-muted-foreground'><Truck className='size-4' /> Delivery</span>
              <span className='font-medium text-emerald-600'>Free</span>
            </div>
          </div>
          <div className='my-5 border-t' />
          <div className='flex items-end justify-between'>
            <span className='font-semibold'>Total</span>
            <span className='text-2xl font-semibold tracking-tight'>₨ {subTotal}</span>
          </div>
          <Button
            className='mt-6 h-11 w-full'
            onClick={() => selectedAddress && navigate(`/payment/${selectedAddress._id}`)}
            disabled={!selectedAddress || Boolean(addressError)}
          >
            Continue to payment
          </Button>
          <div className='mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground'>
            <ShieldCheck className='size-4' />
            Secure checkout · Payment processed by eSewa
          </div>
        </aside>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <form onSubmit={handleAddAddress} className='space-y-5'>
            <DialogHeader>
              <DialogTitle>Add delivery address</DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label htmlFor='delivery-address' className='text-sm font-medium'>Full address</label>
                <Input
                  id='delivery-address'
                  type='text'
                  placeholder='Street, area, city'
                  autoComplete='street-address'
                  maxLength={300}
                  required
                  value={newAddress.address}
                  onChange={(event) => setNewAddress({ ...newAddress, address: event.target.value })}
                />
              </div>
              <div className='space-y-2'>
                <label htmlFor='delivery-phone' className='text-sm font-medium'>Phone number</label>
                <Input
                  id='delivery-phone'
                  type='tel'
                  placeholder='Your contact number'
                  autoComplete='tel'
                  maxLength={20}
                  required
                  value={newAddress.phone}
                  onChange={(event) => setNewAddress({ ...newAddress, phone: event.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type='submit' disabled={savingAddress}>
                {savingAddress ? 'Saving…' : 'Save address'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}

export default Checkout
