"use client";

import ActionButton from "@/components/ActionButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductStatus } from "@/drizzle/schema";
import { formatPlural, formatPrice } from "@/lib/formatters";
import { EyeIcon, LockIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { deleteProduct } from "../actions/products";

function ProductTable({
  products,
}: {
  products: {
    id: string;
    name: string;
    status: ProductStatus;
    priceInDollars: number;
    description: string;
    imageUrl: string;
    courseCount: number;
    customerCount: number;
  }[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            {formatPlural(products.length, {
              singular: "product",
              plural: "products",
            })}
          </TableHead>
          <TableHead>Customers</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="flex items-center gap-4">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={192}
                  height={192}
                  className="object-cover rounded-none size-12"
                />
                <div className="flex flex-col gap-1">
                  <div className="font-semibold">{product.name}</div>
                  <div className="text-muted-foreground">
                    {formatPlural(product.courseCount, {
                      singular: "product",
                      plural: "products",
                    })}{" "}
                    · {formatPrice(product.priceInDollars)}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>{product.customerCount}</TableCell>
            <TableCell>
              <Badge className="inline-flex items-center gap-2">
                {getStatusIcon(product.status)}
                {product.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                </Button>
                <ActionButton
                  variant="destructiveOutline"
                  action={deleteProduct.bind(null, product.id)}
                  requiredAreyouSure
                >
                  <Trash2Icon />
                  <span className="sr-only">Delete</span>
                </ActionButton>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ProductTable;

function getStatusIcon(status: ProductStatus) {
  const Icon = {
    public: EyeIcon,
    private: LockIcon,
  }[status];

  return <Icon className="size-4" />;
}
