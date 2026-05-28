import { Suspense } from "react";
import ThankYou from "./thank-you";

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h1 className="text-xl font-semibold mb-2">Loading...</h1>
      </div>
    }>
      <ThankYou />
    </Suspense>
  );
}
