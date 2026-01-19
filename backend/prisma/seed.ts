import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  const profile = await prisma.profile.create({
    data: {
      name: "Omansh Thakur",
      email: "omanshthakur9211@gmail.com",
      links: {
        create: [
          {
            type: "github",
            url: "https://github.com/Omansh-Thakur",
          },
          {
            type: "linkedin",
            url: "https://www.linkedin.com/in/omansh-thakur-512200235/",
          },
          {
            type: "portfolio",
            url: "https://drive.google.com/file/d/1KrOs4hZKZVR_Q0sKu6WN7Enn3eteo301/view?usp=sharing",
          },
        ],
      },
    },
  });


  await prisma.education.create({
    data: {
      degree: "B.Tech in Computer Science and Engineering",
      institution: "National Institute of Technology (NIT), Delhi",
      startYear: 2023,
      endYear: 2027,
      profileId: profile.id,
    },
  });


  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React.js",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "WebRTC",
    "Node.js",
    "Express.js",
    "WebSockets",
    "Prisma",
    "Java",
    "Python",
    "MongoDB",
    "MySQL",
    "PostgreSQL",
    "Redis",
    "AWS",
    "Docker",
    "Docker Swarm",
    "Kubernetes",
    "Git",
    "GitHub",
    "Jest",
    "Mocha/Chai",
  ];

  const skillRecords = await Promise.all(
    skills.map((skill) =>
      prisma.skill.create({
        data: {
          name: skill,
          profileId: profile.id,
        },
      })
    )
  );

  const skillMap = Object.fromEntries(
    skillRecords.map((s) => [s.name, s.id])
  );



  const aiInterviewer = await prisma.project.create({
    data: {
      title: "AI Interviewer",
      description:
        "AI-powered mock interview platform that simulates real interview experiences. It dynamically generates interview questions based on the selected role and provides intelligent feedback to help users improve their answers and confidence.",
      work: "Personal Project",
      profileId: profile.id,
      links: {
        create: [
          {
            type: "demo",
            url: "https://ai-interviewer-rig4xa96i-vineets-projects-ef673d72.vercel.app/",
          },
        ],
      },
    },
  });

  const sentry = await prisma.project.create({
    data: {
      title: "Sentry – Real-Time Monitoring System",
      description:
        "Real-time monitoring and alerting system designed to track system events and application health. It uses WebSockets for instant updates and sends alerts via email when critical issues occur.",
      work: "Personal Project",
      profileId: profile.id,
      links: {
        create: [
          {
            type: "demo",
            url: "https://sentry-steel.vercel.app/",
          },
        ],
      },
    },
  });

  const urlShortener = await prisma.project.create({
    data: {
      title: "URL Shortener",
      description:
        "Full-stack URL shortening platform that allows users to generate short links and efficiently redirect traffic. The system is optimized for fast redirection and high performance.",
      work: "Personal Project",
      profileId: profile.id,
      links: {
        create: [
          {
            type: "demo",
            url: "https://shorturl-ten-mocha.vercel.app/",
          },
        ],
      },
    },
  });

  const vibeNet = await prisma.project.create({
    data: {
      title: "VibeNet",
      description:
        "Social networking application focused on real-time interaction and seamless user experience. It emphasizes scalability and clean backend architecture.",
      work: "Personal Project",
      profileId: profile.id,
      links: {
        create: [
          {
            type: "github",
            url: "https://github.com/vineetj12/VibeNet",
          },
        ],
      },
    },
  });

  const birdGame = await prisma.project.create({
    data: {
      title: "Bird Game",
      description:
        "Browser-based interactive bird game developed using core web technologies. The project focuses on game logic, animations, and user interaction without external frameworks.",
      work: "Personal Project",
      profileId: profile.id,
      links: {
        create: [
          {
            type: "demo",
            url: "https://vineetj12.github.io/bird/",
          },
        ],
      },
    },
  });


  const projectSkillMap = [
    { projectId: aiInterviewer.id, skills: ["React.js", "Node.js", "JavaScript"] },
    { projectId: sentry.id, skills: ["Node.js", "Express.js", "WebSockets", "Prisma", "PostgreSQL"] },
    { projectId: urlShortener.id, skills: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS"] },
    { projectId: vibeNet.id, skills: ["Node.js", "Express.js", "MongoDB", "JavaScript"] },
    { projectId: birdGame.id, skills: ["HTML", "CSS", "JavaScript"] },
  ];

  for (const ps of projectSkillMap) {
    for (const skillName of ps.skills) {
      const skillId = skillMap[skillName];
      if (!skillId) continue;

      await prisma.projectSkill.create({
        data: {
          projectId: ps.projectId,
          skillId,
        },
      });
    }
  }

  console.log(" Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
