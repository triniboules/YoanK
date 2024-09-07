<script>
    export let close = () => {};
  </script>
  
  <div class="contact-modal">
    <button class="close-btn" on:click={close} aria-label="Close contact">X</button>
    <div class="contact-content">
      <img src="/src/lib/image/contact1.png" alt="Contact" class="contact-image" />
   
    </div>
  </div>
  
  <style>
    .contact-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
  
    .contact-content {
      background: rgba(255, 255, 255, 0); /* Make background solid */
      
    }
  
    .contact-image {
      max-width: 100%; /* Ensure it does not overflow the container */
      max-height: 800px; /* Set a max height if needed */
      width: auto; /* Maintain aspect ratio */
      height: auto; /* Maintain aspect ratio */
    }
  
    .close-btn {
      position: absolute;
      top: 0rem;
      right: 25%;
      bottom: 92%;
      background: rgb(0, 0, 0);
      color: white;
      border: none;
      padding: 0.5rem;
      cursor: help;
      border-radius: 50%;
      font-size: 1.5rem;
      z-index: 1001; /* Ensure button is above other content */
      transform: translate(-650%, 250%);
    }
  </style>
  