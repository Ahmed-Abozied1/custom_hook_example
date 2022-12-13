import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import axios from "axios";
import usePrevState from "./hooks/usePrevState";
function App() {
  const [term, setTerm] = useState("java");
  const [result, setResult] = useState([]);
  const prevTerm = usePrevState(term);

  useEffect(() => {
    const search = async () => {
      const { data } = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          list: "search",
          origin: "*",
          srsearch: term,
          format: "json",
        },
      });
      setResult(data.query.search);
    };
    if (!result.length) {
      search();
    } else if (term !== prevTerm) {
      const timeOut = setTimeout(() => {
        if (term) {
          search();
        }
      }, 1200);
      return () => {
        clearTimeout(timeOut);
      };
    }
  }, [term, result.length, prevTerm]);

  return (
    <div className="App">
      <Form className="d-flex m-5">
        <Form.Control
          type="search"
          placeholder="Search"
          className="me-2"
          aria-label="Search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <Button variant="outline-success">Search</Button>
      </Form>

      <Table striped bordered hover className="m-5">
        <thead>
          <tr>
            <th>title</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {result.map((data, index) => {
            return (
              <tr key={index}>
                <td>{data.title}</td>
                <td>
                  <span dangerouslySetInnerHTML={{ __html: data.snippet }} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default App;
