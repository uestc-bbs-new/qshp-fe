import { useAppState } from '@/states'

import { TransparentBackdropBlurDialog } from './LoginDialog'
import { RegisterContent } from './Register'

const RegisterDialog = ({ open }: { open: boolean }) => {
  const { dispatch } = useAppState()
  const close = () => dispatch({ type: 'close dialog' })
  return (
    <TransparentBackdropBlurDialog open={open} onClose={close}>
      <RegisterContent small />
    </TransparentBackdropBlurDialog>
  )
}

export default RegisterDialog
