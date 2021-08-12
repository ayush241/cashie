import DashboardIcon from "@material-ui/icons/Dashboard";
import CategoryIcon from "@material-ui/icons/Category";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import ListIcon from "@material-ui/icons/List";
import ReceiptIcon from "@material-ui/icons/Receipt";
const sidebarLinks = [
  {
    id: 1,
    label: "Dashboard",
    classes: [],
    icon: <DashboardIcon />,
    path: "/dashboard",
  },

  {
    id: 2,
    label: "Users",
    classes: [],
    icon: <GroupAddIcon />,
    path: "/users",
  },
  {
    id: 3,
    label: "Products",
    classes: [],
    icon: <ListIcon />,
    path: "/products",
  },
    {
    id: 4,
    label: "Category",
    classes: [],
    icon: <CategoryIcon />,
    path: "/category",
  },
  {
    id: 5,
    label: "Transaction",
    classes: [],
    icon: <ReceiptIcon />,
    path: "/transactions",
  },
   {
    id: 6,
    label: "Report",
    classes: [],
    icon: <ReceiptIcon />,
    path: "/Report",
  }

];

export default sidebarLinks;
