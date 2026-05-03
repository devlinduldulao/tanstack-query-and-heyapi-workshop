import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-1 lg:space-x-2", className)} {...props}>
      <Link
        to="/"
        className="hover:text-primary font-display group relative rounded-lg px-3 py-2 text-sm font-semibold transition-all"
        activeProps={{
          className: "text-primary",
        }}
        inactiveProps={{
          className: "text-muted-foreground",
        }}
      >
        {({ isActive }) => (
          <>
            React Miami 2026
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
      <Link
        to="/activities"
        className="hover:text-primary font-display group relative rounded-lg px-3 py-2 text-sm font-semibold transition-all"
        activeProps={{
          className: "text-primary",
        }}
        inactiveProps={{
          className: "text-muted-foreground",
        }}
      >
        {({ isActive }) => (
          <>
            Activities
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="bg-primary/10 absolute inset-0 -z-10 rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="bg-primary/0 group-hover:bg-primary/5 absolute inset-0 rounded-lg transition-colors" />
          </>
        )}
      </Link>
      <Link
        to="/authors"
        className="hover:text-primary font-display group relative rounded-lg px-3 py-2 text-sm font-semibold transition-all"
        activeProps={{
          className: "text-primary",
        }}
        inactiveProps={{
          className: "text-muted-foreground",
        }}
      >
        {({ isActive }) => (
          <>
            Authors
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="bg-primary/10 absolute inset-0 -z-10 rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="bg-primary/0 group-hover:bg-primary/5 absolute inset-0 rounded-lg transition-colors" />
          </>
        )}
      </Link>
      <Link
        to="/books"
        className="hover:text-primary font-display group relative rounded-lg px-3 py-2 text-sm font-semibold transition-all"
        activeProps={{
          className: "text-primary",
        }}
        inactiveProps={{
          className: "text-muted-foreground",
        }}
      >
        {({ isActive }) => (
          <>
            Books
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="bg-primary/10 absolute inset-0 -z-10 rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="bg-primary/0 group-hover:bg-primary/5 absolute inset-0 rounded-lg transition-colors" />
          </>
        )}
      </Link>
      <Link
        to="/bootcamp/challenge/$day/$exercise"
        params={{ day: "4-hour", exercise: "exercise-0" }}
        className="hover:text-primary font-display group relative rounded-lg px-3 py-2 text-sm font-semibold transition-all"
        activeProps={{
          className: "text-primary",
        }}
        inactiveProps={{
          className: "text-muted-foreground",
        }}
      >
        {({ isActive }) => (
          <>
            4-hour workshop
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="bg-primary/10 absolute inset-0 -z-10 rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="bg-primary/0 group-hover:bg-primary/5 absolute inset-0 rounded-lg transition-colors" />
          </>
        )}
      </Link>
      <Link
        to="/bootcamp/challenge/$day/$exercise"
        params={{ day: "8-hour", exercise: "exercise-0" }}
        className="hover:text-primary font-display group relative rounded-lg px-3 py-2 text-sm font-semibold transition-all"
        activeProps={{
          className: "text-primary",
        }}
        inactiveProps={{
          className: "text-muted-foreground",
        }}
      >
        {({ isActive }) => (
          <>
            8-hour workshop
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="bg-primary/10 absolute inset-0 -z-10 rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="bg-primary/0 group-hover:bg-primary/5 absolute inset-0 rounded-lg transition-colors" />
          </>
        )}
      </Link>
    </nav>
  );
}
