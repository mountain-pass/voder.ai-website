// src/main.js
// Sections are built incrementally to ensure each step delivers working UI and can be validated independently
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');

  // Hero Section
  const hero = document.createElement('section');
  hero.className = 'container text-center mt-4';
  const heading = document.createElement('h1');
  heading.textContent = 'Tell Us What You Want. Let Voder Build It.';
  hero.appendChild(heading);
  const subtitle = document.createElement('p');
  subtitle.className = 'mt-2 typing-animation';
  subtitle.textContent = 'Voder turns your business intent into working software—automatically.';
  hero.appendChild(subtitle);
  hero.classList.add('fade-in');
  hero.style.animationDelay = '0s';
  root.appendChild(hero);

  // Conceptual Teaser
  const conceptTeaser = document.createElement('section');
  conceptTeaser.className = 'container text-center mt-4';
  conceptTeaser.textContent =
    'With Voder, you don’t write source code. You describe what your application should do. Voder compiles your intent into production-ready code.';
  conceptTeaser.classList.add('fade-in');
  conceptTeaser.style.animationDelay = '0.3s';
  root.appendChild(conceptTeaser);

  // Metaphor Section
  const metaphor = document.createElement('section');
  metaphor.className = 'container text-center mt-4';
  metaphor.classList.add('fade-in');
  metaphor.style.animationDelay = '0.6s';
  metaphor.textContent =
    'Most AI coding tools feel like giving directions from the passenger seat: “Turn left here”, “Go right at the lights”. Voder is different. It’s like setting your destination in GPS. You tell it where you want to go, and Voder plots the route and drives you there.';
  root.appendChild(metaphor);

  // Problem Framing Section
  const problem = document.createElement('section');
  problem.className = 'container text-center mt-4 fade-in';
  problem.style.animationDelay = '0.9s';
  problem.textContent =
    'Today’s code generation tools still leave you stuck fiddling with source code. Voder lets you work at a higher level—focused on application behaviour, brand identity, and business outcomes.';
  root.appendChild(problem);

  // Our Why Philosophy Section
  const why = document.createElement('section');
  why.className = 'container text-center mt-4 fade-in';
  why.style.animationDelay = '1.2s';
  why.innerHTML = `
    <h2>Our Why:</h2>
    <p>We believe building software should start with intent, not syntax.</p>
    <p>We believe that creators and problem solvers shouldn’t have to get bogged down in implementation details just to bring their ideas to life.</p>
    <p>Your time is better spent defining behaviour, outcomes, and user experience—not wrangling with frameworks, languages, or boilerplate.</p>
    <p>Where others give you faster ways to write code, Voder gives you a better way to describe what you want.</p>
  `;
  root.appendChild(why);

  // Visual Element
  const visual = document.createElement('div');
  visual.className = 'container text-center mt-4';
  // Update flow diagram to reflect business intent pipeline
  visual.innerHTML =
    '<svg viewBox="0 0 400 50" width="400" height="50">' +
      '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" ' +
        'class="accent" font-family="monospace" font-size="14">' +
        'Business Intent → Source Prompts → Voder → Working Software' +
      '</text>' +
    '</svg>';
  visual.classList.add('fade-in');
  visual.style.animationDelay = '1.5s';
  root.appendChild(visual);

  // Philosophy Statement
  const philosophy = document.createElement('section');
  philosophy.className = 'container text-center mt-4 fade-in';
  philosophy.style.animationDelay = '1.8s';
  philosophy.textContent =
    'We’ve versioned our code. We’ve versioned our infrastructure. Now it’s time to version our prompts.';
  root.appendChild(philosophy);

  // Footer
  const footer = document.createElement('footer');
  footer.className = 'text-center mt-4 mb-4 fade-in';
  footer.style.animationDelay = '2.1s';
  footer.textContent = 'Voder. 2025.';
  root.appendChild(footer);
});