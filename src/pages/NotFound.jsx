import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Home } from 'lucide-react'


const NotFound = () => {
  return (
    <main className='flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center'>
      <img
        src={`${import.meta.env.BASE_URL}notfound.jpg`}
        alt='Illustration of a lost page'
        className='h-auto w-64 object-contain sm:w-80'
      />
      <h2 className='text-2xl font-semibold'>Page not found</h2>
      <p className='text-muted-foreground'>The page you’re looking for doesn’t exist or may have moved.</p>
      <Button variant='ghost' render={<Link to='/' />}>
        <Home />
        Go to home page
      </Button>
    </main>
  )
}

export default NotFound