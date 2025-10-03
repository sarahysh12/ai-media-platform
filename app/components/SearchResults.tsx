"use client";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { fetchMoviesByIds, FirestoreMovieDoc } from "../../lib/firebase";
import { MovieCard } from "./MovieCard";

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
      <motion.ul
        className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1, // delay each li
            },
          },
        }}
      >
        {data?.map((item, idx) => (
          <motion.li
            key={idx}
            className="rounded-xl overflow-hidden shadow hover:scale-105 transition-transform duration-300"
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              show: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            <MovieCard item={item} index={idx} firestoreMap={firestoreMap} />
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}