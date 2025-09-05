import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/integrations/supabase/client'

export const ForcePasswordChangeModal = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [pwd, setPwd] = useState('')
  const [pwd2, setPwd2] = useState('')
  const mustChange = (user?.user_metadata as any)?.must_change_password === true

  useEffect(() => {
    setOpen(!!user && mustChange)
  }, [user, mustChange])

  const submit = async () => {
    if (!pwd || pwd !== pwd2) {
      toast({ title: 'Passwords do not match', variant: 'destructive' })
      return
    }
    const { error: e1 } = await supabase.auth.updateUser({ password: pwd })
    if (e1) return toast({ title: 'Update failed', description: e1.message, variant: 'destructive' })
    const { error: e2 } = await supabase.auth.updateUser({ data: { must_change_password: false } })
    if (e2) return toast({ title: 'Updated password, but flag not cleared', description: e2.message })
    toast({ title: 'Password updated' })
    setOpen(false)
    setPwd('')
    setPwd2('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set a new password</DialogTitle>
          <DialogDescription>Your account was created with a temporary password. Please set a new one now.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>New Password</Label>
            <Input type="password" value={pwd} onChange={e => setPwd(e.target.value)} />
          </div>
          <div>
            <Label>Confirm Password</Label>
            <Input type="password" value={pwd2} onChange={e => setPwd2(e.target.value)} />
          </div>
          <Button onClick={submit} className="w-full">Update Password</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ForcePasswordChangeModal
