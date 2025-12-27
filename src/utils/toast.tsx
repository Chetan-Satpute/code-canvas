import { toast } from 'react-toastify';

import ToastComponent from '#components/ToastComponent.tsx';

export function errorToast() {
  toast(
    <ToastComponent
      type="error"
      title="That didn’t go as planned"
      subtitle="Looks like something unexpected happened. I’m on it!"
    />,
    {
      toastId: 'unknown-error',
    },
  );
}

export function playSuccessToast() {
  toast(
    <ToastComponent
      type="success"
      title="Algorithm Play Complete!"
      subtitle="You’ve stepped through all the code."
    />,
    {
      toastId: 'play-success',
    },
  );
}
