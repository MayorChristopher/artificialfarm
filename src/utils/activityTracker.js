import { supabase } from '@/lib/supabase';

class ActivityTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.pageViews = [];
    this.isTracking = false;
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async startTracking() {
    if (this.isTracking) return;
    this.isTracking = true;

    // Track page view
    this.trackPageView(window.location.pathname);

    // Track page visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

    // Track before page unload
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));

    // Track route changes for SPA
    this.trackRouteChanges();

    // Send initial session data
    await this.recordSession();
  }

  trackPageView(path) {
    const pageView = {
      path,
      timestamp: Date.now(),
      title: document.title
    };
    this.pageViews.push(pageView);
    this.recordPageView(pageView);
  }

  trackRouteChanges() {
    let currentPath = window.location.pathname;
    
    // Override pushState and replaceState to track SPA navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        window.activityTracker?.trackPageView(currentPath);
      }
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        window.activityTracker?.trackPageView(currentPath);
      }
    };

    // Listen for popstate events (back/forward buttons)
    window.addEventListener('popstate', () => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        this.trackPageView(currentPath);
      }
    });
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.recordSession();
    }
  }

  handleBeforeUnload() {
    this.recordSession();
  }

  async recordSession() {
    try {
      const sessionData = {
        session_id: this.sessionId,
        duration: Date.now() - this.startTime,
        page_views: this.pageViews.length,
        pages_visited: [...new Set(this.pageViews.map(pv => pv.path))],
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        created_at: new Date().toISOString()
      };

      // Store in local storage as backup
      localStorage.setItem('lastSession', JSON.stringify(sessionData));

      // Try to send to database
      await this.sendToDatabase(sessionData);
    } catch (error) {
      console.error('Error recording session:', error);
    }
  }

  async recordPageView(pageView) {
    try {
      const pageViewData = {
        session_id: this.sessionId,
        path: pageView.path,
        title: pageView.title,
        timestamp: new Date(pageView.timestamp).toISOString(),
        referrer: document.referrer || null
      };

      await this.sendPageViewToDatabase(pageViewData);
    } catch (error) {
      console.error('Error recording page view:', error);
    }
  }

  async sendToDatabase(sessionData) {
    // Create user_sessions table if it doesn't exist
    const { error } = await supabase
      .from('user_sessions')
      .insert(sessionData);

    if (error && error.code === '42P01') {
      // Table doesn't exist, create it
      await this.createSessionTable();
      // Retry insert
      await supabase.from('user_sessions').insert(sessionData);
    }
  }

  async sendPageViewToDatabase(pageViewData) {
    const { error } = await supabase
      .from('page_views')
      .insert(pageViewData);

    if (error && error.code === '42P01') {
      // Table doesn't exist, create it
      await this.createPageViewTable();
      // Retry insert
      await supabase.from('page_views').insert(pageViewData);
    }
  }

  async createSessionTable() {
    // This would typically be done via SQL migration
    console.log('Session tracking table needs to be created in database');
  }

  async createPageViewTable() {
    // This would typically be done via SQL migration
    console.log('Page view tracking table needs to be created in database');
  }

  // Track specific events
  trackEvent(eventName, eventData = {}) {
    const event = {
      session_id: this.sessionId,
      event_name: eventName,
      event_data: eventData,
      timestamp: new Date().toISOString(),
      path: window.location.pathname
    };

    this.recordEvent(event);
  }

  async recordEvent(event) {
    try {
      await supabase.from('user_events').insert(event);
    } catch (error) {
      console.error('Error recording event:', error);
    }
  }

  // Track course enrollments
  trackCourseEnrollment(courseId, courseName) {
    this.trackEvent('course_enrollment', {
      course_id: courseId,
      course_name: courseName
    });
  }

  // Track video plays
  trackVideoPlay(videoId, videoTitle) {
    this.trackEvent('video_play', {
      video_id: videoId,
      video_title: videoTitle
    });
  }

  // Track form submissions
  trackFormSubmission(formType, formData = {}) {
    this.trackEvent('form_submission', {
      form_type: formType,
      ...formData
    });
  }

  // Track downloads
  trackDownload(resourceId, resourceName) {
    this.trackEvent('resource_download', {
      resource_id: resourceId,
      resource_name: resourceName
    });
  }
}

// Create global instance
const activityTracker = new ActivityTracker();

// Auto-start tracking when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    activityTracker.startTracking();
  });
} else {
  activityTracker.startTracking();
}

// Make available globally
window.activityTracker = activityTracker;

export default activityTracker;