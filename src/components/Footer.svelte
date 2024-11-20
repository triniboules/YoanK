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
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 0;
  }

  p {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  @keyframes breathing {
    0% {
      opacity: 0.4;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 0.4;
    }
  }

  footer a {
    color: rgba(0, 0, 0, 0.7);
    text-decoration: none;
    margin-left: 10px;
    transition: all 0.5s ease;
    animation: breathing 3s ease-in-out infinite;
  }

  .hovered a {
    color: #fff;
    animation: none;
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
