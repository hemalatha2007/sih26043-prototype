import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const UNIVERSITIES = [
  {
    name: "Anna Institute of Technology",
    location: "Coimbatore, TN",
    faculty: [
      { name: "Dr. R. Meenakshi", role: "Prof. — ML & Industrial IoT", skills: ["Machine Learning", "IoT", "Data Analytics"] },
      { name: "Dr. S. Vignesh", role: "Assoc. Prof. — Embedded Systems", skills: ["Embedded Systems", "Sensors"] },
    ],
    students: [
      { name: "Aravind K.", skills: ["Machine Learning", "Python"] },
      { name: "Divya S.", skills: ["IoT", "Sensors"] },
      { name: "Naveen R.", skills: ["Data Analytics", "Cloud Computing"] },
    ],
  },
  {
    name: "Erode Coastal University",
    location: "Erode, TN",
    faculty: [
      { name: "Dr. P. Kalaivani", role: "Prof. — AgriTech & Sensors", skills: ["AgriTech", "Sensors", "IoT"] },
      { name: "Dr. M. Suresh", role: "Prof. — Cybersecurity", skills: ["Cybersecurity", "Databases"] },
    ],
    students: [
      { name: "Priya M.", skills: ["AgriTech", "Data Analytics"] },
      { name: "Hariharan V.", skills: ["Cybersecurity", "Cloud Computing"] },
    ],
  },
  {
    name: "Salem Institute of Engineering",
    location: "Salem, TN",
    faculty: [
      { name: "Dr. T. Bhavani", role: "Prof. — Full Stack & Cloud", skills: ["Full Stack Dev", "Web Dev", "Cloud Computing"] },
      { name: "Dr. A. Karthik", role: "Assoc. Prof. — Mobile Systems", skills: ["Mobile Dev", "Full Stack Dev"] },
    ],
    students: [
      { name: "Shalini R.", skills: ["Full Stack Dev", "Web Dev"] },
      { name: "Mohan D.", skills: ["Mobile Dev", "Web Dev"] },
      { name: "Keerthana P.", skills: ["Cloud Computing", "Full Stack Dev"] },
    ],
  },
  {
    name: "Tiruchengode College of Engg.",
    location: "Tiruchengode, TN",
    faculty: [
      { name: "Dr. N. Ramesh", role: "Prof. — HealthTech & ML", skills: ["HealthTech", "Machine Learning"] },
      { name: "Dr. G. Sudha", role: "Assoc. Prof. — Blockchain", skills: ["Blockchain", "Databases"] },
    ],
    students: [
      { name: "Vetri S.", skills: ["HealthTech", "Machine Learning"] },
      { name: "Abarna J.", skills: ["Blockchain", "Databases"] },
    ],
  },
];

async function main() {
  console.log("Clearing existing data…");
  await prisma.task.deleteMany();
  await prisma.match.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.student.deleteMany();
  await prisma.university.deleteMany();

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

  console.log(`Seeded ${UNIVERSITIES.length} universities.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
