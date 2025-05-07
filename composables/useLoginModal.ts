// composables/useLoginModal.ts
import { useState } from '#app';

export function useLoginModal() {
  // State for modal login
  const showLoginModal = useState('showLoginModal', () => false);
  
  // State for storing URL redirect after login
  const redirectPath = useState('loginRedirectPath', () => '');
  
  // Function to display modal
  const openLoginModal = (redirect = '') => {
    console.log('Opening login modal with redirect path:', redirect); // Add debugging
    showLoginModal.value = true;
    if (redirect) {
      redirectPath.value = redirect;
    }
  };
  
  // Function to close modal
  const closeLoginModal = () => {
    showLoginModal.value = false;
  };
  
  return {
    showLoginModal,
    redirectPath,
    openLoginModal,
    closeLoginModal
  };
}