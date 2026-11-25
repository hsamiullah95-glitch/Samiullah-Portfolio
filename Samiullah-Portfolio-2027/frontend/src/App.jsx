
import { Routes, Route, Navigate } from 'react-router-dom';

import SiteLayout from './layouts/SiteLayout';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Tools from './pages/Tools';
import Blog from './pages/Blog';

import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

export default function App() {
  return (
    <Routes>
      {/* WEBSITE */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services/*" element={<Services />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />

        {/* MY PRODUCTS */}
        <Route path="/products" element={<Products />} />
        <Route path="/products/details/:id" element={<ProductDetails />} />
        <Route path="/products/*" element={<Products />} />

        {/* ONLINE TOOLS */}
        <Route path="/tools/*" element={<Tools />} />
      </Route>

      {/* ADMIN */}
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* PAGE NOT FOUND */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

