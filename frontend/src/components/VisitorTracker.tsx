import { useEffect } from 'react';
import { API_BASE_URL } from '@/config';

export function VisitorTracker() {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Generate a unique visitor ID based on browser fingerprint
        const getVisitorId = () => {
          let visitorId = localStorage.getItem('visitorId');
          if (!visitorId) {
            // Create unique ID from browser characteristics
            const fingerprint = `${navigator.userAgent}-${navigator.language}-${screen.width}x${screen.height}`;
            visitorId = btoa(fingerprint).substring(0, 20) + Date.now();
            localStorage.setItem('visitorId', visitorId);
          }
          return visitorId;
        };

        // Check if this page was already tracked in this session
        const currentPage = window.location.pathname;
        const trackedPages = sessionStorage.getItem('trackedPages');
        const trackedPagesArray = trackedPages ? JSON.parse(trackedPages) : [];
        
        if (trackedPagesArray.includes(currentPage)) {
          console.log('Page already tracked in this session');
          return;
        }

        // Get visitor info
        const visitorInfo = {
          visitorId: getVisitorId(),
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          language: navigator.language,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          referrer: document.referrer || 'Direct',
          currentPage: currentPage
        };

        console.log('Tracking visitor:', visitorInfo);

        // Send to backend
        const response = await fetch(`${API_BASE_URL}/analytics/track-visitor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(visitorInfo),
        });

        const data = await response.json();
        console.log('Visitor tracking response:', data);

        if (data.success) {
          console.log('✅ Visitor tracked successfully!');
          // Mark this page as tracked
          trackedPagesArray.push(currentPage);
          sessionStorage.setItem('trackedPages', JSON.stringify(trackedPagesArray));
        } else {
          console.error('❌ Visitor tracking failed:', data.message);
        }
      } catch (error) {
        console.error('Visitor tracking error:', error);
      }
    };

    // Track after a short delay to ensure page is loaded
    const timer = setTimeout(trackVisitor, 1000);
    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
}
