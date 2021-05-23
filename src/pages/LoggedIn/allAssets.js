import React, { useState, useEffect } from "react";
import loadable from "@loadable/component";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import { Container, Col, OverlayTrigger } from "react-bootstrap";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import "./assets.css";

const Input = loadable(() => import("../../common/Input"));

const AllAssets = () => {
  const [assetList, setAssetList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState("");

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
        <Input
          type="text"
          name="asset"
          placeholder="Search"
          value={values.asset || ""}
          onChange={handleChange}
        />
        <CardColumns>
          {values.asset
            ? assetList
                .filter((doc) =>
                  doc.name
                    .toLowerCase()
                    .trim()
                    .includes(values.asset.toLowerCase().trim())
                )
                .map(function (doc) {
                  return (
                    <AssetCard
                      assetName={doc.location}
                      assetValue={doc.value}
                      assetLocation={doc.location}
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
