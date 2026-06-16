import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import ListingDetailClient from "./ListingDetailClient";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  const listing = await prisma.listing.findFirst({
    where: { id, isDeleted: false },
    include: {
      user: { select: { id: true, name: true, phone: true } },
      subcategory: { include: { category: true } },
    },
  });

  if (!listing) notFound();

  return (
    <ListingDetailClient
      listing={{
        ...listing,
        createdAt: listing.createdAt.toISOString(),
      }}
      session={session ? { id: session.id, name: session.name } : null}
    />
  );
}
