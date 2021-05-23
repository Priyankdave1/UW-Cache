import React, { useState, useEffect } from "react";
import loadable from "@loadable/component";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import { Container, Col } from "react-bootstrap";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Input = loadable(() => import("../../common/Input"));

const MyAssets = () => {
  const [assetList, setAssetList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await db.collectionGroup("listings").get();

        setAssetList(querySnapshot.docs.map((doc) => doc.data()));

        await db
          .collection("users")
          .where("email", "==", currentUser.email)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              setOwnerEmail(querySnapshot.docs[0].data());
              console.log(ownerEmail);
            }
          });

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
    startDate,
    endDate,
    picture,
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
                })
            : assetList
                .filter(
                  (doc) =>
                    doc.owner.toLowerCase().trim() ===
                    ownerEmail.name.toLowerCase().trim()
                )
                .map(function (doc) {
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

export default MyAssets;
