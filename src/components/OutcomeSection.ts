/**
 * Creates the “Outcomes, not overhead.” focus section.
 */
export function createOutcomeSection(): HTMLElement {
  // Section wrapper
  const section = document.createElement('section');
  section.setAttribute('role', 'region');
  section.setAttribute('aria-labelledby', 'outcome-focus-heading');

  // Heading
  const h2 = document.createElement('h2');
  h2.id = 'outcome-focus-heading';
  h2.textContent = 'Outcomes, not overhead.';
  h2.style.textAlign = 'center';
  section.appendChild(h2);

  // Supporting paragraph
  const p = document.createElement('p');
  p.textContent =
    'Voder bridges the gap between strategy and shipping — without adding layers, delays, or drift.';
  p.style.textAlign = 'center';
  section.appendChild(p);

  // Container for benefit items
  const container = document.createElement('div');
  container.classList.add('benefit-container');

  section.appendChild(container);

  // Benefit data
  const benefits = [
    { emoji: '🚀', text: 'Deliver faster without losing control' },
    { emoji: '🎯', text: 'Align product, brand, and tech from day one' },
    { emoji: '💡', text: 'Iterate on ideas, not implementations' },
    {
      emoji: '🔄',
      text: 'Make fewer handoffs. Create fewer misunderstandings.',
    },
  ];

  benefits.forEach(({ emoji, text }) => {
    const item = document.createElement('div');
    item.classList.add('benefit-item');
    item.setAttribute('role', 'complementary');
    item.tabIndex = 0;
    const icon = document.createElement('span');
    icon.classList.add('benefit-icon');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = emoji;
    const label = document.createElement('span');
    label.textContent = text;

    item.append(icon, label);
    container.appendChild(item);
  });

  return section;
}
