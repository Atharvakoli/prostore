"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithCredentails } from "@/lib/actions/user.actions";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const CredentailsSigninForm = () => {
  const [data, action] = useActionState(signInWithCredentails, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignInbutton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? "Signing In..." : "Sign In"}
      </Button>
    );
  };
  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={signInDefaultValues.email}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="password"
            defaultValue={signInDefaultValues.password}
            required
          />
        </div>
        {/* <div>
          <Button className="w-full " variant="default">
            Sign In
          </Button>
        </div> */}
        <div>
          <SignInbutton />
        </div>
        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}
        <div className="text-em text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" target="_self" className="link">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentailsSigninForm;
