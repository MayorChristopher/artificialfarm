import { supabase } from './supabase';
import { aiLearningService } from './aiLearningService';

// Initialize auto-learning on service load
aiLearningService.scheduleAutoLearning();

export const chatbotService = {
  _siteData: null,
  _lastDataFetch: 0,
  _dataFetchInterval: 300000, // 5 minutes

  // Load and cache site data
  async loadSiteData() {
    const now = Date.now();
    if (this._siteData && (now - this._lastDataFetch) < this._dataFetchInterval) {
      return this._siteData;
    }

    try {
      const [coursesRes, successStoriesRes, testimonialsRes] = await Promise.all([
        supabase.from('courses').select('id, title, description, category, difficulty_level').limit(10),
        supabase.from('success_stories').select('title, description').limit(5),
        supabase.from('testimonials').select('name, content, rating').limit(5)
      ]);

      this._siteData = {
        courses: coursesRes.data || [],
        successStories: successStoriesRes.data || [],
        testimonials: testimonialsRes.data || [],
        lastUpdated: now
      };
      this._lastDataFetch = now;
      
      return this._siteData;
    } catch (error) {
      console.error('Error loading site data for chatbot:', error);
      return this._siteData || this.getDefaultSiteData();
    }
  },

  // Get user-specific data
  async getUserData(user) {
    if (!user?.id) return null;

    try {
      const [enrollmentsRes, progressRes] = await Promise.all([
        supabase
          .from('course_enrollments')
          .select('*, courses(title, category)')
          .eq('user_id', user.id)
          .limit(5),
        supabase
          .from('lesson_progress')
          .select('course_id, completed, watched_percentage')
          .eq('user_id', user.id)
          .limit(20)
      ]);

      const enrollments = enrollmentsRes.data || [];
      const progress = progressRes.data || [];
      
      const totalProgress = enrollments.length > 0 
        ? Math.round(enrollments.reduce((sum, course) => sum + (course.progress || 0), 0) / enrollments.length)
        : 0;

      const completedLessons = progress.filter(p => p.completed).length;
      const totalLessons = progress.length;

      return {
        name: user.user_metadata?.full_name || 'there',
        email: user.email,
        enrollments,
        totalProgress,
        completedLessons,
        totalLessons,
        isActive: enrollments.length > 0
      };
    } catch (error) {
      console.error('Error loading user data:', error);
      return {
        name: user.user_metadata?.full_name || 'there',
        email: user.email,
        enrollments: [],
        totalProgress: 0,
        completedLessons: 0,
        totalLessons: 0,
        isActive: false
      };
    }
  },

  // Default site data fallback
  getDefaultSiteData() {
    return {
      courses: [
        { title: 'Smart Farming Basics', category: 'Agriculture', difficulty_level: 'Beginner' },
        { title: 'Soil Analysis & Management', category: 'Agriculture', difficulty_level: 'Intermediate' },
        { title: 'IoT in Agriculture', category: 'Technology', difficulty_level: 'Advanced' },
        { title: 'Sustainable Farming Practices', category: 'Sustainability', difficulty_level: 'Intermediate' }
      ],
      successStories: [
        { title: 'Increased Crop Yield by 40%', description: 'Using smart irrigation systems' },
        { title: 'Reduced Water Usage by 30%', description: 'Through precision agriculture' }
      ],
      testimonials: [
        { name: 'John Farmer', content: 'Amazing courses that transformed my farm!', rating: 5 }
      ]
    };
  },

  // Main response generation with AI learning
  async getResponse(message, user = null) {
    const lowerMessage = message.toLowerCase();
    const siteData = await this.loadSiteData();
    const userData = await this.getUserData(user);
    
    // Get learned patterns for improved responses
    const patterns = await aiLearningService.getLearnedPatterns();
    
    // Try to generate improved response based on learning
    const learnedResponse = await aiLearningService.generateImprovedResponse(
      message, 
      { userName: userData?.name, userId: user?.id }, 
      patterns
    );
    
    if (learnedResponse) {
      // Log the learned response
      if (user?.id) {
        await aiLearningService.logConversation(
          user.id, 
          message, 
          learnedResponse, 
          { source: 'learned', userData, siteData, confidence: 'high' }
        );
      }
      return learnedResponse;
    }

    // Context-aware greeting
    if (this.isGreeting(lowerMessage)) {
      return this.getGreetingResponse(userData, siteData);
    }

    // Course-related queries
    if (this.isCourseQuery(lowerMessage)) {
      return this.getCourseResponse(lowerMessage, siteData, userData);
    }

    // Progress tracking
    if (this.isProgressQuery(lowerMessage)) {
      return this.getProgressResponse(userData);
    }

    // Technology and farming topics
    if (this.isTechnologyQuery(lowerMessage)) {
      return this.getTechnologyResponse(lowerMessage, siteData);
    }

    // Success stories and testimonials
    if (this.isSuccessQuery(lowerMessage)) {
      return this.getSuccessResponse(siteData);
    }

    // Consulting and expert advice
    if (this.isConsultingQuery(lowerMessage)) {
      return this.getConsultingResponse(userData);
    }

    // Contact and support
    if (this.isContactQuery(lowerMessage)) {
      return this.getContactResponse();
    }

    // Specific farming topics
    if (this.isFarmingTopicQuery(lowerMessage)) {
      return this.getFarmingTopicResponse(lowerMessage, siteData);
    }

    // Default intelligent response
    const response = this.getDefaultResponse(lowerMessage, userData);
    
    // Log conversation for learning
    if (user?.id) {
      await aiLearningService.logConversation(
        user.id, 
        message, 
        response, 
        { source: 'default', userData, siteData, confidence: 'medium' }
      );
    }
    
    return response;
  },

  // Query type detection methods
  isGreeting(message) {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'];
    return greetings.some(greeting => message.includes(greeting));
  },

  isCourseQuery(message) {
    const courseKeywords = ['course', 'learn', 'training', 'study', 'education', 'class', 'lesson', 'curriculum'];
    return courseKeywords.some(keyword => message.includes(keyword));
  },

  isProgressQuery(message) {
    const progressKeywords = ['progress', 'track', 'complete', 'finish', 'achievement', 'status'];
    return progressKeywords.some(keyword => message.includes(keyword));
  },

  isTechnologyQuery(message) {
    const techKeywords = ['technology', 'iot', 'smart', 'automation', 'sensor', 'drone', 'ai', 'digital'];
    return techKeywords.some(keyword => message.includes(keyword));
  },

  isSuccessQuery(message) {
    const successKeywords = ['success', 'result', 'achievement', 'testimonial', 'review', 'story'];
    return successKeywords.some(keyword => message.includes(keyword));
  },

  isConsultingQuery(message) {
    const consultingKeywords = ['consult', 'advice', 'expert', 'specialist', 'help', 'guidance'];
    return consultingKeywords.some(keyword => message.includes(keyword));
  },

  isContactQuery(message) {
    const contactKeywords = ['contact', 'reach', 'support', 'phone', 'email', 'call'];
    return contactKeywords.some(keyword => message.includes(keyword));
  },

  isFarmingTopicQuery(message) {
    const farmingKeywords = ['soil', 'crop', 'plant', 'harvest', 'water', 'irrigation', 'pest', 'fertilizer', 'seed'];
    return farmingKeywords.some(keyword => message.includes(keyword));
  },

  // Response generation methods
  getGreetingResponse(userData, siteData) {
    const name = userData?.name || 'there';
    const responses = [
      `Hello ${name}! Welcome to Artificial Farm Academy. I'm AFAC Assistant, your intelligent farming companion. I have access to ${siteData.courses.length} courses and can provide personalized guidance based on your farming goals.`,
      `Hi ${name}! I'm here to help you with smart farming solutions, course recommendations, and expert advice. What farming challenge can I help you solve today?`,
      `Welcome ${name}! I can assist you with our comprehensive farming courses, technology solutions, and connect you with expert consultants. How can I help you grow your farming success?`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getCourseResponse(message, siteData, userData) {
    const courses = siteData.courses;
    
    if (message.includes('beginner') || message.includes('start')) {
      const beginnerCourses = courses.filter(c => c.difficulty_level === 'Beginner');
      if (beginnerCourses.length > 0) {
        return `Perfect for beginners! I recommend starting with "${beginnerCourses[0].title}". We also have ${courses.length} total courses covering everything from basic farming to advanced IoT integration. Would you like me to suggest a learning path based on your interests?`;
      }
    }

    if (message.includes('advanced') || message.includes('expert')) {
      const advancedCourses = courses.filter(c => c.difficulty_level === 'Advanced');
      if (advancedCourses.length > 0) {
        return `For advanced learners, I recommend "${advancedCourses[0].title}". Our advanced courses cover cutting-edge farming technologies and data-driven agriculture. What specific advanced topic interests you most?`;
      }
    }

    const enrolledCount = userData?.enrollments?.length || 0;
    if (enrolledCount > 0) {
      return `You're currently enrolled in ${enrolledCount} courses with ${userData.totalProgress}% average progress. Our course library includes ${courses.length} courses across categories like ${courses.map(c => c.category).filter((v, i, a) => a.indexOf(v) === i).slice(0, 3).join(', ')}. Would you like recommendations for your next course?`;
    }

    return `We offer ${courses.length} comprehensive courses including "${courses[0]?.title}", "${courses[1]?.title}", and more. Our courses range from beginner to advanced levels. What's your current farming experience level?`;
  },

  getProgressResponse(userData) {
    if (!userData || !userData.isActive) {
      return "To track your progress, you'll need to enroll in our courses first. I can recommend some excellent starting courses based on your farming interests and experience level. What type of farming are you most interested in?";
    }

    const { totalProgress, completedLessons, totalLessons, enrollments } = userData;
    return `Great question! You're making excellent progress with ${totalProgress}% average completion across your ${enrollments.length} enrolled courses. You've completed ${completedLessons} out of ${totalLessons} lessons. Keep up the fantastic work! Would you like tips on staying motivated or suggestions for your next learning milestone?`;
  },

  getTechnologyResponse(message, siteData) {
    const techCourses = siteData.courses.filter(c => 
      c.category === 'Technology' || c.title.toLowerCase().includes('iot') || c.title.toLowerCase().includes('smart')
    );

    if (message.includes('iot') || message.includes('sensor')) {
      return `IoT and sensors are revolutionizing agriculture! Our technology courses cover soil sensors, weather monitoring, automated irrigation, and crop health tracking. These technologies can increase yields by 20-40% while reducing resource usage. ${techCourses.length > 0 ? `Check out our "${techCourses[0].title}" course.` : ''} What specific IoT application interests you most?`;
    }

    if (message.includes('drone') || message.includes('monitoring')) {
      return `Drone technology is amazing for crop monitoring and precision agriculture! Drones can detect pest infestations, monitor crop health, and optimize fertilizer application. Combined with AI analysis, they provide invaluable insights for modern farmers. Would you like to learn about integrating drones into your farming operations?`;
    }

    return `Smart farming technology is transforming agriculture! We cover IoT sensors, automated systems, data analytics, and AI-powered crop management. These technologies can significantly improve efficiency and yields. What aspect of agricultural technology interests you most?`;
  },

  getSuccessResponse(siteData) {
    const stories = siteData.successStories;
    const testimonials = siteData.testimonials;

    if (stories.length > 0) {
      const story = stories[0];
      return `Our farmers achieve incredible results! For example, one farmer ${story.title.toLowerCase()} ${story.description}. ${testimonials.length > 0 ? `As ${testimonials[0].name} says: "${testimonials[0].content}"` : ''} These success stories show what's possible with the right knowledge and techniques. Would you like to hear more success stories or learn how to achieve similar results?`;
    }

    return `We've helped countless farmers transform their operations! Our students typically see 20-40% increases in crop yields, 30% reduction in water usage, and significant cost savings through smart farming techniques. Success comes from combining traditional farming wisdom with modern technology. What farming challenge would you like to overcome?`;
  },

  getConsultingResponse(userData) {
    const name = userData?.name || 'there';
    return `Hello ${name}! Our expert consultants provide personalized farm optimization, technology integration, and sustainable farming strategies. We offer one-on-one consultations for crop yield improvement, resource management, and smart farming implementation. Our consultants have helped farmers increase productivity by up to 40%. Would you like to schedule a consultation or learn more about our consulting services?`;
  },

  getContactResponse() {
    return `You can reach our support team at Artificialfarm24@gmail.com or call us at +234 803 562 6198. We're also available through WhatsApp for quick questions. Our team typically responds within 2-4 hours during business hours. I'm also here 24/7 to help with immediate questions about courses, farming techniques, and general guidance!`;
  },

  getFarmingTopicResponse(message, siteData) {
    if (message.includes('soil')) {
      return `Soil health is the foundation of successful farming! Key factors include pH levels, nutrient content, organic matter, and soil structure. Our courses cover soil testing, amendment strategies, and sustainable soil management practices. Healthy soil can increase yields by 25-50%. Would you like specific advice on soil testing or improvement techniques?`;
    }

    if (message.includes('water') || message.includes('irrigation')) {
      return `Water management is crucial for sustainable farming! Efficient irrigation systems can reduce water usage by 30-50% while maintaining or increasing yields. We cover drip irrigation, smart sprinkler systems, soil moisture monitoring, and drought-resistant techniques. What's your current irrigation setup?`;
    }

    if (message.includes('pest') || message.includes('disease')) {
      return `Integrated Pest Management (IPM) is key to healthy crops! This includes biological controls, beneficial insects, crop rotation, and targeted treatments. Early detection through monitoring and smart sensors can prevent major infestations. Our courses teach sustainable pest control methods that protect both crops and the environment.`;
    }

    if (message.includes('crop') || message.includes('plant')) {
      return `Crop optimization involves selecting the right varieties, proper spacing, nutrient management, and growth monitoring. Modern techniques include precision planting, variable rate application, and data-driven decision making. What crops are you currently growing or planning to grow?`;
    }

    return `That's an important farming topic! Our comprehensive courses cover all aspects of modern agriculture, from traditional techniques to cutting-edge technology. I can provide specific guidance if you tell me more about your farming situation and goals. What specific challenge are you facing?`;
  },

  getDefaultResponse(message, userData) {
    const name = userData?.name || 'there';
    const responses = [
      `That's a great question, ${name}! I'd love to provide more specific guidance. Could you tell me more about your farming goals or current challenges? I have access to comprehensive course data and can offer personalized recommendations.`,
      `Interesting topic! As your farming companion, I can help with course recommendations, farming techniques, and connecting you with experts. What specific aspect would you like to explore further?`,
      `I'm here to help with all your farming questions! Whether you're interested in traditional techniques or modern technology, I can guide you to the right resources. What's your main farming interest or challenge?`,
      `Great question! I can provide detailed information about our courses, farming best practices, and technology solutions. To give you the most helpful response, could you share more about your farming background or specific interests?`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
};