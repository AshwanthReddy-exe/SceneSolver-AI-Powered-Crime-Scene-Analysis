import {toast} from 'react-toastify';

const handleSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
  });
};

const handleError = (message) => {
  toast.error(message, {
    position: "top-right",
  });
};

export { handleSuccess, handleError };