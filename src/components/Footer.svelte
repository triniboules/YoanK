<script lang="ts">
  import clsx from 'clsx'; 
  let isHovered = false;

  const handleMouseEnter = () => {
    isHovered = true;
  };

  const handleMouseLeave = () => {
    isHovered = false;
  };
</script>

<style>
  footer {
    width: 100vw;
    position: fixed;
    bottom: 0px;
    background-color: var(--col-deepblue);
    color: #fff;
    display: flex; /* Use flexbox for centering */
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
    padding: 22px 0;
  }

  p {
    margin: 0; /* Remove default margin */
    display: flex; /* Use flexbox for the paragraph */
    justify-content: center; /* Center text within the paragraph */
    align-items: center; /* Center vertically */
  }

  .hovered {
    transform: scale(1.05) translateY(-5px);
    transition: transform 0.3s ease-in-out;
  }

  footer a {
    color: #fff;
    text-decoration: none;
    margin-left: 10px;
  }

  @media (max-width: 600px) {
    footer {
      padding: 15px 0; 
    }
  }
</style>

<footer>
  <p
    class={clsx({ hovered: isHovered })} 
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
  >
    <a href="mailto:ksylvestre1@hotmail.com">Crafted by Sylvestre &copy; {new Date().getFullYear()}</a>
  </p>
</footer>
