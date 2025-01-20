import type { Route } from "../+types/layout";
import Vote from "@/pages/voters/vote/vote";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Ψηφοφορία" },
    { name: "description", content: "Ψηφοφορία" },
  ];
}

export default function VoteRoute() {
  return <Vote />;
}
