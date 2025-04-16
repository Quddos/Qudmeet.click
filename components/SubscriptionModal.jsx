import { useState, useEffect } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  animation: slideUp 0.5s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const SubscribeButton = styled.button`
  background-color: #0077b5;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #005582;
  }
`;

const SubscriptionModal = ({ onSubscribe, showImmediately = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [buttonClicks, setButtonClicks] = useState(0);

  useEffect(() => {
    try {
      const subscriptionStatus = localStorage.getItem('linkedinFollowed');
      if (subscriptionStatus === 'true') {
        setHasSubscribed(true);
        return;
      }

      if (showImmediately) {
        console.log('Starting 30-second timer...'); // Debug log
        const timer = setTimeout(() => {
          console.log('Timer completed, showing modal...'); // Debug log
          setIsVisible(true);
        }, 20000); // 20000ms = 20 seconds

        return () => {
          console.log('Cleaning up timer...'); // Debug log
          clearTimeout(timer);
        };
      }

      const handleScroll = () => {
        if (window.scrollY > 300 && !hasSubscribed) {
          setIsVisible(true);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } catch (error) {
      console.error('localStorage error:', error);
    }
  }, [hasSubscribed, showImmediately]);

  // Log state changes
  useEffect(() => {
    console.log('Modal visibility changed:', isVisible);
  }, [isVisible]);

  // Track button clicks globally
  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.tagName === 'BUTTON') {
        setButtonClicks(prev => {
          const newCount = prev + 1;
          if (newCount >= 2 && !hasSubscribed) {
            setIsVisible(true);
          }
          return newCount;
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [hasSubscribed]);

  const handleSubscribe = () => {
    try {
      // LinkedIn company page link
      window.open('https://www.linkedin.com/company/105658013', '_blank');
      localStorage.setItem('linkedinFollowed', 'true');
      setHasSubscribed(true);
      setIsVisible(false);

      if (onSubscribe) {
        onSubscribe();
      }
    } catch (error) {
      console.error('Error saving subscription status:', error);
    }
  };

  if (!isVisible || hasSubscribed) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Follow Us to Continue</h2>
        <p>
          We plan to make these tools generally free for usage. To help us grow
          and continue using our tools, kindly follow our LinkedIn company page
          to gain access and continue using the tools.
        </p>
        <SubscribeButton onClick={handleSubscribe}>
          Follow Qudmeet on LinkedIn
        </SubscribeButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SubscriptionModal;