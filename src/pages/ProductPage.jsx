import React, { useEffect, useState } from 'react'
import { ProductData } from '../context/ProductContext'
import { useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel'
import { UserData } from '../context/UserContext'
import { Button } from '../components/ui/button'
import ProductCard from '../components/ProductCard'
import { CartData } from '../context/CartContext'
import axios from 'axios'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import { Edit, Loader, X } from 'lucide-react'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { categories } from '../assets/assets'
import { server } from '../main'

const ProductPage = () => {
  const {fetchProduct, product, relatedProduct, loading} = ProductData()
  const {addtoCart} = CartData()
  
  

  const {id} = useParams()

  const {isAuth, user} = UserData()
  

  useEffect(()=>{
    fetchProduct(id)
  }, [id])

  const addToCartHandler = () => {
     addtoCart(id)
  }

  const [show, setShow] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [stock, setStock] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')

  const [btnLoading, setBtnLoading] = useState(false)


  const updateHandler = () => {
    setShow((currentShow) => !currentShow)
    if (!product) return
    setCategory(product.category)
    setTitle(product.title)
    setDescription(product.description)
    setStock(product.stock)
    setPrice(product.price)
  }

  const submitHandler = async (e) => {
   e.preventDefault()
   setBtnLoading(true)

   try {
    const {data} = await axios.put(`${server}/api/product/update/${id}`,{title, description, price, stock, category},{
        headers:{
            token:Cookies.get('token')
        }
    })

    toast.success(data.message)
    fetchProduct(id)
    setShow(false)
    
   } catch (error) {
    console.error('Failed to update product:', error)
    toast.error(error.response?.data?.message || 'Could not update product. Please try again.')
   } finally {
    setBtnLoading(false)
   }
  }

  const [updatedImages, setUpdatedImages] = useState([])

  const handleSubmitImage = async(e) => {
    e.preventDefault()
    const form = e.currentTarget

    if (updatedImages.length === 0) {
      toast.error('Please select at least one image.')
      return
    }

    setBtnLoading(true)
    const formData = new FormData()

    for (let i = 0; i < updatedImages.length; i++) {
      formData.append('images', updatedImages[i])
    }

    try {
      const { data } = await axios.post(`${server}/api/product/imgupdate/${id}`, formData, {
        headers: { token: Cookies.get('token') }
      })

      toast.success(data.message)
      setUpdatedImages([])
      form.reset()
      await fetchProduct(id)
    } catch (error) {
      console.error('Failed to update product images:', error)
      toast.error(error.response?.data?.message || 'Could not update product images. Please try again.')
    } finally {
      setBtnLoading(false)
    }
  }
  return (
    
    <div>
        {loading?(
            <Loading/>):(
            <div className='container mx-auto px-4 py-8'>
                {user && user.role === 'admin' && ( <div className='w-[300px ] md:w-[450px] m-auto mb-5'>
                    <Button onClick={updateHandler}>{show?<X/>:<Edit />}</Button>
                    {show && ( <form onSubmit={submitHandler} className='space-y-4'>
                        <div>
                           <Label>Title</Label>
                           <Input
                            placeholder='Product Title' 
                            value={title} 
                            onChange={e=>setTitle(e.target.value)} 
                            required 
                            />
                        </div>
                        <div>
                           <Label>Description</Label>
                           <Input
                            placeholder='Product Description' 
                            value={description} 
                            onChange={e=>setDescription(e.target.value)} 
                            required 
                            />
                        </div>
                        <div>
                           <Label>Category</Label>
                           <select value={category} onChange={e=>setCategory(e.target.value)} required className='w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white'>
                            {
                                categories.map((e)=>(
                                    <option value={e} key={e}>{e}</option>
                                ))
                            }
                           </select>
                        </div>
                        <div>
                           <Label>Price</Label>
                           <Input
                            placeholder='Product Price' 
                            type='number'
                            value={price} 
                            onChange={e=>setPrice(e.target.value)} 
                            required 
                            />
                        </div>
                        <div>
                           <Label>Stock</Label>
                           <Input
                            placeholder='Product Stock' 
                            type='number'
                            value={stock} 
                            onChange={e=>setStock(e.target.value)} 
                            required 
                            />
                        </div>
                        <Button type='submit' className='w-full' disabled={btnLoading}>
                            {
                                btnLoading?<Loader/> : 'Update Product'
                            }
                            
                            </Button>
                    </form>
                    )}
                    </div>)}
                {product && (
                    <div className='grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-10'>
                       <div className='min-w-0 overflow-hidden rounded-md bg-white'>
                        <Carousel>
                            <CarouselContent>
                                {product.images && product.images.map((image, index)=>(
                                    <CarouselItem key={index}>
                                        <img src={image.url} alt='image'
                                        className='aspect-square w-full object-contain' />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>

                        {user && user.role === 'admin' &&(
                            <form onSubmit={handleSubmitImage} className='flex flex-col gap-4'>
                            <div>
                            <Label>Upload New Images:</Label>
                            <Input type='file' name='images' id='product-images' multiple
                            accept='image/*'
                            onChange={e => setUpdatedImages(Array.from(e.target.files || []))}
                            className='block w-full mt-1 text-sm'
                            />
                            <Button type='submit' disabled={btnLoading || updatedImages.length === 0}>
                              {btnLoading ? <Loader className='animate-spin' /> : 'Update Images'}
                            </Button>
                            </div>
                            </form>)}
                       </div>
                       <div className='min-w-0 space-y-4'>
                        <h1 className='text-2xl font-bold'>{product.title}</h1>
                        <p className='text-lg'>{product.description}</p>
                        <p className='text-xl font-semibold'>₨{product.price}</p>
                        {
                            isAuth ? ( 
                            <>
                            {product.stock <= 0 ? ( 
                                <p className='text-red-600
                            text-2xl '>Out of stock</p>
                        ):(
                          <Button onClick={addToCartHandler}>Add to cart</Button>

                            )}
                            </>
                            ) :( 
                            <p className='text-blue-500'>Please Login to add something in cart</p>
                        )}
                       </div>
                    </div>
                    )}
                    </div>
                    )}

                    {relatedProduct?.length>0 && <div className='mt-12'>
                        <h2 className='text-xl font-bold'>Related Products</h2>
                        <div className='mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid grid-cols-3 lg:grid-cols-4 gap-2'>
                            {relatedProduct.map(e=>(
                               <ProductCard key={e._id} product={e} />
                            ))}
                        </div>
                        </div>}
                    </div>
    )
}

export default ProductPage





















