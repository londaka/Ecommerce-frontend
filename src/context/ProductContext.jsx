import axios from "axios";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { server } from "../main";

const productContext = createContext()

export const ProductProvider = ({children}) => {
    const [products, setProducts] = useState([])
    const [newProd, setNewProd] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')
    const [price, setPrice] = useState('')
    const [categories, setCategories] = useState([])

    const fetchProducts = useCallback(async () => {
        setLoading(true)
        try {
            const {data} = await axios.get(`${server}/api/product/all`, {
                params: { search, category, sortByPrice: price, page },
            })

            setProducts(data.products)
            setNewProd(data.newProduct)
            setCategories(data.categories)
            setTotalPages(data.totalPages)
            setLoading(false)
            
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }, [search, category, price, page])

    const [product, setProduct] = useState(null)
    const [relatedProduct, setRelatedProduct] = useState([])
    const [productLoading, setProductLoading] = useState(false)

    async function fetchProduct(id){
        setProductLoading(true)
        setProduct(null)
        setRelatedProduct([])
        try {
           const {data} = await axios.get(`${server}/api/product/single/${id}`)
           setProduct(data.product)
           setRelatedProduct(data.relatedProduct)
           setLoading(false)
        } catch (error) {
             console.log(error)
        } finally {
            setProductLoading(false)
        }
    }

    
    
    useEffect(()=>{
        fetchProducts()
    }, [fetchProducts])
    return <productContext.Provider value={{loading, newProd, products, search, setSearch, categories, category, setCategory, totalPages, price, setPrice, page, setPage, fetchProducts, fetchProduct, product, relatedProduct, productLoading}}>{children}</productContext.Provider>
}

export const ProductData = () => useContext(productContext)
