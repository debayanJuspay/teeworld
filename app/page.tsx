import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product-card";
import { createPublicClient } from "@/lib/supabase/public";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createPublicClient();

  const { data: featured } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Wear Your Story with{" "}
                <span className="text-primary">Tee World</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Discover a world where fashion meets individuality. At Tee World, we craft timeless designs that celebrate your unique personality.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" className="gap-2">
                    Shop Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/products?sort=new">
                  <Button size="lg" variant="outline">
                    New Arrivals
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative h-[480px]">
                <div className="absolute top-0 right-0 w-[280px] h-[380px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://jbpuzaxunjsbbagtlwzj.supabase.co/storage/v1/object/tees/1780074162391-b3of8yre.png"
                    alt="Fashion model"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute bottom-0 left-12 w-[200px] h-[260px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                  <Image
                    src="https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=500&fit=crop"
                    alt="Fashion detail"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-12 left-0 w-12 h-12 grid grid-cols-3 gap-1 opacity-30">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-primary rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative text */}
        <div className="hidden xl:block absolute -bottom-4 left-0 right-0 overflow-hidden pointer-events-none">
          <p className="text-[120px] font-bold text-muted/20 whitespace-nowrap tracking-wider">
            GO WITH TREND
          </p>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">
            <span className="text-primary">New</span> Arrivals
          </h2>
          <p className="text-muted-foreground mt-2">Check out our latest drops</p>
        </div>

        {featured && featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No products yet. Add some products from the admin panel.
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/products">
            <Button variant="outline" size="lg" className="gap-2">
              View All Products <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
