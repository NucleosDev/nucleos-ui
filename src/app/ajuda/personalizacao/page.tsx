import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Personalizacao() {
  return (
    <>
      <section className="pb-30 pt-60 center itemns-center">
        <Card className="w-full max-w-2xl">
          <CardHeader title="Personalização" />
          <CardContent>
            <CardDescription>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Neque
              fugit tenetur labore laudantium quibusdam nulla asperiores alias
              earum quod veritatis, hic ut repudiandae optio nam sunt, totam
              consequatur! Maiores, beatae?
            </CardDescription>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
