import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './components/theme-provider.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { ProductProvider } from './context/ProductContext.jsx'
import { CartProvider } from './context/CartContext.jsx'

export const server = "https://ecommerce-server-1-qvg5.onrender.com"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
    <UserProvider>
      <ProductProvider>
        <CartProvider>
           <App />
       </CartProvider>
       </ProductProvider>
    </UserProvider>
    </ThemeProvider>
  </StrictMode>,
)
