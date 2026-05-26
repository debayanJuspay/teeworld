"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
  sizes: string[];
  colors: string[];
}

export default function AddToCartButton({ product, sizes, colors }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, 1, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Size selector */}
      <div>
        <label className="text-sm font-medium mb-2 block">Size</label>
        <div className="flex gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-10 h-10 rounded-md border text-sm font-medium transition-colors ${
                selectedSize === size
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input hover:bg-muted"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color selector */}
      <div>
        <label className="text-sm font-medium mb-2 block">Color</label>
        <div className="flex gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${
                selectedColor === color
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input hover:bg-muted"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Add to cart */}
      <Button
        size="lg"
        className="w-full gap-2"
        onClick={handleAdd}
        disabled={product.stock <= 0}
      >
        {added ? (
          <>
            <Check className="h-4 w-4" /> Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" /> Add to Cart
          </>
        )}
      </Button>
    </div>
  );
}
