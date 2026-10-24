import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'

const ProductCard = ({ product, latest }) => {
  if (!product) {
    return null
  }


  const imageUrl = product.images?.[0]?.url
  
  const navigate = useNavigate()
  return (
    <article className='relative mx-auto flex h-full w-full max-w-[300px] flex-col overflow-hidden rounded-lg border bg-card shadow-md'>
      <Link to={`/products/${product._id}`} className='block flex-1'>
        <div className='relative flex h-64 items-center justify-center overflow-hidden bg-muted'>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.title || 'Product'}
              className='h-full w-full object-contain transition-transform duration-300 hover:scale-105'
            />
          ) : (
            <span className='text-sm text-muted-foreground'>No image available</span>
          )}
          {latest === 'yes' && (
            <span className='absolute left-2 top-2 rounded bg-green-600 px-2 py-1 text-xs font-medium text-white'>
              Latest
            </span>
          )}
        </div>
        <div className='p-4'>
          <h2 className='truncate font-medium'>{product.title}</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
           ₨ {Number(product.price).toFixed(2)}
          </p>
        </div>
        <div className='p-4'>
          <p className='break-words whitespace-pre-wrap text-sm leading-relaxed'>
            {product.description || 'No description available.'}
          </p>
        </div>
      </Link>
      <div className='mt-auto flex justify-center p-4 pt-0'>
        <Button className='w-full' onClick={() => navigate(`/products/${product._id}`)}>
          View Product
        </Button>
      </div>
    </article>
  )
}

export default ProductCard