import { Slide, ToastContainer } from 'react-toastify';

function ToastProvider() {
  return (
    <ToastContainer
      position="bottom-center"
      autoClose={2000}
      closeButton={false}
      hideProgressBar
      closeOnClick
      pauseOnHover
      draggable={false}
      theme="dark"
      transition={Slide}
      toastClassName="bg-transparent! p-0! min-h-auto! max-h-auto! w-full!"
    />
  );
}

export default ToastProvider;
