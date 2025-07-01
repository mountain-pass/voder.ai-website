// src/main.js
// Use CSS accent class for SVG text fill to maintain theme consistency
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');

  const hero = document.createElement('section');
  hero.className = 'container text-center mt-4';
  const heading = document.createElement('h1');
  heading.textContent = 'The Compiler for Prompts.';
  hero.appendChild(heading);
  const subtitle = document.createElement('p');
  subtitle.className = 'mt-2 typing-animation';
  subtitle.textContent = 'Prompt → LLM → Output → Version Control';
  hero.appendChild(subtitle);
  hero.classList.add('fade-in');
  hero.style.animationDelay = '0s'; // ensures hero fades in immediately
  root.appendChild(hero);

  const teaser = document.createElement('section');
  teaser.className = 'container text-center mt-4';
  teaser.textContent = 'We version our code. We version our infrastructure. Now it’s time to version our prompts.';
  teaser.classList.add('fade-in');
  teaser.style.animationDelay = '0.3s'; // stagger teaser fade-in
  root.appendChild(teaser);

  const visual = document.createElement('div');
  visual.className = 'container text-center mt-4';
  visual.innerHTML = '<svg viewBox="0 0 400 50" width="400" height="50"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" class="accent" font-family="monospace" font-size="14">Prompt → LLM → Output → Version Control</text></svg>';
  visual.classList.add('fade-in');
  visual.style.animationDelay = '0.6s'; // stagger visual fade-in
  root.appendChild(visual);

  const philosophy = document.createElement('section');
  philosophy.className = 'container mt-4';
  const philosophyText = document.createElement('p');
  philosophyText.textContent = 'At Voder, we believe that prompts deserve the same rigor of version control as code and infrastructure.';
  philosophy.appendChild(philosophyText);
  philosophy.classList.add('fade-in');
  philosophy.style.animationDelay = '0.9s'; // stagger philosophy fade-in
  root.appendChild(philosophy);

  const footer = document.createElement('footer');
  footer.className = 'text-center mt-4 mb-4';
  footer.textContent = 'Voder. 2025.';
  footer.classList.add('fade-in');
  footer.style.animationDelay = '1.2s'; // stagger footer fade-in
  root.appendChild(footer);
});