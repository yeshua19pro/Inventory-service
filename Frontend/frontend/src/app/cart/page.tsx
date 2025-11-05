import { checkSession } from "../Components/checksession";
import AuthGuard from "../Components/AuthGuard";
import CartPage from "./CartPage";

export default async function CartServerPage() {
  const user = await checkSession();

  if (!user) {
    return <AuthGuard />;
  }

  return <CartPage />;
}
