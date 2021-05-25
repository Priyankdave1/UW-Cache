import React, { useState, useEffect } from "react";
import loadable from "@loadable/component";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import Dropdown from "react-bootstrap/Dropdown";
import { Container, OverlayTrigger } from "react-bootstrap";
import { Row, Col } from "antd";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import "./assets.css";

const Input = loadable(() => import("../../common/Input"));

const AllAssets = () => {
  const [assetList, setAssetList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState("");
  const [searchingFor, setSearchingFor] = useState("Location");
  const [availableSearch, setAvailableSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await db.collectionGroup("listings").get();

        setAssetList(querySnapshot.docs.map((doc) => doc.data()));
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const searchPlaceHolder = () => {
    var placeholder = "";
    switch (searchingFor) {
      case "Location":
        placeholder = "Search by Location";
        break;

      case "Availability":
        placeholder = "Search by time available (yyyy-mm-dd)";
        break;

      case "Size":
        placeholder = "Search by minimum size (meters cubed)";
        break;
    }
    return placeholder;
  };

  const handleChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
    console.log(values);
  };

  const AssetCard = ({
    assetName,
    assetValue,
    assetLocation,
    assetDescription,
    owner,
    picture,
    startDate,
    endDate,
  }) => {
    return (
      <Link to={`/asset/${assetName} ,${owner}`}>
        <Card
          style={{ margin: "5px", cursor: "pointer", marginBottom: "20px" }}
        >
          {picture ? (
            <Card.Img
              variant="top"
              src={picture}
              style={{ height: "15rem", width: "100%" }}
            />
          ) : (
            <Card.Img
              variant="top"
              src="/img/storage.jpg"
              style={{ height: "15rem", width: "100%" }}
            />
          )}

          <Card.Body style={{ height: "10rem" }}>
            <Card.Title>{assetName}</Card.Title>
            <Card.Text style={{ fontSize: "1rem" }} maxLength="12">
              <strong>Approx Size: </strong>
              {assetValue} m<sup>3</sup> <br />
              {assetDescription.substring(0, 500)}
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">
              {startDate} - {endDate}
            </small>
          </Card.Footer>
        </Card>
      </Link>
    );
  };

  if (loading) {
    return <Container style={{ minHeight: "80vh" }}></Container>;
  } else {
    return (
      <Container style={{ minHeight: "80vh", padding: "none" }}>
        <Row
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Col>
            <Dropdown>
              <Dropdown.Toggle
                style={{ backgroundColour: "gray" }}
                id="dropdown-basic"
              >
                {searchingFor}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSearchingFor("Location")}>
                  Location
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setSearchingFor("Availability");
                    setAvailableSearch("");
                  }}
                >
                  Availability
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSearchingFor("Size")}>
                  Size
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col style={{ width: "80%" }}>
            {searchingFor === "Availability" ? (
              <Input
                type="date"
                name={searchingFor}
                placeholder={searchPlaceHolder()}
                text={eval("values." + searchingFor) || ""}
                onChange={handleChange}
              />
            ) : (
              <Input
                type="text"
                name={searchingFor}
                placeholder={searchPlaceHolder()}
                text={eval("values." + searchingFor) || ""}
                onChange={handleChange}
              />
            )}
          </Col>
        </Row>
        <CardColumns>
          {values.Size || values.Location || values.Availability
            ? assetList
                .filter((doc) =>
                  values.Size
                    ? parseInt(doc.size) > parseInt(values.Size)
                    : true
                )
                .filter((doc) =>
                  values.Location
                    ? doc.location
                        .toLowerCase()
                        .trim()
                        .includes(values.Location.toLowerCase().trim())
                    : true
                )
                .filter((doc) => {
                  var start = new Date(doc.startDate);
                  var end = new Date(doc.endDate);
                  var check = new Date(values.Availability);
                  return values.Availability
                    ? check <= end && check >= start
                    : true;
                })
                .map(function (doc) {
                  return (
                    <AssetCard
                      assetName={doc.location}
                      assetValue={doc.size}
                      assetDescription={doc.description}
                      owner={doc.owner}
                      key={doc.name}
                      picture={doc.picture}
                      startDate={doc.startDate}
                      endDate={doc.endDate}
                    />
                  );
                })
            : assetList.map(function (doc) {
                return (
                  <AssetCard
                    assetName={doc.location}
                    assetValue={doc.size}
                    assetLocation={doc.location}
                    assetDescription={doc.description}
                    owner={doc.owner}
                    key={doc.name}
                    picture={doc.picture}
                    startDate={doc.startDate}
                    endDate={doc.endDate}
                  />
                );
              })}
        </CardColumns>
      </Container>
    );
  }
};

export default AllAssets;
