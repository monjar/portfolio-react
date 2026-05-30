interface FooterProps {
  right: React.ReactNode;
}

const Footer = ({ right }: FooterProps) => (
  <footer className="foot">
    <span>Anno Domini MMXXVI · Amirali Monjar</span>
    <span>{right}</span>
  </footer>
);

export default Footer;
