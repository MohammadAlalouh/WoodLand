import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import tshirtImage from "@/assets/product-tshirt.jpg";
import hoodieImage from "@/assets/product-hoodie.jpg";
import capImage from "@/assets/product-cap.jpg";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

const Shop = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const products: Product[] = [
    {
      id: "1",
      name: "Conservation T-Shirt",
      price: 29.99,
      image: tshirtImage,
      description: "Eco-friendly cotton t-shirt with woodland logo. Comfortable and sustainable.",
    },
    {
      id: "2",
      name: "Earth Hoodie",
      price: 59.99,
      image: hoodieImage,
      description: "Warm organic cotton hoodie perfect for outdoor adventures.",
    },
    {
      id: "3",
      name: "Forest Cap",
      price: 24.99,
      image: capImage,
      description: "Embroidered baseball cap with tree logo. One size fits all.",
    },
    {
      id: "4",
      name: "Trail Pants",
      price: 79.99,
      image: tshirtImage,
      description: "Durable outdoor pants designed for hiking and conservation work.",
    },
    {
      id: "5",
      name: "Nature Tote Bag",
      price: 19.99,
      image: capImage,
      description: "Reusable canvas tote bag for everyday use. Reduce plastic waste!",
    },
    {
      id: "6",
      name: "Conservation Mug",
      price: 14.99,
      image: hoodieImage,
      description: "Insulated travel mug to keep your beverages hot or cold.",
    },
  ];

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("woodlandCart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("woodlandCart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    toast.success(`${product.name} added to cart!`);
  };

  const updateQuantity = (id: string, change: number) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
    toast.success("Item removed from cart");
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Conservation Shop</h1>
            <p className="text-lg text-muted-foreground">
              Support our mission with every purchase. All proceeds go toward forest conservation.
            </p>
          </div>

          <Button
            onClick={() => setShowCart(!showCart)}
            className="relative bg-accent text-accent-foreground"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Cart
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground w-6 h-6 rounded-full text-xs flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Button>
        </div>

        {/* Shopping Cart Sidebar */}
        {showCart && (
          <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-card shadow-strong z-50 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Cart</h2>
              <Button variant="ghost" onClick={() => setShowCart(false)}>
                ✕
              </Button>
            </div>

            {cart.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{item.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              ${item.price.toFixed(2)}
                            </p>
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="h-8 w-8"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="h-8 w-8"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => removeFromCart(item.id)}
                                className="h-8 w-8 ml-auto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span>Total:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <Button className="w-full bg-gradient-forest text-primary-foreground">
                    Proceed to Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card
              key={product.id}
              className="overflow-hidden shadow-medium hover:shadow-strong transition-all duration-300 hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-2xl font-bold text-accent mb-3">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-muted-foreground text-sm mb-4">
                  {product.description}
                </p>
                <Button
                  onClick={() => addToCart(product)}
                  className="w-full bg-gradient-forest text-primary-foreground"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
