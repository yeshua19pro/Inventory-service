import { checkSession } from "../Components/checksession";
import AuthGuard from "../Components/AuthGuard";
import CatalogPage from "./CatalogPage";

export default async function CartServerPage() {
  const user = await checkSession();

  if (!user) {
    return <AuthGuard />;
  }

  return <CatalogPage />;
}
