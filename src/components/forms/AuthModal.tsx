import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {Loader2, Lock, Mail, User} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import InputField from "@/components/forms/InputField";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import {toast} from "sonner";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {GoogleIcon} from "@/components/icons/GoogleIcon";
import {EmailField, NameField, PasswordField} from "@/components/forms/fields";
import SocialAuth from "@/components/forms/SocialAuth";

interface AuthModalProps {
    trigger?: React.ReactNode;
    defaultTab?: "signin" | "signup";
    onSuccess?: () => void;
}

const defaultTrigger = (
    <Button variant="default">Sign In</Button>
);

export default function AuthModal({ trigger, defaultTab = 'signin', onSuccess }: AuthModalProps) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    const { signInEmail, signUpEmail } = useAuth();

    const { register: signInRegister, handleSubmit: signInHandleSubmit, formState: { errors: signInErrors }, clearErrors: clearSignInErrors, setError: setSignInError } = useForm<SignInFormData>({
        defaultValues: { email: "", password: "" },
        mode: "onBlur",
    });
    const { register: signUpRegister, handleSubmit: signUpHandleSubmit, formState: { errors: signUpErrors }, clearErrors: clearSignUpErrors, setError: setSignUpError } = useForm<SignUpFormData>({
        defaultValues: { email: "", password: "", name: "", confirmPassword: "" },
        mode: "onBlur",
    });

    const renderFieldError = (_name: string) => null;

    const handleSignin = signInHandleSubmit(async ({ email, password }) => {
        try {
            setLoading(true);
            clearSignInErrors();

            const res: any = await signInEmail(email, password, rememberMe);
            const user = res?.data?.user;
            if (user) {
                toast.success("Sign in Successfully");
                onSuccess?.();
                setOpen(false);
                return;
            }

            const errorPayload = res?.error ?? res?.details?.error ?? res;
            const message = (typeof errorPayload === "string" && errorPayload) || res?.message || "Unable to sign in";

            const emailErr = errorPayload?.properties?.email?.errors?.[0];
            const passwordErr = errorPayload?.properties?.password?.errors?.[0];

            if (emailErr) {
                setSignInError("email", { type: "server", message: emailErr });
            }
            if (passwordErr) {
                setSignInError("password", { type: "server", message: passwordErr });
            }

            if (!emailErr && !passwordErr) {
                toast.error(message);
            }
        } finally {
            setLoading(false);
        }
    });

    const handleSignup = signUpHandleSubmit(async ({ email, password, name }) => {
        try {
            setLoading(true);
            clearSignUpErrors();

            const res: any = await signUpEmail(email, password, name);
            const user = res?.data?.user;
            if (user) {
                toast.success("Sign up successfully");
                onSuccess?.();
                setOpen(false);
                return;
            }

            const errorPayload = res?.error ?? res?.details?.error ?? res;
            const message = (typeof errorPayload === "string" && errorPayload) || res?.message || "Unable to create account";

            const nameErr = errorPayload?.properties?.name?.errors?.[0];
            const emailErr = errorPayload?.properties?.email?.errors?.[0];
            const passwordErr = errorPayload?.properties?.password?.errors?.[0];

            if (nameErr) setSignUpError("name", { type: "server", message: nameErr });
            if (emailErr) setSignUpError("email", { type: "server", message: emailErr });
            if (passwordErr) setSignUpError("password", { type: "server", message: passwordErr });

            if (!nameErr && !emailErr && !passwordErr) {
                toast.error(message);
            }
        } finally {
            setLoading(false);
        }
    });

    // Reset form/server errors when switching tabs or dialog open state changes
    useEffect(() => {
        clearSignInErrors();
        clearSignUpErrors();
    }, [activeTab, open, clearSignInErrors, clearSignUpErrors]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Join NovelAPP</DialogTitle>
                    <DialogDescription>
                        Sign in to your account or create a new one to start commenting and
                        track your reading progress.
                    </DialogDescription>
                </DialogHeader>

                <Tabs
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as "signin" | "signup")}
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    {/* Sign In Tab */}
                    <TabsContent value="signin" className="mt-4 space-y-4">
                        <form onSubmit={handleSignin} className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative">
                                    <EmailField
                                        register={signInRegister}
                                        error={signInErrors.email?.message}
                                        disabled={loading}
                                        autoFocus
                                    />
                                </div>
                                {renderFieldError("email")}
                            </div>

                            <div className="space-y-2">
                                <div className="relative">
                                    <PasswordField
                                        register={signInRegister}
                                        error={signInErrors.password?.message}
                                        disabled={loading}
                                    />
                                </div>
                                {renderFieldError("password")}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember-me"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) =>
                                        setRememberMe(checked as boolean)
                                    }
                                    disabled={loading}
                                />
                                <Label
                                    htmlFor="remember-me"
                                    className="cursor-pointer text-sm font-normal"
                                >
                                    Remember me
                                </Label>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>

                        <SocialAuth
                            disabled={loading}
                        />
                    </TabsContent>

                    {/* Sign Up Tab */}
                    <TabsContent value="signup" className="mt-4 space-y-4">
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative">
                                    <NameField
                                        register={signUpRegister}
                                        error={signUpErrors.name?.message}
                                        disabled={loading}
                                    />
                                </div>
                                {renderFieldError("name")}
                            </div>

                            <div className="space-y-2">
                                <div className="relative">
                                    <EmailField
                                        register={signUpRegister}
                                        error={signUpErrors.email?.message}
                                        disabled={loading}
                                    />
                                </div>
                                {renderFieldError("email")}
                            </div>

                            <div className="space-y-2">
                                <div className="relative">
                                    <PasswordField
                                        register={signUpRegister}
                                        error={signUpErrors.password?.message}
                                        disabled={loading}
                                    />
                                </div>
                                {renderFieldError("password")}
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </form>

                        <SocialAuth
                            disabled={loading}
                        />
                    </TabsContent>
                </Tabs>

                {/* Terms and Privacy */}
                <div className="text-muted-foreground mt-4 text-center text-xs">
                    By continuing, you agree to our{" "}
                    <a href="/terms" className="hover:text-foreground underline">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="hover:text-foreground underline">
                        Privacy Policy
                    </a>
                    .
                </div>
            </DialogContent>
        </Dialog>
    )
}