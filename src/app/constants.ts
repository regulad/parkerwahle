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

// sample bio: Experienced software developer with a passion for building innovative solutions. Skilled in a variety of programming languages and technologies.
// should be direct and action verb-y but still showcase a little of my personality and writing style
export const bio = "" +
  "Experienced software engineer, eloquently spoken people person, and lifelong learner (a hungry learner at that). " +
  "Currently a computer science tutor, freelance developer, and student."
