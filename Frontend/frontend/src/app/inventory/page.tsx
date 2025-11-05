import { checkSession } from "../Components/checksession";
import AuthGuard from "../Components/AuthGuard";
import InventoryPage from "./InventoryPage";

export default async function CartServerPage() {
  const user = await checkSession();

  if (!user) {
    return <AuthGuard />;
  }

  return <InventoryPage />;
}
