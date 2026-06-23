import { Header } from "@/components/Header";
import { AuthProvider } from "@/components/AuthProvider";
import { AdminDashboard } from "@/components/AdminDashboard";

export default function AdminPage() {
  return (
    <AuthProvider>
      <Header />
      <AdminDashboard />
    </AuthProvider>
  );
}
