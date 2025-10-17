import { supabase } from '@/lib/supabase';

export const initializeRealisticData = async () => {
  try {
    // Initialize site statistics with realistic figures
    const siteStats = {
      farmers_trained: 1247,
      certificates_issued: 892,
      yield_improvement: 65,
      sustainable_projects: 34,
      updated_at: new Date().toISOString()
    };

    // Check if stats already exist
    const { data: existingStats } = await supabase
      .from('site_stats')
      .select('*')
      .limit(1)
      .single();

    if (!existingStats) {
      await supabase
        .from('site_stats')
        .insert([siteStats]);
      console.log('Site statistics initialized');
    }

    // Sample courses data
    const sampleCourses = [
      {
        title: "Modern Rice Farming Techniques",
        description: "Learn advanced rice cultivation methods that can increase your yield by up to 60%. This comprehensive course covers seed selection, water management, pest control, and harvesting techniques.",
        instructor: "Dr. Adebayo Ogundimu",
        category: "Crop Production",
        difficulty: "intermediate",
        duration: "4h 30m",
        price: 49.99,
        total_lessons: 12,
        thumbnail_url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
        content: `
Lesson 1: Introduction to Modern Rice Farming
Lesson 2: Soil Preparation and Testing
Lesson 3: Seed Selection and Treatment
Lesson 4: Planting Techniques and Spacing
Lesson 5: Water Management Systems
Lesson 6: Nutrient Management
Lesson 7: Pest and Disease Control
Lesson 8: Weed Management
Lesson 9: Growth Monitoring
Lesson 10: Harvesting Techniques
Lesson 11: Post-Harvest Processing
Lesson 12: Marketing and Storage
        `,
        created_at: new Date().toISOString()
      },
      {
        title: "Sustainable Poultry Management",
        description: "Master the art of profitable poultry farming with sustainable practices. Learn about housing, feeding, health management, and business planning for your poultry enterprise.",
        instructor: "Engr. Fatima Hassan",
        category: "Livestock",
        difficulty: "beginner",
        duration: "3h 45m",
        price: 39.99,
        total_lessons: 10,
        thumbnail_url: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400",
        content: `
Lesson 1: Introduction to Poultry Farming
Lesson 2: Choosing the Right Breeds
Lesson 3: Housing and Infrastructure
Lesson 4: Feeding and Nutrition
Lesson 5: Health Management
Lesson 6: Breeding and Incubation
Lesson 7: Record Keeping
Lesson 8: Disease Prevention
Lesson 9: Marketing Strategies
Lesson 10: Business Planning
        `,
        created_at: new Date().toISOString()
      },
      {
        title: "Smart Irrigation Systems",
        description: "Discover how to implement smart irrigation technologies to optimize water usage and improve crop yields. Learn about sensors, automation, and data-driven farming decisions.",
        instructor: "Prof. Chinedu Okoro",
        category: "Technology",
        difficulty: "advanced",
        duration: "5h 15m",
        price: 79.99,
        total_lessons: 15,
        thumbnail_url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
        content: `
Lesson 1: Introduction to Smart Irrigation
Lesson 2: Soil Moisture Sensors
Lesson 3: Weather Station Integration
Lesson 4: Automated Control Systems
Lesson 5: Drip Irrigation Design
Lesson 6: Sprinkler System Optimization
Lesson 7: Water Quality Management
Lesson 8: Energy Efficiency
Lesson 9: Data Collection and Analysis
Lesson 10: Mobile App Integration
Lesson 11: Maintenance and Troubleshooting
Lesson 12: Cost-Benefit Analysis
Lesson 13: Case Studies
Lesson 14: Implementation Planning
Lesson 15: Future Technologies
        `,
        created_at: new Date().toISOString()
      },
      {
        title: "Organic Vegetable Production",
        description: "Learn the principles and practices of organic vegetable farming. From soil health to natural pest control, discover how to grow healthy vegetables without synthetic chemicals.",
        instructor: "Dr. Amina Bello",
        category: "Organic Farming",
        difficulty: "beginner",
        duration: "3h 20m",
        price: 34.99,
        total_lessons: 9,
        thumbnail_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
        content: `
Lesson 1: Principles of Organic Farming
Lesson 2: Soil Health and Composting
Lesson 3: Crop Selection and Planning
Lesson 4: Natural Pest Control
Lesson 5: Companion Planting
Lesson 6: Organic Fertilizers
Lesson 7: Water Conservation
Lesson 8: Harvesting and Storage
Lesson 9: Certification Process
        `,
        created_at: new Date().toISOString()
      },
      {
        title: "Agricultural Business Management",
        description: "Transform your farming knowledge into a profitable business. Learn about financial planning, marketing strategies, supply chain management, and scaling your agricultural enterprise.",
        instructor: "MBA Kemi Adeyemi",
        category: "Business",
        difficulty: "intermediate",
        duration: "6h 10m",
        price: 89.99,
        total_lessons: 18,
        thumbnail_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
        content: `
Lesson 1: Introduction to Agribusiness
Lesson 2: Market Research and Analysis
Lesson 3: Business Plan Development
Lesson 4: Financial Planning and Budgeting
Lesson 5: Funding and Investment Options
Lesson 6: Cost Management
Lesson 7: Pricing Strategies
Lesson 8: Marketing and Branding
Lesson 9: Digital Marketing for Farmers
Lesson 10: Supply Chain Management
Lesson 11: Quality Control Systems
Lesson 12: Risk Management
Lesson 13: Legal and Regulatory Compliance
Lesson 14: Technology Integration
Lesson 15: Scaling Your Business
Lesson 16: Partnership and Networking
Lesson 17: Export Opportunities
Lesson 18: Sustainability and Future Planning
        `,
        created_at: new Date().toISOString()
      }
    ];

    // Check if courses already exist
    const { data: existingCourses } = await supabase
      .from('courses')
      .select('*')
      .limit(1);

    if (!existingCourses || existingCourses.length === 0) {
      await supabase
        .from('courses')
        .insert(sampleCourses);
      console.log('Sample courses initialized');
    }

    // Sample success stories
    const successStories = [
      {
        name: "Adebayo Ogundimu",
        role: "Rice Farmer",
        location: "Kebbi State, Nigeria",
        content: "AFAC transformed my farming methods. My rice yield increased by 60% using their precision agriculture techniques. The training was practical and immediately applicable.",
        rating: 5,
        is_featured: true,
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=adebayo",
        created_at: new Date().toISOString()
      },
      {
        name: "Fatima Hassan",
        role: "Agro-entrepreneur",
        location: "Kaduna State, Nigeria",
        content: "The consulting services helped me establish a successful agro-processing business. From business planning to market linkage, they provided comprehensive support. Highly recommended!",
        rating: 5,
        is_featured: true,
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima",
        created_at: new Date().toISOString()
      },
      {
        name: "Chinedu Okoro",
        role: "Poultry Farmer",
        location: "Anambra State, Nigeria",
        content: "Their training programs are world-class. I learned modern poultry management that doubled my profits. The instructors are knowledgeable and supportive throughout the learning journey.",
        rating: 5,
        is_featured: true,
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=chinedu",
        created_at: new Date().toISOString()
      },
      {
        name: "Amina Bello",
        role: "Organic Farmer",
        location: "Kano State, Nigeria",
        content: "The organic farming course changed my perspective on agriculture. I now produce healthier crops while protecting the environment. My customers love the quality of my organic vegetables.",
        rating: 5,
        is_featured: false,
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=amina",
        created_at: new Date().toISOString()
      }
    ];

    // Check if success stories already exist
    const { data: existingStories } = await supabase
      .from('success_stories')
      .select('*')
      .limit(1);

    if (!existingStories || existingStories.length === 0) {
      await supabase
        .from('success_stories')
        .insert(successStories);
      console.log('Success stories initialized');
    }

    return { success: true, message: 'Data initialized successfully' };
  } catch (error) {
    console.error('Error initializing data:', error);
    return { success: false, error: error.message };
  }
};

export default initializeRealisticData;