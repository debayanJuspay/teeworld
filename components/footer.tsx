import Link from "next/link";
import { Globe, MessageCircle, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link href="/" className="text-lg font-bold">
              Tee<span className="text-primary">World</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Premium streetwear for the bold and authentic. Crafted with passion, worn with pride.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="p-2 hover:bg-muted rounded-full transition-colors">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 hover:bg-muted rounded-full transition-colors">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 hover:bg-muted rounded-full transition-colors">
                <Share2 className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-foreground">All Products</Link></li>
              <li><Link href="/products?sort=new" className="hover:text-foreground">New Arrivals</Link></li>
              <li><Link href="/products?sort=sale" className="hover:text-foreground">Sale</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/contact" className="hover:text-foreground">Contact Us</Link></li>
              <li><Link href="/orders" className="hover:text-foreground">Track Order</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-foreground">Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>business.teeworld@gmail.com</li>
              <li>+91 96093 84607</li>
              <li>Sutragarh, Lankapara, Santipur, Nadia, WB</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TeeWorld. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
