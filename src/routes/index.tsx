import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileJson, Globe, Database, Zap, Sparkles, Code2 } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

const features = [
  {
    icon: FileJson,
    title: "OpenAPI Spec",
    description:
      "Uses a standard Swagger/OpenAPI JSON specification as the single source of truth for API definitions.",
    color: "text-blue-500",
  },
  {
    icon: Zap,
    title: "HeyAPI Codegen",
    description:
      "Automatically generates TypeScript interfaces, Zod schemas, and TanStack Query hooks from the spec.",
    color: "text-yellow-500",
  },
  {
    icon: Database,
    title: "TanStack Query",
    description:
      "Seamlessly integrates with generated hooks for caching, synchronization, and server state management.",
    color: "text-purple-500",
  },
  {
    icon: Globe,
    title: "REST API",
    description: "Connects to fakerestapi.vercel.app to demonstrate real-world data fetching and manipulation.",
    color: "text-green-500",
  },
];

function IndexComponent() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section - Asymmetric & Bold */}
      <section className="relative container mx-auto px-4 pt-8 lg:pt-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left: Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-8 lg:col-span-7"
          >
            <div className="relative">
              <div aria-hidden="true" className="text-primary/20 font-display absolute -top-4 -left-4 text-8xl">
                {"{ }"}
              </div>
              <h1 className="font-display relative z-10 text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
                <span className="gradient-text">TanStack</span>
                <br />
                <span className="text-foreground">Query</span>
                <br />
                <span className="text-foreground/70">+ HeyAPI</span>
              </h1>
            </div>

            <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed sm:text-xl">
              Type-safe, auto-generated API clients that merge OpenAPI specifications with the power of TanStack Query.{" "}
              <span className="text-foreground font-semibold">Zero boilerplate. Maximum velocity.</span>
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/activities"
                className={buttonVariants({
                  size: "lg",
                  className:
                    "neo-border-sm border-primary text-primary hover-lift group font-display relative gap-2 overflow-hidden px-8 py-6 text-lg",
                })}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Demo
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="bg-primary absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10" />
              </Link>
              <a
                href="https://heyapi.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "hover-lift gap-2 px-8 py-6 text-lg",
                })}
              >
                <Code2 className="h-5 w-5" />
                Documentation
              </a>
            </div>
          </motion.div>

          {/* Right: Decorative Code Block */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            className="relative lg:col-span-5"
          >
            <div className="neo-border border-primary/30 bg-card/50 relative overflow-hidden rounded-lg p-6 backdrop-blur-sm">
              <div className="absolute top-3 right-3 flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />
              </div>
              <pre className="text-muted-foreground mt-6 overflow-x-auto font-mono text-sm">
                <code>{`// Auto-generated with HeyAPI
import { useSuspenseQuery } from 
  '@tanstack/react-query'

const { data } = useSuspenseQuery(
  getApiV1ActivitiesOptions()
)

// ✨ Fully typed
// ⚡ Zero config
// 🎯 Single source of truth`}</code>
              </pre>
              <Sparkles className="text-primary/30 absolute right-4 bottom-4 h-6 w-6" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4">
        <h2 className="font-display mb-12 text-center text-3xl sm:text-4xl lg:text-left">
          Built for Modern Development
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
            >
              <Card className="hover-lift hover:border-primary/50 h-full border-2 transition-colors">
                <CardHeader>
                  <feature.icon className={`${feature.color} mb-3 h-10 w-10`} />
                  <CardTitle className="font-display text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="neo-border border-primary from-primary/5 to-primary/10 relative overflow-hidden rounded-2xl bg-linear-to-br via-transparent p-8 text-center sm:p-12">
          <div className="relative z-10">
            <h3 className="font-display mb-4 text-3xl sm:text-4xl lg:text-5xl">Ready to explore?</h3>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
              See how type-safe API clients transform your development workflow with live data examples.
            </p>
            <Link
              to="/activities"
              className={buttonVariants({
                size: "lg",
                className:
                  "neo-border-sm border-foreground bg-foreground text-background hover-lift font-display group gap-2 px-8 py-6 text-lg",
              })}
            >
              Browse Activities
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
