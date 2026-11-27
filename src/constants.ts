import {FiGithub, FiLink2, FiLinkedin, FiMail} from "react-icons/fi";
import {RiTwitterXLine} from "react-icons/ri";
import React from "react";
import {TbBrandDiscord} from "react-icons/tb";

export type Social = {
  name: string;
  iconComponent: React.FC;
  url: string;
  isPriority: boolean;
}

export const socials = [
  {
    "name": "Linktree",
    "iconComponent": FiLink2,
    "url": "https://linktr.ee/regulad",
    "isPriority": false
  },
  {
    "name": "LinkedIn",
    "iconComponent": FiLinkedin,
    "url": "https://www.linkedin.com/in/parker-wahle/",
    "isPriority": true
  },
  {
    "name": "GitHub",
    "iconComponent": FiGithub,
    "url": "https://github.com/regulad",
    "isPriority": true
  },
  {
    "name": "X (formerly Twitter)",
    "iconComponent": RiTwitterXLine,
    "url": "https://twitter.com/pewahle",
    "isPriority": true
  },
  {
    "name": "Discord",
    "iconComponent": TbBrandDiscord,
    "url": "https://discord.gg/Jur4Gd89H2",
    "isPriority": false
  },
  {
    "name": "Email",
    "iconComponent": FiMail,
    "url": "mailto:pw@regulad.xyz",
    "isPriority": false
  }
] satisfies Social[];

export const bio = "NC State 2029 Electrical Engineering & Computer Engineering student. " +
  "Amateur software engineer, amateur photographer, and lifelong learner. " +
  "Freelance developer, camera operator, and student."
