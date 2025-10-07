import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { LogIn } from "lucide-react";

export default function SignUp() {
  return (
    <Popover placement="top" size="sm" backdrop="opaque">
      <PopoverTrigger>
        <Button size="sm" color="default" className="w-full" variant="flat">
          Registrarse <LogIn className="w-auto h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-1">
        <div className="px-4 py-3 bg-neutral-900 rounded-md">
          <h3 className=" font-bold text-white">Registrarse</h3>
          <p className=" text-neutral-400">
            Regístrate para acceder a todas las funcionalidades de la
            aplicación.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
