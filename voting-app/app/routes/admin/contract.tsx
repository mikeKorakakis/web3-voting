import type { Route } from "../+types/layout";
import Contract from "@/pages/admin/contract";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contract" },
    { name: "description", content: "Ανεβάστε το contract" },
  ];
}

export default function DeployContractRoute() {
  return <Contract />;
}
