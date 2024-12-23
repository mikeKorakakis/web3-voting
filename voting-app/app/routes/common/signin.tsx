import type { Route } from "../+types/home";
import Signin from "@/pages/common/signin/signin";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Σύνδεση" },
    { name: "description", content: "Συνδεθείτε στην ψηφοφορία" },
  ];
}

export default function SigninRoute() {
  return <Signin />;
}
