"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

const colorTokens = [
  { name: "background", var: "bg-background", text: "text-foreground" },
  { name: "foreground", var: "bg-foreground", text: "text-background" },
  { name: "card", var: "bg-card", text: "text-card-foreground" },
  { name: "primary", var: "bg-primary", text: "text-primary-foreground" },
  { name: "secondary", var: "bg-secondary", text: "text-secondary-foreground" },
  { name: "accent", var: "bg-accent", text: "text-accent-foreground" },
  { name: "muted", var: "bg-muted", text: "text-muted-foreground" },
  { name: "destructive", var: "bg-destructive", text: "text-destructive-foreground" },
  { name: "border", var: "bg-border", text: "text-foreground" },
];

const buttonVariants = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const;
const buttonSizes = ["xs", "sm", "default", "lg", "icon", "icon-sm", "icon-lg"] as const;
const badgeVariants = ["default", "secondary", "outline", "destructive"] as const;

export default function UIKitPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="min-h-dvh p-6 space-y-10 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-heading">UI Kit</h1>
        <p className="text-muted-foreground mt-1">MyThingsToDo — playground de componentes y colores</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-heading">Colores</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {colorTokens.map((c) => (
            <div key={c.name} className={`${c.var} ${c.text} rounded-xl p-4 border`}>
              <p className="font-medium text-sm">{c.name}</p>
              <p className="text-xs opacity-70 mt-0.5 font-mono">{c.var}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-heading">Tipografía</h2>
        <Card>
          <CardContent className="pt-6 space-y-3">
            <p className="text-sm text-muted-foreground font-sans">font-sans: Quicksand</p>
            <p className="text-4xl font-heading">Fredoka — Título grande</p>
            <p className="text-2xl font-heading">Fredoka — Subtítulo</p>
            <p className="text-lg font-sans">Quicksand — Cuerpo de texto. Este es el estilo que se usa en TaskCard, formularios y listas.</p>
            <p className="text-sm font-sans text-muted-foreground">Quicksand small — texto secundario y metadata.</p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-heading">Botones</h2>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              {buttonVariants.map((v) => (
                <Button key={v} variant={v}>{v}</Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {buttonSizes.slice(0, 4).map((s) => (
                <Button key={s} size={s}>size-{s}</Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-heading">Badges</h2>
        <div className="flex flex-wrap gap-2">
          {badgeVariants.map((v) => (
            <Badge key={v} variant={v}>{v}</Badge>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-heading">Input + Progress</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Texto libre..." />
              <Input placeholder="Con icono" defaultValue="Con contenido" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">25%</span>
                <Progress value={25} />
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">68%</span>
                <Progress value={68} />
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">100%</span>
                <Progress value={100} />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-heading">Dialog & Sheet</h2>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Abrir Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva tarea</DialogTitle>
                <DialogDescription>Crea una nueva tarea para tu día.</DialogDescription>
              </DialogHeader>
              <Input placeholder="Título de la tarea..." />
            </DialogContent>
          </Dialog>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Abrir Sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Panel lateral</SheetTitle>
                <SheetDescription>Sheet para formularios o detalles.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-heading">Calendar</h2>
        <Card className="w-fit">
          <CardContent className="pt-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
            />
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-heading">Card combinado (ejemplo TaskCard)</h2>
        <Card className="max-w-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge>Urgente</Badge>
              <Badge variant="outline">Hoy</Badge>
            </div>
            <CardTitle className="text-base mt-2">Hacer la compra semanal</CardTitle>
            <CardDescription>Recordar comprar fruta y verdura</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progreso</span>
                <span>60%</span>
              </div>
              <Progress value={60} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <span className="text-xs text-muted-foreground">~30 min</span>
            <Button size="sm">Completar</Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
