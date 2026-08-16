/**
 * Scrolls the nearest section to 50px from the top of the viewport
 * @param {Event} event - The click event
 */
export function scrollToNearestSection(event) {
  const buttonElement = event.currentTarget;
  if (!buttonElement) return;

  // Find the nearest section element (could be <section> or a div with section-like structure)
  let current = buttonElement.parentElement;
  let section = null;

  // Traverse up the DOM tree to find the section
  // Look for elements with IDs, section tags, or parent containers
  while (current && current !== document.body) {
    // Check if it's a section tag or has an ID (sections usually have IDs)
    if (
      current.tagName === 'SECTION' ||
      current.id ||
      current.classList.contains('section') ||
      current.getAttribute('data-section')
    ) {
      section = current;
      break;
    }
    current = current.parentElement;
  }

  // If still no section found, find the nearest parent div that's likely the section container
  // (usually the outermost wrapper div of the component)
  if (!section) {
    current = buttonElement.parentElement;
    let lastValidParent = null;
    
    while (current && current !== document.body) {
      // Look for a div that's likely a section (has significant height and is a direct child of body or main content area)
      const rect = current.getBoundingClientRect();
      const styles = window.getComputedStyle(current);
      
      // Check if it's a substantial container (likely a section)
      if (rect.height > 200 && (current.id || styles.position === 'relative' || styles.position === 'static')) {
        lastValidParent = current;
      }
      
      // Stop at body or a container that's clearly the section wrapper
      if (current.tagName === 'BODY' || current.classList.contains('min-h-screen')) {
        section = lastValidParent || current;
        break;
      }
      
      current = current.parentElement;
    }
    
    if (!section && lastValidParent) {
      section = lastValidParent;
    }
  }

  if (section) {
    const rect = section.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const sectionTop = rect.top + scrollTop;
    
    // Calculate target scroll position: section top - 50px offset
    const targetScroll = sectionTop - 50;
    
    // Smooth scroll to target position
    window.scrollTo({
      top: Math.max(0, targetScroll), // Ensure we don't scroll to negative values
      behavior: 'smooth'
    });
  }
}
