import { useUsersLogic } from "./useUsersLogic";
import UsersPageUI from "./UsersPageUI";

export default function UsersPage() {
  const logic = useUsersLogic();

  return <UsersPageUI {...logic} />;
}
