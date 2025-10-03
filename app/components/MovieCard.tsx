
import {motion} from 'framer-motion'
import Image from "next/image";

import { FirestoreMovieDoc } from "../../lib/firebase";
import {ResultItemType} from './SearchResults';

interface MovieCardProps {
    firestoreMap: Record<string, FirestoreMovieDoc>,
    item: ResultItemType,
    index: number
}

export const MovieCard = ({
  firestoreMap,
  item,
  index
}: MovieCardProps) => {
  return (
    <motion.div
      className="rounded-xl overflow-hidden bg-gray-900 shadow-md cursor-pointer"
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 8px 24px rgba(0,0,0,0.3)",
      }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
    >
      {/* Poster */}
      <div className="relative w-full h-56">
        {
          firestoreMap[item?.metadata.uuid]?.thumbnailUrl ? (
            <Image
              src={
                firestoreMap[item?.metadata.uuid]?.thumbnailUrl ?? ''
              }
              alt={item?.metadata.text}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              priority={index < 4}
              className="object-cover"
            />
          ): null
        }
        {/* Overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-white text-sm font-bold mb-1">
            {item?.metadata.text}
          </p>
          <p className="text-gray-300 text-xs">
              Year: {firestoreMap[item?.metadata.uuid]?.year ?? "N/A"}
          </p>
        </motion.div>
      </div>
  
      {/* Info always visible (optional, if you want it under the card) */}
      <div className="p-2 text-white">
        <p className="text-xs text-gray-400">
            Rating: {firestoreMap[item?.metadata.uuid]?.rating ?? "N/A"}
        </p>
      </div>
    </motion.div>
  );
}