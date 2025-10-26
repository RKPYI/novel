import { UseFormRegister, FieldError, RegisterOptions } from "react-hook-form";
import React from "react";

declare global {
    type SignInFormData = {
        email: string;
        password: string;
    };

    type SignUpFormData = {
        email: string;
        password: string;
        name: string;
        confirmPassword?: string;
    }

    type FormInputProps = {
        name: string;
        label: string;
        placeholder: string;
        type?: string;
        register: UseFormRegister<any>;
        error?: string | FieldError;
        validation?: RegisterOptions;
        disabled?: boolean;
        value?: string;
        className?: string;
        icon?: React.ReactNode;
        required?: boolean;
    }
}

export {};