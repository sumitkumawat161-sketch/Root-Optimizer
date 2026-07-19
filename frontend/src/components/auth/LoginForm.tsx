import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import Button from "../common/Button";
import { TextField } from "../common/FormField";
import Alert from "../common/Alert";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>();

  async function onSubmit(values: LoginFormValues) {
    setError(null);
    try {
      await login(values);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid email or password");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <TextField
        label="Email address"
        type="email"
        placeholder="you@company.com"
        icon={<FiMail className="h-4 w-4" />}
        error={errors.email?.message}
        {...register("email", { required: "Email is required" })}
      />

      <TextField
        label="Password"
        type="password"
        placeholder="••••••••"
        icon={<FiLock className="h-4 w-4" />}
        error={errors.password?.message}
        {...register("password", { required: "Password is required" })}
      />

      {error && <Alert variant="error">{error}</Alert>}

      <Button type="submit" loading={isSubmitting} fullWidth size="lg" className="mt-2">
        Sign in
      </Button>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">
          Create one
        </Link>
      </p>
    </form>
  );
}
