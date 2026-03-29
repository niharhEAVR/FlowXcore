"use client"


import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Label } from "@/components/ui/label"




import { Input } from "@/components/ui/input"
import { auth } from "@/lib/auth"
import { cn } from "@/lib/utils"

import { authClient } from "@/lib/auth-client"

import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"



const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(5, "Password is required"),
})


type loginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
    const router = useRouter();

    const form = useForm<loginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })


    const onSubmit = async (values: loginFormValues) => {
        await authClient.signIn.email({
            email: values.email,
            password: values.password,
            callbackURL: "/",
        }, {
            onSuccess: () => {
                router.push("/")
            },
            onError: (x) => {
                toast.error(x.error.message);
            }
        })
    }



    const isPending = form.formState.isSubmitting;

    const [showPassword, setShowPassword] = useState(false)


    return (
        <div className="flex flex-col gap-6 ">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>
                        Login to Continue
                    </CardDescription>
                    {/* <CardAction>
                        <Button variant="link">Sign Up</Button>
                    </CardAction> */}
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-6">
                                <div className="flex flex-col gap-4">
                                    <Button variant={"outline"} className="w-full" type="button" disabled={isPending}>
                                        <Image alt="github" src={"/github.svg"} height={20} width={20} />
                                        Continue With Github</Button>
                                    <Button variant={"outline"} className="w-full" type="button" disabled={isPending}>
                                        <Image alt="google" src={"/google.svg"} height={20} width={20} />
                                        Continue With Google</Button>
                                </div>
                                <div className="relative flex items-center">
                                    <div className="grow border-t border-black" />
                                    <span className="mx-4 text-muted-foreground">or</span>
                                    <div className="grow border-t border-black" />
                                </div>

                                <div className="grid gap-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="cooldude@gmail.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />





                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="cooldude@231"
                                                            {...field}
                                                            className="pr-10"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword((prev) => !prev)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                            tabIndex={-1}
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff size={18} />
                                                            ) : (
                                                                <Eye size={18} />
                                                            )}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />












                                    <Button type="submit" className="w-full" disabled={isPending}>
                                        Login
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Don't have an account?{" "}
                                    <Link href={"/signup"} className="hover:underline underline-offset-4">
                                        Sign up
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

        </div>
    )


}