import { Link, linkOptions, type LinkProps } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = linkOptions([
  { to: "/", label: "Home", activeOptions: { exact: true } },
  { to: "/activities", label: "Activities" },
  { to: "/authors", label: "Authors" },
  { to: "/books", label: "Books" },
  {
    to: "/bootcamp/challenge/$day/$exercise",
    params: { day: "4-hour", exercise: "exercise-0" },
    label: "4-hour workshop",
  },
  {
    to: "/bootcamp/challenge/$day/$exercise",
    params: { day: "8-hour", exercise: "exercise-0" },
    label: "8-hour workshop",
  },
]);

const linkClassName =
  "hover:text-primary font-display group relative rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors";

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center", className)} {...props}>
      {/* Desktop links */}
      <div className="hidden items-center space-x-1 lg:flex">
        {navItems.map(({ label, ...linkProps }) => (
          <Link
            key={label}
            {...linkProps}
            className={linkClassName}
            activeProps={{ className: "text-primary" }}
            inactiveProps={{ className: "text-muted-foreground" }}
          >
            {({ isActive }) => (
              <>
                {label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="bg-primary/10 absolute inset-0 -z-10 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </>
            )}
          </Link>
        ))}
      </div>

      {/* Mobile menu */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon" aria-label="Open navigation menu" className="lg:hidden" />}
        >
          <MenuIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="neo-border-sm border-border w-48">
          {navItems.map(({ label, ...linkProps }) => (
            <DropdownMenuItem
              key={label}
              className="font-display cursor-pointer"
              render={<Link {...(linkProps as unknown as LinkProps)}>{label}</Link>}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
