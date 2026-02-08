import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  migrate: {
    adapter: async () => {
      const { PrismaSQLiteAdapter } = await import("@prisma/adapter-sqlite");
      return new PrismaSQLiteAdapter("file:./prisma/dev.db");
    },
  },
});
