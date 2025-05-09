import Link from "next/link";
import { cn } from "@/util/tailwind";
import { usePathname } from "next/navigation";

type NavItem = {
  icon: React.ReactNode;
  label: string;
  path: string;
};

export function NavItem({
  item,
  toggleNavbar,
}: {
  item: NavItem;
  toggleNavbar: () => void;
}) {
  const location = usePathname();
  return (
    <li key={item.path}>
      <Link
        href={item.path}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-sidebar-accent/10",
          location === item.path
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "text-sidebar-foreground/80 hover:text-sidebar-foreground",
        )}
        onClick={toggleNavbar}
      >
        {item.icon}
        <span>{item.label}</span>
      </Link>
    </li>
  );
}
