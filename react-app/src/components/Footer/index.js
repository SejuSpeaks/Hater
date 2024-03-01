import { Link } from "react-router-dom";
import './Footer.css';

const Footer = () => {
    return (
        <footer id="footer">
            <p>Powered by a team of <span><Link to={'/about'}>engineers</Link></span> 🚀</p>
        </footer>
    )
}

export default Footer;
