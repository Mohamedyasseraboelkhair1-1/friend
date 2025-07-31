document.addEventListener('DOMContentLoaded', () => {
    const welcomeButton = document.getElementById('welcomeButton');

    if (welcomeButton) {
        welcomeButton.addEventListener('click', () => {
            alert('أهلاً بك في موقعنا! نتمنى لك تجربة ممتعة.');
        });
    }
});