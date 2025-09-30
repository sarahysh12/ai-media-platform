"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { fetchMoviesByIds, FirestoreMovieDoc } from "../../lib/firebase";

export interface ResultItemType {
    id: string; 
    values: number[];
    metadata: {
        text: string;
        uuid: string;
    };
    score: number;
}

export interface SearchResultType {
    data?: ResultItemType[]
}

export const SearchResults = ({data}: SearchResultType) => {
    const [firestoreMap, setFirestoreMap] = useState<Record<string, FirestoreMovieDoc>>({});

    const uuids = useMemo(() => (data ?? []).map(item => item.metadata.uuid).filter(Boolean), [data]);

    useEffect(() => {
        if (!uuids.length) {
            setFirestoreMap({});
            return;
        }
        fetchMoviesByIds(uuids).then(setFirestoreMap).catch(() => setFirestoreMap({}));
    }, [uuids]);

    return (
        <div className="mt-4">
           <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {data?.map((item, idx) => (
                <li
                key={idx}
                className="rounded-xl overflow-hidden shadow hover:scale-105 transition-transform duration-300"
                >
                <Image
                    src={
                        firestoreMap[item?.metadata.uuid]?.thumbnailUrl ?? ''
                    }
                    alt={item?.metadata.text}
                    width={300}
                    height={224}
                    className="w-full h-56 object-cover"
                />
                <div className="p-2 bg-gray-900 text-white">
                    <p className="font-semibold text-sm truncate">{item?.metadata.text}</p>
                    <p className="text-xs text-gray-400">Rating: {firestoreMap[item?.metadata.uuid]?.rating ?? "N/A"}</p>
                </div>
                </li>
            ))}
            </ul>
        </div>
    )
}