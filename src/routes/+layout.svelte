<script>
	import Header from './Header.svelte';
	import '../app.css';
  </script>
  
  <div class="app">

  
	<main>
	  <slot />
	</main>
  
	<footer>
	
	</footer>
  </div>
  
  <style>
	.app {
	  display: flex;
	  flex-direction: column;
	  min-height: 100vh;
	  margin: 0; /* Ensure no margin affects layout */
	  box-sizing: border-box; /* Apply box-sizing to all elements */
	}
  
	main {
	  flex: 1;
	  display: flex;
	  flex-direction: column;
	  
	  width: 100%;
	  max-width: 100%;
	  margin: 0 auto;
	  box-sizing: border-box;
	}
  
	footer {
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	  align-items: center;
	  padding: 12px;
	  background: var(--color-bg-1); /* Optional: set background color if needed */
	  box-sizing: border-box; /* Apply box-sizing to footer */
	}

	@media (min-width: 480px) {
	  footer {
		padding: 12px 0; /* Adjust padding for larger screens */
	  }
	}
  </style>
  