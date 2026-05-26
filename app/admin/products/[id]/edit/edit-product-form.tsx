"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateProduct } from "../../../actions";
import ProductForm from "../../_components/product-form";
import type { Product } from "@/types";

interface EditProductFormProps {
  product: Product;
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setSubmitting(true);
    await updateProduct(product.id, formData);
    setSubmitting(false);
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold">Edit Product</h1>
      </div>
      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}
