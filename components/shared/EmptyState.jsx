import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200 text-center px-6">
      <div className="bg-brand-cream p-6 rounded-full mb-6">
        <Icon className="w-12 h-12 text-brand-muted" />
      </div>
      <h3 className="text-2xl font-serif font-bold text-brand-charcoal mb-3">{title}</h3>
      <p className="text-brand-muted max-w-sm mb-8 leading-relaxed">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
