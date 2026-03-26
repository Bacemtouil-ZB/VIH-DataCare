import { EmptyState, PageTitle } from "../../../shared/components";

export default function RapportsPage() {
  return (
    <div className="p-3">
      <PageTitle title="Rapports" />
      <EmptyState message="La page des rapports sera disponible prochainement." />
    </div>
  );
}
