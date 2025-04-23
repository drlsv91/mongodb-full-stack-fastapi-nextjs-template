import { Metadata } from "next";

import { ItemsList } from "./_components/Item";

const ItemsPage = () => {
  return (
    <div className="mt-10">
      <ItemsList />
    </div>
  );
};

export const metadata: Metadata = {
  title: "Next-Starter - Item List",
  description: "View all Items",
};

export default ItemsPage;
