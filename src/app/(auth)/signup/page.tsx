import { RegisterForm } from "@/features/auth/components/register-form"
import { requireUnAuth } from "@/lib/auth-utils"

export default async function Component() {
    await requireUnAuth();
    return (<>
        <RegisterForm />
    </>)    
}