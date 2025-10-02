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
        fetchMoviesByIds(uuids).then(setFirestoreMap).catch((error) => {
            console.error('Error fetching Firestore data:', error);
            setFirestoreMap({});
        });
    }, [uuids, data]);

    return (
        <div className="mt-4">
           <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {data?.map((item, idx) => (
                <li
                key={idx}
                className="rounded-xl overflow-hidden shadow hover:scale-105 transition-transform duration-300"
                >
                    <div className="relative w-full h-56">
                        <Image
                        src={
                            firestoreMap[item?.metadata.uuid]?.thumbnailUrl ?? `/${item?.metadata.uuid}.jpeg`
                        }
                        alt={item?.metadata.text}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        priority={idx < 4}
                        className="object-cover"
                    />
                    </div>
                <div className="p-2 bg-gray-900 text-white">
                    <p className="font-semibold text-sm truncate">{item?.metadata.text}</p>
                    <p className="text-xs text-gray-400">Rating: {firestoreMap[item?.metadata.uuid]?.rating ?? "N/A"}</p>
                    <p className="text-xs text-gray-400">Year: {firestoreMap[item?.metadata.uuid]?.year ?? "N/A"}</p>
                </div>
                </li>
            ))}
            </ul>
        </div>
    )
}