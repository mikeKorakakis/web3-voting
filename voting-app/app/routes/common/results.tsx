import Results from "@/pages/common/results/results";
import type { Route } from "../+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Αποτελέσματα" },
    { name: "description", content: "Αποτελέσματα" },
  ];
}

export default function ResultsRoute() {
  return <Results />;
}
