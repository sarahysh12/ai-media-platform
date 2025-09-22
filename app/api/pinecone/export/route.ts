import { NextResponse } from "next/server";
import { getPineconeClient } from "@/lib/pinecone";

export async function GET() {
  const pc = await getPineconeClient();
  const index = pc.index(process.env.PINECONE_INDEX as string);

  let allRecords: any[] = [];
  let paginationToken: string | undefined = undefined;

  do {
    const listed = await index.listPaginated({ limit: 100, paginationToken });
    const ids = listed.vectors?.map((v: any) => v.id);

    if (ids?.length && ids.length > 0) {
      const fetched = await index.fetch(ids);

      Object.entries(fetched.records || {}).forEach(([id, vector]: any) => {
        const { text, image } = vector.metadata || {};
        allRecords.push({ id, text, image });
      });
    }

    paginationToken = listed.pagination?.next;
  } while (paginationToken);

  return NextResponse.json(allRecords, {
    headers: {
      "Content-Disposition": 'attachment; filename="pinecone-export.json"',
    },
  });
}
