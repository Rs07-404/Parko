import { Home, LandPlot, ScanLine, UserCog, UserCog2 } from "lucide-react";

export interface IPath {
  pathId: string;
  name: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
  subPaths?: {
    subPathId: string;
    pathId: string;
    name: string;
    path: string;
    icon: React.ElementType;
  }[]
}

const paths: IPath[] = [
  {
    pathId: "MP1", // MainPath[number]
    name: "Home",
    path: "/home",
    roles: ["Admin", "User", "LandOwner"],
    icon: Home
  },
  {
    pathId: "MP3",
    name: "Registrations",
    path: "/registrations",
    roles: ["Admin"],
    icon: LandPlot
  },
  {
    pathId: "MP4",
    name: "Verify Reservations",
    path: "/verifyreservation",
    roles: ["Admin", "EntryOperator", "ExitOperator"],
    icon: ScanLine
  },
  // {
  //   pathId: "MP2",
  //   name: "Profile",
  //   path: "/profile",
  //   roles: ["Admin", "User"],
  //   icon: UserCog
  // },
  {
    pathId: "MP5",
    name: "Operator Management",
    path: "/operator-management",
    roles: ["Admin"], 
    icon: UserCog
  },

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
