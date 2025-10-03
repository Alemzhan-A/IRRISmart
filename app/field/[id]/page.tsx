import { FieldDetails } from "@/components/field-details";

export default async function FieldPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FieldDetails fieldId={id} />;
}

