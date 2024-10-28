<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap'; // Import GSAP for animations
  import clsx from 'clsx';
  
  export let close = () => {};

  let isEnglish: boolean = false;
  let text: string = '';
  let typingIndex: number = 0;
  let isTyping: boolean = true;

  const frenchText = "Créateur de contenus vidéo spécialisé dans les projets pour artistes, mariages, entreprises, clips musicaux et divers événements.<br>Chaque projet est une occasion de marier rigueur et créativité, concrétisant vos idées avec précision.<br>Je vous accompagne de la conceptualisation à la réalisation, assurant un service professionnel à chaque étape.";

  const englishText = "Video content creator specializing in projects for artists, weddings, businesses, music videos, and various events.<br>Each project presents an opportunity to blend rigor and creativity, bringing your ideas to life with precision.<br>I support you from conceptualization to realization, ensuring a professional service at every step.";

  const currentText = () => (isEnglish ? englishText : frenchText);

  const typeText = () => {
    if (typingIndex < currentText().length) {
      text += currentText()[typingIndex];
      typingIndex++;
      setTimeout(typeText, 30); // Adjust typing speed here
    } else {
      isTyping = false;
    }
  };

  const toggleLanguage = (): void => {
    isEnglish = !isEnglish;
    resetTyping();
  };

  const resetTyping = () => {
    typingIndex = 0;
    text = '';
    isTyping = true;
    typeText(); // Start typing the new text
  };

  // Use GSAP to animate the profile card
  onMount(() => {
    gsap.from('.profile-card', { opacity: 0, scale: 0.8, duration: 0.5 });
    typeText();
  });

  const animateCloseButton = () => {
    gsap.to('.close-icon', { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 });
  };
</script>

<div class="contact-modal">
  <div class="contact-content">
    <button class="close-btn" on:click={() => { animateCloseButton(); close(); }} aria-label="Close contact">
      <img src="/image/X2.webp" alt="Close" class="close-icon" />
    </button>

    <div class="profile-card">
      <div class="avatar-flip">
        <img src="/image/pro.webp" alt="Yoann Kittery Front" class="profile-image" />
        <img src="/image/proback.webp" alt="Yoann Kittery Back" class="profile-image" />
      </div>
      <h2>Yoann Kittery</h2>
      <div class="glass-effect">
        <p class={clsx("justified-text", { "typed-mode": isTyping })}>
          <span class="full-text">{@html currentText()}</span>
          <span class="typed-text">{@html text}</span>
        </p>
        <button class="language-toggle" on:click={toggleLanguage} aria-label="Toggle language">
          <span>{isEnglish ? 'FR' : 'EN'}</span>
        </button>
      </div>
      <div class="contact-info">
        <p class="email">
          <a href="mailto:yoannkittery@gmail.com">yoannkittery@gmail.com</a>
        </p>
      </div>
    </div>
  </div>
</div>

  <style>
    .contact-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      backdrop-filter: blur(10px);
      background: rgba(0, 0, 0, 0.842);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
  
    .contact-content {
      position: relative;
      background: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
      max-width: 500px;
      padding: 20px;
      box-sizing: border-box;
    }
  
    .close-btn {
      position: absolute;
      top: 6%;
      right: 12%;
      background: none;
      border: none;
      cursor: pointer;
      z-index: 1001;
    }
  
    .close-icon {
      width: 24px;
      height: 24px;
      transition: opacity 0.3s ease;
    }
  
    .close-btn:hover .close-icon {
      opacity: 0.6;
    }
  
    .profile-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: linear-gradient(135deg, #ffffff, #f5fafff6); 
      border-radius: 20px;
      padding: 2rem;
      max-width: 420px;
      text-align: center;
      box-shadow: 0px 0px 30px 00px #000000;
      border: thick double #323b3f;
      transition: transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
    }
  
    .avatar-flip {
      border-radius: 100px;
      overflow: hidden;
      height: 140px;
      width: 140px;
      position: relative;
      margin: auto;
      top: -70px;
      box-shadow: 0px 0px 10px 00px #030303;
      transition: transform 0.6s ease-in-out;
    }
  
    .avatar-flip img {
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 100px;
      transition: opacity 0.6s ease-in-out;
      width: 140px;
      height: 140px;
    }
  
    .avatar-flip img:first-child {
      z-index: 1;
    }
  
    .avatar-flip img:last-child {
      z-index: 0;
      transform: rotateY(180deg);
      opacity: 0;
    }
  
    .contact-content:hover .avatar-flip {
      transform: rotateY(180deg);
    }
  
    .contact-content:hover .avatar-flip img:first-child {
      opacity: 0;
    }
  
    .contact-content:hover .avatar-flip img:last-child {
      opacity: 1;
    }
  
    h2 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #131313;
      margin-top: -50px;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
      letter-spacing: 0.5px;
    }
  
    .justified-text {
    /* Keep justified text for layout but hide it */
    white-space: pre-line; /* Treat line breaks as new paragraphs */
    font-size: 1.2rem;
    color: transparent; /* Make it invisible */
    line-height: 1.3; /* Reduces line spacing within paragraphs */
    text-align: justify;
    font-family: Georgia, serif;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
   
    margin-bottom: 1.5rem; /* Space between paragraphs */
    text-indent: 1.5rem; /* Indentation at the start of each paragraph */
}

.typed-text {
    position: absolute; /* Keeps typed text above */
    color: black; /* Ensure visibility */
    left: 0;
    top: 10%;
    font-size: 1.2rem;
    line-height: 1.3; /* Matches the line height of justified text */
    text-align: justify; /* Align typed text similarly */
    font-family: Georgia, serif;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    text-shadow: 0.1px 0.1px rgb(255, 255, 255);
    scale: 1.1;
}



  
    .contact-info {
      margin-bottom: 0;
      font-size: 1rem;
      color: #555;
      z-index: 1001;
    }
  
    .email {
      font-size: 1.75rem;
      color: #007bff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      text-shadow: 1px 1px 1px rgba(66, 69, 88, 0.938);
    }
  
    .contact-info a {
      color: inherit;
      text-decoration: none;
      z-index: 1001;
    }
  
    .contact-info a:hover {
      text-decoration: underline;
    }
  
    p, h2, a {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
  
    .language-toggle {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: none;
      border: none;
      color: #007bff00;
      cursor: pointer;
      z-index: 1001;
    }
  
    .language-toggle span {
      font-size: 1.2rem;
      font-weight: 700;
    }
  
    .glass-effect {
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 20px;
    }
  </style>
  