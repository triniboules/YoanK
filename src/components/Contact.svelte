<script lang="ts">
    import { onMount } from 'svelte';
    export let close = () => {};

    let isEnglish: boolean = false;
    let text: string = '';
    let typingIndex: number = 0;
    let isTyping: boolean = true;

    const frenchText: string =
      "Je suis créateur de contenus vidéo spécialisé dans les projets pour artistes, mariages, entreprises, clips musicaux et divers événements. Chaque projet est une occasion de marier rigueur et créativité, concrétisant vos idées avec précision. Je vous accompagne de la conceptualisation à la réalisation, assurant un service professionnel à chaque étape.";

    const englishText: string =
      "I am a video content creator specializing in projects for artists, weddings, businesses, music videos, and various events. Each project presents an opportunity to blend rigor and creativity, bringing your ideas to life with precision. I support you from conceptualization to realization, ensuring a professional service at every step.";

    const currentText = () => (isEnglish ? englishText : frenchText);

    // Function to handle the typing effect
    const typeText = () => {
      if (typingIndex < currentText().length) {
        text += currentText()[typingIndex];
        typingIndex++;
        setTimeout(typeText, 30); // Adjust typing speed here
      } else {
        isTyping = false;
      }
    };

    // Function to toggle language and restart typing
    const toggleLanguage = (): void => {
      isEnglish = !isEnglish;
      resetTyping();
    };

    const resetTyping = () => {
      typingIndex = 0;
      text = '';
      isTyping = true;
      typeText(); // Start typing the new text
    };

    // Auto-start typing when the component mounts
    onMount(() => {
      typeText();
    });
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
                    <span class="full-text">{currentText()}</span> <!-- The whole text is rendered in white for spacing -->
                    <span class="typed-text">{text}</span> <!-- The typing effect in black -->
                </p>
                <button class="language-toggle" on:click={toggleLanguage} aria-label="Toggle language">
                    <span>{isEnglish ? 'FR' : 'EN'}</span>
                </button>
            </div>
            <div class="contact-info">
                <p class="email">
                    <a href="mailto:yoannkittery@gmail.com">yoannkittery@gmail.com</a>
                </p>
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
        backdrop-filter: blur(30px);
        background: rgba(0, 0, 0, 0.377);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

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

    .close-btn {
        position: absolute;
        top: 6%;
        right: 12%;
        background: none;
        border: none;
        cursor: pointer;
        z-index: 1001;
    }

    .close-icon {
        width: 24px;
        height: 24px;
        transition: opacity 0.3s ease;
    }

    .close-btn:hover .close-icon {
        opacity: 0.6;
    }

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
       box-shadow: 0px 0px 30px 00px #000000;
        border: thick double #323b3f;
        transition: transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
    }

    .avatar-flip {
        border-radius: 100px;
        overflow: hidden;
        height: 140px;
        width: 140px;
        position: relative;
        margin: auto;
        top: -70px;
        box-shadow: 0px 0px 10px 00px #030303;
        transition: transform 0.6s ease-in-out;
    }

    .avatar-flip img {
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 100px;
        transition: opacity 0.6s ease-in-out;
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

    .contact-content:hover .avatar-flip {
        transform: rotateY(180deg);
    }

    .contact-content:hover .avatar-flip img:first-child {
        opacity: 0;
    }

    .contact-content:hover .avatar-flip img:last-child {
        opacity: 1;
    }

    h2 {
    font-size: 2.5rem; /* Increased font size */
    font-weight: 700;
    color: #3c3d3d; /* Darker tone for text color */
    margin-top: -50px;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3); /* Added text shadow for depth */
    letter-spacing: 0.5px; /* Slightly increased letter spacing */
}


    .justified-text {
        text-indent: 1.5rem;
        margin: 10px 0 20px; /* Adjusted gap between text and email */
        font-size: 1.25rem;
        color: white; /* Static text color for spacing */
        line-height: 1.5; /* Increased line-height for better readability */
        text-align: justify;
        position: relative; /* To allow stacking of the typed text */
        font-weight: 450; /* Slightly bold text, adjust as needed (normal is 400) */
    }

    .typed-text {
        position: absolute; /* Position over the static text */
        color: black; /* Typed text color */
        left: 0; /* Align with the static text */
        top: 0; /* Align with the static text */
        white-space: normal; /* Allow wrapping */
        text-indent: 1.5rem; /* Match indentation */
        font-size: 1.25rem; /* Match font size */
        line-height: 1.5; /* Match line-height */
        text-align: justify; /* Match text alignment */
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* Uniformiser la police */
        font-weight: 450; /* Slightly bold text, adjust as needed (normal is 400) */
        
    }

    .contact-info {
        margin-bottom: 0; /* Removed negative margin */
        font-size: 1rem;
        color: #555;
        z-index: 1001;
        
    }

    .email {
        font-size: 1.5rem;
        color: #007bff;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* Uniformiser la police */
    }

    .contact-info a {
        color: inherit;
        text-decoration: none;
        z-index: 1001;
        
    }

    .contact-info a:hover {
        text-decoration: underline;
    }

    p, h2, a {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

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

    @media (max-width: 1000px) {
        .contact-content {
            width: 75%;
        }
    }

    @media (max-width: 800px) {
        .contact-content {
            width: 100%;
        }
    }
</style>
