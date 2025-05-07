import { useState } from '#app';

export function useLoginModal() {
  // State untuk modal login
  const showLoginModal = useState('showLoginModal', () => false);
  
  // State untuk menyimpan URL redirect setelah login
  const redirectPath = useState('loginRedirectPath', () => '');
  
  // Fungsi untuk menampilkan modal
  const openLoginModal = (redirect = '') => {
    showLoginModal.value = true;
    if (redirect) {
      redirectPath.value = redirect;
    }
  };
  
  // Fungsi untuk menutup modal
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