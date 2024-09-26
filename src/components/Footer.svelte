<script lang="ts">
  import { SvelteComponent } from 'svelte';
</script>

<style>
  footer {
    width: 100vw;
    position: fixed;
    bottom: 0px;
    background-color: var(--col-deepblue);
    color: #fff;
    text-align: center;
    padding: 22px 0;
  }

  footer p:hover {
    transform: scale(1.05) translateY(-5px); /* Added hover effect to scale up and move up the <p> element */
    transition: transform 0.3s ease-in-out; /* Added transition for smooth scaling and movement */
  }

  footer a {
    color: #fff;
    text-decoration: none;
    margin-left: 10px;
  }
</style>

<footer>
  <p>Crafted by <a href="mailto:ksylvestre1@hotmail.com">Sylvestre</a> &copy; {new Date().getFullYear()}</p>
</footer>