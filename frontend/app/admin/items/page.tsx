import { Metadata } from "next";

import { ItemsTable } from "./_components/Item";

const ItemsPage = () => {
  return (
    <div className="mt-10">
      <ItemsTable />
    </div>
  );
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Next-Starter - Item List",
  description: "View all Items",
};

export default ItemsPage;
