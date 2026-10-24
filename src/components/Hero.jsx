import React from 'react'
import { Button } from './ui/button'

const Hero = ({navigate}) => {

  return (
    <div className='relative h-[calc(100vh-100px)] bg-cover bg-center'
    style={{
        backgroundImage:`linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.2)),url("/website.jpg")`,
        paddingTop: "100px"
    }}
    >
       <div className='flex items-center justify-center h-full text-center text-white'>
        <div>
            <h1 className='text-4xl sm:text-6xl font-bold mb-6'>
                Find What Makes You Happy
            </h1>
            <p className='text-lg sm:text-2xl mb-8'>
                Great deals on the brands and products you trust most.
            </p>
            <Button onClick={()=>navigate('/products')} size='lg'>Shop Now</Button>
        </div>
       </div>
    </div>
  )
}

export default Hero