<script>
    export let close = () => {};
  
    let isEnglish = false; // Flag to toggle between languages
  
    const toggleLanguage = () => {
      isEnglish = !isEnglish;
    };
  
    // Text content
    const frenchText = "Créateur de contenus vidéo pour artistes, mariages, entreprises, clips musicaux et tout type d'événements. Chaque projet est pour moi une occasion d'allier rigueur et créativité pour concrétiser vos idées avec précision. Je vous accompagne de la conceptualisation à la réalisation, afin de donner vie à vos projets avec professionnalisme.";
    const englishText = "Video content creator for artists, weddings, businesses, music videos, and all types of events. Each project is an opportunity for me to combine rigor and creativity to bring your ideas to life with precision. I support you from conceptualization to realization, to bring your projects to life with professionalism.";
  </script>
  
  <div class="contact-modal">
    <div class="contact-content">
      <button class="close-btn" on:click={close} aria-label="Close contact">
        <img src="/image/X2.webp" alt="Close" class="close-icon" />
      </button>
  
      <div class="profile-card">
        <div class="avatar-flip">
          <img src="/image/pro.webp" alt="Yoann Kittery Front" class="profile-image" />
          <img src="/image/proback.webp" alt="Yoann Kittery Back" class="profile-image" />
        </div>
        <h2>Yoann Kittery</h2>
        <div class="glass-effect">
          <p class="justified-text">
            {isEnglish ? englishText : frenchText}
          </p>
          <button class="language-toggle" on:click={toggleLanguage} aria-label="Toggle language"></button>
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
      transition: opacity 0.3s ease; /* Smooth opacity transition */
  }
  
  .close-btn:hover .close-icon {
      opacity: 0.6; /* Reduced opacity on hover */
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
      box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2);
      transition: transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out; /* Adjusted transition */
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
      box-shadow: 0 0 0 10px #ffffff;
      transition: transform 0.6s ease-in-out; /* Smooth flip transition */
  }
  
  .avatar-flip img {
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 100px;
      transition: opacity 0.6s ease-in-out; /* Match transition duration */
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
  
  /* Justified text */
  .justified-text {
    text-indent: 1.5rem;
    margin-top: 10px;
    font-size: 1.125rem;
    color: #272727;
    line-height: 1.2;
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
  p, h2, a {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
  
  /* Invisible button */
  .language-toggle {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      border: none;
      cursor: pointer;
      z-index: 1000;
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
  