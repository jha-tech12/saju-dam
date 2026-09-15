import fs from "fs";
import path from "path";
import type { SajuResult } from "@/lib/saju/types";

const KNOWLEDGE_DIR = path.join(process.cwd(), "knowledge");

const STEM_FILES: Record<string, string> = {
  甲: "02_cheongan/gap.md",
  乙: "02_cheongan/gap.md",
  丙: "02_cheongan/byung.md",
  丁: "02_cheongan/byung.md",
};

const TOPIC_FILES: Record<string, string> = {
  basic: "01_basic/saju_basics.md",
  love: "10_love/love_basics.md",
  career: "11_career/career_basics.md",
};

function readKnowledge(relativePath: string): string {
  const fullPath = path.join(KNOWLEDGE_DIR, relativePath);
  if (!fs.existsSync(fullPath)) return "";
  return fs.readFileSync(fullPath, "utf-8");
}

export function retrieveKnowledge(
  saju: SajuResult,
  topic: "basic" | "love" | "career" = "basic",
): string {
  const files = new Set<string>([
    "01_basic/saju_basics.md",
    "01_basic/five_elements.md",
    TOPIC_FILES[topic],
  ]);

  const stemFile = STEM_FILES[saju.dayMaster.stem];
  if (stemFile) files.add(stemFile);

  const tenGods = [
    ...saju.tenGods.stems.map((item) => item.tenGod),
    ...saju.tenGods.branches.map((item) => item.tenGod),
  ];

  if (tenGods.includes("七杀") || tenGods.includes("편관")) {
    files.add("04_ten_gods/pyeongwan.md");
  }

  return [...files]
    .map((file) => readKnowledge(file))
    .filter(Boolean)
    .join("\n\n---\n\n");
}
