<script>
  export let close = () => {};
</script>

<div class="contact-modal">
  <div class="contact-content">
    <button class="close-btn" on:click={close} aria-label="Close contact">
      <img src="/image/X2.png" alt="Close" class="close-icon" />
    </button>

    <div class="profile-card">
      <div class="avatar-flip">
        <img src="/image/pro.png" alt="Yoann Kittery Front" class="profile-image" />
        <img src="/image/proback.jpg" alt="Yoann Kittery Back" class="profile-image" />
      </div>
      <h2>Yoann Kittery</h2>
      <div class="glass-effect">
        <p class="justified-text">
          Créateur de contenus vidéo pour artistes, mariages, entreprises, clips musicaux et tout type d'événements. Chaque projet est pour moi une occasion d'allier rigueur et créativité pour concrétiser vos idées avec précision. Je vous accompagne de la conceptualisation à la réalisation, afin de donner vie à vos projets avec professionnalisme.
        </p>
      </div>
      <div class="contact-info">
        <p> <a href="mailto:yoannkittery@gmail.com">yoannkittery@gmail.com</a></p>
      </div>
    </div>
  </div>
</div>

<style>
/* Modal background */
.contact-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.85); 
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

/* Modal content container */
.contact-content {
    position: relative;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    max-width: 500px;
    padding: 20px;
    box-sizing: border-box;
}

/* Close button styles */
.close-btn {
    position: absolute;
    top: 6%;
    right: 6%;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 1001;
}

.close-icon {
    width: 24px;
    height: 24px;
}

.close-btn:hover .close-icon {
    opacity: 0.8;
}

/* Profile card container */
.profile-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffffff;
    border-radius: 20px;
    padding: 2rem;
    max-width: 420px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease-in-out;
}

/* Avatar flip effect */
.avatar-flip {
    border-radius: 100px;
    overflow: hidden;
    height: 140px;
    width: 140px;
    position: relative;
    margin: auto;
    top: -70px;
    box-shadow: 0 0 0 10px #e0e0e0;
    transition: all 0.3s ease-in-out;
}

.avatar-flip img {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 100px;
    transition: all 0.3s ease-in-out;
    width: 140px;
    height: 140px;
}

.avatar-flip img:first-child {
    z-index: 1;
}

.avatar-flip img:last-child {
    z-index: 0;
    transform: rotateY(180deg);
    opacity: 0;
}

/* Avatar flip on hover */
.contact-content:hover .avatar-flip {
    transform: rotateY(180deg);
}

.contact-content:hover .avatar-flip img:first-child {
    opacity: 0;
}

.contact-content:hover .avatar-flip img:last-child {
    opacity: 1;
}

/* Header styling */
h2 {
    font-size: 2.25rem;
    font-weight: 700;
    color: #222;
    margin-top: -50px;
    margin-bottom: 1rem;
}

/* Glass effect only for the main text */
.glass-effect {
    background: rgba(2, 2, 2, 0.034); /* Light transparent background */
    border-radius: 5px;
    backdrop-filter: blur(20px); /* Glass effect */
    padding-right: 1rem;
    padding-left: 1rem;
    margin-top: 0px;
    box-shadow: 0 9px 10px rgba(0, 0, 0, 0.459);
}

/* Justified text */
.justified-text {
  text-indent: 1.5rem; /* Adjust the indentation of the first line */
  margin-top: 10px;
    text-align: justify; /* Justified alignment for the text */
    font-size: 1.125rem;
    color: #444;
    line-height: 1.6;
}

/* Contact info styling */
.contact-info {
    margin-bottom: -8%;
    font-size: 1rem;
    color: #555;
}

.contact-info a {
    color: #007bff;
    text-decoration: none;
}

.contact-info a:hover {
    text-decoration: underline;
}

/* System font stack */
body, p, h2, a {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* Media query for screens less than 1000px wide */
@media (max-width: 1000px) {
    .contact-content {
        width: 75%;
    }
}

/* Media query for screens less than 800px wide */
@media (max-width: 800px) {
    .contact-content {
        width: 100%;
    }
}
</style>
