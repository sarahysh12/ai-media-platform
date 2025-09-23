import { NextResponse } from "next/server";

import { getPineconeClient } from "@/lib/pinecone";

export async function GET() {
  const pc = await getPineconeClient();
  const index = pc.index(process.env.PINECONE_INDEX as string);

  const allRecords: unknown[] = [];
  let paginationToken: string | undefined = undefined;

  do {
    const listed = await index.listPaginated({ limit: 100, paginationToken });
    const ids = (listed.vectors ?? [])
      .map((v: { id?: string }) => v.id)
      .filter((id): id is string => Boolean(id));

    if (ids?.length && ids.length > 0) {
      const fetched = await index.fetch(ids);

      Object.entries(fetched.records || {}).forEach(
        ([id, vector]: [string, { metadata?: { text?: string; image?: string } }]) => {
          const { text, image } = vector.metadata || {};
          allRecords.push({ id, text, image });
        }
      );
    }

    paginationToken = listed.pagination?.next;
  } while (paginationToken);

  return NextResponse.json(allRecords, {
    headers: {
      "Content-Disposition": 'attachment; filename="pinecone-export.json"',
    },
  });
}
