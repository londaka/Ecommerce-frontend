import React from 'react'
import { Globe, Mail, MessageCircle, Play } from 'lucide-react'

const Footer = () => {
  return (
    <footer className='w-full mt-8 print:hidden'>
      <hr className='border border-gray-300 dark:border-gray-700' />

      <div className='container mx-auto px-4 py-6'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <div className='mb-6 flex-col md:flex-row justify-between items-center'>
            <h1 className='text-xl font-bold'>QuickCart</h1>
            <p>Your one-stop shop for everything you need</p>
          </div>

          <div className='flex flex-wrap justify-center md:justify-end gap-4'>
            <a href='' className='text-sm hover:underline'>About Us</a>
            <a href='' className='text-sm hover:underline'>Contact</a>
            <a href='' className='text-sm hover:underline'>Privacy Policy</a>
            <a href='' className='text-sm hover:underline'>Terms and Conditions</a>
          </div>
        </div>

        <div className='mt-6 text-center'>
          <p className='text-sm'>Follow us:</p>
          <div className='flex justify-center gap-4 mt-2'>
            <a href='#' className='hover:opacity-75' aria-label='Website'>
              <Globe className='w-5 h-5' />
            </a>
            <a href='#' className='hover:opacity-75' aria-label='Email'>
              <Mail className='w-5 h-5' />
            </a>
            <a href='#' className='hover:opacity-75' aria-label='Chat'>
              <MessageCircle className='w-5 h-5' />
            </a>
            <a href='#' className='hover:opacity-75' aria-label='Video'>
              <Play className='w-5 h-5' />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer