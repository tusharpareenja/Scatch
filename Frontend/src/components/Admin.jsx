'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ReloadIcon, UploadIcon } from "@radix-ui/react-icons"

export default function AdminProductUpload() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false) // State to check if the user is admin
  const [userLoading, setUserLoading] = useState(true) // State to track user loading

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch('http://localhost:3000/users/current', {
          method: 'GET',
          credentials: 'include', // Include credentials if needed
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user role.');
        }

        const userData = await response.json();
        setIsAdmin(userData.role === 'admin'); // Check if the user's role is admin
      } catch (err) {
        setError(err.message || 'Failed to fetch user role. Please try again.');
      } finally {
        setUserLoading(false); // Set loading to false after fetching
      }
    };

    fetchUserRole();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
  
    const form = event.currentTarget;
    const formData = new FormData(form);
  
    try {
      const response = await fetch('http://localhost:3000/products/add', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include credentials if needed
      });
  
      if (!response.ok) {
        const errorResponse = await response.json(); // Get error message from the server
        throw new Error(errorResponse.message || 'Failed to upload product.');
      }
  
      const result = await response.json(); // Assuming the response returns JSON
      setSuccess('Product uploaded successfully!');
      form.reset();
      setImagePreview(null);
    } catch (err) {
      setError(err.message || 'Failed to upload product. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (userLoading) {
    return <div>Loading...</div>; // Optional loading state
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <h2 className="text-xl font-bold text-red-500">You do not have permission to access this page.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Card className="max-w-2xl mx-auto bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-purple-400">Upload New Product</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-green-800 border-green-600">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <Input 
                id="image" 
                name="image" 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="bg-gray-700 text-white"
                required 
              />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Product preview" className="max-w-full h-auto max-h-48 rounded" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Elegant Tote Bag" 
                className="bg-gray-700 text-white"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input 
                id="price" 
                name="price" 
                type="number" 
                step="0.01" 
                min="0" 
                placeholder="299.99" 
                className="bg-gray-700 text-white"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="A luxurious tote bag perfect for any occasion..." 
                className="bg-gray-700 text-white"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input 
                id="discount" 
                name="discount" 
                type="number" 
                step="1" 
                min="0" 
                max="100" 
                placeholder="10" 
                className="bg-gray-700 text-white"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Upload Product
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
