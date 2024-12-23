import Candidates from "@/pages/admin/candidates";
import type { Route } from "../+types/layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Υποψήφιοι" },
    { name: "description", content: "Υποψήφιοι" },
  ];
}

export default function DeployContractRoute() {
  return <Candidates />;
}
