<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  export let close = () => {
    dispatch('close');
  };

  const text = "Créateur de contenus vidéo spécialisé dans les projets pour artistes, mariages, entreprises, clips musicaux et divers événements.<br>Chaque projet est une occasion de marier rigueur et créativité, concrétisant vos idées avec précision.<br>Je vous accompagne de la conceptualisation à la réalisation, assurant un service professionnel à chaque étape.";

  onMount(() => {
    gsap.from('.profile-card', { opacity: 0, scale: 0.8, duration: 0.5 });
  });

  const handleClose = () => {
    dispatch('close');
  };

  const animateCloseButton = () => {
    gsap.to('.close-btn', { 
      scale: 0.9,
      duration: 0.1,
      ease: 'power1.out',
      yoyo: true,
      repeat: 1
    });
  };
</script>

<div class="contact-modal">
  <div class="contact-content">
    <button 
      class="close-btn" 
      on:click={() => {
        animateCloseButton();
        handleClose();
      }} 
      aria-label="Close contact">
      <img src="/image/X2.webp" alt="Close" class="close-icon" />
    </button>

    <div class="profile-card">
      <div class="avatar-container">
        <div class="avatar-flip">
          <img src="/image/pro.webp" alt="Yoann Kittery Front" class="profile-image" />
          <img src="/image/proback.webp" alt="Yoann Kittery Back" class="profile-image" />
        </div>
      </div>
      
      <div class="header-content">
        <h2>Yoann Kittery</h2>
        <div class="specialties">
          <span>Mariages</span>
          <span class="dot">•</span>
          <span>Clips</span>
          <span class="dot">•</span>
          <span>Événements</span>
        </div>
      </div>

      <div class="glass-effect">
        <p class="justified-text">
          {@html text}
        </p>
      </div>

      <div class="contact-info">
        <a href="mailto:yoannkittery@gmail.com" class="email">yoannkittery@gmail.com</a>
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
    backdrop-filter: blur(20px);
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .contact-content {
    position: relative;
    width: 100%;
    max-width: 520px;
    margin: 1.5rem;
    aspect-ratio: 1/1.4;
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    cursor: pointer;
    z-index: 2;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
  }

  .close-icon {
    width: 16px;
    height: 16px;
    transition: all 0.2s ease;
    opacity: 0.8;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  .close-btn:hover .close-icon {
    opacity: 1;
  }

  .profile-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.973), rgb(255, 255, 255));
    border-radius: 24px;
    padding: 2.5rem 2rem 2rem;
    height: 100%;
    text-align: center;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(15px);
    transition: transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
  }

  .profile-card:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 25px 45px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .avatar-container {
    position: relative;
    margin-top: -80px;
    margin-bottom: 1.25rem;
  }

  .avatar-flip {
    border-radius: 50%;
    overflow: hidden;
    height: 150px;
    width: 150px;
    position: relative;
    box-shadow: 
      0 8px 20px rgba(0, 0, 0, 0.15),
      0 0 0 4px rgba(255, 255, 255, 0.8);
    transition: transform 0.6s ease-in-out;
  }

  .avatar-flip img {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    transition: opacity 0.6s ease-in-out;
    width: 100%;
    height: 100%;
    object-fit: cover;
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

  .header-content {
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 2.75rem;
    font-weight: 800;
    color: #1a1a1a;
    margin: 0 0 0.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    letter-spacing: -0.5px;
    font-family: 'Montserrat', sans-serif;
    line-height: 1.1;
  }

  .specialties {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
    color: #4b5563;
    font-size: 1.1rem;
    font-weight: 500;
    letter-spacing: 0.01em;
  }

  .dot {
    color: #2563eb;
    font-weight: bold;
  }

  .justified-text {
    white-space: pre-line;
    font-size: 1.15rem;
    color: rgba(44, 62, 80, 0.95);
    line-height: 1.7;
    text-align: justify;
    font-family: 'Georgia', serif;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    margin: 0;
    padding: 0 1rem;
    text-shadow: 0 1px 1px rgba(255, 255, 255, 0.1);
  }

  .contact-info {
    position: relative;
    margin-top: auto;
    padding-top: 1.5rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .contact-info::before {
    content: '';
    position: absolute;
    top: 0;
    left: 20%;
    width: 60%;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      rgba(0, 0, 0, 0.1),
      transparent
    );
  }

  .email {
    font-size: 1.25rem;
    color: #2563eb;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    text-decoration: none;
    position: relative;
    padding: 0.25rem 0;
    transition: all 0.3s ease;
    letter-spacing: -0.01em;
    word-break: break-word;
    max-width: 90%;
  }

  .email::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background: linear-gradient(
      to right,
      transparent,
      currentColor,
      transparent
    );
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  .email:hover::after {
    transform: scaleX(1);
    transform-origin: left;
  }

  .glass-effect {
    border-radius: 20px;
    padding: 1.75rem;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.05)
    );
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    flex-grow: 1;
    display: flex;
    align-items: center;
    margin: 0.5rem;
    box-shadow: 
      inset 0 1px 1px rgba(255, 255, 255, 0.1),
      0 5px 15px rgba(0, 0, 0, 0.05);
  }
</style>