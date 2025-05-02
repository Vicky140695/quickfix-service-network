
import Layout from '../../components/Layout';
import PhoneVerification from '../../components/PhoneVerification';

const WorkerPhoneVerificationPage = () => {
  return (
    <Layout>
      <PhoneVerification 
        workerRoute="/worker/registration"
        skipRoute="/worker/terms"
      />
    </Layout>
  );
};

export default WorkerPhoneVerificationPage;
