<script lang="ts">
  import { v4 as uuidv4 } from 'uuid';
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
  <Background /> <!-- Background component added within header for containment -->
  <div class="logo-left">
      <button class="logo-button" on:click={handleLeftLogoClick} aria-label="Open Contact">
          <img src="/image/NOM.webp" alt="Left Logo" />
      </button>
  </div>
  <div class="logo-center">
      <button class="logo-center-button" on:click={handleCenterLogoClick} aria-label="Refresh Page">
          <img src="/image/logo.webp" alt="Center Logo" />
      </button>
  </div>
  <div class="contact">
      <button class="contact-button" on:click={handleLeftLogoClick} aria-label="Contact">
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
  padding: 0 3%;
  background: #cacaca00;
  height: 68px;
  position: relative; /* Set relative to contain Background component */
  z-index: 1;
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
  height: 75px;
}
.logo-center img {
  height: 90px;
}

.contact-button img {
  height: 40px;
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
  .header {
    justify-content: space-around;
  }
}
</style>
