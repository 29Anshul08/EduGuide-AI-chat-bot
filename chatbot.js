/**
 * EduGuide AI - Chatbot Engine
 * Handles all chat logic, intent matching, and response generation.
 */

const ChatBot = (() => {
    // ===== Knowledge Base =====
    const KB = {
        courses: {
            jee: {
                name: "JEE Main & Advanced",
                description: "Our JEE program covers the complete syllabus of Physics, Chemistry, and Mathematics with a structured approach. We focus on concept building, extensive problem-solving, and regular test series.",
                eligibility: "Class 11, 12 students and Droppers",
                duration: "1-year and 2-year programs available",
                subjects: "Physics, Chemistry, Mathematics",
                batches: ["Morning Batch (7 AM - 10 AM)", "Evening Batch (4 PM - 7 PM)", "Weekend Batch (Sat-Sun)"],
                features: [
                    "Expert IITian Faculty",
                    "Daily Practice Problems (DPPs)",
                    "Weekly & Monthly Tests",
                    "Doubt Solving Sessions",
                    "Study Material (Printed + Digital)",
                    "Previous Year Paper Analysis"
                ],
                modes: "Online & Offline both available"
            },
            neet: {
                name: "NEET (UG)",
                description: "Our NEET program is designed to build a strong foundation in Biology, Physics, and Chemistry. The curriculum follows NCERT closely with additional reference material for advanced preparation.",
                eligibility: "Class 11, 12 students and Droppers",
                duration: "1-year and 2-year programs available",
                subjects: "Biology (Botany + Zoology), Physics, Chemistry",
                batches: ["Morning Batch (7 AM - 10 AM)", "Afternoon Batch (12 PM - 3 PM)", "Weekend Batch (Sat-Sun)"],
                features: [
                    "NEET Specialist Faculty",
                    "NCERT-Focused Approach",
                    "Daily MCQ Practice",
                    "Regular Mock Tests (NTA Pattern)",
                    "Comprehensive Study Material",
                    "Biology Practical Sessions"
                ],
                modes: "Online & Offline both available"
            },
            foundation: {
                name: "Foundation Course (Class 8-10)",
                description: "Our Foundation program builds strong basics in Science and Mathematics, preparing students for future competitive exams like JEE, NEET, and Olympiads while ensuring excellent Board performance.",
                eligibility: "Students of Class 8, 9, and 10",
                duration: "1-year programs for each class level",
                subjects: "Science (Physics, Chemistry, Biology) + Mathematics",
                batches: ["After School Batch (4 PM - 6 PM)", "Weekend Batch (Sat-Sun)"],
                features: [
                    "Olympiad Preparation (NTSE, NSO, IMO)",
                    "Strong Conceptual Foundation",
                    "Fun Learning Approach",
                    "Regular Assessments",
                    "Board + Competitive Dual Focus",
                    "Mentorship Program"
                ],
                modes: "Online & Offline both available"
            },
            boards: {
                name: "Board Exam Preparation",
                description: "Score 95%+ in your Class 11 and 12 Board exams with our focused board preparation program. We cover the complete CBSE/State Board syllabus with emphasis on exam-oriented preparation.",
                eligibility: "Class 11 and 12 students",
                duration: "Full academic year",
                subjects: "All Board Subjects",
                batches: ["Evening Batch (5 PM - 7 PM)", "Weekend Batch (Sat-Sun)"],
                features: [
                    "Chapter-wise Notes",
                    "Sample Paper Practice",
                    "Previous Year Question Analysis",
                    "Writing Skills Improvement",
                    "Practical Exam Guidance",
                    "Last Month Crash Course"
                ],
                modes: "Online & Offline both available"
            },
            cuet: {
                name: "CUET Preparation",
                description: "Comprehensive CUET coaching covering General Test, Domain Subjects, and Language sections. Our program is designed to help you get into top central universities like DU, JNU, BHU.",
                eligibility: "Class 12 students and Droppers",
                duration: "6 months to 1 year",
                subjects: "General Test + Domain Subjects + Language",
                batches: ["Available in multiple time slots"],
                features: [
                    "NTA Pattern Mock Tests",
                    "Domain-Specific Coaching",
                    "General Knowledge Sessions",
                    "Language Proficiency Training",
                    "University Selection Guidance"
                ],
                modes: "Online & Offline both available"
            }
        },
        admission: {
            process: [
                "Step 1: Fill the inquiry form or chat with us",
                "Step 2: Appear for our Scholarship-cum-Admission Test (SCAT)",
                "Step 3: Counseling session with our academic advisor",
                "Step 4: Choose your batch and course",
                "Step 5: Complete fee payment and enrollment",
                "Step 6: Get study material and start classes!"
            ],
            scholarships: "We offer scholarships up to 90% based on our entrance test (SCAT) performance. Scholarships are also available for students with exceptional board results or competitive exam scores.",
            documents: ["Passport-sized photos (2)", "Class marksheet (latest)", "Aadhar card copy", "Parent/Guardian ID proof"]
        },
        fees: {
            note: "Fees vary based on the course, batch type (online/offline), and duration. We offer flexible payment options including EMI.",
            range: "Our programs range from ₹25,000 to ₹1,50,000 per year depending on the course and batch.",
            discounts: "Early bird discount (10%), Sibling discount (5%), and Scholarship-based fee waiver available.",
            contact: "For exact fee details, I'd recommend speaking with our counselor who can give you the best offer. Should I collect your details for a callback?"
        },
        results: {
            summary: "In 2025, our students achieved remarkable results with 500+ selections in JEE/NEET. Our toppers include AIR 45 in JEE Advanced and AIR 112 in NEET UG.",
            highlights: [
                "500+ selections in JEE & NEET in 2025",
                "Top ranker: AIR 45 in JEE Advanced (Priya Sharma)",
                "NEET topper: AIR 112 (Rahul Verma)",
                "92% overall selection rate",
                "200+ students scored 95%+ in Board Exams"
            ]
        },
        schedule: {
            general: "Classes run 6 days a week (Mon-Sat). We have multiple batch timings to suit different schedules.",
            newBatch: "New batches start every month. The next batch begins on the 1st of the upcoming month.",
            timings: {
                morning: "7:00 AM – 10:00 AM",
                afternoon: "12:00 PM – 3:00 PM",
                evening: "4:00 PM – 7:00 PM",
                weekend: "Saturday & Sunday: 9:00 AM – 1:00 PM"
            }
        }
    };

    // ===== Intent Patterns =====
    const intents = [
        {
            name: "greeting",
            patterns: [/^(hi|hello|hey|hii+|namaste|namaskar|good\s*(morning|evening|afternoon|night))/i, /^(hola|howdy|sup|what'?s?\s*up)/i],
            responses: [
                "Hello! 👋 Welcome to EduGuide! I'm here to help you with anything related to our coaching programs. Whether it's JEE, NEET, Foundation, or Boards — just ask! 😊\n\nHow can I help you today?",
                "Hi there! 🌟 Welcome! I can help you with course details, admissions, fees, batch timings, and more. What would you like to know?",
                "Namaste! 🙏 EduGuide AI mein aapka swagat hai! Batayein, kaise madad kar sakta hoon?"
            ]
        },
        {
            name: "jee",
            patterns: [/jee/i, /iit/i, /engineering/i, /joint\s*entrance/i],
            handler: () => {
                const c = KB.courses.jee;
                return `🎯 **${c.name} Coaching**\n\n${c.description}\n\n📋 **Key Details:**\n• Eligibility: ${c.eligibility}\n• Duration: ${c.duration}\n• Subjects: ${c.subjects}\n• Mode: ${c.modes}\n\n⏰ **Batch Timings:**\n${c.batches.map(b => '• ' + b).join('\n')}\n\n✨ **Features:**\n${c.features.map(f => '• ' + f).join('\n')}\n\nWould you like to know about the fees or admission process? 😊`;
            }
        },
        {
            name: "neet",
            patterns: [/neet/i, /medical/i, /doctor/i, /mbbs/i],
            handler: () => {
                const c = KB.courses.neet;
                return `🩺 **${c.name} Coaching**\n\n${c.description}\n\n📋 **Key Details:**\n• Eligibility: ${c.eligibility}\n• Duration: ${c.duration}\n• Subjects: ${c.subjects}\n• Mode: ${c.modes}\n\n⏰ **Batch Timings:**\n${c.batches.map(b => '• ' + b).join('\n')}\n\n✨ **Features:**\n${c.features.map(f => '• ' + f).join('\n')}\n\nShall I share the fee details or help with admission? 😊`;
            }
        },
        {
            name: "foundation",
            patterns: [/foundation/i, /class\s*(8|9|10)\b/i, /olympiad/i, /ntse/i],
            handler: () => {
                const c = KB.courses.foundation;
                return `📖 **${c.name}**\n\n${c.description}\n\n📋 **Key Details:**\n• Eligibility: ${c.eligibility}\n• Duration: ${c.duration}\n• Subjects: ${c.subjects}\n• Mode: ${c.modes}\n\n⏰ **Batch Timings:**\n${c.batches.map(b => '• ' + b).join('\n')}\n\n✨ **Features:**\n${c.features.map(f => '• ' + f).join('\n')}\n\nWould you like to know about fees or enroll your child? 😊`;
            }
        },
        {
            name: "boards",
            patterns: [/board/i, /cbse/i, /state\s*board/i, /12th/i, /11th/i],
            handler: () => {
                const c = KB.courses.boards;
                return `📚 **${c.name}**\n\n${c.description}\n\n📋 **Key Details:**\n• Eligibility: ${c.eligibility}\n• Duration: ${c.duration}\n• Mode: ${c.modes}\n\n✨ **Features:**\n${c.features.map(f => '• ' + f).join('\n')}\n\nWant to know about fees or combine it with JEE/NEET coaching? 😊`;
            }
        },
        {
            name: "cuet",
            patterns: [/cuet/i, /central\s*universit/i, /du\b/i, /delhi\s*university/i],
            handler: () => {
                const c = KB.courses.cuet;
                return `🎓 **${c.name}**\n\n${c.description}\n\n📋 **Key Details:**\n• Eligibility: ${c.eligibility}\n• Duration: ${c.duration}\n• Subjects: ${c.subjects}\n• Mode: ${c.modes}\n\n✨ **Features:**\n${c.features.map(f => '• ' + f).join('\n')}\n\nWould you like to know the fee structure?`;
            }
        },
        {
            name: "courses_general",
            patterns: [/course/i, /program/i, /what.*offer/i, /what.*teach/i, /coaching/i, /classes/i],
            handler: () => {
                return `📚 **Our Courses & Programs:**\n\n🎯 **JEE Main & Advanced** — For engineering aspirants (Class 11-12, Droppers)\n🩺 **NEET (UG)** — For medical aspirants (Class 11-12, Droppers)\n📖 **Foundation** — Early preparation (Class 8, 9, 10)\n📝 **Board Preparation** — Score 95%+ in CBSE/State Boards\n🎓 **CUET** — For central university admissions\n\nAll courses are available in **Online & Offline** mode with multiple batch timings.\n\nWhich course are you interested in? I can share detailed information! 😊`;
            }
        },
        {
            name: "fees",
            patterns: [/fee/i, /price/i, /cost/i, /kitna/i, /charge/i, /paisa/i, /amount/i, /₹/i, /rupee/i],
            handler: () => {
                return `💰 **Fee Information:**\n\n${KB.fees.note}\n\n📊 ${KB.fees.range}\n\n🎁 **Discounts Available:**\n${KB.fees.discounts}\n\n${KB.fees.contact}`;
            }
        },
        {
            name: "admission",
            patterns: [/admis/i, /enrol/i, /join/i, /regist/i, /apply/i, /how\s*to\s*(start|begin)/i],
            handler: () => {
                return `📝 **Admission Process:**\n\n${KB.admission.process.map(s => s).join('\n')}\n\n📄 **Documents Required:**\n${KB.admission.documents.map(d => '• ' + d).join('\n')}\n\n🎓 **Scholarship:** ${KB.admission.scholarships}\n\nWould you like to start the admission process? I can collect your details for a counselor callback! 😊`;
            }
        },
        {
            name: "scholarship",
            patterns: [/scholar/i, /discount/i, /free/i, /concession/i, /waiver/i, /scat/i],
            handler: () => {
                return `🏆 **Scholarships & Discounts:**\n\n${KB.admission.scholarships}\n\n🎁 **Additional Discounts:**\n${KB.fees.discounts}\n\nThe next Scholarship Test (SCAT) is scheduled soon. Want me to register you? 😊`;
            }
        },
        {
            name: "results",
            patterns: [/result/i, /topper/i, /selection/i, /rank/i, /success/i, /achieve/i, /air\b/i],
            handler: () => {
                return `🏆 **Our Results:**\n\n${KB.results.summary}\n\n🌟 **Key Highlights:**\n${KB.results.highlights.map(h => '• ' + h).join('\n')}\n\nThese results speak for themselves! Want to be our next success story? 🚀`;
            }
        },
        {
            name: "schedule",
            patterns: [/timing/i, /schedule/i, /batch/i, /when.*start/i, /time/i, /slot/i, /kab/i],
            handler: () => {
                const t = KB.schedule.timings;
                return `🕐 **Batch Timings & Schedule:**\n\n${KB.schedule.general}\n\n⏰ **Available Timings:**\n• 🌅 Morning: ${t.morning}\n• ☀️ Afternoon: ${t.afternoon}\n• 🌇 Evening: ${t.evening}\n• 📅 Weekend: ${t.weekend}\n\n📅 ${KB.schedule.newBatch}\n\nWhich timing suits you best? I can check availability! 😊`;
            }
        },
        {
            name: "counselor",
            patterns: [/counsel/i, /talk.*person/i, /call.*back/i, /speak.*someone/i, /contact/i, /phone/i, /number/i, /callback/i],
            handler: () => {
                return `📞 **Connect with a Counselor:**\n\nI'd be happy to connect you with our expert counselor who can provide personalized guidance!\n\n📱 **Call us:** +91 98765 43210\n📧 **Email:** info@eduguide.in\n🕐 **Available:** Mon-Sat, 9 AM - 7 PM\n\nOr, you can fill in the contact form (click the 👤+ icon above) and our counselor will call you within 30 minutes! 😊`;
            }
        },
        {
            name: "doubt",
            patterns: [/doubt/i, /question/i, /help.*stud/i, /not\s*understand/i, /explain/i, /samajh/i],
            handler: () => {
                return `🧠 **Doubt Solving:**\n\nWe have multiple ways to clear your doubts:\n\n• 📱 **Daily Doubt Sessions** — 1 hour dedicated slot after every class\n• 💬 **WhatsApp Doubt Group** — Get answers from faculty within hours\n• 🖥️ **Online Doubt Portal** — Submit doubts 24/7, get video solutions\n• 👨‍🏫 **One-on-One Sessions** — Available on request\n\nFor specific academic doubts, I'd recommend attending our doubt-solving sessions. Would you like to know the schedule?`;
            }
        },
        {
            name: "online",
            patterns: [/online/i, /virtual/i, /remote/i, /from\s*home/i, /digital/i],
            handler: () => {
                return `💻 **Online Learning:**\n\nYes! All our courses are available in **Online mode** with:\n\n• 🎥 Live interactive classes (not recorded)\n• 📱 Mobile app for learning on-the-go\n• 📝 Digital study material & e-books\n• 🧪 Online test series & analysis\n• 💬 Live doubt solving\n• 📊 Performance tracking dashboard\n\nThe online experience is designed to be as effective as offline classes. Want to join our online batch?`;
            }
        },
        {
            name: "parent",
            patterns: [/parent/i, /father/i, /mother/i, /guardian/i, /my\s*(son|daughter|child|kid|ward)/i, /beta|beti|bachcha/i],
            handler: () => {
                return `🙏 **Welcome, Parent!**\n\nWe understand your concern for your child's future, and we're committed to providing:\n\n🛡️ **Safety & Discipline:**\n• CCTV monitored classrooms\n• Regular attendance tracking (SMS alerts)\n• Structured study environment\n\n📊 **Progress Tracking:**\n• Monthly parent-teacher meetings\n• Regular performance reports\n• Direct communication with mentors\n\n🎯 **Academic Excellence:**\n• 92% selection rate\n• 15,000+ successful students\n• Experienced faculty (avg 10+ years)\n\nWould you like to schedule a visit to our center or speak with a counselor? 😊`;
            }
        },
        {
            name: "class_guidance",
            patterns: [/i\s*am\s*in\s*class/i, /which.*choose/i, /suggest/i, /guide.*me/i, /kya.*karu/i, /what.*should.*i/i, /best.*for\s*me/i, /confused/i],
            handler: (msg) => {
                const classMatch = msg.match(/class\s*(\d+)/i) || msg.match(/(\d+)(th|st|nd|rd)/i);
                if (classMatch) {
                    const cls = parseInt(classMatch[1]);
                    if (cls <= 10) {
                        return `Great! Since you're in Class ${cls}, I'd recommend our **Foundation Course**! 📖\n\nIt will:\n• Build strong basics in Science & Math\n• Prepare you for Olympiads (NTSE, NSO, IMO)\n• Give you a head start for JEE/NEET\n• Help score excellent marks in school exams\n\nAre you more inclined towards Engineering (JEE) or Medical (NEET)? This will help me suggest the perfect plan! 😊`;
                    } else {
                        return `Since you're in Class ${cls}, this is the perfect time to start serious preparation! 🎯\n\nI'd recommend:\n• **JEE Course** — If you want to become an engineer (IIT/NIT)\n• **NEET Course** — If you want to become a doctor (AIIMS/MBBS)\n• **Board + Competitive Combo** — Best of both worlds!\n\nWhich direction are you leaning towards? I'll give you the perfect roadmap! 😊`;
                    }
                }
                return `I'd love to help you choose the right course! 😊\n\nCould you tell me:\n1. Which class are you currently in?\n2. Are you interested in Engineering (JEE) or Medical (NEET)?\n\nThis will help me suggest the best program for you!`;
            }
        },
        {
            name: "dropper",
            patterns: [/drop/i, /gap\s*year/i, /repeat/i, /didn'?t\s*(clear|pass|qualify)/i, /fail/i, /once\s*more/i],
            handler: () => {
                return `💪 **Dropper / Repeater Program:**\n\nTaking a drop year is a brave and smart decision! Many toppers were droppers. We have a specialized program:\n\n📋 **What We Offer:**\n• Intensive 1-year program\n• Focused revision + advanced problem-solving\n• Personal mentor assigned\n• Special test series (weekly + monthly)\n• Psychological support & motivation sessions\n\n⏰ **Batch Timings:** Full-day batches available (9 AM - 5 PM)\n\n🎓 **Scholarships:** Special scholarships for droppers based on previous attempt scores.\n\nDon't worry — with the right guidance, you WILL crack it! Should I register you for our dropper batch? 🚀`;
            }
        },
        {
            name: "thanks",
            patterns: [/thank/i, /dhanyawad/i, /shukriya/i, /thx/i, /thnk/i, /appreciate/i],
            responses: [
                "You're welcome! 😊 Feel free to ask if you have any more questions. We're always here to help!\n\nWould you like me to connect you with a counselor for personalized guidance?",
                "Glad I could help! 🙌 Don't hesitate to reach out anytime. Best of luck with your preparation! 🚀",
                "My pleasure! 😊 If you'd like a callback from our counselor, just share your phone number and we'll get back to you!"
            ]
        },
        {
            name: "bye",
            patterns: [/bye/i, /goodbye/i, /see\s*you/i, /alvida/i, /chal.*ta/i],
            responses: [
                "Goodbye! 👋 Wishing you all the best for your preparation. Remember, we're just a message away! 🌟",
                "Bye! 😊 Feel free to come back anytime. Good luck with your studies! 🚀",
                "Take care! 🙏 If you need anything in the future, don't hesitate to reach out. All the best!"
            ]
        }
    ];

    // ===== Lead tracking =====
    let leadData = {};
    let messageCount = 0;
    let leadAsked = false;

    // ===== Response Functions =====
    function findIntent(message) {
        const cleaned = message.trim().toLowerCase();
        for (const intent of intents) {
            for (const pattern of intent.patterns) {
                if (pattern.test(cleaned)) {
                    return intent;
                }
            }
        }
        return null;
    }

    function getResponse(message) {
        messageCount++;
        const intent = findIntent(message);

        if (intent) {
            let response;
            if (intent.handler) {
                response = intent.handler(message);
            } else if (intent.responses) {
                response = intent.responses[Math.floor(Math.random() * intent.responses.length)];
            }

            // Add lead collection prompt after a few messages
            if (messageCount >= 3 && !leadAsked && intent.name !== 'greeting' && intent.name !== 'thanks' && intent.name !== 'bye') {
                leadAsked = true;
                response += "\n\n---\n💡 **Tip:** For personalized guidance, can I have your name and contact number? Our counselor can help you much better! Just click the 👤+ icon above to fill the form.";
            }

            return response;
        }

        // Fallback responses
        const fallbacks = [
            "That's a great question! 🤔 I want to make sure you get the right answer. Let me connect you with our expert counselor who can help better.\n\nYou can call us at **+91 98765 43210** or fill the contact form above! 😊",
            "I appreciate your question! While I may not have the exact answer, our academic counselor can definitely help. Would you like a callback? Just share your contact details! 📞",
            "Hmm, I want to give you the most accurate information. 🎯 Could you rephrase your question? Or I can connect you with a counselor who can assist better!\n\nYou can also try asking about:\n• Courses (JEE, NEET, Foundation)\n• Fees & Scholarships\n• Batch Timings\n• Admission Process"
        ];

        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    function formatMessage(text) {
        // Convert markdown-like formatting to HTML
        let html = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid rgba(0,0,0,0.08);margin:8px 0">')
            .replace(/^• (.+)$/gm, '<div style="padding-left:12px;margin:2px 0">• $1</div>')
            .replace(/\n/g, '<br>');
        return html;
    }

    function getWelcomeMessage() {
        return "Hello! 👋 Welcome to **EduGuide AI**!\n\nI'm your virtual counselor. I can help you with:\n\n• 📚 Course details (JEE, NEET, Foundation, Boards, CUET)\n• 💰 Fee structure & scholarships\n• 🕐 Batch timings & schedule\n• 📝 Admission process\n• 🏆 Our results & success stories\n\nWhat would you like to know? 😊";
    }

    function saveLead(data) {
        leadData = { ...leadData, ...data };
        console.log("📋 Lead Captured:", leadData);
        // In production, this would POST to an API
        return leadData;
    }

    return {
        getResponse,
        formatMessage,
        getWelcomeMessage,
        saveLead
    };
})();
