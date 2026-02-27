import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug, SERVICES } from "@/lib/data/services";
import ServiceDetail from "@/components/sections/ServiceDetail";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Услуга не найдена | MM Detailing" };
  return {
    title: `${service.title} | MM Detailing`,
    description: service.desc,
  };
}

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  return <ServiceDetail service={service} />;
}
