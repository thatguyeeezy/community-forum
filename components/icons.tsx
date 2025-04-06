import { Loader2, LightbulbIcon as LucideProps } from 'lucide-react'

export const Icons = {
  spinner: Loader2,
  discord: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 12h.01M15 12h.01M8.5 17.5l-1.5.5s1.5 2 4 2c2.5 0 4-2 4-2l-1.5-.5" />
      <path d="M15.5 17.5l1.5.5s-1.5 2-4 2c-2.5 0-4-2-4-2l1.5-.5" />
      <path d="M20.5 9c0 1-1.5 3-1.5 3s-1.5-2-1.5-3a1.5 1.5 0 0 1 3 0Z" />
      <path d="M3.5 9c0 1 1.5 3 1.5 3s1.5-2 1.5-3a1.5 1.5 0 0 0-3 0Z" />
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0a2.5 2.5 0 0 1-2.5 2.5h0A2.5 2.5 0 0 1 7 4.5v0A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v0a2.5 2.5 0 0 1-2.5 2.5h0A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 14.5 2Z" />
      <path d="M3 7v6c0 5 4 8 9 8s9-3 9-8V7" />
    </svg>
  ),
}