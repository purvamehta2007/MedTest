"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pill, Bell, ClipboardList, Heart, Users, AlertTriangle, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import { AuthProvider } from "@/components/auth-provider";

function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const features = [
    {
      icon: Pill,
      title: "Medicine Management",
      description: "Track all your medications, dosages, and schedules in one place.",
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Never miss a dose with customizable reminder notifications.",
    },
    {
      icon: ClipboardList,
      title: "Intake Tracking",
      description: "Monitor your medication adherence with detailed intake logs.",
    },
    {
      icon: Heart,
      title: "Health Records",
      description: "Store allergies, conditions, and medical history securely.",
    },
    {
      icon: Users,
      title: "Family Contacts",
      description: "Keep emergency contacts informed about missed doses.",
    },
    {
      icon: AlertTriangle,
      title: "Emergency Alerts",
      description: "Instantly notify loved ones in case of emergencies.",
    },
  ];

  const benefits = [
    "Track unlimited medications",
    "Set multiple daily reminders",
    "View adherence statistics",
    "Share with family members",
    "Secure and private",
    "Access from any device",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Pill className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">MedSync</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Your Complete Medicine{" "}
              <span className="text-primary">Management Solution</span>
            </h1>
            <p className="mt-6 text-pretty text-lg leading-8 text-muted-foreground">
              Stay on top of your medications with smart reminders, detailed tracking, 
              and instant emergency alerts. MedSync helps you and your family stay healthy and connected.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Start Free Today
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign In to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything You Need for Medication Safety
            </h2>
            <p className="mt-4 text-muted-foreground">
              Comprehensive tools to manage your health and keep your loved ones informed.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="group relative overflow-hidden transition-all hover:border-primary/50">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-y border-border bg-card py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Take Control of Your Medication Schedule
              </h2>
              <p className="mt-4 text-muted-foreground">
                MedSync provides all the tools you need to manage medications effectively 
                and keep your family informed about your health.
              </p>
              <ul className="mt-8 space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Link href="/signup">
                  <Button size="lg">Create Your Free Account</Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-accent/10 p-8">
                <div className="grid h-full grid-cols-2 gap-4">
                  <div className="rounded-xl bg-card/50 p-4 backdrop-blur">
                    <div className="text-3xl font-bold text-primary">98%</div>
                    <div className="text-sm text-muted-foreground">Adherence Rate</div>
                  </div>
                  <div className="rounded-xl bg-card/50 p-4 backdrop-blur">
                    <div className="text-3xl font-bold text-success">24/7</div>
                    <div className="text-sm text-muted-foreground">Monitoring</div>
                  </div>
                  <div className="rounded-xl bg-card/50 p-4 backdrop-blur">
                    <div className="text-3xl font-bold text-accent">5+</div>
                    <div className="text-sm text-muted-foreground">Family Members</div>
                  </div>
                  <div className="rounded-xl bg-card/50 p-4 backdrop-blur">
                    <div className="text-3xl font-bold text-warning">Instant</div>
                    <div className="text-sm text-muted-foreground">Alerts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of users who trust MedSync to manage their medications safely.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Pill className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">MedSync</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Medicine Awareness and Safety Application
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  );
}
