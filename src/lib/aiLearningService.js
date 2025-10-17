import { supabase } from './supabase';

export const aiLearningService = {
  // Log conversations for learning
  async logConversation(userId, userMessage, botResponse, context = {}) {
    try {
      await supabase.from('ai_conversations').insert({
        user_id: userId,
        user_message: userMessage,
        bot_response: botResponse,
        context: context,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error logging conversation:', error);
    }
  },

  // Analyze patterns from conversations
  async analyzePatterns() {
    try {
      const { data: conversations } = await supabase
        .from('ai_conversations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (!conversations?.length) return [];

      const patterns = this.extractPatterns(conversations);
      await this.savePatterns(patterns);
      return patterns;
    } catch (error) {
      console.error('Error analyzing patterns:', error);
      return [];
    }
  },

  // Extract learning patterns from conversations
  extractPatterns(conversations) {
    const patterns = [];
    const messageGroups = {};

    // Group similar messages
    conversations.forEach(conv => {
      const key = this.normalizeMessage(conv.user_message);
      if (!messageGroups[key]) {
        messageGroups[key] = [];
      }
      messageGroups[key].push(conv);
    });

    // Find patterns with multiple occurrences
    Object.entries(messageGroups).forEach(([key, convs]) => {
      if (convs.length >= 3) {
        const responses = convs.map(c => c.bot_response);
        const mostCommon = this.findMostCommonResponse(responses);
        
        patterns.push({
          pattern_type: 'frequent_question',
          trigger: key,
          response: mostCommon,
          confidence: Math.min(0.9, convs.length / 10),
          usage_count: convs.length,
          last_used: convs[0].created_at
        });
      }
    });

    // Extract topic patterns
    const topicPatterns = this.extractTopicPatterns(conversations);
    patterns.push(...topicPatterns);

    return patterns;
  },

  // Normalize message for pattern matching
  normalizeMessage(message) {
    return message
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 100);
  },

  // Find most common response
  findMostCommonResponse(responses) {
    const counts = {};
    responses.forEach(response => {
      const normalized = this.normalizeMessage(response);
      counts[normalized] = (counts[normalized] || 0) + 1;
    });

    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || responses[0];
  },

  // Extract topic-based patterns
  extractTopicPatterns(conversations) {
    const topics = {
      courses: ['course', 'learn', 'training', 'study'],
      technology: ['iot', 'smart', 'sensor', 'automation'],
      farming: ['soil', 'crop', 'plant', 'harvest'],
      progress: ['progress', 'track', 'complete']
    };

    const topicPatterns = [];
    
    Object.entries(topics).forEach(([topic, keywords]) => {
      const topicConvs = conversations.filter(conv =>
        keywords.some(keyword => 
          conv.user_message.toLowerCase().includes(keyword)
        )
      );

      if (topicConvs.length >= 5) {
        const successfulResponses = topicConvs
          .filter(conv => conv.context?.source !== 'default')
          .map(conv => conv.bot_response);

        if (successfulResponses.length > 0) {
          topicPatterns.push({
            pattern_type: 'topic_pattern',
            trigger: topic,
            response: this.generateTopicResponse(topic, successfulResponses),
            confidence: 0.8,
            usage_count: topicConvs.length,
            last_used: topicConvs[0].created_at
          });
        }
      }
    });

    return topicPatterns;
  },

  // Generate improved topic response
  generateTopicResponse(topic, responses) {
    const commonPhrases = this.extractCommonPhrases(responses);
    return commonPhrases.slice(0, 3).join(' ');
  },

  // Extract common phrases from responses
  extractCommonPhrases(responses) {
    const phrases = [];
    responses.forEach(response => {
      const sentences = response.split(/[.!?]+/);
      sentences.forEach(sentence => {
        if (sentence.trim().length > 20) {
          phrases.push(sentence.trim());
        }
      });
    });

    const counts = {};
    phrases.forEach(phrase => {
      const normalized = this.normalizeMessage(phrase);
      counts[normalized] = (counts[normalized] || 0) + 1;
    });

    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([phrase]) => phrase);
  },

  // Save learned patterns
  async savePatterns(patterns) {
    try {
      for (const pattern of patterns) {
        await supabase.from('ai_patterns').upsert({
          pattern_type: pattern.pattern_type,
          trigger: pattern.trigger,
          response: pattern.response,
          confidence: pattern.confidence,
          usage_count: pattern.usage_count,
          last_used: pattern.last_used,
          updated_at: new Date().toISOString()
        }, { onConflict: 'trigger' });
      }
    } catch (error) {
      console.error('Error saving patterns:', error);
    }
  },

  // Get learned patterns for response generation
  async getLearnedPatterns() {
    try {
      const { data: patterns } = await supabase
        .from('ai_patterns')
        .select('*')
        .gte('confidence', 0.6)
        .order('confidence', { ascending: false });

      return patterns || [];
    } catch (error) {
      console.error('Error getting patterns:', error);
      return [];
    }
  },

  // Generate improved response using learned patterns
  async generateImprovedResponse(message, userContext, patterns) {
    const normalizedMessage = this.normalizeMessage(message);
    
    // Find exact pattern match
    const exactMatch = patterns.find(p => 
      p.trigger === normalizedMessage && p.confidence > 0.8
    );

    if (exactMatch) {
      await this.updatePatternUsage(exactMatch.trigger);
      return this.personalizeResponse(exactMatch.response, userContext);
    }

    // Find partial matches
    const partialMatches = patterns.filter(p => {
      const similarity = this.calculateSimilarity(normalizedMessage, p.trigger);
      return similarity > 0.7 && p.confidence > 0.7;
    });

    if (partialMatches.length > 0) {
      const bestMatch = partialMatches[0];
      await this.updatePatternUsage(bestMatch.trigger);
      return this.personalizeResponse(bestMatch.response, userContext);
    }

    // Check topic patterns
    const topicMatch = patterns.find(p => 
      p.pattern_type === 'topic_pattern' && 
      message.toLowerCase().includes(p.trigger)
    );

    if (topicMatch) {
      await this.updatePatternUsage(topicMatch.trigger);
      return this.personalizeResponse(topicMatch.response, userContext);
    }

    return null;
  },

  // Calculate message similarity
  calculateSimilarity(msg1, msg2) {
    const words1 = msg1.split(' ');
    const words2 = msg2.split(' ');
    const intersection = words1.filter(word => words2.includes(word));
    return intersection.length / Math.max(words1.length, words2.length);
  },

  // Personalize response with user context
  personalizeResponse(response, userContext) {
    if (!userContext?.userName) return response;
    
    return response.replace(/\bthere\b/g, userContext.userName);
  },

  // Update pattern usage statistics
  async updatePatternUsage(trigger) {
    try {
      await supabase.rpc('increment_pattern_usage', { pattern_trigger: trigger });
    } catch (error) {
      console.error('Error updating pattern usage:', error);
    }
  },

  // Train from site data changes
  async trainFromSiteData() {
    try {
      const [courses, stories, testimonials] = await Promise.all([
        supabase.from('courses').select('*'),
        supabase.from('success_stories').select('*'),
        supabase.from('testimonials').select('*')
      ]);

      const sitePatterns = this.generateSiteDataPatterns({
        courses: courses.data || [],
        stories: stories.data || [],
        testimonials: testimonials.data || []
      });

      await this.savePatterns(sitePatterns);
      return sitePatterns;
    } catch (error) {
      console.error('Error training from site data:', error);
      return [];
    }
  },

  // Generate patterns from site data
  generateSiteDataPatterns(siteData) {
    const patterns = [];

    // Course recommendation patterns
    if (siteData.courses.length > 0) {
      const categories = [...new Set(siteData.courses.map(c => c.category))];
      categories.forEach(category => {
        const categorycourses = siteData.courses.filter(c => c.category === category);
        patterns.push({
          pattern_type: 'course_recommendation',
          trigger: category.toLowerCase(),
          response: `For ${category}, I recommend "${categorycourses[0].title}". We have ${categorycourses.length} courses in this category.`,
          confidence: 0.9,
          usage_count: 1,
          last_used: new Date().toISOString()
        });
      });
    }

    // Success story patterns
    if (siteData.stories.length > 0) {
      patterns.push({
        pattern_type: 'success_story',
        trigger: 'success',
        response: `Here's a great success story: ${siteData.stories[0].title} - ${siteData.stories[0].description}`,
        confidence: 0.8,
        usage_count: 1,
        last_used: new Date().toISOString()
      });
    }

    return patterns;
  },

  // Auto-learning scheduler
  async scheduleAutoLearning() {
    // Run pattern analysis every hour
    setInterval(async () => {
      await this.analyzePatterns();
      await this.trainFromSiteData();
    }, 3600000); // 1 hour

    // Initial learning
    await this.analyzePatterns();
    await this.trainFromSiteData();
  },

  // Get learning statistics
  async getLearningStats() {
    try {
      const [conversationsRes, patternsRes] = await Promise.all([
        supabase.from('ai_conversations').select('id', { count: 'exact' }),
        supabase.from('ai_patterns').select('*')
      ]);

      const totalConversations = conversationsRes.count || 0;
      const patterns = patternsRes.data || [];
      const avgConfidence = patterns.length > 0 
        ? patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length 
        : 0;

      return {
        totalConversations,
        totalPatterns: patterns.length,
        averageConfidence: Math.round(avgConfidence * 100) / 100,
        highConfidencePatterns: patterns.filter(p => p.confidence > 0.8).length,
        lastLearningUpdate: patterns[0]?.updated_at || null
      };
    } catch (error) {
      console.error('Error getting learning stats:', error);
      return {
        totalConversations: 0,
        totalPatterns: 0,
        averageConfidence: 0,
        highConfidencePatterns: 0,
        lastLearningUpdate: null
      };
    }
  }
};