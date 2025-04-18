import logoDark from "../assets/images/logo-dark.svg";
import logoLight from "../assets/images/logo-light.svg";

const Logo = () => (
  <>
    <img src={logoLight} alt="Логотип" className="block dark:hidden h-10" />
    <img src={logoDark} alt="Логотип" className="hidden dark:block h-10" />
  </>
);

export default Logo;