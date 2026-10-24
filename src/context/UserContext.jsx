import axios from 'axios'
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import {createContext} from 'react'
import toast, {Toaster} from 'react-hot-toast'
import { server } from '../main'
import Cookies from 'js-cookie'



const UserContext = createContext()

export const UserProvider = ({children}) => {
    const [user, setUser] = useState([])
    const [loading, setLoading] = useState(true)
    const [btnLoading, setBtnLoading] = useState(false)
    const [isAuth, setIsAuth] = useState(false)

    async function loginUser(email, navigate){
        const normalizedEmail = email.trim().toLowerCase()
        if (!normalizedEmail) {
            toast.error('Enter your email address to continue.')
            return
        }

        setBtnLoading(true)
        try {
            const {data} = await axios.post(
                `${server}/api/user/login`,
                { email: normalizedEmail },
                { timeout: 20000 }
            )

            toast.success(data.message)
            localStorage.setItem('email', normalizedEmail)
            navigate('/verify')
        } catch (error) {
            console.error('Failed to request login OTP:', error)
            toast.error(
                error.response?.data?.message ||
                (error.code === 'ECONNABORTED'
                    ? 'The login request timed out. Check the server email configuration and try again.'
                    : 'Could not send the login code. Please try again.')
            )
        } finally {
            setBtnLoading(false)
        }
    }

     async function verifyUser(otp, navigate){
        setBtnLoading(true)
        const email = localStorage.getItem('email')
        try {
            const {data} = await axios.post(`${server}/api/user/verify`,{email, otp})

            toast.success(data.message)
            localStorage.clear()
            navigate('/')
            setBtnLoading(false)
            setIsAuth(true)
            setUser(data.user)
            
            Cookies.set('token', data.token,{
                expires: 15,
                secure: true,
                path:'/'
            })
        } catch (error) {
            console.error('Failed to verify login OTP:', error)
            toast.error(error.response?.data?.message || 'Could not verify the login code. Please try again.')
            setBtnLoading(false)
        }
    }

    async function fetchUser(){
        const token = Cookies.get('token')

        if (!token) {
            setIsAuth(false)
            setLoading(false)
            return
        }

        try{
            const {data} = await axios.get(`${server}/api/user/me`,{
                headers:{
                    token,
                    'Cache-Control': 'no-cache'
                },
                timeout: 10000
            })

            setIsAuth(true)
            setUser(data.user)
        }catch(error){
            console.error('Failed to fetch the current user:', error)
            setIsAuth(false)
            setUser([])
        }finally{
            setLoading(false)
        }
    }

    function logoutUser(navigate, setTotalItem){
        Cookies.set('token', null)
        setUser([])
        setIsAuth(false)
        navigate('/login')
        toast.success("Logged Out")
        setTotalItem(0)
    }

    useEffect(()=>{
        fetchUser()
    }, [])
    return <UserContext.Provider value={{ user, loading, btnLoading, isAuth, loginUser, verifyUser, logoutUser }}>
        {children}
        <Toaster />
    </UserContext.Provider>
}


export const UserData = () => useContext(UserContext)
