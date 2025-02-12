import * as React from "react";
import { extendTheme, styled } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import LogoutIcon from "@mui/icons-material/Logout";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import Grid from "@mui/material/Grid2";
import "./style.css"
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import {
  setOrders,
  setCollector,
  setOrderStatus,
} from "../../redux/reducers/adminOrders";
import { setLogout } from "../../redux/reducers/auth";

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: "class",
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

const Skeleton = styled("div")(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;
}

export default function DashboardLayoutBasic(props) {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const NAVIGATION = [
    {
      kind: "header",
      title: "Main items",
    },
    {
      segment: "dashboard",
      title: "Dashboard",
      icon: <DashboardIcon />,
    },
    {
      segment: "orders",
      title: "Orders",
      icon: <ShoppingCartIcon />,
    },
    {
      kind: "divider",
    },
    {
      kind: "header",
      title: "Analytics",
    },
    {
      title: "logout",
      icon: (
        <LogoutIcon
          onClick={() => {
            dispatch(setLogout());
            navigate("/");
          }}
        />
      ),
    },
  ];
  const getAllOrders = () => {
    axios
      .get("http://localhost:5000/admin/getAllOrders")
      .then((result) => {
        console.log(result);
        dispatch(setOrders(result.data.orders));
      })
      .catch((error) => {
        console.log(error);
        setMessage(error.response.data.message);
      });
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  const orders = useSelector((reducers) => reducers.adminOrdersReducer.orders);
  console.log("orders", orders);

  useEffect(() => {
    const rowsData = orders.map((order) => ({
      id: order.order_id,
      name: `${order.requester_first_name} ${order.requester_last_name}`,
      requests: order.requests_list.map((request) => {
        console.log("rr", request);

        const requestDetails = [];

        if (request.category_name) {
          requestDetails.push(`Category: ${request.category_name}`);
        }

        if (request.weight != null) {
          requestDetails.push(`Weight: ${request.weight}`);
        }

        if (request.width != null) {
          requestDetails.push(`Width: ${request.width}`);
        }

        if (request.height != null) {
          requestDetails.push(`Height: ${request.height}`);
        }

        if (request.length != null) {
          requestDetails.push(`Length: ${request.length}`);
        }

        return requestDetails;
      }),

      status: order.status,
      location: order.location,
      predicted_price: order.predicted_price,
      last_price: order.last_price,

      collector:
        `${order.collector_first_name || ""} ${order.collector_last_name || ""}`.trim(),
    }));
    setRows(rowsData);
  }, [orders]);

  const { window } = props;

  const router = useDemoRouter("/dashboard");

  const demoWindow = window ? window() : undefined;
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  // const handleDeleteClick = (id) => () => {
  //   setRows(rows.filter((row) => row.id !== id));
  // };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: "name", headerName: "Name", width: 180, editable: false },
    {
      field: "requests",
      headerName: "Requests",
      width: 600,
      editable: false,
    },
    {
      field: "location",
      headerName: "Location",
      width: 100,
      editable: false,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      editable: true,
      type: "singleSelect",
      valueOptions: ["accepted", "rejected"],
    },

    {
      field: "predicted_price",
      headerName: "Predicted Price",
      width: 150,
      editable: false,
    },
    {
      field: "last_price",
      headerName: "Last Price",
      width: 150,
      editable: true,
    },
    {
      field: "collector",
      headerName: "Collector",
      width: 150,
      editable: true,
      type: "singleSelect",
      valueOptions: ["ahmad", "ali", "sami"],
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode =
          rowModesModel[id]?.mode === GridRowModes.Edit || false;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          // <GridActionsCellItem
          //   icon={<DeleteIcon />}
          //   label="Delete"
          //   onClick={handleDeleteClick(id)}
          //   color="inherit"
          // />,
        ];
      },
    },
  ];

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout
        sx={{ "& .MuiIconButton-root": { width: "fit-content" } }}
      >
        <PageContainer sx={{ ml: 0 ,fontSize: "30px" }} >
          {router.pathname === "/orders" && (
            <div >
              <Grid container spacing={3} className="gridBox">
                <Grid item xs={12} >
                  <DataGrid  sx={{fontSize: "17px" }}
                    rows={rows}
                    columns={columns}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    slots={{ toolbar: EditToolbar }}
                    slotProps={{
                      toolbar: { setRows, setRowModesModel },
                    }}
                  />
                </Grid>
              </Grid>
            </div>
          )}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
