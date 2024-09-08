<script>
	import Contact from '../components/Contact.svelte'; // Import the contact component
	
	let showContact = false;
	
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
  </script>
  
  <header>
	<div class="logo-left">
	  <!-- Wrap the logo image in a button for accessibility -->
	  <button class="logo-button" on:click={openContact} aria-label="Open Contact">
		<img src="/image/NOM.png" alt="Logo Left" />
	  </button>
	</div>
	<div class="logo-center">
	  <button class="logo-center-button" on:click={refreshPage} aria-label="Refresh Page">
		<img src="/image/logo.png" alt="Logo Center" />
	  </button>
	</div>
	<div class="contact">
	  <button class="contact-button" on:click={openContact} aria-label="Contact">
		<img src="/image/contact.png" alt="Contact" />
	  </button>
	</div>
  </header>
  
  {#if showContact}
	<Contact close={closeContact} />
  {/if}
  
  <style>
	header {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  padding: 1% 2%;
	  background: #0000004b;
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
	  position: absolute;
	  left: 50%;
	  transform: translateX(-50%);
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
		position: static; /* Remove absolute positioning */
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
  