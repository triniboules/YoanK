<script>
  import '../app.css';
</script>

<slot />

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background-color: black;
    color: white;
    font-family: system-ui, -apple-system, sans-serif;
  }

  :global(*) {
    box-sizing: border-box;
  }
</style>