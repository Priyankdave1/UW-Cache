import React, { useState, useEffect } from "react";
import loadable from "@loadable/component";
import { Link, useHistory } from "react-router-dom";
import { BrowserRouter as Router, useRouteMatch } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Container, Button } from "react-bootstrap";

import { db } from "../../firebase";

const nodemailer = require("nodemailer");
const AssetBlock = loadable(() => import("../../components/AssetBlock"));
const ContactFrom = loadable(() => import("../../components/ContactForm"));

const AssetInfo = () => {
  const match = useRouteMatch("/asset/:assetName,:owner");
  const [asset, setAsset] = useState({});
  const [owner, setOwner] = useState({});
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assetName = match.params.assetName;

        await db
          .collection("users")
          .where("name", "==", match.params.owner)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              setOwner(querySnapshot.docs[0].data());
              querySnapshot.docs[0].ref
                .collection("listings")
                .doc(assetName.trim())
                .get()
                .then((doc) => {
                  setAsset(doc.data());

                  setLoading(false);
                });
            }
          });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const editListing = () => {
    setEdit(true);
  };

  const deleteListing = async () => {
    try {
      console.log("trying to delete");
      await db
        .collection("users")
        .doc(currentUser.email)
        .collection("listings")
        .doc(match.params.assetName.trim())
        .delete();
    } catch (err) {
      console.error(err);
    }
    history.push("/");
    console.log("deleted");
  };

  if (loading) {
    return <Container style={{ minHeight: "80vh" }}></Container>;
  } else {
    if (currentUser.email === owner.email) {
      if (!edit) {
        return (
          <Container style={{ minHeight: "80vh" }}>
            <AssetBlock
              title={asset.location}
              content={asset.description}
              owner={match.params.owner.trim()}
              size={asset.size}
              phone={owner.phone}
              email={owner.email}
              button={deleteListing}
              button2={editListing}
              startDate={asset.startDate}
              endDate={asset.endDate}
              picture={asset.picture}
              id="info"
            />
          </Container>
        );
      } else {
        return (
          <ContactFrom
            edit={true}
            asset={asset.name}
            value={asset.value}
            location={asset.location}
            description={asset.description}
          />
        );
      }
    } else {
      return (
        <Container style={{ minHeight: "80vh" }}>
          <AssetBlock
            title={asset.name}
            content={asset.description}
            owner={match.params.owner.trim()}
            value={asset.value}
            location={asset.location}
            phone={owner.phone}
            email={owner.email}
            id="info"
          />
        </Container>
      );
    }
  }
};

export default AssetInfo;
