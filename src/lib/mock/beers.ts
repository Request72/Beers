export type Beer = {
  id: string;
  name: string;
  brewery: string;
  style: string;
  description: string;
  rating: number;
  abv: number;
  image: string; // public path
  price: number;
};

export const beers: Beer[] = [
  {
    id: "1",
    name: "Everest Premium Lager",
    brewery: "Himalayan Breweries",
    style: "Pilsner Lager",
    description:
      "Nepal's most iconic beer with a crisp, clean finish. Brewed from pure Himalayan water with balanced hop character.",
    rating: 4.6,
    abv: 5.0,
    image: "/images/beer-1.svg",
    price: 4.99,
  },
  {
    id: "2",
    name: "Gorkha Gold",
    brewery: "Gorkha Brewery",
    style: "Golden Lager",
    description:
      "A smooth golden lager with hints of malt sweetness. Perfect for celebrations and everyday enjoyment in Nepal.",
    rating: 4.4,
    abv: 4.8,
    image: "/images/beer-2.svg",
    price: 4.49,
  },
  {
    id: "3",
    name: "Kathmandu Dark",
    brewery: "Nepal Breweries Ltd",
    style: "Dark Ale",
    description:
      "Rich and full-bodied dark ale with roasted malt flavors and hints of chocolate, brewed in the heart of Kathmandu.",
    rating: 4.5,
    abv: 5.8,
    image: "/images/beer-3.svg",
    price: 5.49,
  },
  {
    id: "4",
    name: "Pokhara Ale",
    brewery: "Annapurna Brewing Co.",
    style: "Amber Ale",
    description:
      "A smooth amber ale inspired by the beautiful landscapes of Pokhara. Balanced malt with gentle hop bitterness.",
    rating: 4.3,
    abv: 5.2,
    image: "/images/beer-4.svg",
    price: 4.75,
  },
  {
    id: "5",
    name: "Sherpa's Peak IPA",
    brewery: "Mountain Craft Nepal",
    style: "India Pale Ale",
    description:
      "A bold IPA crafted for the adventurous spirit. Fruity hops with a clean finish, paying homage to Nepal's mountain heritage.",
    rating: 4.7,
    abv: 6.5,
    image: "/images/beer-5.svg",
    price: 5.99,
  },
  {
    id: "6",
    name: "Pashupatinath Special",
    brewery: "Heritage Breweries Nepal",
    style: "Strong Lager",
    description:
      "A premium strong lager with a rich, complex flavor profile. Brewed with traditional Nepali brewing methods and local ingredients.",
    rating: 4.8,
    abv: 7.2,
    image: "/images/beer-6.svg",
    price: 6.49,
  },
];
