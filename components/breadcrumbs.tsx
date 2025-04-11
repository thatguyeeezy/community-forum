import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-400 mb-6">
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}

            {isLast || !item.href ? (
              <span className={isLast ? "text-gray-300" : ""}>{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-gray-300">
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
