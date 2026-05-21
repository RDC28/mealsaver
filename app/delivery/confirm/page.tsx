import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function DeliveryConfirmPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card px-7 py-8 shadow-sm space-y-6">
        {/* Success banner */}
        <div className="flex items-center gap-3 rounded-xl bg-primary px-4 py-3">
          <CheckCircle2 size={20} className="shrink-0 text-white" />
          <div>
            <p className="text-sm font-semibold text-white">Delivery Successful!</p>
            <p className="text-xs text-green-100">Thank you for completing this delivery.</p>
          </div>
        </div>

        {/* Receiver Confirmation */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Receiver Confirmation</h2>
          {[
            'Received quantity correct',
            'Food condition safe',
            'Delivery completed on time',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5">
              <CheckCircle2 size={15} className="shrink-0 text-primary" />
              <span className="text-sm text-foreground">{item}</span>
            </div>
          ))}
        </div>

        {/* Receiver Note */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Receiver Note (Optional)
          </label>
          <textarea
            rows={3}
            defaultValue="Thank you so much! The food is fresh and will help a lot of people."
            className="w-full resize-none rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <p className="text-right text-xs text-muted-foreground">62/200</p>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Delivered At</p>
            <p className="font-medium text-foreground">Today, 6:42 PM</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Received By</p>
            <p className="font-medium text-foreground">Anita Reddy</p>
            <p className="text-xs text-muted-foreground">Coordinator, Helping Hands NGO</p>
          </div>
        </div>

        <button className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
          Confirm Delivery
        </button>
      </div>
    </div>
  )
}
