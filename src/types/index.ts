
export type Product = {
  id: number;           // პროდუქტის უნიკალური ID
  title: string;        // პროდუქტის დასახელება
  description: string;  // პროდუქტის აღწერა
  price: number;        // პროდუქტის ფასი
  stock: number;        // საწყობში არსებული რაოდენობა
  thumbnail: string;    // პროდუქტის მთავარი სურათის URL
  images: string[];     // პროდუქტის ყველა სურათის URL-ების მასივი
  category: string;     // პროდუქტის კატეგორია
  rating: number;       // პროდუქტის რეიტინგი
  brand?: string;       // პროდუქტის ბრენდი
  reviews?: ProductReview[]; // პროდუქტის მიმოხილვების მასივი, შეიძლება არ არსებობდეს
};

export type ProductReview = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail?: string;
};

export type ProductsResponse = {
  products: Product[];  // პროდუქტების ობიექტების მასივი
  total: number;        // პროდუქტების საერთო რაოდენობა
  skip: number;         // გამოტოვებული პროდუქტების რაოდენობა
  limit: number;        // ერთ მოთხოვნაზე დასაბრუნებელი პროდუქტების მაქსიმალური რაოდენობა
};

export type CartItem = {
  product: Product;     // კალათაში არსებული კონკრეტული ერთი პროდუქტი
  quantity: number;     // და კალათაში ამ პროდუქტის რაოდენობა
};

export type CartState = {
  items: CartItem[];    // კალათაში დამატებული პროდუქტების მასივი
};

export type LoginFormValues = {
  username: string;     // მომხმარებლის სახელი
  password: string;     // მომხმარებლის პაროლი
};

export type CheckoutFormValues = {
  fullName: string;     // მომხმარებლის სრული სახელი და გვარი
  email: string;        // მომხმარებლის ელფოსტის მისამართი
  address: string;      // მიწოდების მისამართი
  city: string;         // ქალაქი, სადაც შეკვეთა უნდა მივიდეს
};
