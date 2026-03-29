import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (<><div className="bg-muted flex min-h-svh flex-col justify-center gap-6 p-6 md:p-10 items-center">
        <div className="flex w-full max-w-sm flex-col ga-6">
            <Link href={"/"} className="flex items-center gap-2 self-center font-medium">
                <Image alt="nodebase" src={"/logo.svg"} height={30} width={30} />
                Nodebase
            </Link>
            {children}
        </div>
    </div>
    </>);
}
