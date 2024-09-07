<script>
	import Contact from '../components/Contact.svelte'; // Import the contact component
  
	let showContact = false;
  
	const openContact = () => {
	  showContact = true;
	};
  
	const closeContact = () => {
	  showContact = false;
	};
  </script>
  
  <header>
	<div class="logo-left">
	  <img src="/src/lib/image/NOM.png" alt="Logo Left" />
	</div>
	<div class="logo-center">
	  <img src="/src/lib/image/logo.png" alt="Logo Center" />
	</div>
	<div class="contact">
	  <button class="contact-button" on:click={openContact} aria-label="Contact">
		<img src="/src/lib/image/contact.png" alt="Contact" />
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
  
	.logo-left img {
	  height: 65px;
	}
  
	.logo-center {
	  position: absolute;
	  left: 50%;
	  transform: translateX(-50%);
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
  </style>
  