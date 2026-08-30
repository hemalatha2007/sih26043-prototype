import { PrismaClient } from "@prisma/client";

const KEYWORD_MAP: { re: RegExp; tag: string }[] = [
  { re: /machine learning|\bml\b|predictive|classif|neural/i, tag: "Machine Learning" },
  { re: /\biot\b|internet of things/i, tag: "IoT" },
  { re: /python/i, tag: "Python" },
  { re: /data analytic|data science|analytics/i, tag: "Data Analytics" },
  { re: /embedded|microcontroller|firmware/i, tag: "Embedded Systems" },
  { re: /sensor/i, tag: "Sensors" },
  { re: /cloud/i, tag: "Cloud Computing" },
  { re: /mobile|android|ios app/i, tag: "Mobile Dev" },
  { re: /web app|website|web platform|\bweb\b/i, tag: "Web Dev" },
  { re: /full stack|fullstack|mern|react|node/i, tag: "Full Stack Dev" },
  { re: /blockchain|ledger|smart contract/i, tag: "Blockchain" },
  { re: /cyber ?security|security|encryption/i, tag: "Cybersecurity" },
  { re: /agricultur|farm|irrigation|crop/i, tag: "AgriTech" },
  { re: /health|patient|clinical|medical/i, tag: "HealthTech" },
  { re: /database|\bsql\b|data storage/i, tag: "Databases" },
  { re: /manufactur|machine(?!\s?learning)|factory|industrial/i, tag: "Industrial Systems" },
];

/** Rule-based stand-in for an LLM/embedding classifier — same shape either way: text in, tags out. */
export function extractTags(text: string): string[] {
  const found = new Set<string>();
  for (const { re, tag } of KEYWORD_MAP) {
    if (re.test(text)) found.add(tag);
  }
  return Array.from(found);
}

function scorePerson(personSkills: string[], problemTags: string[]): number {
  if (problemTags.length === 0) return 0;
  const overlap = personSkills.filter((s) => problemTags.includes(s)).length;
  return Math.round((overlap / problemTags.length) * 100);
}

export type PersonScore = { id: string; name: string; role?: string; skills: string[]; score: number };
export type UniversityMatch = {
  universityId: string;
  name: string;
  location: string;
  score: number;
  faculty: PersonScore[];
  students: PersonScore[];
};

/** Fetches every university with its faculty/students and ranks them against the problem's tags. */
export async function computeMatches(prisma: PrismaClient, problemTags: string[]): Promise<UniversityMatch[]> {
  const universities = await prisma.university.findMany({
    include: { faculty: true, students: true },
  });
  type UniWithPeople = (typeof universities)[number];

  const ranked = universities.map((u: UniWithPeople) => {
    const faculty: PersonScore[] = u.faculty
      .map((f: UniWithPeople["faculty"][number]) => ({
        id: f.id,
        name: f.name,
        role: f.role,
        skills: f.skills,
        score: scorePerson(f.skills, problemTags),
      }))
      .sort((a: PersonScore, b: PersonScore) => b.score - a.score);

    const students: PersonScore[] = u.students
      .map((s: UniWithPeople["students"][number]) => ({
        id: s.id,
        name: s.name,
        skills: s.skills,
        score: scorePerson(s.skills, problemTags),
      }))
      .sort((a: PersonScore, b: PersonScore) => b.score - a.score);

    const bestFaculty = faculty.length ? Math.max(...faculty.map((f) => f.score)) : 0;
    const avgStudent = students.length ? students.reduce((a: number, s: PersonScore) => a + s.score, 0) / students.length : 0;
    const score = Math.round(bestFaculty * 0.6 + avgStudent * 0.4);

    return { universityId: u.id, name: u.name, location: u.location, score, faculty, students };
  });

  return ranked
    .filter((u: UniversityMatch) => u.score > 0)
    .sort((a: UniversityMatch, b: UniversityMatch) => b.score - a.score);
}
