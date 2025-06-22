import { Button } from "~/components/ui/button";
import type { Route } from "./+types/home";
/* import { Welcome } from "../welcome/welcome"; */

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <h1>Truckor <Button>Click me</Button></h1>;
}
