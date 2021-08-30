import Logo from "../components/Logo";
import { AiOutlineUser } from "react-icons/ai";

import styles from "../styles/LandingPage.module.css";
import image from "../static/img/stock_image.jpeg";

const LandingPage = () => {
  return (
    <section className={styles.container}>
      <main className={styles.login}>
        <Logo fill="#cc001a" height={80} width={80} />
        <h1>Scrum.io</h1>
        <p>We make IT easy</p>
        <button>
          <AiOutlineUser /> Login
        </button>
      </main>
      <img src={image} alt="Scrum.io" />
    </section>
  );
};

export default LandingPage;
