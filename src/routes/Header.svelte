<script lang="ts">
    import { v4 as uuidv4 } from 'uuid';  // Import UUID
    import Contact from '../components/Contact.svelte'; // Import the contact component
    import { db, Timestamp, setDoc, doc, arrayUnion, getDoc } from '../components/firebase'; // Adjusted import path

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

    console.log('Generated/Retrieved userId:', userId); // Debugging

    const openContact = () => {
        showContact = true;
    };

    const closeContact = () => {
        showContact = false;
    };

    // Function to refresh the page
    const refreshPage = () => {
        window.location.reload();
    };

    // Function to handle clicks on logos
    const handleLogoClick = async (logoPosition: string) => {
        try {
            const logoRef = doc(db, 'header', logoPosition);
            const clickTimestamp = Timestamp.now();

            // Update the logo document with the new click information
            await setDoc(logoRef, {
                clicks: arrayUnion({
                    userId: userId,
                    timestamp: clickTimestamp
                })
            }, { merge: true });

            console.log(`Click recorded for ${logoPosition} logo`);
        } catch (error) {
            console.error(`Error recording click for ${logoPosition} logo:`, error);
        }
    };

    // Function to handle contact button click
    const handleContactClick = async () => {
        await handleLogoClick('contact'); // Log the click for the contact logo
        // Open the Contact component after clicking
        openContact();
    };
    
    // Add these two functions to handle clicks on left and center logos
    const handleLeftLogoClick = async () => {
        await handleLogoClick('logoLeft'); // Log the click for the left logo
    };

    const handleCenterLogoClick = async () => {
        await handleLogoClick('logoCenter'); // Log the click for the center logo
        refreshPage(); // Refresh page after clicking center logo
    };
</script>

<header class="header">
    <div class="logo-left">
        <!-- Wrap the logo image in a button for accessibility -->
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
		justify-content: content;
		align-items: center;
		padding: 0px 3%;
		background: #0000004b;
		height: 78px; /* Fixed height for the header */
		position: relative;
	  }
	
	  .logo-left .logo-button {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	  }
	
	  .logo-left img {
		height: 65px;
	  }
	
	  .logo-center {
		display: flex;
		justify-content: center;
		align-items: auto;
		margin-left: -1.5%; /* Center the logo horizontally */
		transform: scale(100%);
	  }
	
	  .logo-center-button {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	  }
	
	  .logo-center img {
		height: 80px;
	  }
	
	  .contact {
		display: flex;
		align-items: center;
	  }
	
	  .contact-button {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
	  }
	
	  .contact-button img {
		height: 30px; /* Adjust the size as needed */
	  }
	
	  /* Responsive styles */
	  @media (max-width: 1200px) {
		.contact {
		  display: none; /* Hide contact button on small screens */
		}
	
		.logo-center {
		  margin-left: auto; /* Push logo to the right */
		}
	  }
	
	  @media (max-width: 800px) {
		.contact {
		  display: none; /* Hide center logo and contact button on very small screens */
		}
		.logo-center {
		  display: none;
		}
	  }
	</style>