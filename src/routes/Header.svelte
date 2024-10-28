<script lang="ts">
  import { v4 as uuidv4 } from 'uuid';
  import clsx from 'clsx';
  import Contact from '../components/Contact.svelte';
  import { db, Timestamp, setDoc, doc, arrayUnion } from '../components/firebase';
  import Background from '../components/Background.svelte';

  let showContact = false;
  const hasLocalStorage = typeof localStorage !== 'undefined';

  let userId = hasLocalStorage ? localStorage.getItem('userId') : null;
  if (!userId) {
      userId = uuidv4();
      if (hasLocalStorage) localStorage.setItem('userId', userId);
  }

  const toggleContact = () => (showContact = !showContact);
  const refreshPage = () => window.location.reload();

  const handleLogoClick = async (logoPosition: string) => {
      try {
          const logoRef = doc(db, 'header', logoPosition);
          const clickTimestamp = Timestamp.now();
          await setDoc(logoRef, { clicks: arrayUnion({ userId, timestamp: clickTimestamp }) }, { merge: true });
          console.log(`Click recorded for ${logoPosition} logo`);
      } catch (error) {
          console.error(`Error recording click for ${logoPosition} logo:`, error);
      }
  };

  const handleLeftLogoClick = async () => {
      await handleLogoClick('contact');
      toggleContact();
  };
  const handleCenterLogoClick = async () => {
      await handleLogoClick('logoCenter');
      refreshPage();
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
  
  <div class={clsx("logo-center", { hidden: window.innerWidth < 1200 })}>
      <button
        class="logo-center-button"
        on:click={handleCenterLogoClick}
        aria-label="Refresh Page">
          <img src="/image/logo.webp" alt="Center Logo" />
      </button>
  </div>
  
  <div class={clsx("contact", { hidden: window.innerWidth < 800, highlight: showContact })}>
      <button
        class={clsx("contact-button")}
        on:click={handleLeftLogoClick}
        aria-label="Contact">
          <img src="/image/contact.webp" alt="Contact" />
      </button>
  </div>
</header>

{#if showContact}
<Contact close={toggleContact} />
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

.logo-button,
.logo-center-button,
.contact-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
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
  .contact,
  .logo-center {
    display: none;
  }

}
</style>
