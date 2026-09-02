import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const UNIVERSITIES = [
  {
    name: "Anna Institute of Technology",
    location: "Coimbatore, TN",
    faculty: [
      { name: "Dr. R. Meenakshi", role: "Prof. — ML & Industrial IoT", department: "Computer Science & Engineering", skills: ["Machine Learning", "IoT", "Data Analytics"], expertise: ["Disaster Management", "IoT", "Machine Learning"] },
      { name: "Dr. S. Vignesh", role: "Assoc. Prof. — Embedded Systems", department: "Electronics Engineering", skills: ["Embedded Systems", "Sensors"], expertise: ["Sensors", "Embedded Systems"] },
    ],
    students: [
      { name: "Aravind K.", department: "Computer Science & Engineering", skills: ["Machine Learning", "Python"], interests: ["Disaster Management", "Machine Learning"] },
      { name: "Divya S.", department: "Electronics Engineering", skills: ["IoT", "Sensors"], interests: ["Water Management", "IoT"] },
      { name: "Naveen R.", department: "Information Technology", skills: ["Data Analytics", "Cloud Computing"], interests: ["Data Analytics", "Environment"] },
    ],
  },
  {
    name: "Erode Coastal University",
    location: "Erode, TN",
    faculty: [
      { name: "Dr. P. Kalaivani", role: "Prof. — AgriTech & Sensors", department: "Agricultural Engineering", skills: ["AgriTech", "Sensors", "IoT"], expertise: ["Agriculture", "AgriTech"] },
      { name: "Dr. M. Suresh", role: "Prof. — Cybersecurity", department: "Computer Science & Engineering", skills: ["Cybersecurity", "Databases"], expertise: ["Cybersecurity"] },
    ],
    students: [
      { name: "Priya M.", department: "Agricultural Engineering", skills: ["AgriTech", "Data Analytics"], interests: ["Agriculture", "AgriTech"] },
      { name: "Hariharan V.", department: "Information Technology", skills: ["Cybersecurity", "Cloud Computing"], interests: ["Cybersecurity"] },
    ],
  },
];

const DEMO_USERS = [
  {
    name: "Govt / Industry Publisher Demo",
    email: "publisher@solink.ai",
    password: "publisher123",
    role: UserRole.PUBLISHER,
  },
  {
    name: "Aravind K (Student)",
    email: "student@solink.ai",
    password: "student123",
    role: UserRole.STUDENT,
  },
  {
    name: "Dr. R. Meenakshi (Faculty)",
    email: "faculty@solink.ai",
    password: "faculty123",
    role: UserRole.FACULTY,
  },
  {
    name: "Platform Administrator",
    email: "admin@solink.ai",
    password: "admin123",
    role: UserRole.ADMIN,
  },
];

async function main() {
  console.log("Clearing existing data…");
  await prisma.notification.deleteMany();
  await prisma.publisherProfile.deleteMany();
  await prisma.task.deleteMany();
  await prisma.match.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.student.deleteMany();
  await prisma.university.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding demo users…");
  const createdUsers: Record<string, any> = {};
  for (const u of DEMO_USERS) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const createdUser = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        passwordHash,
        role: u.role,
      },
    });
    createdUsers[u.email] = createdUser;

    if (u.role === UserRole.PUBLISHER) {
      await prisma.publisherProfile.create({
        data: {
          userId: createdUser.id,
          organizationName: "Coimbatore Smart City Ltd.",
          organizationType: "Government Authority",
          location: "Coimbatore, Tamil Nadu",
        },
      });
    }
  }

  console.log("Seeding universities, faculty, and students…");
  for (const u of UNIVERSITIES) {
    await prisma.university.create({
      data: {
        name: u.name,
        location: u.location,
        faculty: { create: u.faculty },
        students: { create: u.students },
      },
    });
  }

  console.log("Seeding initial notifications…");
  if (createdUsers["publisher@solink.ai"]) {
    await prisma.notification.create({
      data: {
        userId: createdUsers["publisher@solink.ai"].id,
        type: "SYSTEM",
        title: "Welcome to SoLink AI Open Innovation Workspace",
        message: "You can submit challenges, run AI domain classification, and route problems to university mentors.",
      },
    });
  }

  if (createdUsers["student@solink.ai"]) {
    await prisma.notification.create({
      data: {
        userId: createdUsers["student@solink.ai"].id,
        type: "NEW_RELEVANT_PROBLEM",
        title: "Platform Orientation Alert",
        message: "New challenges matched to your skill profile in Machine Learning and Disaster Management will appear here.",
      },
    });
  }

  if (createdUsers["faculty@solink.ai"]) {
    await prisma.notification.create({
      data: {
        userId: createdUsers["faculty@solink.ai"].id,
        type: "NEW_RELEVANT_PROBLEM",
        title: "Faculty Mentorship Hub Active",
        message: "You will receive notifications when new societal challenges require mentorship in your domain expertise.",
      },
    });
  }

  console.log(`Seeded ${DEMO_USERS.length} demo users, initial notifications, and universities.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
