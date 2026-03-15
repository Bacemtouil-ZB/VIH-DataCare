// ── UsersPage.jsx ────────────────────────────────────────────────────────────
// Point d'entrée — appelle le hook et passe tout à l'UI

import { useUsersLogic } from "./useUsersLogic";
import UsersPageUI from "./UsersPageUi";

export default function UsersPage() {
  const logic = useUsersLogic();

  return <UsersPageUI {...logic} />;
}