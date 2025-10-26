import {Lock, Mail, User} from "lucide-react";
import InputField from "@/components/forms/InputField";

export const EmailField = (props: any) => (
    <InputField
        name="email"
        label="Email"
        placeholder="novel@gmail.com"
        type="email"
        className="pl-10"
        icon={<Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />}
        autoComplete="email"
        {...props}
    />
)

export const PasswordField = (props: any) => (
    <InputField
        name="password"
        label="Password"
        placeholder="Enter your password"
        type="password"
        className="pl-10"
        icon={<Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />}
        autoComplete="current-password"
        {...props}
    />
);

export const NameField = (props: any) => (
    <InputField
        name="name"
        label="Name"
        placeholder="Enter your username"
        type="text"
        className="pl-10"
        icon={<User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />}
        autoComplete="nickname"
        {...props}
    />
);