import { Home, UserCog } from "lucide-react";

interface path {
  pathId: string;
  name: string;
  path: string;
  icon: React.ElementType;
  subPaths?: {
    subPathId: string;
    pathId: string;
    name: string;
    path: string;
    icon: React.ElementType;
  }[]
}

const paths: path[] = [
  {
    pathId: "MP1", // MainPath[number]
    name: "Home",
    path: "/home",
    icon: Home
  },
  {
    pathId: "MP2",
    name: "Profile",
    path: "/profile",
    icon: UserCog
  }
  // {
  //   pathId: "MP2",
  //   name: "Settings",
  //   path: "/settings",
  //   icon: Settings,
  //   subPaths: [
  //     {
  //       subPathId: "SP1",
  //       name: "State",
  //       path: "/settings/state",
  //       icon: AlignLeft
  //     },
  //     {
  //       subPathId: "SP2",
  //       name: "State District",
  //       path: "/settings/statedistrict",
  //       icon: AlignLeft
  //     },
  //   ]
  // },
];

export default paths;
