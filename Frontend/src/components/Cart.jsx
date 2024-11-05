import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch cart items from the backend when the component mounts
    const fetchCartItems = async () => {
      try {
        const response = await fetch('http://localhost:3000/cart', {
          method: 'GET',
          credentials: 'include', // Include cookies for authentication
        });

        if (!response.ok) throw new Error('Failed to fetch cart items');

        const data = await response.json();
        setCartItems(data.products); // Assuming data.products contains the cart items
      } catch (err) {
        console.error(err);
        setError("Unable to load cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems(); // Call the fetch function here
  }, []); // Dependency array to run only on mount

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity >= 0) {
      try {
        const response = await fetch(`http://localhost:3000/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ productId: id, quantity: newQuantity }),
        });

        if (!response.ok) throw new Error("Failed to update quantity");

        setCartItems(cartItems.map(item =>
          item._id === id ? { ...item, quantity: newQuantity } : item
        ));
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    }
  };

  const removeItem = async (id) => {
    try {
      const response = await fetch('http://localhost:3000/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productId: id }), // Sending productId in the request body
        
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      const data = await response.json();
      // Update local state or handle the response accordingly
      setCartItems(cartItems.filter(item => item._id !== id)); // Update the local cart state
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price , 0);
  };

  if (loading) return <div>Loading cart...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-purple-400">Your Cart</h1>
        {cartItems.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-xl mb-4">Your cart is empty</p>
              <Link to="/home">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {cartItems.map((item) => (
              <Card key={item._id} className="mb-4 bg-gray-800 border-gray-700">
                <CardContent className="p-4 flex items-center">
                  <img src={`http://localhost:3000${item.image}`} alt={item.name} className="w-24 h-24 object-cover rounded mr-4" />
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-purple-400">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center">
                    
                    
                    
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItem(item._id)}
                      className="ml-4"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="mt-8 bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span>Subtotal</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-purple-400">${calculateTotal().toFixed(2)}</span>
              </CardFooter>
            </Card>
            <div className="mt-8 flex justify-between">
              <Link to="/home">
                <Button variant="outline" className="text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
