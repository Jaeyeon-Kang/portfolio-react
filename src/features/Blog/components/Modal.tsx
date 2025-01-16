import { ReactNode, useState, useRef } from "react";
import { X } from "react-feather";
import { fetchPokemonData } from "../api/pokemon";
import { useQuery } from "@tanstack/react-query";

interface ModalComponentProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const ModalComponent = ({ open, onClose, children }: ModalComponentProps) => {
  return (
    // backdrop
    <div
      onClick={onClose}
      className={`
            fixed inset-0 flex justify-center items-start transition-colors
            ${open ? "visible bg-black/20" : "invisible"}
          `}
    >
      {/* modal */}
      <div
        onClick={(e) => e.stopPropagation()} // 이벤트 버블링 방지(모달 클릭해도 안닫히도록)
        className={`
              bg-white rounded-xl shadow p-6 transition-all relative mx-auto mt-20
              ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
            `}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600"
        >
          <X />
        </button>
        {children}
      </div>
    </div>
  );
};

interface Poke {
  id: number;
  name: string;
  height: number;
  weight: number;
  baseExperience: number;
  image: string;
}

const Modal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Poke | null>(null);

  const handlePokemonClick = (pokemon: Poke) => {
    setSelectedPokemon(pokemon);
    setOpen(true);
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["pokemons"],
    queryFn: () =>
      fetchPokemonData<Poke>({
        url: "https://pokeapi.co/api/v2/pokemon/",
        pageParam: 0,
        limit: 3, // 3개 데이터만 가져오기
        dataMapper: (item: any) => ({
          id: item.id,
          name: item.name,
          height: item.height,
          weight: item.weight,
          baseExperience: item.base_experience,
          image: item.sprites.front_default,
        }),
      }),
  });

  return (
    <div className="p-4 max-w-screen-lg mx-auto flex flex-col items-center">
      <div className="flex gap-4">
        {data?.data.map((pokemon) => (
          <img
            key={pokemon.id}
            src={pokemon.image}
            alt={pokemon.name}
            className="w-32 h-32 cursor-pointer rounded-full bg-green-50 shadow-lg shadow-gray-200 hover:bg-green-100 p-2"
            onClick={() => handlePokemonClick(pokemon)}
          />
        ))}
      </div>

      <ModalComponent open={open} onClose={() => setOpen(false)}>
        {selectedPokemon && (
          <div className="text-center w-56">
            <img
              src={selectedPokemon.image}
              alt={selectedPokemon.name}
              className="w-32 h-32 mx-auto rounded-full"
            />
            <h3 className="text-lg font-black text-gray-800 capitalize">
              {selectedPokemon.name}
            </h3>
            <p className="text-sm text-gray-500">
              Height: {selectedPokemon.height} | Weight:{" "}
              {selectedPokemon.weight}
            </p>
            <p className="text-sm text-gray-500">
              Base Experience: {selectedPokemon.baseExperience}
            </p>
          </div>
        )}
      </ModalComponent>
    </div>
  );
};

export default Modal;
