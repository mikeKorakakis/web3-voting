import type { Route } from "../+types/layout";
import Voters from "@/pages/admin/voters";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Ψηφοφόροι" },
    { name: "description", content: "Ψηφοφόροι" },
  ];
}

export default function DeployContractRoute() {
  return <Voters />;
}
