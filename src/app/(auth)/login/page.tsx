import { Button } from '@/components/ui/button'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">Dinnartec</h1>
        <p className="text-muted-foreground">Sign in to continue</p>
        <Button className="w-full">Sign in with GitHub</Button>
      </div>
    </div>
  )
}
