import {
  IconLayoutDashboard,
  IconLink,
  IconTargetArrow,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/dashboard",
  },

  {
    navlabel: true,
    subheader: "Ad Campaigns",
  },
  {
    id: uniqueId(),
    title: "Create New Ad",
    icon: IconTargetArrow,
    href: "/dashboard/create",
  },

  {
    navlabel: true,
    subheader: "Blink Links",
  },
  {
    id: uniqueId(),
    title: "Manage Links",
    icon: IconLink,
    href: "/dashboard/manage-links",
  },
];

export default Menuitems;
