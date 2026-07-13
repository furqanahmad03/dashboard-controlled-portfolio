import React from "react";
import { TechnologyCategory } from "@/interfaces/Technologies";
import { DiMongodb } from "react-icons/di";
import { FaBootstrap, FaCss3Alt, FaGithub, FaGitSquare, FaHtml5, FaJava, FaJsSquare, FaLinux, FaPython, FaReact, FaWindows, FaTools } from "react-icons/fa";
import { FaApple } from "react-icons/fa6";
import { LiaNode } from "react-icons/lia";
import { SiDocker, SiIntellijidea, SiOracle, SiPostman, SiRadixui, SiTailwindcss, SiTypescript, SiXcode, SiAndroidstudio, SiJupyter, SiFramework7, SiDotnet, SiChakraui, SiRemix, SiElectron, SiFastapi, SiMaterialformkdocs, SiPostgresql, SiFirebase, SiSupabase } from "react-icons/si";
import { TbBrandCpp, TbBrandCSharp, TbBrandKotlin, TbBrandNextjs, TbBrandVscode, TbSql } from "react-icons/tb";
import { FaGolang } from "react-icons/fa6";
import { VscAzure } from "react-icons/vsc";
import { AiOutlineCode } from "react-icons/ai";
import { GrSystem, GrMysql } from "react-icons/gr";
import { ImDatabase } from "react-icons/im";

export const technologies: TechnologyCategory[] = [
  {
    icon: <AiOutlineCode />,
    category: "Programming Languages",
    color: "#f06428",
    items: [
      { name: "HTML", icon: <FaHtml5 size={32} />, color: "#E34F26" },
      { name: "CSS", icon: <FaCss3Alt size={32} />, color: "#1572B6" },
      { name: "JavaScript", icon: <FaJsSquare size={32} />, color: "#F7DF1E" },
      { name: "TypeScript", icon: <SiTypescript size={32} />, color: "#3178C6" },
      { name: "C/C++", icon: <TbBrandCpp size={32} />, color: "#00599C" },
      { name: "C#", icon: <TbBrandCSharp size={32} />, color: "#68217A" },
      { name: "Java", icon: <FaJava size={32} />, color: "#007396" },
      { name: "Python", icon: <FaPython size={32} />, color: "#3776AB" },
      { name: "Kotlin", icon: <TbBrandKotlin size={32} />, color: "#7F52FF" },
      { name: "SQL", icon: <TbSql size={32} />, color: "#CC2927" },
      { name: "Go", icon: <FaGolang size={32} />, color: "#00ADD8" },
    ],
  },
  {
    icon: <SiFramework7 />,
    category: "Frameworks & Libraries",
    color: "#ff007f",
    items: [
      { name: "React", icon: <FaReact size={32} />, color: "#61DAFB" },
      { name: "Node.js", icon: <LiaNode size={32} />, color: "#339933" },
      { name: "Next.js", icon: <TbBrandNextjs size={32} />, color: "#00FF7F" },
      { name: "Remix", icon: <SiRemix size={32} />, color: "#5f43e9" },
      { name: "Electron.js", icon: <SiElectron size={32} />, color: "#0AE000" },
      { name: ".Net", icon: <SiDotnet size={32} />, color: "#0078D7" },
      { name: "FastAPI", icon: <SiFastapi size={32} />, color: "#009688" },
      { name: "Bootstrap", icon: <FaBootstrap size={32} />, color: "#7952B3" },
      { name: "TailwindCSS", icon: <SiTailwindcss size={32} />, color: "#38B2AC" },
      { name: "Radix UI", icon: <SiRadixui size={32} />, color: "#8E44AD" },
      { name: "Material UI", icon: <SiMaterialformkdocs size={32} />, color: "#5f43e9" },
      { name: "Chakra UI", icon: <SiChakraui size={32} />, color: "#009747" },
    ],
  },
  {
    icon: <FaTools />,
    category: "Tools",
    color: "#ff9800",
    items: [
      { name: "VsCode", icon: <TbBrandVscode size={32} />, color: "#007ACC" },
      { name: "Xcode", icon: <SiXcode size={32} />, color: "#1575F9" },
      { name: "IntelliJ IDEA", icon: <SiIntellijidea size={32} />, color: "#A445F7" },
      { name: "Android Studio", icon: <SiAndroidstudio size={32} />, color: "#3DDC84" },
      { name: "Jupyter Notebook", icon: <SiJupyter size={32} />, color: "#F37626" },
      { name: "Git", icon: <FaGitSquare size={32} />, color: "#F05032" },
      { name: "GitHub", icon: <FaGithub size={32} />, color: "#6E5494" },
      { name: "Postman", icon: <SiPostman size={32} />, color: "#FF6C37" },
      { name: "Docker", icon: <SiDocker size={32} />, color: "#2496ED" },
      { name: "Azure", icon: <VscAzure size={32} />, color: "#0078D7" },
    ],
  },
  {
    icon: <GrSystem />,
    category: "OS",
    color: "#607d8b",
    items: [
      { name: "MacOS", icon: <FaApple size={32} />, color: "#A2AAAD" },
      { name: "Windows", icon: <FaWindows size={32} />, color: "#0078D6" },
      { name: "Linux", icon: <FaLinux size={32} />, color: "#FCC624" },
    ],
  },
  {
    icon: <ImDatabase />,
    category: "Databases",
    color: "#4caf50",
    items: [
      { name: "MongoDB", icon: <DiMongodb size={32} />, color: "#47A248" },
      { name: "MySql", icon: <GrMysql size={32} />, color: "#4479A1" },
      { name: "Oracle", icon: <SiOracle size={32} />, color: "#F80000" },
      { name: "PostgreSQL", icon: <SiPostgresql size={32} />, color: "#336791" },
      { name: "Firebase", icon: <SiFirebase size={32} />, color: "#FFCA28" },
      { name: "Supabase", icon: <SiSupabase size={32} />, color: "#3FCF8E" },
    ],
  },
];

export default technologies; 