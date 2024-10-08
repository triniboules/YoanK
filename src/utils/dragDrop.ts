// src/utils/dragDrop.ts
export function enableDragAndDrop(element: HTMLElement, onDrop: (droppedId: string, targetId: string) => void) {
    let dragged: HTMLElement | null = null;
  
    element.addEventListener('dragstart', (event) => {
      if (event.target instanceof HTMLElement) {
        dragged = event.target;
        event.target.style.opacity = '0.5';
      }
    });
  
    element.addEventListener('dragend', (event) => {
      if (event.target instanceof HTMLElement) {
        event.target.style.opacity = '';
      }
    });
  
    element.addEventListener('dragover', (event) => {
      event.preventDefault();
    });
  
    element.addEventListener('drop', (event) => {
      event.preventDefault();
      if (dragged && event.target instanceof HTMLElement) {
        const droppedId = dragged.getAttribute('data-id');
        const targetId = event.target.getAttribute('data-id');
        if (droppedId && targetId) {
          onDrop(droppedId, targetId);  // Call the function with dragged and drop targets
        }
      }
    });
  }
  