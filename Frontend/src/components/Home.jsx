import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, LogOut, Plus, Home, Package } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [message, setMessage] = useState('');
  const [cartProductIds, setCartProductIds] = useState(new Set()); // State for cart product IDs

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/home', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Error fetching user data: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched User Data:", data);
        setUser(data.user);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setUserError(err.message);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  // Add product to cart
  const addToCart = async (productId) => {
    try {
      const response = await fetch(`http://localhost:3000/addtocart/${productId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message); // Display the error message from the backend
        return;
      }

      const data = await response.json();
      console.log(data.message); // Successfully added to cart
      setCartProductIds(prev => new Set(prev).add(productId)); // Add product ID to the cartProductIds set
      setMessage(data.message); // Set success message
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Fetch products data on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/products/', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched Products Data:", data);
        setProducts(data || []);
      } catch (err) {
        setProductsError(err.message);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  if (loadingUser) return <div>Loading user data...</div>;
  if (userError) return <div>Error: {userError}</div>;
  if (loadingProducts) return <div>Loading products...</div>;
  if (productsError) return <div>Error fetching products: {productsError}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-purple-400">Scatch</Link>
          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:text-purple-400 transition-colors">
              <Home className="h-6 w-6" />
              <span className="sr-only">Home</span>
            </Link>
            <Link to="/products" className="hover:text-purple-400 transition-colors">
              <Package className="h-6 w-6" />
              <span className="sr-only">Products</span>
            </Link>
            <Link to="/cart" className="hover:text-purple-400 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              <span className="sr-only">Cart</span>
            </Link>
            <Button variant="ghost" size="icon" className="hover:text-purple-400 transition-colors">
              <LogOut className="h-6 w-6" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4 flex">
        {/* Sidebar */}
        <aside className="w-64 pr-8">
          <h2 className="text-xl font-semibold mb-4 text-purple-400">Categories</h2>
          <ul className="space-y-2">
            <li><Link to="#" className="hover:text-purple-400 transition-colors">All Products</Link></li>
            <li><Link to="#" className="hover:text-purple-400 transition-colors">Totes</Link></li>
            <li><Link to="#" className="hover:text-purple-400 transition-colors">Clutches</Link></li>
            <li><Link to="#" className="hover:text-purple-400 transition-colors">Backpacks</Link></li>
            <li><Link to="#" className="hover:text-purple-400 transition-colors">Evening Bags</Link></li>
          </ul>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-8 text-purple-400">Featured Products</h1>
          {message && <p className="text-green-400 mb-4">{message}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product._id} className="bg-gray-800 border-gray-700 text-white">
                <CardContent className="p-4">
                  <img
                    src={`http://localhost:3000${product.image}`}
                    alt={product.name}
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                  <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                  <p className="text-purple-400 font-bold">${product.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="bg-gray-700 p-4">
                  <Button
                    onClick={() => addToCart(product._id)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={cartProductIds.has(product._id)} // Disable button if product is already added
                  >
                    {cartProductIds.has(product._id) ? "Added" : <><Plus className="mr-2 h-4 w-4" /> Add to Cart</>}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
