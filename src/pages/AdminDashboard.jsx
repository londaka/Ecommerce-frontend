import React, { useState } from 'react'
import AdminHome from '../components/admin/AdminHome'
import AdminOrders from '../components/admin/AdminOrders'
import AdminInfo from '../components/admin/AdminInfo'
import { Button } from '../components/ui/button'
import { Home, Info, MenuIcon, ShoppingBag, X } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { UserData } from '../context/UserContext'
import Loading from '../components/Loading'

const AdminDashboard = () => {
    const [selectedPage, setSelectedPage] = useState('home')
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const { user, loading } = UserData()

    if (loading) return <Loading />
    if (user?.role !== 'admin') return <Navigate to='/' replace />

    const renderPageContent = () => {
        switch (selectedPage){
            case 'home': 
            return <AdminHome />
            
            case 'orders': 
            return <AdminOrders />

            case 'info':
            return <AdminInfo />   


            default: return <AdminHome />
        }
    }
  return (
    <div className='flex min-h-screen'>
        {/* sidebar */}

        <div className={`${sidebarOpen?'translate-x-0':'-translate-x-full'}
        fixed lg:relative lg:translate-x-0
        h-full shadow-lg transition-transform
        duration-300 bg-background/50 border-b
        backdrop-blur z-50`}>

           <div className='flex flex-col h-full p-4'>
              <h1 className='text-lg font-bold mb-4'>Admin Panel</h1>
              <div className='space-y-4'>
               <Button variant='ghost' 
               onClick={()=>setSelectedPage('home')}
               className={`w-full flex items-center gap-2
               ${selectedPage==='home'? 'bg-gray-500':''}`}
               >
                <Home className='w-5 h-5'/>
                Home
                </Button>
               <Button variant='ghost' 
               onClick={()=>setSelectedPage('orders')}
               className={`w-full flex items-center gap-2
               ${selectedPage==='order'? 'bg-gray-500':''}`}
               >
                <ShoppingBag className='w-5 h-5'/>
                Orders
                </Button>
               <Button variant='ghost' 
               onClick={()=>setSelectedPage('info')}
               className={`w-full flex items-center gap-2
               ${selectedPage==='info'? 'bg-gray-500':''}`}
               >
                <Info className='w-5 h-5'/>
                Info
                </Button>

                <Button variant='ghost' className='lg:hidden' onClick={()=>setSidebarOpen(false)}><X className='w-5 h-5'/>Close</Button>
              </div>
           </div> 
        </div>


        <div className='flex-1 flex flex-col'>
            <div className='shadow p-4 flex items-center justify-between lg:justify-end'>
                <Button variant='outline'
                className='lg:hidden'
                onClick={()=>setSidebarOpen(!sidebarOpen)}>
                <MenuIcon className='w-5 h-5'/>
                </Button>
                <h2 className='text-lg font-bold hidden lg:block'>Admin Dashboard</h2>
            </div>
            <div className='p-4'>{renderPageContent()}</div>
        </div>
      
    </div>
  )
}

export default AdminDashboard