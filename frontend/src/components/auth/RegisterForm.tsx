import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import Button from "../common/Button";
import { TextField, SelectField } from "../common/FormField";
import Alert from "../common/Alert";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  role: string;
}

export default function RegisterForm() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({ defaultValues: { role: "DISPATCHER" } });

  async function onSubmit(values: RegisterFormValues) {
    setError(null);
    try {
      await registerUser(values);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <TextField
        label="Full name"
        placeholder="Jane Doe"
        icon={<FiUser className="h-4 w-4" />}
        error={errors.name?.message}
        {...register("name", { required: "Name is required" })}
      />

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
        placeholder="At least 6 characters"
        icon={<FiLock className="h-4 w-4" />}
        error={errors.password ? "Minimum 6 characters" : undefined}
        {...register("password", { required: true, minLength: 6 })}
      />

      <SelectField label="Role" {...register("role")}>
        <option value="DISPATCHER">Dispatcher</option>
        <option value="DRIVER">Driver</option>
        <option value="ADMIN">Admin</option>
      </SelectField>

      {error && <Alert variant="error">{error}</Alert>}

      <Button type="submit" loading={isSubmitting} fullWidth size="lg" className="mt-2">
        Create account
      </Button>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">
          Sign in
        </Link>
      </p>
    </form>
  );
}
