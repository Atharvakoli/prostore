"use client";

import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart, CartItem } from "@/types";
import { Plus, Minus, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      toast({
        description: res.message,
        action: (
          <ToastAction
            className="bg-primary text-white hover:bg-gray-800"
            altText="Go to Cart"
            onClick={() => router.push("/cart")}
          >
            Go To Cart
          </ToastAction>
        ),
      });
    });
  };

  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      toast({
        variant: res.success ? "default" : "destructive",
        description: res.message,
      });
      return;
    });
  };

  return existItem ? (
    <div className="flex align-middle gap-2 ">
      <Button
        className="w-full"
        type="button"
        variant="outline"
        onClick={handleRemoveFromCart}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="p-2 text-black bg-green-400 rounded-full">
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          existItem.qty
        )}
      </span>
      <Button className="w-full" type="button" onClick={handleAddToCart}>
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}{" "}
      Add to cart
    </Button>
  );
};

export default AddToCart;
