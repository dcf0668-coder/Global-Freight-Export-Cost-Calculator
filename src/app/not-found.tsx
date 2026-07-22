import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <Compass className="mb-4 h-12 w-12 text-muted-foreground" />
      <h1 className="mb-2 text-3xl font-bold">Page Not Found</h1>
      <p className="mb-6 max-w-md text-muted-foreground">
        The page you're looking for doesn't exist. Try one of our calculators instead.
      </p>
      <Button asChild>
        <Link href="/calculator">Go to Freight Calculator</Link>
      </Button>
    </div>
  );
}
