import { useRouter } from 'next/router';
import SubscriptionModal from './SubscriptionModal';
import { useSubscription } from '../hooks/useSubscription';
import { useEffect } from 'react';

export default function Layout({ children }) {
  const { isSubscribed, handleSubscribe } = useSubscription();
  const router = useRouter();

  // List of paths that should show the modal immediately
  const immediateModalPaths = [
    '/tools/tool1',
    '/tools/tool2',
    '/tools/converter',  
    '/tools/qrcode',

    // Add more paths as needed
  ];

  // List of paths that should show modal on scroll
  const scrollModalPaths = [
    '/tools/tool3',
    '/tools/tool4',
    '/tools/resume-analyzer',
    '/tools/research-analyzer',
    '/tools/ai-humanizer',
    
    
  ];

  const shouldShowImmediately = immediateModalPaths.includes(router.pathname);
  const shouldShowOnScroll = scrollModalPaths.includes(router.pathname);

  // Don't show modal if path is not in either list
  if (!shouldShowImmediately && !shouldShowOnScroll) {
    return <div>{children}</div>;
  }

  useEffect(() => {
    console.log('Current path:', router.pathname);
    console.log('Should show immediately:', shouldShowImmediately);
    console.log('Should show on scroll:', shouldShowOnScroll);
    console.log('Is subscribed:', isSubscribed);
  }, [router.pathname, shouldShowImmediately, shouldShowOnScroll, isSubscribed]);

  return (
    <div>
      <SubscriptionModal 
        onSubscribe={handleSubscribe} 
        showImmediately={shouldShowImmediately}
      />
      {children}
    </div>
  );
} 