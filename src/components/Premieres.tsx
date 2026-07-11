import Image from "next/image";
import Link from "next/link";

const PREMIERES = [
  {
    id: 1,
    title: "Bad Boys: Ride or Die",
    language: "English",
    image: "/bookmyshow home page_files/et00376522-xlgslruapz-portrait.jpg"
  },
  {
    id: 2,
    title: "The Fall Guy",
    language: "English",
    image: "/bookmyshow home page_files/et00364831-tcbkezfsux-portrait.jpg"
  },
  {
    id: 3,
    title: "Dune: Part Two",
    language: "English",
    image: "/bookmyshow home page_files/et00325467-chwjnwllzu-portrait.jpg"
  },
  {
    id: 4,
    title: "Kung Fu Panda 4",
    language: "English",
    image: "/bookmyshow home page_files/et00076445-pehxusjqjr-portrait.jpg"
  },
  {
    id: 5,
    title: "Godzilla x Kong",
    language: "English",
    image: "/bookmyshow home page_files/et00349868-umcquqxrqn-portrait.jpg"
  }
];

export default function Premieres() {
  return (
    <div className="w-full bg-[#2b3149] py-12 mt-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="w-full mb-8 rounded-lg overflow-hidden cursor-pointer">
           <Image 
             src="/bookmyshow home page_files/premiere-banner-web-collection-202208191200.png"
             alt="Premieres Banner"
             width={1280}
             height={100}
             className="w-full h-auto"
             unoptimized
           />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Premieres</h2>
        <p className="text-white mb-6 text-sm">Brand new releases every Friday</p>
        
        <div className="flex overflow-x-auto gap-8 pb-4 snap-x snap-mandatory hide-scrollbar">
          {PREMIERES.map((movie) => (
            <Link key={movie.id} href={`/movies/${movie.id}`} className="group shrink-0 w-[220px] snap-start flex flex-col gap-3 cursor-pointer">
              <div className="w-full rounded-lg overflow-hidden shadow-md">
                <Image 
                  src={movie.image} 
                  alt={movie.title} 
                  width={220}
                  height={330}
                  className="w-full h-auto object-contain group-hover:scale-105 transition duration-300"
                  style={{ width: '100%', height: 'auto' }}
                  unoptimized
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white line-clamp-1">{movie.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{movie.language}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
