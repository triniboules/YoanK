<script lang="ts">
  import { v4 as uuidv4 } from 'uuid';
  import Contact from '../components/Contact.svelte';
  import { db, Timestamp, setDoc, doc, arrayUnion } from '../components/firebase';
  import Background from '../components/Background.svelte';

  let showContact = false;
  const hasLocalStorage = typeof localStorage !== 'undefined';

  // Generate or retrieve userId
  let userId = hasLocalStorage ? localStorage.getItem('userId') : null;
  if (!userId) {
      userId = uuidv4();
      if (hasLocalStorage) {
          localStorage.setItem('userId', userId);
      }
  }

  const openContact = () => showContact = true;
  const closeContact = () => showContact = false;

  // Function to refresh the page
  const refreshPage = () => window.location.reload();

  // Function to handle clicks on logos
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

  // Function to handle contact button click
  const handleContactClick = async () => {
      await handleLogoClick('contact');
      openContact();
  };

  // Handle clicks on left and center logos
  const handleLeftLogoClick = () => handleContactClick(); // Changed this line
  const handleCenterLogoClick = async () => { 
      await handleLogoClick('logoCenter'); 
      refreshPage(); 
  };
</script>


<header class="header">
  <div class="logo-left">
      <button class="logo-button" on:click={handleLeftLogoClick} aria-label="Open Contact">
          <img src="/image/NOM.webp" alt="Logo Left" />
      </button>
  </div>
  <div class="logo-center">
      <button class="logo-center-button" on:click={handleCenterLogoClick} aria-label="Refresh Page">
          <img src="/image/logo.webp" alt="Logo Center" />
      </button>
  </div>
  <div class="contact">
      <button class="contact-button" on:click={handleContactClick} aria-label="Contact">
          <img src="/image/contact.webp" alt="Contact" />
      </button>
  </div>
</header>

{#if showContact}
<Contact close={closeContact} />
{/if}

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 3%;
  background: rgba(0, 0, 0, 0.29);
  height: 68px;
  position: relative;
  z-index: 1;
}

.logo-left {
  flex: 1; /* Takes equal space on both sides */
}

.logo-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%); /* Ensures the logo stays centered */
}

.logo-button,
.logo-center-button,
.contact-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.contact-button img {
  height: 30px;
}

.logo-left img,
.logo-center img {
  height: 60px;
}

@media (max-width: 1200px) {
  .logo-center {
    display: none; /* Hides center logo on smaller screens */
  }
}

@media (max-width: 800px) {
  .contact, 
  .logo-center {
    display: none; /* Hides contact and center logo on small screens */
  }
  .header {
    justify-content: space-around; /* Re-distribute items on small screens */
  }
}

</style>
