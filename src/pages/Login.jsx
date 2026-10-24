import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { useState } from 'react'
import { UserData } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { Loader } from 'lucide-react'

const Login = () => {
    const [email, setEmail] = useState('')

    const navigate = useNavigate()

    const {loginUser, btnLoading} = UserData()
    const submitHandler = () => {
        loginUser(email, navigate)
    }
  return (
    <div className='min-h-[60vh]'>
        <Card className='md:w-[400px] sm:w-[300px] m-auto mt-5'>
            <CardHeader>
                <CardTitle>Enter Email to get Otp</CardTitle>
                <CardDescription>
                    If you have already got otp on mail than you can directly go to otp tab
                </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
             <div className='space-x-1'>
               <Label>Enter Email</Label>

               <Input type='email' value={email} onChange={e=>setEmail(e.target.value)}  />
             </div>
            </CardContent>

            <CardFooter>
                <Button disabled={btnLoading} onClick={submitHandler}>{btnLoading?<Loader />: "Submit"}</Button>
            </CardFooter>
        </Card>
    </div>
  )
}

export default Login
