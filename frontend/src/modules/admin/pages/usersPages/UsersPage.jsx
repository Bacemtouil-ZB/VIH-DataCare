import { useUsersLogic } from "./useUsersLogic";
import UsersPageUI from "./UsersPageUi";

export default function UsersPage() {
  const logic = useUsersLogic();

  return <UsersPageUI {...logic} />;
}
