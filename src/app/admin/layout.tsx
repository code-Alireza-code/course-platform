import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { canAccessAdminPages } from "@/permissions/general";
import { getCurrentUser } from "@/services/clerk";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode, Suspense } from "react";

function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function Navbar() {
  return (
    <header className="flex h-12 shadow bg-background z-10">
      <nav className="flex gap-4 container">
        <div className="mr-auto flex items-center gap-2">
          <Link className="text-lg hover:underline" href="/">
            Web Dev Simplified
          </Link>
          <Badge className="rounded-sm">Admin</Badge>
        </div>
        <Suspense fallback={"Loading"}>
          <SignedIn>
            <AdminLink />
            <Link
              href="/admin/courses"
              className="hover:bg-accent/10 flex items-center px-2"
            >
              Courses
            </Link>
            <Link
              href="/admin/products"
              className="hover:bg-accent/10 flex items-center px-2"
            >
              Products
            </Link>
            <Link
              href="/admin/sales"
              className="hover:bg-accent/10 flex items-center px-2"
            >
              Sales
            </Link>
            <div className="size-8 self-center">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: { width: "100%", height: "100%" },
                  },
                }}
              />
            </div>
          </SignedIn>
        </Suspense>
        <Suspense>
          <SignedOut>
            <Button className="self-center" asChild>
              <SignInButton>Sign In</SignInButton>
            </Button>
          </SignedOut>
        </Suspense>
      </nav>
    </header>
  );
}

async function AdminLink() {
  const { role } = await getCurrentUser({ allData: true });
  if (!canAccessAdminPages(role)) return null;
  return (
    <Link href="/admin" className="hover:bg-accent/10 flex items-center px-2">
      Admin
    </Link>
  );
}

export default AdminLayout;
