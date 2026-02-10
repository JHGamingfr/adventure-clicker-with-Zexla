const filterButtons = document.querySelectorAll('.filter');
const templateCards = document.querySelectorAll('.template-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    button.classList.add('active');

    const selected = button.dataset.filter;

    templateCards.forEach((card) => {
      const tags = card.dataset.tags || '';
      const showCard = selected === 'all' || tags.includes(selected);
      card.classList.toggle('is-hidden', !showCard);
    });
  });
});
