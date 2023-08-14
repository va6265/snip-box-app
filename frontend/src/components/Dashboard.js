import {
  Checkbox,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { Link, useNavigate, useParams } from "react-router-dom";

function Dashboard() {
  const {id} = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function getUserData() {
      try {
        const user = await axios.get("/users/me");

        if(user.data.data.name !== id)
          throw new Error();

        const response = await axios.get("/pastes");
        setUserData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    getUserData();
  }, []);

  if (loading) return <div>loading</div>;

  if (error) return <div>error</div>;

  if (userData) {
    return (
      <Container>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="right">Title</TableCell>
                <TableCell align="right">Created At</TableCell>
                <TableCell align="right">Scope</TableCell>
                <TableCell align="right">Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData.map((data) => (
                  <TableRow
                    key={data.content}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    onClick={() => navigate(`/${data._id}`)}
                  >
                    <TableCell component="th" scope="row">
                      {data.title}
                    </TableCell>
                    {/* <TableCell align="right">{data.title}</TableCell> */}
                    <TableCell align="right">{data.createdAt}</TableCell>
                    <TableCell align="right">{data.scope}</TableCell>
                    <TableCell align="right">{data.category}</TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
  }
}

export default Dashboard;

const headCells = [
  {
    id: "title",
    numeric: false,
    disablePadding: true,
    label: "Title",
  },
  {
    id: "created-at",
    numeric: false,
    disablePadding: true,
    label: "Created At",
  },
  {
    id: "Scope",
    numeric: false,
    disablePadding: true,
    label: "Scope",
  },
  {
    id: "category",
    numeric: false,
    disablePadding: true,
    label: "Category",
  },
];
