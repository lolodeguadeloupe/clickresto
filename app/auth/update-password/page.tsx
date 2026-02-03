import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";

export const metadata = {
  title: "Nouveau mot de passe | Clickresto",
  description: "Definissez votre nouveau mot de passe",
};

export default function UpdatePasswordPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
