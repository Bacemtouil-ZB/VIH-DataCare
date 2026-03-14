// ── UsersPage.jsx ────────────────────────────────────────────────────────────
// Point d'entrée — appelle le hook et passe tout à l'UI

import { useUsersLogic } from "./useUsersLogic";
import UsersPageUI from "./UsersPageUI";

export default function UsersPage() {
  const logic = useUsersLogic();

  return <UsersPageUI {...logic} />;
}