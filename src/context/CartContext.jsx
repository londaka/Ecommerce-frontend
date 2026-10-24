import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie'
import axios from "axios";
import toast from "react-hot-toast";
import { server } from '../main'

const CartContext = createContext()

export const CartProvider = ({children})=>{
    const [loading, setLoading] = useState(true)
    const [totalItem, setTotalItem] = useState(0)
    const [subTotal, setSubTotal] = useState(0)


    const [cart, setCart] = useState([])

    const fetchCart = useCallback(async function fetchCart(){
        setLoading(true)
        try {
            const {data} = await axios.get(`${server}/api/cart/all`,{
                headers:{
                    token: Cookies.get('token'),
                    'Cache-Control': 'no-cache'
                },
                timeout: 10000
            })
            setCart(data.cart)
            setTotalItem(data.sumOfQuantities)
            setSubTotal(data.subTotal)
            
        } catch (error) {
            console.error('Failed to fetch cart:', error)
            toast.error(error.response?.data?.message || 'Failed to load cart')
        } finally {
            setLoading(false)
        }
    }, [])

    async function addtoCart (product)  {
        try {
            const {data} = await axios.post(`${server}/api/addtocart`, {product}, {
                headers:{
                    token: Cookies.get('token'),
                    'Cache-Control': 'no-cache'
                },
                timeout: 10000

            })

            toast.success(data.message)
            fetchCart()
        } catch (error) {
            console.error('Failed to add product to cart:', error)
            toast.error(error.response?.data?.message || 'Failed to add product to cart')
        }
    }

    async function updateCart (action, id) {
       try {
        const {data} = await axios.post(`${server}/api/cart/update?action=${action}`,{id}, {
            headers:{
                token: Cookies.get('token'),
                'Cache-Control': 'no-cache'
            }
        })

        toast.success(data.message)
        await fetchCart()
        
       } catch (error) {
        console.error('Failed to update cart:', error)
        toast.error(error.response?.data?.message || 'Failed to update cart')
        
       }
    }
    

    async function removeFromCart(id) {
         try {
        const {data} = await axios.get(`${server}/api/cart/remove/${id}`, {
            headers:{
                token: Cookies.get('token'),
                'Cache-Control': 'no-cache'
                
            }
        })

        toast.success(data.message)
        fetchCart()
         

        
       } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update cart')
        
       }
    }
    useEffect(() => {
        fetchCart()
    }, [fetchCart])
    return <CartContext.Provider value={{cart, totalItem, subTotal, loading, fetchCart, addtoCart, setTotalItem, updateCart, removeFromCart }}>{children}</CartContext.Provider>
}


export const CartData = () => useContext(CartContext)