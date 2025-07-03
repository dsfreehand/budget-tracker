import { writeFile } from "fs";
import { join } from "path";

const filePath = join(process.cwd(), "dist", ".nojekyll");

writeFile(filePath, "", (err) => {
  if (err) {
    console.error("Failed to create .nojekyll file:", err);
  } else {
    console.log(".nojekyll added to dist/ for GitHub Pages.");
  }
});
