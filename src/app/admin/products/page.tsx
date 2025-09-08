import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import {
  CourseProductTable,
  ProductTable as DbProductTable,
  PurchaseTable,
} from "@/drizzle/schema";
import ProductTable from "@/features/product/components/ProductTable";
import { getProductGlobalTag } from "@/features/product/db/cache";
import { asc, countDistinct, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";

export default async function ProductPage() {
  const products = await getProducts();
  return (
    <div className="container my-6">
      <PageHeader title="Products">
        <Button asChild>
          <Link href="/admin/products/new">New Product</Link>
        </Button>
      </PageHeader>
      <ProductTable products={products} />
    </div>
  );
}

async function getProducts() {
  "use cache";
  cacheTag(getProductGlobalTag());

  return db
    .select({
      id: DbProductTable.id,
      name: DbProductTable.name,
      status: DbProductTable.status,
      priceInDollars: DbProductTable.priceInDollars,
      description: DbProductTable.description,
      imageUrl: DbProductTable.imageUrl,
      courseCount: countDistinct(CourseProductTable.courseId),
      customerCount: countDistinct(PurchaseTable.userId),
    })
    .from(DbProductTable)
    .leftJoin(PurchaseTable, eq(PurchaseTable.productId, DbProductTable.id))
    .leftJoin(
      CourseProductTable,
      eq(CourseProductTable.productId, DbProductTable.id)
    )
    .orderBy(asc(DbProductTable.name))
    .groupBy(DbProductTable.id);
}
