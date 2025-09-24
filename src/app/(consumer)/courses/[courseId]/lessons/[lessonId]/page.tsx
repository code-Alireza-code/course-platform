import ActionButton from "@/components/ActionButton";
import SkeletonButton from "@/components/Skeleton";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import {
  CourseSectionTable,
  LessonsStatus,
  LessonTable,
  UserLessonCompleteTable,
} from "@/drizzle/schema";
import { wherePublicCourseSections } from "@/features/courseSections/permissions/sections";
import { updateLessonCompleteStatus } from "@/features/lessons/actions/userLessonComplete";
import YoutubeVideoPlayer from "@/features/lessons/components/YoutubeVideoPlayer";
import { getLessonIdTag } from "@/features/lessons/db/cache/lessons";
import { getUserLessonCompleteIdTag } from "@/features/lessons/db/cache/userLessonComplete";
import {
  canViewLesson,
  wherePublicLessons,
} from "@/features/lessons/permissions/lessons";
import { canUpdateUserLessonCompleteStatus } from "@/features/lessons/permissions/userLessonComplete";
import { getCurrentUser } from "@/services/clerk";
import { and, asc, desc, eq, gt, lt } from "drizzle-orm";
import { CheckSquare2, LockIcon, XSquare } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode, Suspense } from "react";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string; courseId: string }>;
}) {
  const { lessonId, courseId } = await params;
  const lesson = await getLesson(lessonId);

  if (lesson == null) return notFound();

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SuspenseBoundary lesson={lesson} courseId={courseId} />
    </Suspense>
  );
}

function LoadingSkeleton() {
  return null;
}

async function SuspenseBoundary({
  lesson,
  courseId,
}: {
  lesson: {
    id: string;
    name: string;
    description: string | null;
    status: LessonsStatus;
    sectionId: string;
    youtubeVideoId: string;
    order: number;
  };
  courseId: string;
}) {
  const { userId, role } = await getCurrentUser();

  const isLessonComplete =
    userId == null
      ? false
      : await getIsLessonCompelete({ lessonId: lesson.id, userId });
  const canView = await canViewLesson({ role, userId }, lesson);
  const canUpdateCompleteLessonStatus = await canUpdateUserLessonCompleteStatus(
    { userId },
    lesson.id
  );

  const previousLesson = await getPreviousLesson(lesson);

  return (
    <div className="flex my-4 flex-col gap-4">
      <div className="aspect-video">
        {canView ? (
          <YoutubeVideoPlayer
            videoId={lesson.youtubeVideoId}
            onFinishedVideo={
              !isLessonComplete && canUpdateCompleteLessonStatus
                ? updateLessonCompleteStatus.bind(null, lesson.id, true)
                : undefined
            }
          />
        ) : (
          <div className="flex items-center justify-center bg-primary text-primary-foreground h-full w-full">
            <LockIcon className="size-16" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start gap-4">
          <h1 className="text-2xl font-semibold">{lesson.name}</h1>
          <div className="flex gap-2 justify-end">
            <Suspense fallback={<SkeletonButton />}>
              <ToLessonButton
                courseId={courseId}
                lesson={lesson}
                lessonFunc={getPreviousLesson}
              >
                Previous
              </ToLessonButton>
            </Suspense>
            {canUpdateCompleteLessonStatus && (
              <ActionButton
                variant="outline"
                action={updateLessonCompleteStatus.bind(
                  null,
                  lesson.id,
                  !isLessonComplete
                )}
              >
                <div className="gap-2 items-center flex">
                  {isLessonComplete ? (
                    <>
                      <CheckSquare2 />
                      Mark Incomplete
                    </>
                  ) : (
                    <>
                      <XSquare />
                      Mark Complete
                    </>
                  )}
                </div>
              </ActionButton>
            )}
            <Suspense fallback={<SkeletonButton />}>
              <ToLessonButton
                courseId={courseId}
                lesson={lesson}
                lessonFunc={getNextLesson}
              >
                Next
              </ToLessonButton>
            </Suspense>
          </div>
        </div>
        {canView ? (
          lesson.description && <p>{lesson.description}</p>
        ) : (
          <p>This Lesson is locked. Please Purchase the course to view it.</p>
        )}
      </div>
    </div>
  );
}

async function ToLessonButton({
  children,
  lessonFunc,
  courseId,
  lesson,
}: {
  children: ReactNode;
  courseId: string;
  lesson: {
    id: string;
    sectionId: string;
    order: number;
  };
  lessonFunc: (lesson: {
    id: string;
    sectionId: string;
    order: number;
  }) => Promise<{ id: string } | undefined>;
}) {
  const toLesson = await lessonFunc(lesson);
  if (toLesson == null) return;
  return (
    <Button variant="outline" asChild>
      <Link href={`/courses/${courseId}/lessons/${toLesson.id}`}>
        {children}
      </Link>
    </Button>
  );
}

async function getPreviousLesson(lesson: {
  id: string;
  sectionId: string;
  order: number;
}) {
  let previousLesson = await db.query.LessonTable.findFirst({
    where: and(
      lt(LessonTable.order, lesson.order),
      eq(LessonTable.sectionId, lesson.sectionId),
      wherePublicLessons
    ),
    orderBy: desc(LessonTable.order),
    columns: { id: true },
  });

  if (previousLesson == null) {
    const section = await db.query.CourseSectionTable.findFirst({
      where: eq(CourseSectionTable.id, lesson.sectionId),
      columns: { order: true, courseId: true, id: true },
    });

    if (section == null) return;

    const previousSection = await db.query.CourseSectionTable.findFirst({
      where: and(
        lt(CourseSectionTable.order, section.order),
        eq(CourseSectionTable.courseId, section.id),
        wherePublicCourseSections
      ),
      orderBy: desc(CourseSectionTable.order),
      columns: { id: true },
    });

    if (previousSection == null) return;

    previousLesson = await db.query.LessonTable.findFirst({
      where: and(
        eq(LessonTable.sectionId, previousSection.id),
        wherePublicLessons
      ),
      orderBy: desc(LessonTable.order),
      columns: { id: true },
    });
  }

  return previousLesson;
}

async function getNextLesson(lesson: {
  id: string;
  sectionId: string;
  order: number;
}) {
  let nextLesson = await db.query.LessonTable.findFirst({
    where: and(
      gt(LessonTable.order, lesson.order),
      eq(LessonTable.sectionId, lesson.sectionId),
      wherePublicLessons
    ),
    orderBy: asc(LessonTable.order),
    columns: { id: true },
  });

  if (nextLesson == null) {
    const section = await db.query.CourseSectionTable.findFirst({
      where: eq(CourseSectionTable.id, lesson.sectionId),
      columns: { order: true, courseId: true, id: true },
    });

    if (section == null) return;

    const nextSection = await db.query.CourseSectionTable.findFirst({
      where: and(
        gt(CourseSectionTable.order, section.order),
        eq(CourseSectionTable.courseId, section.id),
        wherePublicCourseSections
      ),
      orderBy: asc(CourseSectionTable.order),
      columns: { id: true },
    });

    if (nextSection == null) return;

    nextLesson = await db.query.LessonTable.findFirst({
      where: and(eq(LessonTable.sectionId, nextSection.id), wherePublicLessons),
      orderBy: asc(LessonTable.order),
      columns: { id: true },
    });
  }

  return nextLesson;
}

async function getIsLessonCompelete({
  lessonId,
  userId,
}: {
  lessonId: string;
  userId: string;
}) {
  "use cache";
  cacheTag(getUserLessonCompleteIdTag({ userId, lessonId }));

  const data = await db.query.UserLessonCompleteTable.findFirst({
    where: and(
      eq(UserLessonCompleteTable.userId, userId),
      eq(UserLessonCompleteTable.lessonId, lessonId)
    ),
  });

  return data != null;
}

async function getLesson(id: string) {
  "use cache";
  cacheTag(getLessonIdTag(id));

  return db.query.LessonTable.findFirst({
    where: and(eq(LessonTable.id, id), wherePublicLessons),
    columns: {
      id: true,
      name: true,
      description: true,
      status: true,
      sectionId: true,
      youtubeVideoId: true,
      order: true,
    },
  });
}
