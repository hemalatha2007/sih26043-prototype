import { PrismaClient } from "@prisma/client";
import { callAIProvider } from "./aiProvider";

/**
 * Analyzes a problem statement, persists AI classification to database,
 * and dispatches database notifications to relevant platform users.
 */
export async function analyzeAndClassifyProblem(prisma: PrismaClient, problemId: string) {
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    include: { publisher: true },
  });

  if (!problem) throw new Error("Problem not found");

  // Mark status as ANALYZING
  await prisma.problem.update({
    where: { id: problemId },
    data: { status: "ANALYZING" },
  });

  // Call AI Provider
  const aiResult = await callAIProvider(
    problem.title || problem.org,
    problem.description,
    problem.suggestedDomain || problem.domain
  );

  // Update Problem record in PostgreSQL
  const updatedProblem = await prisma.problem.update({
    where: { id: problemId },
    data: {
      primaryDomain: aiResult.primaryDomain,
      domain: aiResult.primaryDomain,
      aiSummary: aiResult.summary,
      aiConfidence: aiResult.confidence,
      aiRequiredExpertise: aiResult.requiredExpertise,
      extractedTags: aiResult.extractedTags,
      status: "ANALYZED",
    },
  });

  // Dispatch In-App Database Notifications
  const notificationsToCreate: any[] = [];

  // 1. Notify Problem Publisher
  if (problem.publisherId) {
    notificationsToCreate.push({
      userId: problem.publisherId,
      type: "PROBLEM_ANALYZED",
      title: "🤖 AI Analysis Complete",
      message: `Your challenge '${problem.title}' has been classified under domain ${aiResult.primaryDomain} with ${Math.round(aiResult.confidence * 100)}% confidence.`,
      relatedProblemId: problem.id,
    });
  }

  // 2. Notify Relevant Student & Faculty Users matching the domain / expertise
  const users = await prisma.user.findMany({
    where: {
      role: { in: ["STUDENT", "FACULTY"] },
    },
    include: {
      student: true,
      faculty: true,
    },
  });

  for (const user of users) {
    const userSkills = user.student?.skills || user.faculty?.skills || [];
    const userInterests = user.student?.interests || user.faculty?.expertise || [];
    const allUserTags = [...userSkills, ...userInterests].map((s) => s.toLowerCase());

    const isMatch =
      allUserTags.includes(aiResult.primaryDomain.toLowerCase()) ||
      aiResult.requiredExpertise.some((req) => allUserTags.includes(req.toLowerCase()));

    if (isMatch || users.length <= 5) {
      notificationsToCreate.push({
        userId: user.id,
        type: "NEW_RELEVANT_PROBLEM",
        title: `🔔 New Challenge in ${aiResult.primaryDomain}`,
        message: `A newly analyzed challenge '${problem.title}' matches your expertise in ${aiResult.primaryDomain}.`,
        relatedProblemId: problem.id,
      });
    }
  }

  if (notificationsToCreate.length > 0) {
    await prisma.notification.createMany({
      data: notificationsToCreate,
    });
  }

  return updatedProblem;
}
