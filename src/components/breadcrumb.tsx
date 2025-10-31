import Link from 'next/link';
import { Icons } from '@/components/icons'; // Assuming ChevronRight is available

type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`mb-4 text-sm text-muted-foreground ${className}`}>
      <ol className="flex items-center space-x-1.5">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <Link href={item.href} className="hover:text-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <Icons.chevronDown className="h-4 w-4 rotate-[270deg] mx-1" /> // Using chevronDown and rotating
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
