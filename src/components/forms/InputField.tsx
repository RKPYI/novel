'use client'

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InputField({
  name,
  label,
  placeholder,
  type = "text",
  register,
  error,
  validation,
  disabled,
  value,
  className,
  icon,
  required,
}: FormInputProps) {
  const isPassword = type === "password";
  const [show, setShow] = useState(false);
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
      </Label>
      <div className="relative">
        {icon}
        <Input
          required={required ?? false}
          type={inputType}
          id={name}
          placeholder={placeholder}
          disabled={disabled}
          {...(value !== undefined ? { value } : {})}
          className={cn(
            className,
            { "opacity-50 cursor-not-allowed": disabled },
            isPassword ? "pr-10" : undefined
          )}
          {...register(name, validation)}
        />
        {isPassword && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShow((s) => !s)}
            onMouseDown={(e) => e.preventDefault()}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            disabled={disabled}
          >
            {show ? (
              <EyeOff className="text-muted-foreground h-4 w-4" />
            ) : (
              <Eye className="text-muted-foreground h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500">
          {typeof error === "string" ? error : error?.message}
        </p>
      )}
    </div>
  );
}