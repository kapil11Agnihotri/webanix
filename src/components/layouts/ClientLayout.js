import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const ClientLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default ClientLayout;
