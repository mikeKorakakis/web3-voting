import Layout from "@/components/layout";
import { Outlet } from "react-router";



export default function LayoutRoute({children}: {children: React.ReactNode}) {
  return <Layout ><Outlet/></Layout>;
}
