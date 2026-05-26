"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, LogOut, LayoutDashboard, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@/types";

const announcements = [
  "🚚 Free shipping on all orders above ₹50",
  "⚡ Flash sale — Limited stock remaining!",
];

function AnnouncementBar({ isAdmin }: { isAdmin: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeUntilMidnight());
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
  }

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="hidden md:flex items-center justify-between px-6 py-2.5 text-xs text-white bg-primary">
      <div className="flex items-center gap-4">
        <div
          key={currentIndex}
          className="min-w-[240px] animate-in fade-in duration-500"
        >
          {announcements[currentIndex]}
        </div>
        <span className="opacity-40">|</span>
        <div className="flex items-center gap-1 font-mono font-semibold">
          <span className="opacity-90">Ends in</span>
          <span className="bg-white/25 px-1.5 py-0.5 rounded min-w-[22px] text-center">
            {mounted ? pad(timeLeft.hours) : "--"}
          </span>
          <span className="opacity-70">:</span>
          <span className="bg-white/25 px-1.5 py-0.5 rounded min-w-[22px] text-center">
            {mounted ? pad(timeLeft.minutes) : "--"}
          </span>
          <span className="opacity-70">:</span>
          <span className="bg-white/25 px-1.5 py-0.5 rounded min-w-[22px] text-center">
            {mounted ? pad(timeLeft.seconds) : "--"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/orders" className="hover:text-white/80 transition-colors">
          Track Order
        </Link>
        {isAdmin && (
          <Link href="/admin" className="hover:text-white/80 transition-colors">
            Admin
          </Link>
        )}
      </div>
    </div>
  );
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/products?sort=new", label: "New Arrivals" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user as unknown as User);
        setIsAdmin(data.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL);
      }
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user as unknown as User);
        setIsAdmin(session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      {/* Announcement Bar */}
      <AnnouncementBar isAdmin={isAdmin} />

      {/* Main nav */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 max-w-7xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Tee<span className="text-primary">World</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("?")[0]))
                  ? "text-primary"
                  : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button onClick={openCart} className="relative p-2 hover:bg-muted rounded-full transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{user.user_metadata?.full_name || user.email}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button size="sm" className="hidden md:flex" onClick={handleSignIn}>
              Sign In
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-6 mt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-base font-medium ${
                      pathname === link.href ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="text-base font-medium text-foreground flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Admin Panel
                  </Link>
                )}
                <hr />
                {user ? (
                  <>
                    <div className="text-sm text-muted-foreground">
                      Signed in as {user.user_metadata?.full_name || user.email}
                    </div>
                    <Link
                      href="/orders"
                      onClick={() => setMobileOpen(false)}
                      className="text-base font-medium text-foreground flex items-center gap-2"
                    >
                      <Package className="h-4 w-4" /> My Orders
                    </Link>
                    <Button variant="outline" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" /> Sign Out
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleSignIn}>Sign In with Google</Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
