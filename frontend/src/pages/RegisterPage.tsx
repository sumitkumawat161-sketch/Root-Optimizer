import AuthLayout from "../components/auth/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout title="Create your account" subtitle="Set up your workspace in under a minute">
      <RegisterForm />
    </AuthLayout>
  );
}
