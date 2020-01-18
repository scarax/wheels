const header = document.querySelector('.header');
const firstSection = document.querySelector('.intro');

const firstSectionOptions = {
  rootMargin: '-150px 0px 0px 0px'
};

const firstSectionObserver = new IntersectionObserver ((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  })
},
firstSectionOptions);

firstSectionObserver.observe(firstSection);