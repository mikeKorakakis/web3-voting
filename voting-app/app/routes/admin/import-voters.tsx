import ImportVoters from "@/pages/admin/import-voters_not_used";
import type { Route } from "../+types/layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Εισαγωγή Ψηφοφόρων" },
    { name: "description", content: "Εισαγωγή Ψηφοφόρων" },
  ];
}

export default function ImportVotersRoute() {
  return <ImportVoters />;
}
