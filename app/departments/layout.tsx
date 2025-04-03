import { ReactNode } from "react"

interface DepartmentsLayoutProps {
  children: ReactNode
}

export default function DepartmentsLayout({ children }: DepartmentsLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        {/* Content */}
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  )
} 