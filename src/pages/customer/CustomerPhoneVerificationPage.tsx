
import Layout from '../../components/Layout';
import PhoneVerification from '../../components/PhoneVerification';

const CustomerPhoneVerificationPage = () => {
  return (
    <Layout>
      <PhoneVerification 
        customerRoute="/customer/dashboard"
        skipRoute="/customer/dashboard"
      />
    </Layout>
  );
};

export default CustomerPhoneVerificationPage;
