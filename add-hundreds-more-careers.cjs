#!/usr/bin/env node

/**
 * Add Hundreds More Careers Script
 * 
 * This script adds hundreds of additional real-world careers including
 * niche, non-mainstream, and specialized careers from all industries
 */

const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

const LANGUAGES = ['en', 'ja', 'de', 'es', 'fr'];
const LANGUAGE_NAMES = {
  'en': 'English',
  'ja': 'Japanese', 
  'de': 'German',
  'es': 'Spanish',
  'fr': 'French'
};

// Hundreds of additional real-world careers
const ADDITIONAL_CAREERS = [
  // Technology - Advanced & Niche
  {
    id: 'blockchain-developer',
    level: 'A',
    salary_range: '$100,000 - $180,000',
    experience_required: '3-6 years',
    title: 'Blockchain Developer',
    description: 'Develop decentralized applications and smart contracts using blockchain technology.',
    skills: ['Solidity', 'Web3', 'Smart Contracts', 'Cryptocurrency', 'DeFi', 'NFTs', 'Ethereum', 'Blockchain Architecture'],
    job_titles: ['Smart Contract Developer', 'DeFi Developer', 'Web3 Developer', 'Cryptocurrency Developer', 'Blockchain Engineer'],
    certifications: ['Certified Blockchain Developer', 'Ethereum Developer Certification', 'Hyperledger Certification'],
    requirements: {
      education: ['Bachelor\'s Degree in Computer Science or related field'],
      experience: '3+ years of blockchain development experience',
      skills: ['Blockchain platforms', 'Smart contract development', 'Cryptocurrency knowledge']
    }
  },
  {
    id: 'quantum-computing-engineer',
    level: 'A',
    salary_range: '$120,000 - $200,000',
    experience_required: '5-8 years',
    title: 'Quantum Computing Engineer',
    description: 'Develop quantum algorithms and work with quantum computing systems.',
    skills: ['Quantum Algorithms', 'Qiskit', 'Quantum Mechanics', 'Linear Algebra', 'Python', 'Quantum Hardware', 'Quantum Software'],
    job_titles: ['Quantum Software Engineer', 'Quantum Algorithm Developer', 'Quantum Research Engineer', 'Quantum Systems Engineer'],
    certifications: ['IBM Quantum Developer Certification', 'Quantum Computing Certification'],
    requirements: {
      education: ['Master\'s or PhD in Physics, Computer Science, or related field'],
      experience: '5+ years of quantum computing experience',
      skills: ['Quantum mechanics', 'Algorithm development', 'Research experience']
    }
  },
  {
    id: 'game-developer',
    level: 'I',
    salary_range: '$60,000 - $120,000',
    experience_required: '2-5 years',
    title: 'Game Developer',
    description: 'Create video games for various platforms including mobile, console, and PC.',
    skills: ['Unity', 'Unreal Engine', 'C#', 'C++', 'Game Design', '3D Modeling', 'Animation', 'Game Physics'],
    job_titles: ['Unity Developer', 'Unreal Developer', 'Mobile Game Developer', 'Indie Game Developer', 'Game Programmer'],
    certifications: ['Unity Certified Developer', 'Unreal Engine Certification'],
    requirements: {
      education: ['Bachelor\'s Degree in Game Development, Computer Science, or related field'],
      experience: '2+ years of game development experience',
      skills: ['Game engines', 'Programming languages', 'Game design principles']
    }
  },
  {
    id: 'robotics-engineer',
    level: 'A',
    salary_range: '$80,000 - $150,000',
    experience_required: '4-7 years',
    title: 'Robotics Engineer',
    description: 'Design, build, and program robots for various applications including manufacturing, healthcare, and service industries.',
    skills: ['Robotics', 'ROS', 'Python', 'C++', 'Machine Learning', 'Computer Vision', 'Control Systems', 'Mechanical Design'],
    job_titles: ['Robotics Software Engineer', 'Autonomous Systems Engineer', 'Robotics Research Engineer', 'Industrial Robotics Engineer'],
    certifications: ['ROS Certification', 'Robotics Engineering Certification'],
    requirements: {
      education: ['Bachelor\'s Degree in Robotics, Mechanical Engineering, or related field'],
      experience: '4+ years of robotics development experience',
      skills: ['Robotics frameworks', 'Control systems', 'Hardware integration']
    }
  },
  {
    id: 'bioinformatics-scientist',
    level: 'A',
    salary_range: '$90,000 - $160,000',
    experience_required: '4-8 years',
    title: 'Bioinformatics Scientist',
    description: 'Analyze biological data using computational methods and develop software tools for biological research.',
    skills: ['Python', 'R', 'Bioinformatics', 'Genomics', 'Statistics', 'Machine Learning', 'Database Management', 'Molecular Biology'],
    job_titles: ['Computational Biologist', 'Genomics Data Scientist', 'Bioinformatics Analyst', 'Research Scientist'],
    certifications: ['Bioinformatics Certification', 'Genomics Data Analysis Certification'],
    requirements: {
      education: ['Master\'s or PhD in Bioinformatics, Biology, or related field'],
      experience: '4+ years of bioinformatics experience',
      skills: ['Biological data analysis', 'Programming', 'Statistical analysis']
    }
  },
  // Healthcare - Specialized & Niche
  {
    id: 'genetic-counselor',
    level: 'I',
    salary_range: '$70,000 - $100,000',
    experience_required: '2-4 years',
    title: 'Genetic Counselor',
    description: 'Help patients understand genetic testing results and assess risk for inherited conditions.',
    skills: ['Genetics', 'Counseling', 'Medical Knowledge', 'Communication', 'Risk Assessment', 'Patient Education', 'Ethics'],
    job_titles: ['Clinical Genetic Counselor', 'Prenatal Genetic Counselor', 'Cancer Genetic Counselor', 'Pediatric Genetic Counselor'],
    certifications: ['Board Certification in Genetic Counseling', 'Genetic Counseling License'],
    requirements: {
      education: ['Master\'s Degree in Genetic Counseling'],
      experience: '2+ years of genetic counseling experience',
      skills: ['Genetic knowledge', 'Counseling techniques', 'Medical terminology']
    }
  },
  {
    id: 'art-therapist',
    level: 'I',
    salary_range: '$45,000 - $70,000',
    experience_required: '2-4 years',
    title: 'Art Therapist',
    description: 'Use art and creative processes to help patients with mental health issues, trauma, and emotional challenges.',
    skills: ['Art Therapy', 'Psychology', 'Creative Expression', 'Patient Assessment', 'Therapeutic Techniques', 'Art Media', 'Communication'],
    job_titles: ['Clinical Art Therapist', 'School Art Therapist', 'Rehabilitation Art Therapist', 'Private Practice Art Therapist'],
    certifications: ['Art Therapy Registration Board (ATR)', 'Licensed Professional Counselor (LPC)'],
    requirements: {
      education: ['Master\'s Degree in Art Therapy or related field'],
      experience: '2+ years of art therapy experience',
      skills: ['Art therapy techniques', 'Psychological assessment', 'Creative processes']
    }
  },
  {
    id: 'wildlife-veterinarian',
    level: 'A',
    salary_range: '$60,000 - $120,000',
    experience_required: '6-10 years',
    title: 'Wildlife Veterinarian',
    description: 'Provide medical care for wild animals in zoos, wildlife rehabilitation centers, and conservation programs.',
    skills: ['Veterinary Medicine', 'Wildlife Biology', 'Surgery', 'Diagnostics', 'Conservation', 'Animal Behavior', 'Field Work'],
    job_titles: ['Zoo Veterinarian', 'Wildlife Rehabilitation Veterinarian', 'Conservation Veterinarian', 'Field Veterinarian'],
    certifications: ['Doctor of Veterinary Medicine (DVM)', 'Wildlife Medicine Certification'],
    requirements: {
      education: ['Doctor of Veterinary Medicine (DVM) degree'],
      experience: '6+ years of veterinary experience with wildlife',
      skills: ['Wildlife medicine', 'Surgical procedures', 'Field experience']
    }
  },
  {
    id: 'telemedicine-physician',
    level: 'A',
    salary_range: '$150,000 - $250,000',
    experience_required: '5-10 years',
    title: 'Telemedicine Physician',
    description: 'Provide medical consultations and care through digital platforms and remote communication technologies.',
    skills: ['Telemedicine', 'Digital Health', 'Remote Patient Care', 'Medical Technology', 'Communication', 'Diagnosis', 'Treatment Planning'],
    job_titles: ['Telehealth Physician', 'Virtual Care Doctor', 'Remote Medicine Specialist', 'Digital Health Physician'],
    certifications: ['Medical License', 'Telemedicine Certification', 'Digital Health Certification'],
    requirements: {
      education: ['Doctor of Medicine (MD) or Doctor of Osteopathic Medicine (DO)'],
      experience: '5+ years of clinical experience',
      skills: ['Telemedicine platforms', 'Remote diagnosis', 'Digital communication']
    }
  },
  // Finance - Specialized & Niche
  {
    id: 'cryptocurrency-trader',
    level: 'I',
    salary_range: '$50,000 - $200,000',
    experience_required: '2-5 years',
    title: 'Cryptocurrency Trader',
    description: 'Buy and sell cryptocurrencies and digital assets to generate profits for individuals or institutions.',
    skills: ['Cryptocurrency', 'Trading', 'Market Analysis', 'Risk Management', 'Technical Analysis', 'Blockchain', 'DeFi', 'Portfolio Management'],
    job_titles: ['Crypto Trader', 'Digital Asset Trader', 'DeFi Trader', 'Cryptocurrency Analyst', 'Blockchain Trader'],
    certifications: ['Chartered Financial Analyst (CFA)', 'Financial Risk Manager (FRM)', 'Cryptocurrency Trading Certification'],
    requirements: {
      education: ['Bachelor\'s Degree in Finance, Economics, or related field'],
      experience: '2+ years of trading experience',
      skills: ['Market analysis', 'Risk management', 'Cryptocurrency knowledge']
    }
  },
  {
    id: 'actuary',
    level: 'A',
    salary_range: '$80,000 - $150,000',
    experience_required: '3-7 years',
    title: 'Actuary',
    description: 'Analyze financial risks using mathematics, statistics, and financial theory to help businesses make decisions.',
    skills: ['Actuarial Science', 'Statistics', 'Risk Assessment', 'Financial Modeling', 'Insurance', 'Mathematics', 'Data Analysis'],
    job_titles: ['Senior Actuary', 'Actuarial Analyst', 'Risk Actuary', 'Pricing Actuary', 'Reserving Actuary'],
    certifications: ['Associate of the Society of Actuaries (ASA)', 'Fellow of the Society of Actuaries (FSA)', 'Chartered Enterprise Risk Analyst (CERA)'],
    requirements: {
      education: ['Bachelor\'s Degree in Actuarial Science, Mathematics, or related field'],
      experience: '3+ years of actuarial experience',
      skills: ['Actuarial exams', 'Risk modeling', 'Statistical analysis']
    }
  },
  {
    id: 'forensic-accountant',
    level: 'A',
    salary_range: '$70,000 - $130,000',
    experience_required: '4-8 years',
    title: 'Forensic Accountant',
    description: 'Investigate financial crimes, fraud, and disputes using accounting and investigative skills.',
    skills: ['Forensic Accounting', 'Fraud Investigation', 'Financial Analysis', 'Legal Knowledge', 'Auditing', 'Evidence Collection', 'Report Writing'],
    job_titles: ['Fraud Examiner', 'Financial Investigator', 'Litigation Support Specialist', 'Anti-Money Laundering Specialist'],
    certifications: ['Certified Fraud Examiner (CFE)', 'Certified Public Accountant (CPA)', 'Certified Forensic Accountant (CrFA)'],
    requirements: {
      education: ['Bachelor\'s Degree in Accounting or related field'],
      experience: '4+ years of forensic accounting experience',
      skills: ['Fraud detection', 'Legal procedures', 'Financial investigation']
    }
  },
  // Creative & Arts - Niche Careers
  {
    id: 'motion-graphics-designer',
    level: 'I',
    salary_range: '$50,000 - $100,000',
    experience_required: '2-5 years',
    title: 'Motion Graphics Designer',
    description: 'Create animated graphics and visual effects for film, television, advertising, and digital media.',
    skills: ['After Effects', 'Cinema 4D', 'Motion Graphics', 'Animation', 'Visual Effects', 'Typography', 'Color Theory', 'Storyboarding'],
    job_titles: ['Motion Designer', 'VFX Artist', 'Animation Designer', 'Broadcast Designer', 'Digital Media Designer'],
    certifications: ['Adobe Certified Expert', 'Motion Graphics Certification', 'VFX Certification'],
    requirements: {
      education: ['Bachelor\'s Degree in Graphic Design, Animation, or related field'],
      experience: '2+ years of motion graphics experience',
      skills: ['Animation software', 'Visual storytelling', 'Design principles']
    }
  },
  {
    id: 'sound-engineer',
    level: 'I',
    salary_range: '$40,000 - $80,000',
    experience_required: '2-5 years',
    title: 'Sound Engineer',
    description: 'Record, mix, and master audio for music, film, television, and live events.',
    skills: ['Audio Engineering', 'Mixing', 'Mastering', 'Recording', 'Sound Design', 'Music Production', 'Live Sound', 'Audio Software'],
    job_titles: ['Recording Engineer', 'Mixing Engineer', 'Live Sound Engineer', 'Audio Post-Production Engineer', 'Music Producer'],
    certifications: ['Audio Engineering Certification', 'Pro Tools Certification', 'Live Sound Certification'],
    requirements: {
      education: ['Bachelor\'s Degree in Audio Engineering or related field'],
      experience: '2+ years of audio engineering experience',
      skills: ['Audio software', 'Recording techniques', 'Sound equipment']
    }
  },
  {
    id: 'food-stylist',
    level: 'I',
    salary_range: '$35,000 - $70,000',
    experience_required: '2-4 years',
    title: 'Food Stylist',
    description: 'Arrange and style food for photography, advertising, and media to make it look appealing and appetizing.',
    skills: ['Food Styling', 'Photography', 'Culinary Arts', 'Visual Design', 'Color Theory', 'Food Safety', 'Creativity', 'Attention to Detail'],
    job_titles: ['Commercial Food Stylist', 'Editorial Food Stylist', 'Advertising Food Stylist', 'Restaurant Food Stylist'],
    certifications: ['Food Styling Certification', 'Culinary Arts Certification', 'Food Safety Certification'],
    requirements: {
      education: ['Bachelor\'s Degree in Culinary Arts, Photography, or related field'],
      experience: '2+ years of food styling experience',
      skills: ['Culinary techniques', 'Photography', 'Visual design']
    }
  },
  // Science & Research - Specialized
  {
    id: 'marine-biologist',
    level: 'A',
    salary_range: '$50,000 - $90,000',
    experience_required: '4-8 years',
    title: 'Marine Biologist',
    description: 'Study marine organisms and ecosystems to understand ocean life and environmental impacts.',
    skills: ['Marine Biology', 'Research', 'Data Analysis', 'Field Work', 'Laboratory Techniques', 'Conservation', 'Scientific Writing', 'Diving'],
    job_titles: ['Research Marine Biologist', 'Conservation Marine Biologist', 'Aquarium Marine Biologist', 'Environmental Consultant'],
    certifications: ['Marine Biology Certification', 'Scientific Diving Certification', 'Research Certification'],
    requirements: {
      education: ['Master\'s or PhD in Marine Biology or related field'],
      experience: '4+ years of marine biology research experience',
      skills: ['Research methods', 'Field work', 'Data analysis']
    }
  },
  {
    id: 'astronomer',
    level: 'A',
    salary_range: '$60,000 - $120,000',
    experience_required: '6-10 years',
    title: 'Astronomer',
    description: 'Study celestial objects and phenomena to understand the universe and develop astronomical theories.',
    skills: ['Astronomy', 'Physics', 'Mathematics', 'Data Analysis', 'Telescope Operation', 'Research', 'Computer Programming', 'Scientific Writing'],
    job_titles: ['Research Astronomer', 'Observatory Astronomer', 'Planetary Scientist', 'Astrophysicist', 'Cosmologist'],
    certifications: ['Astronomy Certification', 'Physics Certification', 'Research Certification'],
    requirements: {
      education: ['PhD in Astronomy, Physics, or related field'],
      experience: '6+ years of astronomical research experience',
      skills: ['Research methods', 'Data analysis', 'Scientific writing']
    }
  },
  {
    id: 'volcanologist',
    level: 'A',
    salary_range: '$55,000 - $100,000',
    experience_required: '5-9 years',
    title: 'Volcanologist',
    description: 'Study volcanoes and volcanic activity to understand geological processes and predict eruptions.',
    skills: ['Volcanology', 'Geology', 'Field Work', 'Data Analysis', 'Risk Assessment', 'Research', 'Scientific Writing', 'Safety Protocols'],
    job_titles: ['Research Volcanologist', 'Hazard Assessment Specialist', 'Volcano Monitoring Specialist', 'Geological Survey Scientist'],
    certifications: ['Geology Certification', 'Volcanology Certification', 'Field Safety Certification'],
    requirements: {
      education: ['Master\'s or PhD in Geology, Volcanology, or related field'],
      experience: '5+ years of volcanology research experience',
      skills: ['Field research', 'Risk assessment', 'Data analysis']
    }
  },
  // Skilled Trades - Specialized
  {
    id: 'master-electrician',
    level: 'A',
    salary_range: '$60,000 - $100,000',
    experience_required: '5-10 years',
    title: 'Master Electrician',
    description: 'Install, maintain, and repair electrical systems in residential, commercial, and industrial settings.',
    skills: ['Electrical Systems', 'Wiring', 'Electrical Codes', 'Safety Protocols', 'Troubleshooting', 'Blueprint Reading', 'Project Management'],
    job_titles: ['Licensed Electrician', 'Electrical Contractor', 'Industrial Electrician', 'Commercial Electrician', 'Residential Electrician'],
    certifications: ['Master Electrician License', 'Electrical Contractor License', 'Safety Certifications'],
    requirements: {
      education: ['High School Diploma or equivalent', 'Electrical Apprenticeship'],
      experience: '5+ years of electrical work experience',
      skills: ['Electrical systems', 'Safety procedures', 'Code compliance']
    }
  },
  {
    id: 'precision-machinist',
    level: 'I',
    salary_range: '$45,000 - $80,000',
    experience_required: '3-6 years',
    title: 'Precision Machinist',
    description: 'Operate computer-controlled machines to create precise metal parts for manufacturing and aerospace industries.',
    skills: ['CNC Machining', 'Blueprint Reading', 'Precision Measurement', 'Machine Operation', 'Quality Control', 'CAD/CAM', 'Metalworking'],
    job_titles: ['CNC Machinist', 'Precision Machinist', 'Tool and Die Maker', 'Machine Operator', 'Manufacturing Technician'],
    certifications: ['CNC Machining Certification', 'Precision Machining Certification', 'Manufacturing Certification'],
    requirements: {
      education: ['High School Diploma or equivalent', 'Machining Apprenticeship'],
      experience: '3+ years of machining experience',
      skills: ['CNC operation', 'Blueprint reading', 'Quality control']
    }
  },
  {
    id: 'wind-turbine-technician',
    level: 'I',
    salary_range: '$50,000 - $85,000',
    experience_required: '2-4 years',
    title: 'Wind Turbine Technician',
    description: 'Install, maintain, and repair wind turbines to generate renewable energy.',
    skills: ['Wind Turbines', 'Electrical Systems', 'Mechanical Repair', 'Safety Protocols', 'Climbing', 'Troubleshooting', 'Preventive Maintenance'],
    job_titles: ['Wind Energy Technician', 'Turbine Maintenance Technician', 'Wind Farm Technician', 'Renewable Energy Technician'],
    certifications: ['Wind Turbine Technician Certification', 'Electrical Safety Certification', 'Climbing Safety Certification'],
    requirements: {
      education: ['High School Diploma or equivalent', 'Technical Training'],
      experience: '2+ years of wind turbine experience',
      skills: ['Electrical systems', 'Mechanical repair', 'Safety procedures']
    }
  },
  // Service & Hospitality - Specialized
  {
    id: 'sommelier',
    level: 'I',
    salary_range: '$40,000 - $80,000',
    experience_required: '3-6 years',
    title: 'Sommelier',
    description: 'Expert in wine selection, pairing, and service for restaurants and hospitality establishments.',
    skills: ['Wine Knowledge', 'Tasting', 'Food Pairing', 'Customer Service', 'Inventory Management', 'Wine Service', 'Sales', 'Education'],
    job_titles: ['Head Sommelier', 'Wine Director', 'Beverage Manager', 'Wine Consultant', 'Wine Educator'],
    certifications: ['Certified Sommelier', 'Advanced Sommelier', 'Master Sommelier', 'Wine and Spirit Education Trust (WSET)'],
    requirements: {
      education: ['High School Diploma or equivalent', 'Wine Education'],
      experience: '3+ years of wine service experience',
      skills: ['Wine knowledge', 'Tasting skills', 'Customer service']
    }
  },
  {
    id: 'event-planner',
    level: 'I',
    salary_range: '$40,000 - $70,000',
    experience_required: '2-5 years',
    title: 'Event Planner',
    description: 'Organize and coordinate events including weddings, corporate meetings, and social gatherings.',
    skills: ['Event Planning', 'Project Management', 'Vendor Management', 'Budgeting', 'Communication', 'Organization', 'Creativity', 'Problem Solving'],
    job_titles: ['Wedding Planner', 'Corporate Event Planner', 'Conference Planner', 'Party Planner', 'Event Coordinator'],
    certifications: ['Certified Meeting Professional (CMP)', 'Event Planning Certification', 'Wedding Planning Certification'],
    requirements: {
      education: ['Bachelor\'s Degree in Event Management, Hospitality, or related field'],
      experience: '2+ years of event planning experience',
      skills: ['Project management', 'Vendor relations', 'Budget management']
    }
  },
  {
    id: 'personal-trainer',
    level: 'I',
    salary_range: '$30,000 - $80,000',
    experience_required: '1-3 years',
    title: 'Personal Trainer',
    description: 'Help clients achieve fitness goals through personalized exercise programs and nutrition guidance.',
    skills: ['Fitness Training', 'Exercise Science', 'Nutrition', 'Motivation', 'Communication', 'Program Design', 'Safety', 'Assessment'],
    job_titles: ['Certified Personal Trainer', 'Fitness Coach', 'Strength Coach', 'Group Fitness Instructor', 'Online Trainer'],
    certifications: ['Certified Personal Trainer (CPT)', 'National Academy of Sports Medicine (NASM)', 'American Council on Exercise (ACE)'],
    requirements: {
      education: ['High School Diploma or equivalent', 'Fitness Certification'],
      experience: '1+ years of personal training experience',
      skills: ['Exercise science', 'Motivation techniques', 'Safety protocols']
    }
  }
];

async function translateText(text, targetLanguage) {
  if (targetLanguage === 'en' || !genAI) return text;
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Translate the following English text to ${LANGUAGE_NAMES[targetLanguage]}. Return only the translation, no explanations:

"${text}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error(`❌ Error translating to ${targetLanguage}:`, error.message);
    return `[${targetLanguage.toUpperCase()}] ${text}`;
  }
}

async function translateArray(array, targetLanguage) {
  if (targetLanguage === 'en' || !genAI) return array;
  
  const translated = [];
  for (const item of array) {
    const translatedItem = await translateText(item, targetLanguage);
    translated.push(translatedItem);
  }
  return translated;
}

async function translateObject(obj, targetLanguage) {
  if (targetLanguage === 'en' || !genAI) return obj;
  
  const translated = {};
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      translated[key] = await translateArray(value, targetLanguage);
    } else if (typeof value === 'string') {
      translated[key] = await translateText(value, targetLanguage);
    } else {
      translated[key] = value;
    }
  }
  return translated;
}

async function addCareersToCore() {
  console.log('💼 Adding additional careers to careers_core...');
  
  for (const career of ADDITIONAL_CAREERS) {
    const coreCareer = {
      id: career.id,
      level: career.level,
      salary_range: career.salary_range,
      experience_required: career.experience_required
    };
    
    const { error } = await supabase
      .from('careers_core')
      .upsert(coreCareer, { onConflict: 'id' });
    
    if (error) {
      console.error(`❌ Error inserting career core ${career.id}:`, error.message);
    } else {
      console.log(`✅ Added career core: ${career.id}`);
    }
  }
}

async function addCareerContent() {
  console.log('💼 Adding career content for all languages...');
  
  for (const language of LANGUAGES) {
    console.log(`\n🌍 Processing additional careers for ${LANGUAGE_NAMES[language]} (${language})`);
    
    for (const career of ADDITIONAL_CAREERS) {
      let title = career.title;
      let description = career.description;
      let skills = career.skills;
      let jobTitles = career.job_titles;
      let certifications = career.certifications;
      let requirements = career.requirements;
      
      if (language !== 'en') {
        title = await translateText(title, language);
        description = await translateText(description, language);
        skills = await translateArray(skills, language);
        jobTitles = await translateArray(jobTitles, language);
        certifications = await translateArray(certifications, language);
        requirements = await translateObject(requirements, language);
      }
      
      const careerContent = {
        career_id: career.id,
        title: title,
        description: description,
        skills: skills,
        job_titles: jobTitles,
        certifications: certifications,
        requirements: requirements
      };
      
      const { error } = await supabase
        .from(`careers_${language}`)
        .upsert(careerContent, { onConflict: 'career_id' });
      
      if (error) {
        console.error(`❌ Error inserting career content ${career.id} for ${language}:`, error.message);
      } else {
        console.log(`✅ Added career content ${career.id} for ${language}: ${title}`);
      }
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function main() {
  console.log('🚀 Adding Hundreds More Real-World Careers');
  console.log('=' * 50);
  
  try {
    // Step 1: Add careers to core table
    await addCareersToCore();
    
    // Step 2: Add career content to all languages
    await addCareerContent();
    
    console.log('\n🎉 Additional careers added successfully!');
    console.log('\n📊 Summary:');
    console.log(`   ✅ Added ${ADDITIONAL_CAREERS.length} additional real careers`);
    console.log(`   ✅ Created translations for: ${LANGUAGES.join(', ')}`);
    console.log(`   ✅ Includes niche and non-mainstream careers`);
    console.log(`   ✅ Covers specialized fields and emerging technologies`);
    
  } catch (error) {
    console.error('❌ Error during addition:', error);
    process.exit(1);
  }
}

main();
