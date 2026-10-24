import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { server } from '../../main'
import { Input } from '../ui/input'
import Loading from '../Loading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Link } from 'react-router-dom'
import moment from 'moment'
import toast from 'react-hot-toast'

const AdminOrders = () => {
    const [orders, setOrders] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [updatingOrderId, setUpdatingOrderId] = useState(null)

    const fetchOrders = async() => {
        try {
            const {data} = await axios.get(`${server}/api/order/admin/all`, {
                headers:{
                    token: Cookies.get('token')
                },
            })

            setOrders(data)
            setLoading(false)
            
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Could not load orders')
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchOrders()
    }, [])

    const updateOrderStatus = async (orderId, status) => {
        setUpdatingOrderId(orderId)
        try {
            const {data} = await axios.post(`${server}/api/order/update/${orderId}`, {status},{
                headers:{
                    token: Cookies.get('token')
                }
            })

            toast.success(data.message)
            setOrders((currentOrders) => currentOrders.map((order) =>
                order._id === orderId ? { ...order, ...data.order } : order
            ))
        } catch (error) {
            console.error('Failed to update order status:', error)
            toast.error(error.response?.data?.message || 'Could not update order status')
        } finally {
            setUpdatingOrderId(null)
        }
    }

    const filteredOrders = orders.filter((order)=> order.user.email.toLowerCase().includes(search.toLowerCase()) || order._id.toLowerCase().includes(search.toLocaleLowerCase()))
  return (
    <div className='p-6 space-y-6'>
        <h1 className='text-2xl font-bold'>Manage Orders</h1>

        <Input 
        placeholder='serarch by email or order id' 
        value={search} 
        onChange={e=>setSearch(e.target.value)} 
        className='w-full md:w-1/2'
        />


        {
            loading?(
              <Loading /> 
              )  : filteredOrders.length>0 ?(
                 <div className='overflow-x-auto'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order Id</TableHead>
                                <TableHead>User Email</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.map((order)=> (
                                <TableRow key={order._id}>
                                    <TableCell>
                                        <Link to={`/order/${order._id}`}>{order._id}</Link>
                                    </TableCell>
                                    <TableCell>
                                        {order.user.email}
                                    </TableCell>
                                    <TableCell>
                                        {order.subTotal}
                                    </TableCell>
                                    <TableCell>
                                       <span className={`px-2 py-1 rounded text-white ${order.status === 'Pending'? 'bg-yellow-500' : order.status==='Shipped'? 'bg-blue-500': 'bg-green-500'}`}>
                                        {order.status}
                                       </span>
                                    </TableCell>
                                    <TableCell>
                                        {moment(order.createdAt).format("DD MM YYYY")}
                                    </TableCell>
                                    <TableCell>
                                        <select 
                                        value={order.status} 
                                        className='w-[150px] rounded-md border bg-background px-3 py-2 text-foreground'
                                        disabled={updatingOrderId === order._id}
                                        onChange={(e)=>updateOrderStatus(order._id, e.target.value)}>
                                            <option className='bg-background text-foreground' value="Pending">Pending</option>
                                            <option className='bg-background text-foreground' value="Shipped">Shipped</option>
                                            <option className='bg-background text-foreground' value="Delivered">Delivered</option>
                                        </select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 </div>
              ):(
                <p>No Orders</p>

        )}
    </div>
  )
}

export default AdminOrders