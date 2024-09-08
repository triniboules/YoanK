<script>
  export let close = () => {};
</script>

<div class="contact-modal">
  <div class="contact-content">
    <button class="close-btn" on:click={close} aria-label="Close contact">
      <img src="/image/X.png" alt="Close" class="close-icon" />
    </button>

    <div class="profile-card">
      <div class="avatar-flip">
        <img src="/image/pro.png" alt="Yoann Kittery Front" class="profile-image" />
        <img src="/image/proback.jpg" alt="Yoann Kittery Back" class="profile-image" />
      </div>
      <h2>Yoann Kittery</h2>
      <p>
        Créateur de contenus vidéo pour artistes, mariages, entreprises, clips musicaux et tout type d'événements. Chaque projet est pour moi une nouvelle opportunité de m'investir avec rigueur et sens de l'écoute. Je vous accompagne à chaque étape, de la conceptualisation à la réalisation, pour donner vie à vos idées avec créativité et professionnalisme.
      </p>
      <div class="contact-info">
        <p>Email: <a href="mailto:yoann@example.com">yoann@example.com</a></p>
        <p>Phone: <a href="tel:+1234567890">+1 (234) 567-890</a></p>
      </div>
    </div>
  </div>
</div>

<style>
  .contact-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.85); /* Darker for better contrast */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    transition: all 0.3s ease-in-out;
}

.contact-content {
    position: relative; /* Ensure the close button is positioned relative to this container */
    background: rgba(0, 0, 0, 0); /* Transparent background */
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%; /* Default width is 100% */
    max-width: 1000px; /* Maximum width for larger screens */
    box-sizing: border-box; /* Ensure padding is included in the width calculation */
}

/* Media query for screens less than 1000px wide */
@media (max-width: 1000px) {
    .contact-content {
        width: 80%; /* Set width to 80% for smaller screens */
        max-width: none; /* Remove max-width restriction for smaller screens */
    }
}

.close-btn {
    position: absolute;
    top: -7%; /* Fixed distance from the top of .contact-content */
    right: -5%; /* Fixed distance from the right of .contact-content */
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    z-index: 1001;
}

.close-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
}

.close-btn:hover .close-icon {
    opacity: 0.8;
}

.profile-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffffff; /* Light card background */
    border-radius: 20px;
    padding: 2rem 2rem; /* Slightly reduced padding for better balance */
    max-width: 420px;
    margin: 0 auto;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* Deeper shadow for better focus */
    transition: all 0.3s ease-in-out;
    position: relative;
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
    transition: all 0.3s ease-in-out;
    box-shadow: 0 0 0 10px #ffffff;
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
    font-size: 2.25rem; /* Slightly larger font size for prominence */
    font-weight: 700;
    color: #222; /* Darker color for better contrast */
    margin-top: -40px; /* Adjust for avatar overlap */
    margin-bottom: 1rem; /* Increased margin for better spacing */
}

p {
    font-size: 1.125rem; /* Larger font size for better readability */
    color: #444; /* Darker color for better readability */
    line-height: 1.6; /* Better readability */
    margin-bottom: 0; /* Increased margin for better spacing */
    padding: 0px; /* Added padding for better text alignment */
}

/* Contact info styling */
.contact-info {
    margin-top: 1.5rem;
    font-size: 1rem;
    color: #555;
}

.contact-info a {
    color: #007bff; /* Link color */
    text-decoration: none;
}

.contact-info a:hover {
    text-decoration: underline;
}

/* Subtle scaling effect on hover */
.contact-content:hover .profile-card {
    transform: scale(1.05); 
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.25); /* Deeper shadow on hover */
}

</style>
