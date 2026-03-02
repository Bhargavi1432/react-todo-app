import { useQuery } from "@tanstack/react-query";
import "./Users.css";

function Users() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/users")
        .then(res => res.json())
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error occurred</p>;

  return (
    <div className="users-container">
      <h1 className="users-title">Users List</h1>

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
          </tr>
        </thead>

        <tbody>
          {data.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.company.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;