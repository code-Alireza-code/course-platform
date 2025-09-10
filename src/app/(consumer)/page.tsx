import { db } from "@/drizzle/db";
import { ProductTable } from "@/drizzle/schema";
import ProductCard from "@/features/product/components/ProductCard";
import { getProductGlobalTag } from "@/features/product/db/cache";
import { WherePublicProducts } from "@/features/product/permissions/products";
import { asc } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export default async function HomePage() {
  const products = await getPublicProducts();

  return (
    <div className="container my-6">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}

async function getPublicProducts() {
  "use cache";

  cacheTag(getProductGlobalTag());

  return db.query.ProductTable.findMany({
    columns: {
      id: true,
      name: true,
      description: true,
      priceInDollars: true,
      imageUrl: true,
    },
    where: WherePublicProducts,
    orderBy: asc(ProductTable.name),
  });
}
