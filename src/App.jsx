import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Products from "./pages/Products"
import Cart from "./pages/Cart"
import Orders from "./pages/Orders"
import Navbar from "./components/ui/Navbar"
import Footer from "./components/ui/Footer"
import { UserData } from "./context/UserContext"
import Verify from "./pages/Verify"
import Loading from "./components/Loading"
import NotFound from "./pages/NotFound"
import ProductPage from "./pages/ProductPage"
import Checkout from "./pages/Checkout"
import EsewaPayment from "./pages/EsewaPayment"
import PaymentResult from "./pages/PaymentResult"
import OrderDetail from "./pages/OrderDetail"
import AdminDashboard from "./pages/AdminDashboard"

function App() {
  const { isAuth, loading, user } = UserData()
  
  return (
    <BrowserRouter>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/products' element={<Products />} />
            <Route path='/products/:id' element={<ProductPage />} />
            <Route path='/cart' element={isAuth ? <Cart /> : <Login />} />
            <Route path='/orders' element={isAuth?<Orders />: <Login />} />
            <Route path='/order/:id' element={isAuth ? <OrderDetail /> : <Login />} />
            <Route
              path='/admin/dashboard'
              element={
                isAuth && user?.role === 'admin'
                  ? <AdminDashboard />
                  : <Navigate to={isAuth ? '/' : '/login'} replace />
              }
            />
            <Route path='/checkout' element={isAuth ? <Checkout /> : <Login />} />
            <Route path='/payment/result' element={isAuth ? <PaymentResult /> : <Login />} />
            <Route path='/payment/:addressId' element={isAuth ? <EsewaPayment /> : <Login />} />
            <Route path='*' element={<NotFound/>} />
            <Route path='/login' element={isAuth ? <Home /> : <Login />} />
            <Route path='/verify' element={isAuth ? <Home /> : <Verify />} />
          </Routes>
          <Footer />
        </>
      )}
    </BrowserRouter>
  )
}

export default App