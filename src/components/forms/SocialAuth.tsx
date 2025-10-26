import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {GoogleIcon} from "@/components/icons/GoogleIcon";

type Props = { disabled?: boolean; onGoogle?: () => void };

export default function SocialAuth({ disabled, onGoogle }: Props) {
    return (
        <>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background text-muted-foreground px-2">
                        Or continue with
                    </span>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={onGoogle}
                disabled={disabled}
            >
                <GoogleIcon className="mr-2 h-4 w-4" />
                Google
            </Button>
        </>
    )
}