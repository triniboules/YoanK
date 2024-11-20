<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { v4 as uuidv4 } from 'uuid';
  import clsx from 'clsx';
  import Contact from '../components/Contact.svelte';
  import { recordHeaderClick } from '../components/firebase';

  let showContact = false;
  let width = browser ? window.innerWidth : 1920;
  let mounted = false;

  onMount(() => {
    mounted = true;
    const updateWidth = () => {
      width = window.innerWidth;
    };
    
    window.addEventListener('resize', updateWidth);
    updateWidth();
    
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  });

  const handleLeftLogoClick = async () => {
    if (!browser || !mounted) return;
    
    showContact = !showContact;
    try {
      await recordHeaderClick('logoLeft', uuidv4());
    } catch (error) {
      console.error('Error updating logo left clicks:', error);
    }
  };

  const handleCenterLogoClick = async () => {
    if (!browser || !mounted) return;
    
    try {
      await recordHeaderClick('logoCenter', uuidv4());
    } catch (error) {
      console.error('Error updating logo center clicks:', error);
    }
  };

  const handleContactClick = async () => {
    if (!browser || !mounted) return;
    
    showContact = !showContact;  
    try {
      await recordHeaderClick('contact', uuidv4());
    } catch (error) {
      console.error('Error updating contact clicks:', error);
    }
  };
</script>

<header class="header">

  
  <div class="logo-left">
      <button
        class={clsx("logo-button", { highlight: showContact })}
        on:click={handleLeftLogoClick}
        aria-label="Open Contact">
          <img src="/image/NOM.webp" alt="Left Logo" />
      </button>
  </div>
  
  <div class={clsx("logo-center", { hidden: width < 1200 })}>
      <button
        class="logo-center-button"
        on:click={handleCenterLogoClick}
        aria-label="Refresh Page">
          <img src="/image/logo.webp" alt="Center Logo" />
      </button>
  </div>
  
  <div class="logo-contact">
      <button
        class={clsx("contact-button", { hidden: width < 800 })}
        on:click={handleContactClick}
        aria-label="Contact">
          <img src="/image/contact.webp" alt="Contact" />
      </button>
  </div>
</header>

{#if showContact}
  <Contact on:close={() => (showContact = false)} />
{/if}

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #cacaca00;
  position: relative;
  z-index: 1;
  margin: 30px;
  margin-bottom: 10px;
max-height: 50px;
}

.logo-left {
  flex: 1;
}

.logo-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.logo-contact {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.logo-button,
.logo-center-button,
.contact-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.logo-button:hover,
.logo-center-button:hover,
.contact-button:hover {
  transform: scale(1.05);
}

.logo-left img {
  height: 65px;
}

.logo-center img {
  height: 80px;
}

.contact-button img {
  height: 40px;
}

.hidden {
  display: none;
}

@media (max-width: 1200px) {
  .logo-center {
    display: none;
  }
}

@media (max-width: 800px) {
  .contact-button {
    display: none;
  }
}
</style>
