import { createVercelHandler } from "../../server/vercel-handler";

const handler = createVercelHandler();

export default handler;

export const config = {
  maxDuration: 60,
};
