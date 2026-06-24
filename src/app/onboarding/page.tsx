"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/lib/actions/onboarding.actions";

const steps = [
  {
    title: "¿Para qué usarás la app?",
    key: "workType",
    options: [
      { value: "work", label: "Trabajo", icon: "💼" },
      { value: "daily", label: "Vida cotidiana", icon: "🏠" },
      { value: "both", label: "Ambos", icon: "🔄" },
    ],
  },
  {
    title: "¿Cuánto tiempo al día?",
    key: "dailyTime",
    options: [
      { value: "5", label: "5 min", icon: "⚡" },
      { value: "15", label: "15 min", icon: "☕" },
      { value: "30", label: "30 min", icon: "📚" },
      { value: "60", label: "1 hora+", icon: "🎯" },
    ],
  },
  {
    title: "¿Avisos cuando pase algo bueno?",
    key: "notifications",
    options: [
      { value: "yes", label: "Sí, me gusta", icon: "🔔" },
      { value: "no", label: "No, gracias", icon: "🔕" },
    ],
  },
  {
    title: "¿Modo focus?",
    key: "focusMode",
    description:
      "Un modo donde solo ves tu tarea activa, sin distracciones",
    options: [
      { value: "yes", label: "Me interesa", icon: "🎯" },
      { value: "no", label: "No por ahora", icon: "🤷" },
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [, startTransition] = useTransition();

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const allAnswered = steps.every((s) => answers[s.key]);

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [step.key]: value };
    setAnswers(newAnswers);

    if (isLast) {
      startTransition(() => {
        completeOnboarding(newAnswers as {
          workType: string;
          dailyTime: string;
          notifications: string;
          focusMode: string;
        });
      });
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    startTransition(() => {
      completeOnboarding({
        workType: "both",
        dailyTime: "15",
        notifications: "yes",
        focusMode: "no",
      });
    });
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="flex min-h-dvh flex-col px-4 py-8">
      <div className="mb-2 flex items-center gap-1">
        <img src="/pets/orange-cat/happy.svg" alt="" className="h-6 w-auto" />
        <span className="font-heading text-base font-bold">MyThingsToDo</span>
      </div>

      <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex flex-1 flex-col justify-center gap-6">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium">
            Paso {currentStep + 1} de {steps.length}
          </p>
          <h1 className="font-heading text-2xl font-bold">{step.title}</h1>
          {"description" in step && step.description ? (
            <p className="text-muted-foreground text-sm">{step.description}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          {step.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 text-left shadow-sm transition-all hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98]"
            >
              <span className="text-2xl">{opt.icon}</span>
              <span className="font-medium">{opt.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleSkip}
          className="text-muted-foreground mx-auto text-xs underline underline-offset-2 hover:text-foreground"
        >
          Saltar onboarding
        </button>
      </div>
    </div>
  );
}
