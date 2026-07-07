// app/projects/[slug]/page.tsx

import ProjectDetail from "@/components/ProjectDetails";
import { getProjectBySlug, PROJECTS } from "@/lib/Project-Data";
import { notFound } from "next/navigation";


export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const currentIndex = PROJECTS.findIndex((p) => p.slug === params.slug);
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  return <ProjectDetail project={project} nextProject={nextProject} />;
}
