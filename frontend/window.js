document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('subscribe-popup');
    const thankYou = document.getElementById('thank-you');
    const acceptBtn = document.getElementById('accept-subscribe');
    const declineBtn = document.getElementById('decline-subscribe');

    if (!localStorage.getItem('subscribed')) {
      setTimeout(() => {
        popup.classList.remove('hidden');
      }, 3000);
    }

    function hidePopup() {
      popup.classList.add('hidden');
    }

    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('subscribed', 'true');
      hidePopup();
      thankYou.classList.remove('hidden');
      setTimeout(() => {
        thankYou.classList.add('hidden');
      }, 2000);
    });

    declineBtn.addEventListener('click', () => {
      hidePopup();
    });
});