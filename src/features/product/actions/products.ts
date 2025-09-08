"use server";

import z from "zod/v3";
import { productSchema } from "./../schema/products";
import { getCurrentUser } from "@/services/clerk";

import {
  canCreateProduct,
  canDeleteProduct,
  canUpdateProduct,
} from "../permissions/products";
import {
  insertProduct,
  updateProduct as updateProductDb,
  deleteProduct as deleteProductDb,
} from "../db/products";
import { redirect } from "next/navigation";

export async function createProduct(unsafeData: z.infer<typeof productSchema>) {
  const { success, data } = productSchema.safeParse(unsafeData);

  if (!success || !canCreateProduct(await getCurrentUser())) {
    return { error: true, message: "There was an error creating your product" };
  }

  await insertProduct(data);

  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  unsafeData: z.infer<typeof productSchema>
) {
  const { success, data } = productSchema.safeParse(unsafeData);

  if (!success || !canUpdateProduct(await getCurrentUser())) {
    return {
      error: true,
      message: "There was an error updating your product!",
    };
  }

  await updateProductDb(id, data);

  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  if (!canDeleteProduct(await getCurrentUser())) {
    return {
      error: true,
      message: "Error Deleting your product !",
    };
  }

  await deleteProductDb(id);

  return {
    error: false,
    message: "successfully deleted your product !",
  };
}
