"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { formatCurrency } from "@/lib/utils";
import { Cart, CartItem } from "@/types";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const [pendingItems, setPendingItems] = useState(new Set());
  const [currentItem, setCurrentItem] = useState(-1);
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleRemove = (productId: string, index: number) => {
    startTransition(async () => {
      setPendingItems((prev) => new Set(prev).add(productId));
      const res = await removeItemFromCart(productId);
      if (!res.success) {
        toast({ variant: "destructive", description: res.message });
      }
      setPendingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    });
    setCurrentItem(index);
  };

  const handleAdd = (item: CartItem, index: number) => {
    startTransition(async () => {
      setPendingItems((prev) => new Set(prev).add(item.productId));
      const res = await addItemToCart(item);
      if (!res.success) {
        toast({ variant: "destructive", description: res.message });
      }
      setPendingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.productId);
        return newSet;
      });
    });
    setCurrentItem(index);
  };

  return (
    <>
      <h2 className="py-4 h2">
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          "Shopping Cart"
        )}
      </h2>
      {!cart || cart.items.length === 0 ? (
        <div>
          <Link href="/">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item, index) => (
                  <TableRow key={item.productId}>
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex items-center justify-center gap-2">
                      <Button
                        disabled={pendingItems.has(item.productId)}
                        variant="outline"
                        type="button"
                        onClick={() => handleRemove(item.productId, index)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      {pendingItems.has(item.productId) ||
                      (isPending && currentItem === index) ? (
                        <Loader className="w-4 p-4 text-black animate-spin" />
                      ) : (
                        <span>{item.qty}</span>
                      )}
                      <Button
                        disabled={pendingItems.has(item.productId)}
                        variant="outline"
                        type="button"
                        onClick={() => handleAdd(item, index)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">${item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className="p-4 gap-4">
              <div className="pb-3 text-xl flex justify-between">
                SubTotal ({cart.items.reduce((acc, curr) => acc + curr.qty, 0)}
                ):
                <span className="font-bold text-green-500">
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>
              <Button
                className="w-full"
                disabled={isPending}
                onClick={() =>
                  startTransition(() => router.push("/shipping-address"))
                }
              >
                <ArrowRight className="w-4 h-4" /> Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
