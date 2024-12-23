import type { Route } from "../+types/layout";
import Signup from "@/pages/voters/signUp/signup";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Εγγραφή" },
    { name: "description", content: "Εγγραφή" },
  ];
}

export default function VoteRoute() {
  return <Signup />;
}
