import Image from "next/image";

export interface ResultItemType {
    id: string;
    values: number[];
    metadata: {
        text: string;
        uuid: string;
        // image?: string;
        // thumbnailUrl?: string;
    };
    score: number;
}

export interface SearchResultType {
    data?: ResultItemType[]
}

export const SearchResults = ({data}: SearchResultType) => {
    return (
        <div className="mt-4">
           <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {data?.map((item, idx) => (
                <li
                key={idx}
                className="rounded-xl overflow-hidden shadow hover:scale-105 transition-transform duration-300"
                >
                <Image
                    src={`/${item?.metadata.uuid}.jpeg`}
                    alt={item?.metadata.text}
                    width={300}
                    height={224}
                    className="w-full h-56 object-cover"
                />
                <div className="p-2 bg-gray-900 text-white">
                    <p className="font-semibold text-sm truncate">{item?.metadata.text}</p>
                    <p className="text-xs text-gray-400">Score: {item?.score.toFixed(3)}</p>
                </div>
                </li>
            ))}
            </ul>
        </div>
    )
}